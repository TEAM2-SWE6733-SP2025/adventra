"use client";

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useSearchParams } from "next/navigation";

const socket = io({
  path: "/api/socket",
});

export default function Chat({ matchId, currentUserId }) {
  const searchParams = useSearchParams();
  const receiverId = searchParams.get("receiverId");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  let typingTimeout;

  useEffect(() => {
    fetch("/api/socket");
  }, []);

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

    const handleTyping = ({ senderId }) => {
      if (senderId !== currentUserId) {
        setIsTyping(true);
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => setIsTyping(false), 2000);
      }
    };

    const handleStopTyping = ({ senderId }) => {
      if (senderId !== currentUserId) {
        setIsTyping(false);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      console.log("Cleaning up listeners");
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, matchId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleTyping = () => {
    socket.emit("typing", { matchId, senderId: currentUserId });
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", { matchId, senderId: currentUserId });
    }, 2000);
  };

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
    socket.emit("stopTyping", { matchId, senderId: currentUserId });
  };

  return (
    <div className="flex flex-col h-full bg-black text-gray-200">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
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

      {isTyping && (
        <div className="p-2 text-sm text-gray-400 bg-gray-900 border-t border-gray-700">
          The other user is typing...
        </div>
      )}

      <div className="bg-gray-900 border-t border-gray-700 p-4 flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
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
