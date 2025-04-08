import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { AiTwotoneDelete } from "react-icons/ai";

function NoticeComm(props) {
  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const username = localStorage.getItem("userName");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notices, setNotices] = useState([]);

  //   --------------------------------------------------------------------------------create notice
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!heading || !body) {
      setError("Both heading and body are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/users/create_notice",
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

  //   -------------------------------------------------------------------------------- fetch notice
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/users/get_notice/${props.communityId}`
        );
        setNotices(response.data.notices);
      } catch (err) {
        console.error("Error fetching notices:", err);
        toast.error("Failed to load notices.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [props.communityId]);

  if (loading) {
    return <p>Loading notices...</p>;
  }

  //   -------------------------------------------------------------------------------- delete notice
  const handleDelete = async (noticeId) => {
    try {
      // Sending data in the request body using the `data` property
      const response = await axios.delete(
        "http://localhost:4000/users/del_notice",
        {
          data: {
            communityId: props.communityId,
            noticeId,
          },
          withCredentials: true, // This sends cookies if needed for authentication
        }
      );

      if (response.status === 200) {
        toast.success("Notice deleted successfully" || response.data.message);
        // Optionally, update UI after successful deletion (e.g., remove the notice from the list)
      }
    } catch (error) {
      console.error("Error deleting notice:", error);
      // Handle errors and show message to the user
      if (error.response) {
        // Server responded with a status other than 200 range
        toast.error(error.response.data.message || "An error occurred");
      } else {
        // No response from the server
        toast.error("Failed to connect to the server.");
      }
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

      {/* Collapsible Form with Animation */}
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
                onClick={() => handleDelete(notice._id)}
              >
                <AiTwotoneDelete />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NoticeComm;
