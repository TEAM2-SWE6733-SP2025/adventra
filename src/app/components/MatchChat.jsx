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
        console.log("User Data:", data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    //Fetch user data from the database for use in match chat room assignment
    fetchUserData();
    return () => {};
  }, []);

  useEffect(() => {
    if (userData) {
      setUserId(userData.id); // Set userId when userData is available
      console.log("User ID:", userId);
      //TODO: createMatches() is a temporary method for making matches for testing in the development database, this needs to be replaced with a proper function that creates matches when two users swipe right(or whatever equivalent we come up with) on each other
      createMatches();
      loadUserMatches();
    }
  }, [userData]);

  //This useEffect is used to set the current match to the first match in the userMatches array when it is created/updated
  useEffect(() => {
    if (userMatches.length > 0) {
      setCurrentMatch(userMatches[0]); // Set the first match only after userMatches is updated
      console.log("Current Match:", userMatches[0]);
    }
  }, [userMatches]);

  //This useEffect contains the socket.io client connection logic, as well as the event listeners for connection and disconnection events(disconnections are not implemented on the server yet so they're just hanging out for now)
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
    //TODO: Not implemented serverside, will get back to this in the near future
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.disconnect();
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);
  //useEffect for recieving messages from the server and adding them to the component's messages array
  useEffect(() => {
    socket.on("messageResponse", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, self: false },
      ]);
      console.log("Message received by client:", message);
    });
    // Cleanup listener on component unmount
    return () => {
      socket.off("messageResponse");
    };
  }, [socket]);

  //Send message to the server, and add it to the component's messages array
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", message); // Send message to server
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, self: true },
      ]);
      setMessage("");
    }
  };

  //This function is called when the user selects a match from the list of matches, and switches the active chat to that match's chat.
  const handleMatchChange = async (match) => {
    setCurrentMatch(match);
    console.log("New MatchId:", match.id);
    socket.emit("Joining match session", match.id); //TODO: Left from previous implementation, further research on the best way to handle this functionality is needed

    try {
      const response = await fetch(`/api/match-messages?matchId=${match.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch user data");
      const data = await response.json();
      setMessages(data);
      console.log("Match Message Data:", data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    setMessage("");
  };

  //This loads the matches in the database that involve the current user's id
  const loadUserMatches = async () => {
    try {
      const response = await fetch("/api/matcher", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to load user matches");
      const matches = await response.json();
      setUserMatches(matches);
      console.log("Current Match:", currentMatch);
      console.log("Loaded User Matches:", matches);
    } catch (error) {
      console.error("Error loading user matches:", error);
    }
  };

  //TODO:This is a temporary method for testing purposes only, and needs to be replaced with a proper function that creates matches when two users swipe right on each other(or whatever requirements we decide on)
  //This function creates matches between the first user in the database and all other users in the database at the time the function is called
  const createMatches = async () => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch users data");
      const data = await response.json();
      console.log("Fetched Users:", data);
      var matches = [];
      for (let i = 1; i < data.length; i++) {
        const match = {
          userOneId: data[0].id,
          userTwoId: data[i].id,
          userOneName: data[0].name,
          userTwoName: data[i].name,
        };
        matches.push(match);
      }
      console.log("Matches:", matches);
      saveMatches(matches);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  //TODO: This will need to be modified to work with actual matches,this is just a temporary method
  // that works with the createMatches testing function to make some dummy matches. The new version
  // should probably end up in the dedicated matching component when we have that up and running.
  const saveMatches = async (matches) => {
    try {
      const response = await fetch("/api/matcher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matches),
      });
      if (!response.ok) throw new Error("Failed to save matches to database");
      console.log("Any new matches have been saved to the database:", matches);
    } catch (error) {
      console.error("Error saving matches to database:", error);
    }
  };

  return (
    <div className="flex">
      <div>
        <p>Status: {isConnected ? "connected" : "disconnected"}</p>
        <p>Transport: {transport}</p>
      </div>
      <aside className="w-1/4 border-r border-gray-300 p-2.5">
        <h2 className="text-lg font-bold mb-4">Matches</h2>
        <ul>
          {userMatches.map((match, index) => (
            <li key={index} className="flex items-center justify-between">
              {match.userOneId === userId
                ? match.userTwoName
                : match.userOneName}
              <button
                onClick={() => {
                  // Swap current room to the selected match
                  handleMatchChange(match);
                  setMessages([]); // Clear messages when switching matches
                }}
                className="ml-2 cursor-pointer bg-transparent border-none p-1 transition-colors duration-300 hover:bg-gray-200"
              >
                Chat
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div className="flex-1 p-2.5">
        <div className="border border-gray-300 p-2.5 h-72 overflow-y-scroll">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                msg.self ? "items-end" : "items-start"
              }`}
            >
              <span className="text-sm text-gray-500">
                {msg.self ? "You" : msg.senderName || "Other User"}
              </span>
              <div
                className={`p-2 rounded-lg ${
                  msg.self ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2.5 flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-grow p-1.5 border border-gray-300 rounded"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            className="ml-2 p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
export default MatchChat;
