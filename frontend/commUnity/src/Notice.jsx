import React, { useState, useEffect } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import axios from "axios";
import NoticeComm from "./components/NoticeComm";

function Notice() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [communities, setCommunities] = useState([]);

  // Fetch communities from backend
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/users/joined_communities",
          { withCredentials: true }
        );
        setCommunities(res.data || []);
      } catch (err) {
        console.error("Error fetching communities:", err);
      }
    };

    fetchCommunities();
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const onSelectCommunity = (community) => setSelectedCommunity(community);

  return (
    <div className="flex font-primary h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white transition-all duration-300 ease-in-out 
        ${isOpen ? "w-64" : "w-12"} relative`}
      >
        {/* Toggle Button */}
        <button
          className="absolute top-4 -right-4 bg-gray-800 p-1 rounded-r-md z-10"
          onClick={toggleSidebar}
        >
          {isOpen ? (
            <MdKeyboardArrowRight
              size={20}
              className="rotate-180 transition-transform duration-200"
            />
          ) : (
            <MdKeyboardArrowRight size={20} />
          )}
        </button>

        {/* Sidebar Content */}
        <div className="p-4 overflow-y-auto h-full">
          {isOpen && (
            <>
              <h2 className="text-lg font-semibold mb-4">Your Communities</h2>
              <ul className="space-y-2">
                {communities.length > 0 ? (
                  communities.map((community, index) => (
                    <li
                      key={index}
                      className={`cursor-pointer hover:bg-gray-700 p-2 rounded-md ${
                        selectedCommunity?.name === community.name
                          ? "bg-gray-700"
                          : ""
                      }`}
                      onClick={() => onSelectCommunity(community)}
                    >
                      {community.name}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No joined communities.</li>
                )}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Notices Section */}
      <div className="flex-1 p-2 overflow-y-auto">
        {selectedCommunity ? (
          <NoticeComm communityId={selectedCommunity._id} />
        ) : (
          <div className="text-center max-w-md mx-auto mt-40">
          <img
            src="/images/login_side.png" 
            alt="Select a community"
            className="w-64 h-64 mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Community Selected</h2>
          <p className="text-gray-500">
            Please select a community from the sidebar to view its latest notices and updates.
          </p>
        </div>
        )}
      </div>
    </div>
  );
}

export default Notice;