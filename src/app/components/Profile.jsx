"use client";
import React, { useEffect, useState, useRef } from "react";
import EditableField from "./EditableField";
import SocialLinksEditor from "./SocialLinksEditor";
import MultiSelectDropdown from "./MultiSelectDropdown";
import Badge from "./Badge";
import Button from "./Button";
import Card from "./Card";
import { signOut } from "next-auth/react";
import { FaTrashAlt } from "react-icons/fa";
import { State, City } from "country-state-city";

import Select from "react-select";

const languageOptions = [
  "English",
  "Spanish",
  "Mandarin",
  "Hindi",
  "French",
  "Arabic",
  "Bengali",
  "Russian",
  "Portuguese",
  "German",
  "Bahasa Malayu",
];

const adventureOptions = [
  "Hiking",
  "Backpacking",
  "Skiing",
  "Climbing",
  "Kayaking",
  "Cycling",
  "Camping",
  "Surfing",
  "Rafting",
  "Zip-lining",
];

const attitudeOptions = [
  "Adventurous",
  "Easy-Going",
  "Spontaneous",
  "Fearless",
  "Open-Minded",
  "Curious",
  "Energetic",
  "Optimistic",
  "Resilient",
  "Independent",
  "Free-Spirited",
  "Social",
  "Flexible",
  "Nature-Loving",
  "Bold",
];

const skillLevelOptions = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const fileInputRef = useRef(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedPhoto =
    selectedPhotoIndex !== null ? userData?.photos?.[selectedPhotoIndex] : null;

  const handleStateChange = (stateCode) => {
    setSelectedState(stateCode);
    setSelectedCity(""); // Reset city when state changes
    setUserData({ ...userData, state: stateCode });
  };

  const handleCityChange = (cityName) => {
    const city = City.getCitiesOfState("US", selectedState).find(
      (c) => c.name === cityName,
    );
    setSelectedCity(cityName);
    setUserData({
      ...userData,
      city: cityName,
      latitude: parseFloat(city.latitude),
      longitude: parseFloat(city.longitude),
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserData(data);
        setProfilePic(data.profilePic || null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error("Failed to save user data");
      const updatedData = await response.json();
      setUserData(updatedData);
      setIsEditing(false);
      localStorage.setItem("profile", JSON.stringify(updatedData));
    } catch (error) {
      console.error("Error saving user data:", error);
      setError("Failed to save user data.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      const response = await fetch("/api/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userData.id }),
      });
      if (response.ok) {
        alert("Your account has been deleted.");
        await signOut();
      } else {
        alert("Failed to delete your account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("photo", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload photo");
      const { fileUrl } = await response.json();
      setProfilePic(fileUrl);
      setUserData((prev) => ({ ...prev, profilePic: fileUrl }));
      alert("Profile picture uploaded successfully!");
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo. Please try again.");
    }
  };

  const handleDeletePhoto = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete your profile picture?",
    );
    if (!confirmed) return;

    try {
      const key = profilePic.split("/").pop();
      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      if (!response.ok) throw new Error("Failed to delete profile picture");
      setProfilePic(null);
      setUserData((prev) => ({ ...prev, profilePic: null }));
      alert("Profile picture deleted successfully!");
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      alert("Failed to delete profile picture. Please try again.");
    }
  };

  const handleImageClick = () => fileInputRef.current.click();

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Card>
      <div className="flex flex-col md:flex-row items-center gap-8">
        {!isEditing ? (
          <img
            src={profilePic || "/profilepic.png"}
            alt="Profile"
            className="w-40 h-40 object-cover mb-4 border-4 border-yellow-500 rounded-full p-1"
          />
        ) : (
          <div>
            <img
              src={profilePic || "/profilepic.png"}
              alt="Profile"
              title="Click to upload a new photo"
              className="w-40 h-40 object-cover mb-4 border-4 border-yellow-500 rounded-full p-1 cursor-pointer hover:opacity-80 hover:border-yellow-700"
              onClick={handleImageClick}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}
        {isEditing && profilePic && (
          <button
            onClick={handleDeletePhoto}
            className="mt-2"
            title="Delete Photo"
          >
            <FaTrashAlt className="w-5 h-5 text-yellow-500 hover:text-yellow-700" />
          </button>
        )}
        <div>
          <h1 className="text-3xl font-extrabold">{userData.name}</h1>
          <div className="flex items-center gap-x-4">
            <EditableField
              isEditing={isEditing}
              value={
                userData.birthdate
                  ? new Date(userData.birthdate).toISOString().split("T")[0]
                  : ""
              }
              onChange={(value) =>
                setUserData({ ...userData, birthdate: value })
              }
              type="date"
            >
              {userData.birthdate
                ? `${calculateAge(userData.birthdate)} years old`
                : "No birthdate"}
            </EditableField>
            <p> | </p>
          </div>
          <div className="flex items-center gap-x-4">
            {/* State Dropdown */}
            {!isEditing ? (
              <p className="text-gray-400 text-lg">
                {userData.city && userData.state
                  ? userData?.city + ", " + userData?.state
                  : "No location"}
              </p>
            ) : (
              <select
                onChange={(e) => handleStateChange(e.target.value)}
                value={selectedState}
                className="mt-4 bg-gray-800 border border-yellow-500 text-white p-2 rounded-md w-full md:w-1/2"
              >
                <option value="">Select State</option>
                {State.getStatesOfCountry("US").map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>
            )}
            {/* City Dropdown */}
            {!isEditing ? (
              <p></p>
            ) : (
              selectedState && (
                <select
                  onChange={(e) => handleCityChange(e.target.value)}
                  value={selectedCity}
                  className="mt-4 bg-gray-800 border border-yellow-500 text-white p-2 rounded-md w-full md:w-1/2"
                >
                  <option value="">Select City</option>
                  {City.getCitiesOfState("US", selectedState).map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              )
            )}
          </div>
          <div className="text-gray-400 text-lg">
            <span>Languages: </span>
            {!isEditing ? (
              userData.languages?.length ? (
                userData.languages.join(", ")
              ) : (
                "No languages"
              )
            ) : (
              <MultiSelectDropdown
                options={languageOptions}
                selected={userData.languages}
                onChange={(selectedLanguages) =>
                  setUserData((prev) => ({
                    ...prev,
                    languages: selectedLanguages,
                  }))
                }
              />
            )}
          </div>
          <SocialLinksEditor
            isEditing={isEditing}
            links={userData.socialMedia || {}}
            onChange={(platform, value) =>
              setUserData({
                ...userData,
                socialMedia: { ...userData.socialMedia, [platform]: value },
              })
            }
          />
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-8">About Me</h2>
      <EditableField
        isEditing={isEditing}
        value={userData.bio || ""}
        onChange={(value) => setUserData({ ...userData, bio: value })}
        type="textarea"
        placeholder="Write a short description about yourself, your interests, or your adventures."
      >
        {userData.bio || "No bio"}
      </EditableField>

      <h2 className="text-2xl font-semibold mt-8">Adventure Preferences</h2>
      {!isEditing ? (
        <div className="flex flex-wrap gap-3 mt-4">
          {userData.adventureTypes?.length ? (
            userData.adventureTypes.map((type) => (
              <Badge key={type}>{type}</Badge>
            ))
          ) : (
            <p>No adventure preferences</p>
          )}
        </div>
      ) : (
        <MultiSelectDropdown
          options={adventureOptions}
          selected={userData.adventureTypes}
          onChange={(selected) =>
            setUserData((prev) => ({ ...prev, adventureTypes: selected }))
          }
        />
      )}

      <h2 className="text-2xl font-semibold mt-8">Skill Level</h2>
      {!isEditing ? (
        <p className="text-gray-400 text-lg">
          {userData.skillLevel || "No skill level"}
        </p>
      ) : (
        <select
          value={userData.skillLevel || ""}
          onChange={(e) =>
            setUserData({ ...userData, skillLevel: e.target.value })
          }
          className="mt-4 bg-gray-800 border border-yellow-500 text-white p-2 rounded-md w-full md:w-1/2"
        >
          <option value="" disabled>
            Select Skill Level
          </option>
          {skillLevelOptions.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      )}

      <h2 className="text-2xl font-semibold mt-8">Attitudes</h2>
      {!isEditing ? (
        <div className="flex flex-wrap gap-3 mt-4">
          {userData.attitude?.length ? (
            userData.attitude.map((attitude) => (
              <Badge key={attitude}>{attitude}</Badge>
            ))
          ) : (
            <p>No attitudes selected</p>
          )}
        </div>
      ) : (
        <MultiSelectDropdown
          options={attitudeOptions}
          selected={userData.attitude}
          onChange={(selected) =>
            setUserData((prev) => ({ ...prev, attitude: selected }))
          }
        />
      )}

      <h2 className="text-2xl font-semibold mt-8">Photo Gallery</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
        {userData.photos?.length ? (
          userData.photos.map((photo, index) => {
            const key = photo.url.split("?")[0].split("/").pop();
            return (
              <div key={index} className="relative group">
                <img
                  src={photo.url}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg cursor-pointer"
                  onClick={() => {
                    setSelectedPhotoIndex(index);
                    setIsModalOpen(true);
                  }}
                />

                {isEditing && (
                  <div className="absolute bottom-0 left-0 w-full p-2 bg-black bg-opacity-50">
                    <EditableField
                      isEditing={isEditing}
                      value={photo.caption || ""}
                      onChange={(value) => {
                        const updatedPhotos = [...userData.photos];
                        updatedPhotos[index].caption = value;
                        setUserData({ ...userData, photos: updatedPhotos });
                      }}
                      type="text"
                      placeholder="Add a caption"
                      className="bg-gray-800 text-white rounded-lg p-2 w-full"
                    >
                      {photo.caption || "No caption"}
                    </EditableField>
                  </div>
                )}

                {isEditing && (
                  <button
                    onClick={async () => {
                      const confirmed = confirm("Delete this photo?");
                      if (!confirmed) return;
                      try {
                        await fetch("/api/upload", {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ key }),
                        });
                        const updated = userData.photos.filter(
                          (_, i) => i !== index,
                        );
                        setUserData({ ...userData, photos: updated });
                        alert("Photo deleted!");
                      } catch (err) {
                        console.error("Delete error:", err);
                        alert("Failed to delete photo.");
                      }
                    }}
                    className="absolute top-2 right-2 bg-black bg-opacity-60 p-1 rounded hover:bg-opacity-80"
                  >
                    <FaTrashAlt className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-400">No photos yet</p>
        )}
      </div>

      {isModalOpen && selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative bg-gray-900 rounded-lg p-6 max-w-xl w-full text-center">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-white hover:text-yellow-500 text-xl"
            >
              ✕
            </button>

            <button
              onClick={() =>
                setSelectedPhotoIndex((prev) =>
                  prev === 0 ? userData.photos.length - 1 : prev - 1,
                )
              }
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-2xl hover:text-yellow-500"
              aria-label="Previous"
            >
              ‹
            </button>

            <img
              src={selectedPhoto.url}
              alt="Photo"
              className="w-full h-auto max-h-[70vh] object-contain mx-auto mb-4 rounded"
            />

            <button
              onClick={() =>
                setSelectedPhotoIndex((prev) =>
                  prev === userData.photos.length - 1 ? 0 : prev + 1,
                )
              }
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-2xl hover:text-yellow-500"
              aria-label="Next"
            >
              ›
            </button>

            <p className="text-white italic mt-2">
              {selectedPhoto.caption || "No caption provided"}
            </p>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="mt-4">
          <div className="mt-4">
            <label
              htmlFor="file-upload"
              className="block text-white bg-yellow-500 border border-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-700 cursor-pointer text-center"
            >
              Choose a file
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const formData = new FormData();
                  formData.append("photo", file);
                  const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                  });
                  if (!response.ok) throw new Error("Failed to upload photo");
                  const { fileUrl } = await response.json();
                  const newPhoto = { url: fileUrl, caption: "" };
                  setUserData((prev) => ({
                    ...prev,
                    photos: prev.photos
                      ? [...prev.photos, newPhoto]
                      : [newPhoto],
                  }));
                } catch (error) {
                  console.error("Error uploading photo:", error);
                  alert("Failed to upload photo. Please try again.");
                }
              }}
              className="hidden"
            />
          </div>
        </div>
      )}

      <div className="mt-12 flex gap-6">
        {isEditing ? (
          <>
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            <Button
              variant="outline"
              className="border border-yellow-500 text-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-900 cursor-pointer"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}

const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};
