"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [userProfile] = useState({
    favoriteActivities: ["Hiking", "Scuba Diving", "Mountain Biking"],
    favoriteAdventures: [
      {
        name: "Scuba Diving in Redang Island",
        description: "Exploring the underwater world of Malaysia.",
      },
      {
        name: "Mountain Biking in the Rockies",
        description: "Riding through the rugged trails of the Rocky Mountains.",
      },
    ],
    preferences: {
      people: "Adventurous, open-minded, and fun-loving individuals.",
      adventureTypes: "Outdoor, water sports, and extreme adventures.",
    },
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/current-user", {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setEditedUser(data);
        } else {
          console.error("Failed to fetch current user");
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleEditToggle = () => {
    setIsEditingAccount(!isEditingAccount);
    setEditedUser(user);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch("/api/update-account", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          name: editedUser.name,
          bio: editedUser.bio,
          location: editedUser.location,
          instagramLink: editedUser.instagramLink,
          twitterLink: editedUser.twitterLink,
          linkedInLink: editedUser.linkedInLink,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsEditingAccount(false);
        alert("Account information updated successfully.");
      } else {
        alert("Failed to update account information. Please try again.");
      }
    } catch (error) {
      console.error("Error updating account:", error);
      alert("An error occurred. Please try again.");
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user.id }),
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

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <header className="block w-full">
        <Navbar />
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-8">
          <Image
            src={user.image}
            alt="Profile"
            width={128}
            height={128}
            priority
            className="rounded-full border-4 border-gray-300 dark:border-gray-700 shadow-md object-cover"
          />
          {isEditingAccount ? (
            <>
              <input
                type="text"
                name="name"
                value={editedUser.name || ""}
                onChange={handleInputChange}
                className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white text-center bg-gray-200 dark:bg-gray-700 rounded-lg p-2"
              />
              <textarea
                name="bio"
                value={editedUser.bio || ""}
                onChange={handleInputChange}
                className="mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-300 text-center bg-gray-200 dark:bg-gray-700 rounded-lg p-2 w-full"
              />
              <input
                type="text"
                name="location"
                value={editedUser.location}
                onChange={handleInputChange || ""}
                className="mt-2 text-base sm:text-lg text-gray-900 dark:text-white text-center bg-gray-200 dark:bg-gray-700 rounded-lg p-2 w-full"
                placeholder="Location"
              />
              <div className="flex items-center justify-center gap-4 mt-4">
                <FaInstagram size={24} className="mt-2" />
                <input
                  type="text"
                  name="instagramLink"
                  value={editedUser.instagramLink || ""}
                  onChange={handleInputChange}
                  className="mt-2 text-base sm:text-lg text-gray-900 dark:text-white text-center bg-gray-200 dark:bg-gray-700 rounded-lg p-2 w-full"
                  placeholder="Instagram"
                />
              </div>
              <div className="flex items-center justify-center gap-4 mt-4">
                <FaTwitter size={24} className="mt-2" />
                <input
                  type="text"
                  name="twitterLink"
                  value={editedUser.twitterLink || ""}
                  onChange={handleInputChange}
                  className="mt-2 text-base sm:text-lg text-gray-900 dark:text-white text-center bg-gray-200 dark:bg-gray-700 rounded-lg p-2 w-full"
                  placeholder="Twitter"
                />
              </div>
              <div className="flex items-center justify-center gap-4 mt-4">
                <FaLinkedin size={24} className="mt-2" />
                <input
                  type="text"
                  name="linkedInLink"
                  value={editedUser.linkedInLink || ""}
                  onChange={handleInputChange}
                  className="mt-2 text-base sm:text-lg text-gray-900 dark:text-white text-center bg-gray-200 dark:bg-gray-700 rounded-lg p-2 w-full"
                  placeholder="LinkedIn"
                />
              </div>
            </>
          ) : (
            <>
              <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white text-center">
                {user.name}
              </h1>
              <p className="mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-300 text-center">
                {user.bio}
              </p>
              <p className="mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-300 text-center">
                <strong>Location:</strong> {user.location}
              </p>
              <div className="flex justify-center gap-4 mt-4">
                {user.instagramLink ? (
                  <a
                    href={user.instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram
                      size={24}
                      className="text-pink-500 hover:text-pink-600"
                    />
                  </a>
                ) : (
                  <FaInstagram size={24} />
                )}

                {user.twitterLink ? (
                  <a
                    href={user.twitterLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTwitter
                      size={24}
                      className="text-blue-500 hover:text-blue-700"
                    />
                  </a>
                ) : (
                  <FaTwitter size={24} />
                )}
                {user.linkedInLink ? (
                  <a
                    href={user.linkedInLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedin
                      size={24}
                      className="text-blue-500 hover:text-blue-700"
                    />
                  </a>
                ) : (
                  <FaLinkedin size={24} />
                )}
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end gap-4 mb-8">
          {isEditingAccount ? (
            <>
              <button
                onClick={handleSaveChanges}
                className="text-green-600 hover:text-green-800"
                title="Save Changes"
              >
                <FaSave size={20} />
              </button>
              <button
                onClick={handleEditToggle}
                className="text-gray-600 hover:text-gray-800"
                title="Cancel"
              >
                <FaTimes size={20} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEditToggle}
                className="text-blue-600 hover:text-blue-800"
                title="Edit Profile"
              >
                <FaEdit size={20} />
              </button>
              <button
                onClick={handleDeleteAccount}
                className="text-red-600 hover:text-red-800"
                title="Delete Account"
              >
                <FaTrash size={20} />
              </button>
            </>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Favorite Activities
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            {userProfile.favoriteActivities.map((activity, index) => (
              <li
                key={index}
                className="text-base sm:text-lg text-gray-700 dark:text-gray-300"
              >
                {activity}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Favorite Adventures
          </h2>
          {userProfile.favoriteAdventures.map((adventure, index) => (
            <div
              key={index}
              className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {adventure.name}
              </h3>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                {adventure.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Preferences
          </h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
            <strong>People:</strong> {userProfile.preferences.people}
          </p>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mt-2">
            <strong>Adventure Types:</strong>{" "}
            {userProfile.preferences.adventureTypes}
          </p>
        </div>
      </main>
    </>
  );
}
