import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaRegThumbsUp,
  FaRegThumbsDown,
  FaRegCommentDots,
} from "react-icons/fa";
import { MdOutlineFeed } from "react-icons/md";
import Comments from "./Comments";
import { FaEllipsisVertical } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";

const DisplayEventsTimeline = () => {
  const [events, setEvents] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [visibleComments, setVisibleComments] = useState({});
  const [activeMenuId, setActiveMenuId] = useState(null);

  const toggleComment = (eventId) => {
    setVisibleComments((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  // ---------------------------------------------------------------------------------------- FETCH EVENTS BY JOINED COMMUNITIES
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${backendUrl}/users/user_events`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setEvents(response.data.events);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // ---------------------------------------------------------------------------------------- HANDLE LIKE AND DISLIKE
  const handleReaction = async (eventId, action) => {
    const CURRENT_USER_ID = localStorage.getItem("userId");
    try {
      const response = await axios.put(
        `${backendUrl}/users/toggle_reaction/${eventId}`,
        {
          userId: CURRENT_USER_ID,
          action: action,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === eventId ? response.data.event : event
          )
        );
      }
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  };

  // ---------------------------------------------------------------------------------------- HANDLE EVENT DELETE
  const deleteEvent = async (eventId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/users/delete_event/${eventId}`
      );

      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log("event delete error: ", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100 h-auto my-10 rounded-xl">
      <Toaster />
      <h1 className="flex text-3xl font-bold mb-6 justify-center gap-4 text-gray-800">
        Community Events Feed <MdOutlineFeed />
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
            {/* ************************************************************************************ HEADER */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <p className="text-lg font-bold text-gray-800">
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

            {/* ************************************************************************************ BODY */}
            <div className="p-4 relative">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{event.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(event.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="relative">
                  <FaEllipsisVertical
                    className="hover:cursor-pointer"
                    onClick={() =>
                      setActiveMenuId(
                        activeMenuId === event._id ? null : event._id
                      )
                    }
                  />

                  {activeMenuId === event._id && (
                    <div className="absolute right-0 mt-2 w-max bg-primaryRed shadow-lg rounded-md z-10 animate-smallFall overflow-hidden">
                      <ul>
                        <li
                          className="px-4 py-2 text-sm text-white hover:bg-red-800 hover:cursor-pointer"
                          onClick={() => {
                            setActiveMenuId(null);
                            deleteEvent(event._id);
                          }}
                        >
                          Delete
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-700 mb-3">{event.body}</p>
              {event.image && (
                <img
                  src={event.image}
                  alt={event.name}
                  className="rounded-lg w-full object-cover max-h-72"
                />
              )}
            </div>

            {/* ************************************************************************************ FOOTER */}
            <div className="flex items-center justify-around px-4 py-3 border-t text-gray-600 text-sm">
              <button
                className="flex items-center gap-1 hover:text-blue-600 transition"
                onClick={() => handleReaction(event._id, "like")}
              >
                <FaRegThumbsUp />
                {event.likes?.length || 0}
              </button>
              <button
                className="flex items-center gap-1 hover:text-red-500 transition"
                onClick={() => handleReaction(event._id, "dislike")}
              >
                <FaRegThumbsDown />
                {event.dislikes?.length || 0}
              </button>
              <button
                className="flex items-center gap-1 hover:text-blue-600 transition"
                onClick={() => toggleComment(event._id)}
              >
                <FaRegCommentDots /> Comment
              </button>
            </div>

            {visibleComments[event._id] && (
              <div>
                <Comments eventId={event._id} />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default DisplayEventsTimeline;
