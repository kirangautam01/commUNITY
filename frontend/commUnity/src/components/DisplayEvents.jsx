import React, { useEffect, useState } from "react";
import axios from "axios"; // Ensure you have axios installed

import {
  FaRegThumbsUp,
  FaRegThumbsDown,
  FaRegCommentDots,
} from "react-icons/fa";

const DisplayEventsTimeline = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events from the backend API
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/users/get_events"
        ); // Adjust URL if necessary
        if (response.data.success) {
          setEvents(response.data.events);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100 h-auto my-10 rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Community Events Feed 📰
      </h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-500">
          No events available at the moment.
        </p>
      ) : (
        events.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {event.author?.username || "Unknown"}
                </p>
                <p className="text-xs text-gray-500">
                  {event.communityId?.name || "No community"}
                </p>
              </div>
              {event.author?.profilePic && (
                <img
                  src={event.author.profilePic}
                  alt={event.author.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
            </div>

            {/* Body */}
            <div className="p-4">
              <p className="text-xs text-gray-500">
                {new Date(event.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-gray-700 mb-3">{event.body}</p>
              {event.image && (
                <img
                  src={event.image}
                  alt={event.name}
                  className="rounded-lg w-full object-cover max-h-72"
                />
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-around px-4 py-3 border-t text-gray-600 text-sm">
              <button className="flex items-center gap-1 hover:text-blue-600 transition">
                <FaRegThumbsUp /> Like
              </button>
              <button className="flex items-center gap-1 hover:text-red-500 transition">
                <FaRegThumbsDown /> Dislike
              </button>
              <button className="flex items-center gap-1 hover:text-blue-600 transition">
                <FaRegCommentDots /> Comment
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DisplayEventsTimeline;
