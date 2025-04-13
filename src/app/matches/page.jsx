"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import Chat from "@/app/components/Chat";

function MatchesContent() {
  const searchParams = useSearchParams();
  const currentUserId = searchParams.get("userId");

  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMatchesVisible, setIsMatchesVisible] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(`/api/matches?userId=${currentUserId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch matches");
        }
        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchMatches();
    }
  }, [currentUserId]);

  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    setIsMatchesVisible(false);
  };

  const handleDeleteMatch = async (matchId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chat? This action cannot be undone.",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/messages/${matchId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete match");
      }

      setMatches((prevMatches) =>
        prevMatches.filter((match) => match.id !== matchId),
      );

      if (selectedMatch?.id === matchId) {
        setSelectedMatch(null);
      }
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  };

  return (
    <div className="matches-page flex h-screen bg-black text-gray-200">
      <div
        className={`matches-list fixed inset-y-0 left-0 w-2/3 sm:w-1/3 bg-black border-r border-gray-700 p-4 transform ${
          isMatchesVisible ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 sm:relative sm:translate-x-0`}
      >
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">
          Your Matches
        </h2>
        {loading ? (
          <p className="text-gray-400">Loading matches...</p>
        ) : matches.length === 0 ? (
          <p className="text-gray-400">No matches found.</p>
        ) : (
          <ul className="space-y-4">
            {matches.map((match) => {
              const matchedUser =
                match.user1Id === currentUserId ? match.user2 : match.user1;

              return (
                <li
                  key={match.id}
                  className={`p-4 border rounded cursor-pointer ${
                    selectedMatch?.id === match.id
                      ? "bg-yellow-400 text-black"
                      : "bg-gray-800 text-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center space-x-4"
                      onClick={() => handleSelectMatch(match)}
                    >
                      <img
                        src={matchedUser.profilePic || "/default-avatar.png"}
                        alt={matchedUser.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-bold">
                          {matchedUser.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {matchedUser.location}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMatch(match.id)}
                      className="text-red-600 hover:text-red-700"
                      aria-label="Delete Match"
                    >
                      <FaTrash className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="chat-section flex-1 p-4 bg-black">
        {selectedMatch ? (
          <Chat matchId={selectedMatch.id} currentUserId={currentUserId} />
        ) : (
          <p className="text-gray-400 text-center">
            Select a match to start chatting.
          </p>
        )}
      </div>
    </div>
  );
}

export default function MatchesPage() {
  return (
    <Suspense fallback={<p className="text-gray-400">Loading...</p>}>
      <MatchesContent />
    </Suspense>
  );
}
