import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "./socket";

const MessageBox = () => {
  const { id: communityId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const currentUser = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");

  // Join room and receive messages
  useEffect(() => {
    if (userId) {
      console.log("Connecting user with ID:", userId);
      socket.connect(); // ✅ only needed if socket is not auto-connecting
      socket.emit("user-connected", userId);
    }
  
    socket.emit("join-room", communityId);
  
    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
  
    return () => {
      socket.off("receive-message");
  
      // ✅ Explicit disconnect
      socket.disconnect();
      console.log("Socket disconnected on unmount");
    };
  }, [communityId, userId]);
  

  const sendMessage = () => {
    if (message.trim() && currentUser) {
      const newMessage = {
        communityId,
        message,
        sender: currentUser,
      };

      socket.emit("send-message", newMessage);
      setMessage("");
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Scrollable message area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 pr-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-md w-full md:max-w-[75%] break-words ${
              msg.sender === currentUser
                ? "bg-blue-100 self-end text-right"
                : "bg-gray-200 self-start text-left"
            }`}
          >
            <strong>{msg.sender === currentUser ? "You" : msg.sender}:</strong>
            {msg.message}
          </div>
        ))}
      </div>

      {/* Input and send button */}
      <div className="flex gap-2 mt-4 flex-col sm:flex-row">
        <input
          className="flex-1 border px-4 py-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-primaryBlue text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageBox;
