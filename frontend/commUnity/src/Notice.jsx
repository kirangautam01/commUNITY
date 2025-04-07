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
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedCommunity ? (
          <NoticeComm communityId={selectedCommunity._id} />
        ) : (
          <p className="text-gray-500">
            Select a community to view its notices.
          </p>
        )}
      </div>
    </div>
  );
}

export default Notice;

{
  /* <div className="relative bg-yellow-100 text-black p-6 rounded-lg shadow-2xl w-80 h-auto max-w-xs">
          <div className="absolute top-2 right-2">
            <img
              src="/images/pin2.png"
              alt="pin"
              className="h-6 w-6 filter drop-shadow-[0px_12px_8px_rgb(0,0,0)]"
            />
          </div>
          <h2 className="font-semibold text-xl mb-2">Notice 1</h2>
          <p className="text-sm">
            This is a sample notice with some text to give you an idea of the
            content structure.
          </p>
        </div> */
}
