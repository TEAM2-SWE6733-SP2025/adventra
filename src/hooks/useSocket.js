import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io({
      path: "/api/socket",
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;
