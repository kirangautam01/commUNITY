import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function NoticeComm(props) {
  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");
  const [isExpanded, setIsExpanded] = useState(false); // Manage form expansion
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
    // Fetch notices when the component is mounted or communityId changes
    const fetchNotices = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/users/get_notice/${props.communityId}`
        );
        setNotices(response.data.notices); // Set the notices state with fetched data
      } catch (err) {
        console.error("Error fetching notices:", err);
        setError("Failed to load notices.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [props.communityId]);

  if (loading) {
    return <p>Loading notices...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
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
        className={`overflow-hidden transition-all duration-700 ease ${
          isExpanded ? "max-h-screen" : "max-h-0"
        }`}
      >
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          {/* Heading Input */}
          <div>
            <label
              htmlFor="heading"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Heading
            </label>
            <input
              type="text"
              id="heading"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the notice heading"
            />
          </div>

          {/* Body Input */}
          <div>
            <label
              htmlFor="body"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Body
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Enter the notice content"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit Notice
            </button>
          </div>
        </form>
      </div>

      {/* --------------------------------------------------------------------------------display notice */}
      <div className="space-y-4">
        {notices.length === 0 ? (
          <p>No notices found for this community.</p>
        ) : (
          notices.map((notice) => (
            <div
              key={notice._id}
              className="relative bg-yellow-100 text-black p-6 rounded-lg shadow-2xl w-80 h-auto max-w-xs"
            >
              <div className="absolute top-2 right-2">
                <img
                  src="/images/pin2.png"
                  alt="pin"
                  className="h-6 w-6 filter drop-shadow-[0px_12px_8px_rgb(0,0,0)]"
                />
              </div>
              <h2 className="font-semibold text-xl mb-2">{notice.heading}</h2>
              <p className="text-sm">{notice.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NoticeComm;
