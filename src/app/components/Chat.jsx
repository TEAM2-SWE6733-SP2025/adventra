"use client";

import { useState, useEffect, useRef } from "react";
import useSocket from "@/hooks/useSocket";
import { useSearchParams } from "next/navigation";

export default function Chat({ matchId, currentUserId }) {
  const socket = useSocket();
  const searchParams = useSearchParams();
  const receiverId = searchParams.get("receiverId");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`/api/messages/${matchId}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    if (matchId) {
      fetchChatHistory();
    }
  }, [matchId]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("joinRoom", matchId);

    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      console.log("Cleaning up listener for receiveMessage");
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, matchId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      senderId: currentUserId,
      receiverId,
      matchId,
      content: newMessage,
      createdAt: new Date(),
    };

    socket.emit("sendMessage", message);

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full bg-black text-gray-200">
      <div className="bg-gray-900 border-b border-gray-700 p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search messages..."
          className="w-full bg-gray-800 text-gray-200 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages
          .filter((msg) =>
            msg.content.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.senderId === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.senderId === currentUserId
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-gray-900 border-t border-gray-700 p-4 flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 text-gray-200 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button
          onClick={sendMessage}
          className="ml-4 bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500"
        >
          Send
        </button>
      </div>
    </div>
  );
}
