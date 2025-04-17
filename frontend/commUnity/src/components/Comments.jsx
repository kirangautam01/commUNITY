import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";

function Comments({ eventId }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const userId = localStorage.getItem("userId");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const menuRef = useRef();

  // ------------------------------------------------------- TO DISAPPEAR DELETE MENU IN COMMENT SECTION WHEN CLICKING OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveCommentId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ------------------------------------------------------------------------------------- TO FETCH COMMENTS OF EVENTS
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/users/get_comments/${eventId}`
        );
        setComments(response.data);
      } catch (error) {
        console.log("Error fetching comments:", error);
      }
    };

    if (eventId) {
      fetchComments();
    }
  }, [eventId, backendUrl]);

  // ------------------------------------------------------------------------------------- TO CREATE COMMENT
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`${backendUrl}/users/create_comment`, {
        eventId,
        userId,
        commentText: newComment,
      });

      setNewComment("");
      setComments((prev) => [...prev, response.data]);
    } catch (error) {
      console.log("Error creating comment:", error);
    }
  };
  // ------------------------------------------------------------------------------------- TO DELETE COMMENT
  const deleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/users/delete_comment/${commentId}`
      );

      if (response.status === 200) {
        toast.success(response.data.message);

        //remove the delete comments from state
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("error deleting comment: ", error);
      toast.error("Something went wrong while deleting the comment.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <Toaster />
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Comments ({comments.length})
      </h2>

      {/* ************************************************************************ ADD COMMENT */}
      <div className="flex space-x-3 mb-6">
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="1"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                newComment.trim()
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Post Comment
            </button>
          </div>
        </div>
      </div>

      {/* ************************************************************************ SHOW COMMENT */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center text-gray-500 text-sm">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment, index) => (
            <div
              className="flex items-center group relative"
              key={comment._id || index}
            >
              <div className="flex flex-1 items-start space-x-4 p-1">
                <img
                  src={comment.userId?.profilePic}
                  alt="commenter_pic"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 rounded-lg shadow-sm pl-4 bg-gray-100 ">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-semibold text-gray-800">
                      {comment.userId?.username}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700">{comment.commentText}</p>
                </div>
              </div>

              {/* Icon + Dropdown */}
              <div className="relative flex items-center h-full">
                <IoEllipsisHorizontalSharp
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:cursor-pointer"
                  onClick={() =>
                    setActiveCommentId(
                      activeCommentId === comment._id ? null : comment._id
                    )
                  }
                />

                {/* Dropdown menu below the icon */}
                {activeCommentId === comment._id && (
                  <div className="absolute top-full right-0 mt-2 w-max bg-primaryRed shadow-lg rounded-md z-10 animate-smallFall overflow-hidden">
                    <ul>
                      <li
                        ref={menuRef}
                        className="px-4 py-2 text-sm text-white hover:bg-red-800 hover:text-white cursor-pointer"
                        onClick={() => {
                          setActiveCommentId(null);
                          deleteComment(comment._id);
                        }}
                      >
                        Delete
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Comments;
