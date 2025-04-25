import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function UserSettingsForm() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currentUser = localStorage.getItem("userId");
  const [formData, setFormData] = useState({
    username: "",
    oldPassword: "",
    newPassword: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${backendUrl}/users/edit_user`, {
        userId: currentUser,
        ...formData,
      });

      toast.success(response.data.message);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Old password is incorrect.");
      } else {
        toast.error("Something went wrong.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 animate-fall">
      <Toaster />
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg lg:max-w-xl">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center">
          Update Profile Settings
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              placeholder="Enter new username"
              className="w-full px-4 py-2 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* Old Password Field */}
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-gray-700 font-medium mb-2"
            >
              Old Password
            </label>
            <input
              type="password"
              name="oldPassword"
              onChange={handleChange}
              placeholder="Enter old password"
              className="w-full px-4 py-2 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* New Password Field */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-gray-700 font-medium mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full px-4 py-2 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* Location Field */}
          <div>
            <label
              htmlFor="location"
              className="block text-gray-700 font-medium mb-2"
            >
              Location
            </label>
            <input
              type="text"
              name="location"
              onChange={handleChange}
              placeholder="Enter your location"
              className="w-full px-4 py-2 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-xl font-semibold transition duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
