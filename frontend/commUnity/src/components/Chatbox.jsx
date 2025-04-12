import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import MessageBox from "./MessageBox";

const ChatUI = () => {
  const { id } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  // const [message, setMessage] = useState("");
  const [community, setCommunity] = useState(null);

  // Fetch community data
  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await axios.get(`${backendUrl}/users/explore/${id}`);

        if (response.data) {
          setCommunity(response.data);
        }
      } catch (error) {
        console.error("Error fetching community", error);
        toast.error("Error fetching community details");
      }
    };

    if (id) {
      fetchCommunity();
    }
  }, [id]);

  return (
    <div className="flex h-[80vh] bg-gray-50 font-sans">
      <Toaster />
      {/* Members List */}
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg ml-6 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-primaryBlue">Members</h2>
        <ul className="space-y-4">
          {community?.members?.map((member, index) => (
            <li key={index} className="flex items-center justify-between">
              <span className="text-gray-700">{member.username}</span>
              {member.online && (
                <FaCheckCircle className="text-primaryGreen w-5 h-5" />
              )}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <MessageBox />
      </div>
    </div>
  );
};

export default ChatUI;
