import React, { useState, useEffect } from "react";
import axios from "axios";

function Comments({ eventId }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const userId = localStorage.getItem("userId");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

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

  return (
    <div className="mt-8 max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Comments ({comments.length})
      </h2>

      {/* Add Comment */}
      <div className="flex space-x-3 mb-6">
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="3"
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

      {/* Show Comments */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center text-gray-500 text-sm">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg shadow-sm border"
            >
              <img
                src={comment.userId?.profilePic}
                alt="commenter_pic"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {comment.userId?.username}
                  </p>
                </div>
                <p className="text-sm text-gray-700">{comment.commentText}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Comments;
