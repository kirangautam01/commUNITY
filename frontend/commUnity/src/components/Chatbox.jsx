import React, { useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import MessageBox from "./MessageBox";
import socket from "./socket";

const ChatUI = () => {
  const { id } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [community, setCommunity] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await axios.get(`${backendUrl}/users/explore/${id}`, {
          withCredentials: true,
        });
        if (response.data) setCommunity(response.data);
      } catch (error) {
        console.error("Error fetching community", error);
        toast.error("Error fetching community details");
      }
    };

    if (id) fetchCommunity();
  }, [id]);

  useEffect(() => {
    // Listen for online status updates
    socket.on("update-user-status", ({ userId, isOnline }) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: isOnline,
      }));
    });

    return () => {
      socket.off("update-user-status");
    };
  }, []);

  if (!community) {
    return (
      <div className="flex justify-center items-center">
        <p>Loading community details...</p>
      </div>
    );
  }

  return (
    <div className="font-primary">
      <h1 className="text-center text-2xl uppercase font-bold">
        {community.name}
      </h1>
      <div className="flex flex-col md:flex-row h-screen md:h-[80vh] bg-gray-50 p-4 gap-4">
        <Toaster />

        {/* Members List */}
        <div className="w-full md:w-1/3 bg-white p-4 md:p-6 rounded-lg shadow-lg overflow-y-auto max-h-72 md:max-h-full">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-primaryBlue">
            Members
          </h2>
          <ul className="space-y-4">
            {community?.members?.map((member, index) => (
              <li key={index} className="flex items-center justify-between">
                <span className="text-gray-700 flex items-center gap-2">
                  {member.username}
                  {onlineUsers[member._id] && (
                    <FaCircle className="text-green-500" title="Online" /> 
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Message Box */}
        <div className="w-full md:flex-1">
          <MessageBox />
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
