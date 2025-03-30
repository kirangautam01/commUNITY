import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function ExploreCommunity() {
  const location = useLocation();
  const item = location.state?.communityId; // This expects 'item' to be passed through navigation state
  const [community, setCommunity] = useState(null); // Initialize with null
  const [message, setMessage] = useState(""); // Correct use of useState

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        // Use backticks for template literals
        const response = await axios.get(
          `http://localhost:4000/users/explore/${item}`
        );

        if (response.data) {
          setCommunity(response.data); // Set community data from the response
        }
      } catch (error) {
        setMessage("Error fetching community details");
        console.log("error fetching community", error);
        toast.error(message); // Show an error toast with the message
      }
    };

    if (item) {
      fetchCommunity(); // Fetch data only if 'item' exists
    }
  }, [item, message]); // Add message to dependency array

  // ------------------------------------------------------------------------------------------------------- TO JOIN COMMUNITY
  const joinCommunity = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:4000/users/join_community/${item}`,
        {},
        {
          withCredentials: true,
        }
      );

      // console.log(item);

      if (response.data) {
        const message = response.data.message;
        setMessage(message);
        toast.success(message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred.";
      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <Toaster />
      {community ? (
        <div className="font-primary">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white p-6 shadow-lg rounded-lg">
            {/* Community Image */}
            <img
              src={community.image}
              alt="community_profile"
              className="w-full md:w-1/2 h-100 object-cover rounded-lg shadow-lg"
            />

            {/* Community Details */}
            <div className="flex flex-col gap-4 md:ml-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {community.name}
              </h1>
              <p className="text-gray-600">
                ID:{" "}
                <span className="font-semibold">#{community.communityId}</span>
              </p>
              <p className="text-gray-700">
                {community.subtitle} - {community.location}
              </p>
              <p className="text-gray-700">{community.description}</p>
              <p className="text-gray-700">
                <span className="font-semibold">Genre:</span> {community.genre}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Created Date:</span>{" "}
                {community.createdAt.split("T")[0]}
              </p>

              {/* Join Button */}
              <button
                onClick={joinCommunity}
                className="mt-4 w-full md:w-auto bg-primaryBlue rounded-2xl p-1 hover:cursor-pointer hover:bg-sky-300"
              >
                Join
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 p-10 bg-gray-100 rounded-lg shadow-lg">
            {/* Admin / Creator Section */}
            <div className="p-10 flex flex-col items-center bg-white shadow-md rounded-lg">
              <img
                src={community.creater.profilePic}
                alt="admin_pic"
                className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md object-cover"
              />
              <h2 className="text-xl font-semibold text-gray-700 mt-4">
                Admin / Creator
              </h2>
              <p className="text-lg font-medium text-gray-600">
                {community.creater.username}
              </p>
              <p className="text-sm text-gray-500">
                {community.creater.location}
              </p>
            </div>

            {/* Members Section */}
            <div className="flex-grow w-full md:w-auto bg-white shadow-md rounded-lg p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center md:text-left">
                Members
              </h1>

              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="py-3 px-5 text-left">S.N</th>
                      <th className="py-3 px-5 text-left">Profile</th>
                      <th className="py-3 px-5 text-left">Username</th>
                      <th className="py-3 px-5 text-left">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {community.members.map((item, index) => (
                      <tr
                        key={item._id}
                        className="border-b border-gray-200 hover:bg-gray-100 transition"
                      >
                        <td className="py-3 px-5">{index + 1}</td>
                        <td className="py-3 px-5">
                          <img
                            src={item.profilePic}
                            alt="members_profile"
                            className="w-12 h-12 rounded-full border border-gray-300 shadow-sm object-cover"
                          />
                        </td>
                        <td className="py-3 px-5 font-medium text-gray-700">
                          {item.username}
                        </td>
                        <td className="py-3 px-5 text-gray-600">
                          {item.location}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading community details...</p>
      )}
    </div>
  );
}

export default ExploreCommunity;
