import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function Setting() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState([]);
  const [usernameChange, setUsernameChange] = useState(false);
  const [newUname, setNewUname] = useState("");
  const [passwordChange, setPasswordChange] = useState(false);
  const [oldPW, setOldPW] = useState("");
  const [newPW1, setNewPW1] = useState("");
  const [newPW2, setNewPW2] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (newPW1 && newPW2 && newPW1 !== newPW2) {
      setError("New passwords do not match");
    } else {
      setError("");
    }
  }, [newPW1, newPW2]);

  // --------------------------------------------------------------- FETCH USER
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const respone = await axios.get(`${backendUrl}/users/fetch_user/`, {
          withCredentials: true,
        });
        if (respone.status === 404) {
          console.log(response.data.message);
          toast.error(respone.data.message);
        }
        setUser(respone.data.user);
        // console.log(user);
      } catch (error) {
        console.log("error fetching user: ", error);
        toast.error("Internal server error");
      }
    };
    fetchUser();
  }, []);

  // --------------------------------------------------------------- UPDATE USERNAME
  const handleUsernameUpdate = async () => {
    try {
      const response = await axios.patch(
        `${backendUrl}/users/update_username`,
        {
          newUsername: newUname,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(response.data.message);
      setUsernameChange(false); // optionally close the modal
      setUser((prev) => ({ ...prev, username: newUname })); // update local user state
    } catch (error) {
      console.log("error updating username: ", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // --------------------------------------------------------------- UPDATE PASSWORD
  const handlePasswordUpdate = async () => {
    // console.log("old pass: ", oldPW);
    // console.log("new pass 1: ", newPW1);
    // console.log("new pass 2: ", newPW2);
    try {
      const response = await axios.patch(
        `${backendUrl}/users/update_password`,
        {
          oldPassword: oldPW,
          newPassword: newPW2,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(response.data.message);
      setPasswordChange(false); // optionally close the modal
    } catch (error) {
      console.log("error updating password: ", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full mx-auto px-4 py-8 space-y-8 ">
      <Toaster />
      <h2 className="text-2xl font-bold">Settings</h2>

      {/* ******************************************************************************** USERNAME DISPLAY BOX */}
      <div>
        <div className="bg-gray-100 p-4 rounded-xl shadow-sm space-y-2">
          <h3 className="text-lg font-semibold">Profile</h3>
          <p className="text-sm text-gray-600">Name: {user.username} </p>
          <p className="text-sm text-gray-600">Email: {user.email}</p>
          <button
            className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            onClick={() => {
              setUsernameChange(true);
            }}
          >
            Edit Profile
          </button>
        </div>
        {/* ******************************************************************************** USERNAME CHANGE MODAL */}
        {usernameChange && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-[rgba(0,0,0,0.5)]">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-96 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Update Username
              </h2>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">
                  New Username
                </label>
                <input
                  type="text"
                  placeholder="Enter new username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  onChange={(e) => setNewUname(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  className="px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 text-gray-700"
                  onClick={() => setUsernameChange(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-sm bg-primaryBlue hover:bg-blue-700 text-white"
                  onClick={handleUsernameUpdate}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ******************************************************************************** PASSWORD BOX */}
      <div className="bg-gray-100 p-4 rounded-xl shadow-sm space-y-3">
        <h3 className="text-lg font-semibold">Security</h3>
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          onClick={() => {
            setPasswordChange(true);
          }}
        >
          Change Password
        </button>
        {/* ******************************************************************************** PASSWORD CHANGE MODAL */}
        {passwordChange && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-[rgba(0,0,0,0.5)]">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-96 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Update Password
              </h2>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">
                  old Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryBlue"
                  onChange={(e) => setOldPW(e.target.value)}
                />
                <label className="block text-sm font-medium text-gray-600">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryBlue"
                  onChange={(e) => setNewPW1(e.target.value)}
                />
                <label className="block text-sm font-medium text-gray-600">
                  New Password Again
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryBlue"
                  onChange={(e) => setNewPW2(e.target.value)}
                />

                {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  className="px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 text-gray-700"
                  onClick={() => setPasswordChange(false)}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-sm text-white ${
                    error || !oldPW || !newPW1 || !newPW2
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primaryBlue hover:bg-blue-700"
                  }`}
                  onClick={handlePasswordUpdate}
                  disabled={!!error || !oldPW || !newPW1 || !newPW2}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ******************************************************************************** preferences BOX */}
      <div className="bg-gray-100 p-4 rounded-xl shadow-sm space-y-4">
        <h3 className="text-lg font-semibold">Preferences</h3>
        <div className="flex items-center justify-between">
          <span>Dark Mode</span>
          <input type="checkbox" className="w-5 h-5" />
        </div>
        <div className="flex items-center justify-between">
          <span>Email Notifications</span>
          <input type="checkbox" className="w-5 h-5" />
        </div>
      </div>

      {/* ******************************************************************************** DELETE ACCOUNT BOX */}
      <div className="bg-red-50 border border-red-300 p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
        <p className="text-sm text-gray-600 mb-3">
          Deleting your account is irreversible. Please proceed with caution.
        </p>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          onClick={() => setShowConfirm(true)}
        >
          Delete Account
        </button>

        {/* ******************************************************************************** DELETE CONFIRMATION BOX */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-md w-80">
              <h4 className="text-lg font-semibold mb-2">Are you sure?</h4>
              <p className="text-sm text-gray-600">
                This action cannot be undone.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  onClick={handleDelete}
                  disabled=""
                >
                  {isDeleting ? "Deleting..." : "Yes, delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Setting;
