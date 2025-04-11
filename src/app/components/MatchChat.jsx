"use client";
import React, { useState, useEffect } from "react";
import socket from "../../socket";

const MatchChat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState("");
  const [userMatches, setUserMatches] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/current-user");
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
    //Set the current match to the first match in the userMatches array if it exists
    if (userMatches.length > 0) setCurrentMatch(userMatches[0]);
  }, []);

  //userData useEffect, this is where we set the userId for the socket connection(etc)
  useEffect(() => {
    if (userData && !userId) {
      setUserId(userData.id); // Set userId when userData is available
      //console.log("User ID:", userId);

      //TODO: createMatches() is a temporary method for making matches for testing in the development database, this needs to be replaced with a proper function that creates matches when two users swipe right(or whatever equivalent we come up with) on each other
      createMatches(userData.id);
    }
    if (userData && !userMatches) {
      loadUserMatches(); // Load user matches when userData is available
    }
  }, [userData]);

  //This useEffect contains the socket.io client connection logic, as well as the event listeners for connection and disconnection events
  useEffect(() => {
    socket.connect(); // Connect client to the server
    if (socket.connected) {
      onConnect();
    }
    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }
    socket.on("connect", onConnect);
    //TODO: Not implemented correctly serverside, will get back to this in the near future
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, [socket]);

  //useEffect for recieving messages from the server and adding them to the component's messages array.
  //Split this off from the connection logic to avoid a giant useEffect
  useEffect(() => {
    socket.on("messageResponse", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, self: false },
      ]);
    });
    //This recieves the Match Deleted event from the server and reloads the user matches(inefficient, but probably sufficient for now)
    socket.on("Match deleted", () => {
      loadUserMatches(); // Reload user matches when a match is deleted
      console.log("Match deleted successfully");
    });

    // Cleanup listener on component unmount
    return () => {
      socket.off("messageResponse");
      socket.off("Match Deleted");
    };
  }, [socket]);

  //Send message to the server, and add it to the component's messages array
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", message, currentMatch, userData); // Send message and relevant information to server
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, self: true },
      ]);
      setMessage("");
    }
  };

  //This function is called when the user selects a match from the list of matches, and switches the active chat to that match's chat. (Fetches old match chat messages and displays them)
  const handleMatchChange = async (match) => {
    setCurrentMatch(match);
    //console.log("New MatchId:", match.id);
    socket.emit("Joining match session", match.id); //TODO: Left from previous implementation, further research on the best way to handle this functionality is needed

    try {
      const response = await fetch(`/api/match-messages?matchId=${match.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch user data");
      const fetchedMessages = await response.json();
      //(Chris W) There's some cleaning up to do here, will be back when i've got more time x_x
      const sortedMessages = fetchedMessages
        .map((msg) => ({ text: msg.content, self: msg.senderId === userId }))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMessages(sortedMessages);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    setMessage("");
  };

  //This loads the matches in the database that involve the current user's id and sets the userMatches state to that array
  //TODO: (Chris W) I did this before the large refactor to have the socket.io server handle database interaction. Will refactor this when time allows.
  const loadUserMatches = async () => {
    try {
      const response = await fetch("/api/matcher", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to load user matches");
      const matches = await response.json();
      setUserMatches(matches);
      //console.log("Loaded User Matches:", matches);
    } catch (error) {
      console.error("Error loading user matches:", error);
    }
  };

  //This function sends a request to the server to delete a match from the database
  const deleteMatch = async (matchToDelete) => {
    socket.emit("Deleting a match", matchToDelete.id);
  };

  //TODO:This is a temporary method for testing purposes only, and needs to be replaced with a proper function that creates matches when two users swipe right on each other(or whatever requirements we decide on)
  //This function creates matches between the current user and all other users in the database at the time the function is called
  //Also, quick-fixed this with copilot, so it's visually MESSY, but it's getting deleted anyways so if it works it works.
  const createMatches = async (userId) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch users data");
      const data = await response.json();
      // Filter out existing matches
      const existingMatchIds = new Set(
        userMatches.map(
          (match) =>
            `${match.userOneId}-${match.userTwoId}` ||
            `${match.userTwoId}-${match.userOneId}`,
        ),
      );

      const matches = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === userId) continue; // Skip the current user
        const match = {
          userOneId: userId,
          userOneName: userData.name,
          userTwoId: data[i].id,
          userTwoName: data[i].name,
        };
        matches.push(match);
      }

      if (matches.length > 0) {
        saveMatches(matches);
        loadUserMatches(); // Reload user matches after creating new matches
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  //TODO: This will need to be modified to work with actual matches and save them to the database, this is just a temporary method
  // that works with the createMatches testing function to post some dummy matches to the db. The new version
  // should probably end up in the dedicated matching component when we have that up and running.
  const saveMatches = async (matches) => {
    try {
      const response = await fetch("/api/matcher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matches),
      });
      if (!response.ok) throw new Error("Failed to save matches to database");
    } catch (error) {
      console.error("Error saving matches to database:", error);
    }
  };

  return (
    <div className="flex h-screen bg-black text-gray-100">
      <aside className="w-1/4 border-r border-gray-800 p-4 bg-gray-900 flex flex-col">
        <h2 className="text-xl font-bold mb-6 text-gray-400">Your Matches</h2>
        <ul className="space-y-4 overflow-y-auto flex-grow">
          {userMatches.map((match, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 bg-gray-800 rounded shadow hover:shadow-md transition-shadow"
            >
              <span className="text-gray-200 font-medium">
                {match.userOneId === userId
                  ? match.userTwoName
                  : match.userOneName}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    // Swap current room to the selected match
                    handleMatchChange(match);
                    setMessages([]); // Clear messages when switching matches
                  }}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Chat
                </button>
                <button
                  onClick={() => deleteMatch(match)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex-1 flex flex-col p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">
              <span className="font-semibold">Status:</span>{" "}
              {isConnected ? (
                <span className="text-green-400">Connected</span>
              ) : (
                <span className="text-red-400">Disconnected</span>
              )}
            </p>
            <p className="text-sm text-gray-400">
              <span className="font-semibold">Transport:</span> {transport}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-400">
              {currentMatch
                ? `Chatting with ${
                    currentMatch.userOneId === userId
                      ? currentMatch.userTwoName
                      : currentMatch.userOneName
                  }` // (Chris W) This is a temporary but functional solution, will need to be replaced with a proper function that gets the other user's name if I have the time
                : "Select a match to start chatting"}
            </h2>
          </div>
        </div>

        <div className="flex-1 border border-gray-800 rounded p-4 overflow-y-auto bg-gray-900">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 flex ${
                msg.self ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg shadow ${
                  msg.self
                    ? "bg-gray-600 text-white"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                <span className="block text-xs mb-1 text-gray-400">
                  {msg.self
                    ? "You"
                    : currentMatch &&
                      (currentMatch.userOneId === userId
                        ? currentMatch.userTwoName
                        : currentMatch.userOneName)}
                </span>
                <span>{msg.text}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-shrink-0 mt-4 flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              currentMatch
                ? "Type a message..."
                : "Select a chat to start typing"
            }
            className="flex-grow p-2 border border-gray-800 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
            onKeyDown={(e) => {
              if (e.key === "Enter" && currentMatch) {
                sendMessage();
              }
            }}
            disabled={!currentMatch}
          />
          <button
            onClick={sendMessage}
            className={`ml-3 px-4 py-2 rounded transition-colors ${
              currentMatch
                ? "bg-gray-600 text-white hover:bg-gray-700"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!currentMatch}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
export default MatchChat;
