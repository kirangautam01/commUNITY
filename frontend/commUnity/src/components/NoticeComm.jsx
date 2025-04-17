import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { AiTwotoneDelete } from "react-icons/ai";

function NoticeComm(props) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const username = localStorage.getItem("userName");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notices, setNotices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);

  // -------------------------------------------------------------------------------- create notice
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!heading || !body) {
      setError("Both heading and body are required.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/users/create_notice`,
        { heading, body, communityId: props.communityId, author: username },
        { withCredentials: true }
      );

      if (response.status === 201) {
        toast.success("Notice created successfully!");
        setHeading("");
        setBody("");
      }
    } catch (error) {
      console.error("Error creating notice:", error);
      toast.error("An error occurred while creating the notice.");
    }
  };

  // -------------------------------------------------------------------------------- fetch notice
  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      setNotices([]); // Clear previous notices when switching community

      try {
        const response = await axios.get(
          `${backendUrl}/users/get_notice/${props.communityId}`
        );
        setNotices(response.data.notices || []);
      } catch (err) {
        console.error("Error fetching notices:", err);
        toast.error("Failed to load notices.");
        setNotices([]); // Also clear notices on error
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [props.communityId]);

  if (loading) {
    return <p>Loading notices...</p>;
  }

  // -------------------------------------------------------------------------------- delete notice
  const handleDelete = async () => {
    if (!noticeToDelete) return;

    try {
      const response = await axios.delete(`${backendUrl}/users/del_notice`, {
        data: {
          communityId: props.communityId,
          noticeId: noticeToDelete._id,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("Notice deleted successfully");
        setNotices(
          notices.filter((notice) => notice._id !== noticeToDelete._id)
        );
        setIsModalOpen(false); // Close the modal after deletion
      }
    } catch (error) {
      console.error("Error deleting notice:", error);
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred");
      } else {
        toast.error("Failed to connect to the server.");
      }
      setIsModalOpen(false); // Close the modal in case of an error
    }
  };

  return (
    <div className="max-w-full mx-auto bg-white rounded-lg">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        {isExpanded ? "Create a Notice" : "Write a Notice"}
      </h2>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-blue-600 hover:underline mb-4 block w-full text-center"
      >
        {isExpanded ? "Collapse Form" : "Write a Notice"}
      </button>

      {/* ************************************************************************ Collapsible Form with Animation */}
      <div
        className={`overflow-hidden transition-all duration-700 ease mx-auto mb-10 block max-w-lg ${
          isExpanded ? "max-h-screen" : "max-h-0"
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6 bg-white shadow-lg rounded-lg border border-gray-200"
        >
          {/* Heading Input */}
          <div>
            <label
              htmlFor="heading"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Heading
            </label>
            <input
              type="text"
              id="heading"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Enter the notice heading"
            />
          </div>

          {/* Body Input */}
          <div>
            <label
              htmlFor="body"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Body
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              rows="6"
              placeholder="Enter the notice content"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-1/2 mx-auto block py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          >
            Submit Notice
          </button>
        </form>
      </div>

      {/* --------------------------------------------------------------------------------display notice */}
      <div className="flex gap-10 flex-wrap justify-center">
        {notices.length === 0 ? (
          <p>No notices found for this community.</p>
        ) : (
          notices.map((notice) => (
            <div
              key={notice._id}
              className="relative bg-yellow-100 text-black p-6 rounded-lg w-80 h-auto max-w-xs"
            >
              <div className="absolute top-2 right-2">
                <img
                  src="/images/pin2.png"
                  alt="pin"
                  className="h-6 w-6 filter drop-shadow-[0px_12px_8px_rgb(0,0,0)]"
                />
              </div>
              <h2 className="font-semibold text-xl">{notice.heading}</h2>
              <p className="mb-2 italic text-xs">-{notice.author}</p>
              <p className="text-sm">{notice.body}</p>
              <div
                className="absolute right-2 bottom-2 transition-all duration-200 ease hover:cursor-pointer hover:scale-150 hover:text-red-600 hover:-rotate-45"
                onClick={() => {
                  setNoticeToDelete(notice); // Set notice to delete
                  setIsModalOpen(true); // Open the modal
                }}
              >
                <AiTwotoneDelete />
              </div>
            </div>
          ))
        )}
      </div>

      {/* -------------------------------------------------------------------------------- Warning Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Are you sure?</h3>
            <p className="mb-6">Do you really want to delete this notice?</p>
            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="py-2 px-4 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoticeComm;
