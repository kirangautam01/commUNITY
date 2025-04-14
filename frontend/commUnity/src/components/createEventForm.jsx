import React, { useState, useEffect } from "react";
import { FiImage, FiPlusCircle } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const CreateEventForm = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const user_id = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    name: "",
    body: "",
    communityId: "",
    author: "",
    image: null,
  });

  const [joinedCommunities, setJoinedCommunities] = useState([]);
// ---------------------------------------------------------------------------------------- FETCH COMMUNITY 
  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/users/associated_communities`,
          { withCredentials: true }
        );
        setJoinedCommunities(response.data);
      } catch (error) {
        console.log("error fetching communities: ", error);
      }
    };

    fetchCommunity();
  }, []);

  // ---------------------------------------------------------------------------------------- HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // ---------------------------------------------------------------------------------------- HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      author: user_id,
    };

    const data = new FormData();
    data.append("name", updatedFormData.name);
    data.append("body", updatedFormData.body);
    data.append("communityId", updatedFormData.communityId);
    data.append("author", updatedFormData.author);
    if (updatedFormData.image) {
      data.append("image", updatedFormData.image);
    }

    try {
      const response = await axios.post(
        `${backendUrl}/users/create_event`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
      setFormData({
        name: "",
        body: "",
        communityId: "",
        author: "",
        image: null,
      });
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  return (
    <div className="mt-10">
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto p-4 bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <textarea
          name="body"
          placeholder="What's on your mind?"
          value={formData.body}
          onChange={handleChange}
          rows={3}
          className="w-full resize-none border-none focus:outline-none text-sm"
        />

        <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <select
            name="communityId"
            value={formData.communityId}
            onChange={handleChange}
            className="text-sm px-3 py-2 border rounded-md bg-gray-100 focus:outline-none w-full md:w-1/3"
            required
          >
            <option value="">Select Community</option>
            {joinedCommunities.map((com) => (
              <option key={com._id} value={com._id}>
                {com.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="name"
            placeholder="Event title"
            value={formData.name}
            onChange={handleChange}
            className="text-sm px-3 py-2 border rounded-md bg-gray-100 focus:outline-none w-full md:w-1/3"
          />

          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-1/3">
            <label className="cursor-pointer text-gray-600 hover:text-blue-600">
              <FiImage className="w-5 h-5" />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>

            <button
              type="submit"
              className="text-blue-600 hover:text-blue-800"
              title="Post Event"
            >
              <FiPlusCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEventForm;
