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
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(false);
    }
  }, [userData]);

  //This useEffect is used to set the current match to the first match in the userMatches array when it is created/updated
  useEffect(() => {
    if (userMatches.length > 0) {
      setCurrentMatch(userMatches[0]); // Set the first match once after userMatches is updated
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

    /*socket.on("matchChatHistory", (messages) => {
      setMessages(messages);
      console.log("Match chat history received:", messages);
    });*/

    // Cleanup listener on component unmount
    return () => {
      socket.off("messageResponse");
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
    console.log("New MatchId:", match.id);
    socket.emit("Joining match session", match.id); //TODO: Left from previous implementation, further research on the best way to handle this functionality is needed

    try {
      const response = await fetch(`/api/match-messages?matchId=${match.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch user data");
      const fetchedMessages = await response.json();
      console.log("Fetched Messages:", fetchedMessages);
      //There's some cleaning up to do here, will be back when i've got more time :)
      const sortedMessages = fetchedMessages
        .map((msg) => ({ text: msg.content, self: msg.senderId === userId }))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMessages(sortedMessages);
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
    <div className="flex h-screen bg-black text-gray-100">
      <aside className="w-1/4 border-r border-gray-800 p-4 bg-gray-900">
        <h2 className="text-xl font-bold mb-6 text-gray-400">Your Matches</h2>
        <ul className="space-y-4">
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
              <button
                onClick={() => {
                  // Swap current room to the selected match
                  handleMatchChange(match);
                  setMessages([]); // Clear messages when switching matches
                }}
                className="ml-2 px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Chat
              </button>
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
                  }` //This is a temporary solution, will need to be replaced with a proper function that gets the other user's name if I have the time
                : "Select a match to start chatting"}
            </h2>
          </div>
        </div>

        <div className="flex-1 border border-gray-800 rounded p-4 overflow-y-scroll bg-gray-900">
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

        <div className="mt-4 flex items-center">
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
