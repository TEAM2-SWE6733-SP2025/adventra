"use client";
import React, { useEffect, useState } from "react";
import AvatarUploader from "./AvatarUploader";
import EditableField from "./EditableField";
import SocialLinksEditor from "./SocialLinksEditor";
import MultiSelectDropdown from "./MultiSelectDropdown";
import Badge from "./Badge";
import Button from "./Button";
import Card from "./Card";
import { signOut } from "next-auth/react";

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
  const [isOffline, setIsOffline] = useState(!navigator.onLine); // Track offline status

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData({
          ...data,
          adventureTypes: data.adventureTypes || [],
          attitude: data.attitude || [],
          languages: data.languages || [],
          socialMedia: data.socialMedia || {},
        });

        localStorage.setItem("profile", JSON.stringify(data));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);

        const cachedProfile = localStorage.getItem("profile");
        if (cachedProfile) {
          setUserData(JSON.parse(cachedProfile));
        } else {
          setError("Failed to load user data.");
        }
        setLoading(false);
      }
    };

    fetchUserData();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleDelete = async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete profile");
      }
      router.push("/");
    } catch (error) {
      console.error("Error deleting profile:", error);
      setError("Failed to delete profile.");
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error("Failed to save user data");
      }
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
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const response = await fetch("/api/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <Card>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <AvatarUploader
          src={userData.profilePic || userData.image || ""}
          alt={userData.name || "User"}
          isEditing={isEditing}
          onChange={(e) =>
            setUserData({
              ...userData,
              profilePic: URL.createObjectURL(e.target.files[0]),
            })
          }
        />
        <div>
          <h1 className="text-3xl font-extrabold">
            {userData.name || "New User"}
          </h1>
          <div className="flex items-center gap-x-4">
            <EditableField
              isEditing={isEditing}
              value={
                isEditing && userData.birthdate
                  ? new Date(userData.birthdate).toISOString().split("T")[0]
                  : userData.birthdate || ""
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
            <EditableField
              isEditing={isEditing}
              value={userData.location || ""}
              onChange={(value) =>
                setUserData({ ...userData, location: value })
              }
            >
              {userData.location || "No location"}
            </EditableField>
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
          onChange={(selectedAdventureTypes) =>
            setUserData((prev) => ({
              ...prev,
              adventureTypes: selectedAdventureTypes,
            }))
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
          onChange={(selectedAttitudes) =>
            setUserData((prev) => ({
              ...prev,
              attitude: selectedAttitudes,
            }))
          }
        />
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
