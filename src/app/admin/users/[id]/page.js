"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfilePage from "@/app/components/Profile";

export default function UserProfilePage({ params }) {
  const { id } = params;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/admin/users/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data.");
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <p className="text-gray-300">Loading user profile...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen p-6">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-500 hover:underline"
      >
        ← Back to Users
      </button>
      <ProfilePage
        userData={userData}
        setUserData={setUserData}
        isEditing={true}
        handleSave={async () => {
          try {
            const response = await fetch(`/api/admin/users/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(userData),
            });
            if (!response.ok) {
              throw new Error("Failed to save user");
            }
            const updatedData = await response.json();
            setUserData(updatedData);
            alert("User profile updated successfully!");
          } catch (err) {
            console.error("Error saving user data:", err);
            alert("Failed to save user profile.");
          }
        }}
      />
    </div>
  );
}
