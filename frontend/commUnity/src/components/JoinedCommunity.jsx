import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function JoinedCommunity() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [communities, setCommunities] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendUrl}/users/joined_communities`,
          { withCredentials: true }
        );

        setCommunities(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "failed to fetch communities"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, []);

  const handleClick = (communityId) => {
    navigate("/community/explore", { state: { communityId } });
  };

  return (
    <div className="p-5 bg-gray-200 mt-20">
      <h1 className="text-2xl font-semibold text-gray-800 text-center md:text-left md:pl-8 mt-20">
        Joined Communities
      </h1>
      <hr className="h-0.5 bg-gradient-to-r from-blue-500 to-green-500 border-none w-[calc(100%-3rem)] mx-auto" />

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : communities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 px-4">
          {communities.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden p-5 border border-gray-200 w-full max-w-sm mx-auto transition-all duration-300 hover:shadow-2xl"
            >
              {/* Community Image */}
              <img
                src={item.image}
                alt="community_profile"
                className="w-full h-44 object-cover rounded-lg"
              />

              {/* Community Details */}
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {item.name}
                </h2>
                <p className="text-gray-600 text-sm">{item.subtitle}</p>
                <p className="mt-2 text-gray-700 line-clamp-3">
                  {item.description}
                </p>
              </div>

              {/* Explore Button */}
              <button
                onClick={() => handleClick(item._id)}
                className="mt-4 w-full bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-700 hover:scale-105"
              >
                Explore
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No communities found.</p>
      )}
    </div>
  );
}

export default JoinedCommunity;
