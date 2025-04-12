"use client";

import { useEffect } from "react";
import Button from "./Button.jsx";

export default function LikeButton({
  likedUserId,
  currentUserId,
  status,
  setStatus,
}) {
  useEffect(() => {
    const fetchStatus = async () => {
      if (!likedUserId || !currentUserId) return;

      try {
        const response = await fetch(`/api/match/status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            likerId: currentUserId,
            likedId: likedUserId,
          }),
        });

        const data = await response.json();
        if (data.status === "matched") {
          setStatus("Matched");
        } else if (data.status === "liked") {
          setStatus("Liked");
        } else {
          setStatus("Like");
        }
      } catch (error) {
        console.error("Error fetching match status:", error);
        setStatus("Like");
      }
    };

    fetchStatus();
  }, [likedUserId, currentUserId, setStatus]);

  const handleLike = async () => {
    if (!likedUserId || !currentUserId) {
      alert("User data is missing!");
      return;
    }

    if (status !== "Like") {
      alert("You have already liked this user.");
      return;
    }

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          likerId: currentUserId,
          likedId: likedUserId,
        }),
      });

      const data = await response.json();
      if (data.message === "It's a match!") {
        setStatus("Matched");
        alert("It's a match!");
      } else {
        setStatus("Liked");
        alert("Like recorded, waiting for mutual like.");
      }
    } catch (error) {
      console.error("Error liking user:", error);
      alert("Failed to like user.");
    }
  };

  return (
    <Button
      onClick={handleLike}
      className={`mt-2 px-4 py-2 rounded ${
        status === "Matched"
          ? "bg-green-500 text-white"
          : status === "Liked"
            ? "bg-gray-500 text-white"
            : "bg-blue-500 text-white"
      }`}
      disabled={status === "Matched"}
    >
      {status}
    </Button>
  );
}
