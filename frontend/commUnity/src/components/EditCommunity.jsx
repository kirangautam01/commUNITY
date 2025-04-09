import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

function EditCommunity() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const location = useLocation();
  const item = location.state || "";
  const [message, setMessage] = useState("");
  const [community, setCommunity] = useState({});
  const [newPhoto, setNewPhoto] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    subtitle: "",
    description: "",
    location: "",
    privacy: "Public",
    genre: "General",
    image: "",
  });

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/users/explore/${item.item}`
        );
        if (response.data) {
          setCommunity(response.data);
          setFormData({
            name: response.data.name || "",
            subtitle: response.data.subtitle || "",
            description: response.data.description || "",
            location: response.data.location || "",
            privacy: response.data.privacy || "Public",
            genre: response.data.genre || "General",
          });
        }
      } catch (error) {
        setMessage("Error fetching community details");
        toast.error(message);
      }
    };
    fetchCommunity();
  }, [item]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  {
    /* ********************************************************************************************** HANDLE SUBMIT */
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
      // console.log("key: ", key, "value: ", formData[key]);
    });

    if (newPhoto) {
      data.append("image", newPhoto);
      // console.log("Profile: ", data.get("image"));
    }
    try {
      const res = await axios.patch(
        `${backendUrl}/users/edit_community/${community._id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Community updated successfully!");
    } catch (error) {
      console.error("Error updating community:", error);
      toast.error("Failed to update community");
    }
  };

  {
    /* ********************************************************************************************** DELETE MEMBERS */
  }
  const handleDeleteMember = async (memberId) => {
    try {
      const response = await axios.delete(`${backendUrl}/users/del_mem`, {
        data: { communityId: item.item, user: memberId },
      });

      if (response.data.message) {
        const message = "member remove successfully";
        toast.success(message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "member remove failed";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-100 p-6 font-primary">
      <Toaster />
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center">
          💫 Edit Community
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          {/* 🌟 Image Upload */}
          <div className="text-center mb-4">
            <label className="block text-purple-700 font-semibold mb-2">
              🖼 Community Photo
            </label>
            <div className="flex flex-col items-center space-y-2">
              <img
                src={community.image}
                alt="Community"
                className="w-32 h-32 object-cover rounded-full border-4 border-purple-300 shadow"
              />
              <label className="bg-purple-500 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-purple-600 transition">
                📷 Change Photo
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewPhoto(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* ********************************************************************************************** COMMUNITY INFO */}
          <div>
            <label className="block text-purple-700 font-semibold mb-1">
              🌸 Community Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border-2 border-purple-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-pink-50"
              placeholder="Enter community name"
            />
          </div>

          <div>
            <label className="block text-purple-700 font-semibold mb-1">
              🌸 Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full border-2 border-purple-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-pink-50"
              placeholder="Enter subtitle"
            />
          </div>

          <div>
            <label className="block text-purple-700 font-semibold mb-1">
              ✏️ Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border-2 border-purple-200 rounded-xl p-3 h-24 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-pink-50"
              placeholder="What is this community about?"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-purple-700 font-semibold mb-1">
                📍 Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border-2 border-purple-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-pink-50"
                placeholder="Enter location"
              />
            </div>

            <div>
              <label className="block text-purple-700 font-semibold mb-1">
                🔒 Privacy
              </label>
              <select
                name="privacy"
                value={formData.privacy}
                onChange={handleChange}
                className="w-full border-2 border-purple-200 rounded-xl p-3 bg-pink-50"
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-purple-700 font-semibold mb-1">
              🎨 Genre
            </label>
            <select
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full border-2 border-purple-200 rounded-xl p-3 bg-pink-50"
            >
              <option value="General">General</option>
              <option value="Business">Business</option>
              <option value="Education">Education</option>
              <option value="Technology">Technology</option>
              <option value="Sports">Sports</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition transform"
            >
              💾 Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* ********************************************************************************************** COMMUNITY MEMBERS */}

      <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-purple-600 mb-4 text-center">
          👥 Community Members
        </h3>
        {community.members && community.members.length > 0 ? (
          <ul className="space-y-3">
            {community.members.map((member) => (
              <li
                key={member._id}
                className="flex justify-between items-center bg-gradient-to-r from-pink-100 to-purple-100 p-3 rounded-xl shadow"
              >
                <div>
                  <p className="font-semibold text-purple-800">
                    {member.username}
                  </p>
                  <p className="text-sm text-gray-600">
                    📍 {member.location || "Unknown"}
                  </p>
                </div>
                <button
                  className="bg-red-400 hover:bg-red-500 text-white font-semibold px-4 py-1 rounded-full transition"
                  onClick={() => handleDeleteMember(member._id)}
                >
                  ❌ Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 mt-4">No members found.</p>
        )}
      </div>
    </div>
  );
}

export default EditCommunity;
