import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { TbLogout } from "react-icons/tb";
import { IoMdChatboxes } from "react-icons/io";
import { MdBookmarkAdd } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function ExploreCommunity() {
  const location = useLocation();
  const item = location.state?.communityId;
  const [community, setCommunity] = useState(null);
  const [message, setMessage] = useState("");
  const [admin, setAdmin] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const userid = localStorage.getItem("userId");
  const [modalToggle, setModalToggle] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/users/explore/${item}`
        );

        if (response.data) {
          setCommunity(response.data);
          setAdmin(response.data.creater._id);
        }
      } catch (error) {
        setMessage("Error fetching community details");
        console.log("error fetching community", error);
        toast.error(message);
      }
    };

    if (item) {
      fetchCommunity(); // Fetch data only if 'item' exists
    }
  }, [item, message]); // Add message to dependency array

  // ------------------------------------------------------------------------------------------------------- TO JOIN COMMUNITY
  const joinCommunity = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:4000/users/join_community/${item}`,
        {},
        {
          withCredentials: true,
        }
      );

      // console.log(item);

      if (response.data) {
        const message = response.data.message;
        setMessage(message);
        toast.success(message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred.";
      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  };

  // --------------------------------------------------------------------------------------------------- LEAVE COMMUNITY
  const handleCommunityLeave = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:4000/users/leave_community",
        {
          data: { communityId: item },
          withCredentials: true,
        }
      );

      if (response.data.message) {
        const message = response.data.message;
        toast.success(message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Leaving community failed";
      toast.error(errorMessage);
    }
  };

  // ------------------------------------------------------------------------------------------------------- CHECK ADMIN
  useEffect(() => {
    // console.log("admin: ", admin);
    // console.log("userId: ", userid);
    if (admin === userid) {
      setIsAdmin(true);
    }
  }, [community, userid]);

  const onClose = () => {
    setModalToggle(false);
  };

  const editHandler = (item) =>
    navigate("/community/explore/edit", { state: { item } });

  // ------------------------------------------------------------------------------------------------------- DELETE COMMUNITY
  const deleteHandler = async () => {
    if (!item) {
      toast.error("Community id is not provided.");
      return;
    }
    try {
      const response = await axios.delete(
        "http://localhost:4000/users/del_community",
        {
          data: { communityId: item },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/community");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("delete community error: ", error);
      toast.error(
        error.response.data.message ||
          "An error occured while deleting community."
      );
    }
  };

  return (
    <div>
      <Toaster />
      {/* ------------------------------------------------------------------------------------  modal to confirm delete */}
      {modalToggle && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 bg-[rgba(0,0,0,0.5)]">
          <div className="p-6 rounded-lg shadow-xl w-96 bg-white">
            <h2 className="text-lg font-semibold">Confirm Deletion</h2>
            <p className="mt-2">
              Are you sure you want to delete this community? This action cannot
              be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={deleteHandler}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {community ? (
        <div className="font-primary">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white p-6 shadow-lg rounded-lg">
            <img
              src={community.image}
              alt="community_profile"
              className="w-full md:w-1/2 h-100 object-cover rounded-lg shadow-lg"
            />

            {/* Community Details */}
            <div className="flex w-full flex-col gap-4 md:ml-6">
              <div className="flex justify-between">
                <h1 className="text-3xl font-bold text-gray-900">
                  {community.name}
                </h1>

                {/* leave community */}
                <TbLogout
                  onClick={handleCommunityLeave}
                  className="text-3xl cursor-pointer transition-scale duration-400 ease hover:scale-110"
                />
              </div>

              <p className="text-gray-600">
                ID:&nbsp;&nbsp;
                <span className="font-semibold">{community.communityId}</span>
              </p>
              <p className="text-gray-700">
                {community.subtitle} - {community.location}
              </p>
              <p className="text-gray-700">{community.description}</p>
              <p className="text-gray-700">
                <span className="font-semibold">Genre:</span> {community.genre}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Members:</span> {community.members.length}
              </p>
              
              <p className="text-gray-700">
                <span className="font-semibold">Created Date:</span>{" "}
                {community.createdAt.split("T")[0]}
              </p>

              {/* --------------------------------------------------------------  ICONS: EDIT,DELETE,JOIN,CHAT */}
              <div className="w-full flex gap-7 p-5">
                <div className={`relative group`}>
                  <IoMdChatboxes className="size-7 hover:cursor-pointer hover:scale-105 transition-transform duration-200" />
                  <span className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Chat
                  </span>
                </div>
                <div className={`relative group`}>
                  <MdBookmarkAdd
                    onClick={joinCommunity}
                    className="size-7 hover:cursor-pointer hover:scale-105 transition-transform duration-200"
                  />
                  <span className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Join
                  </span>
                </div>
                <div
                  className={`relative group ${
                    !isAdmin && "pointer-events-none opacity-50"
                  }`}
                >
                  <AiFillEdit
                    onClick={() => editHandler(item)}
                    className="size-7 hover:cursor-pointer hover:scale-105 transition-transform duration-200"
                  />
                  <span className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Edit
                  </span>
                </div>
                <div
                  className={`relative group ${
                    !isAdmin && "pointer-events-none opacity-50"
                  }`}
                >
                  <MdDelete
                    onClick={() => setModalToggle(true)}
                    className="size-7 hover:cursor-pointer hover:scale-105 transition-transform duration-200 text-red-500 hover:text-red-700"
                  />
                  <span className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Delete
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 p-10 bg-gray-100 rounded-lg shadow-lg">
            {/* Admin / Creator Section */}
            <div className="p-10 flex flex-col items-center bg-white shadow-md rounded-lg">
              <img
                src={community.creater.profilePic}
                alt="admin_pic"
                className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md object-cover"
              />
              <h2 className="text-xl font-semibold text-gray-700 mt-4">
                Admin / Creator
              </h2>
              <p className="text-lg font-medium text-gray-600">
                {community.creater.username}
              </p>
              <p className="text-sm text-gray-500">
                {community.creater.location}
              </p>
            </div>

            {/* Members Section */}
            <div className="flex-grow w-full md:w-auto bg-white shadow-md rounded-lg p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center md:text-left">
                Members
              </h1>

              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-primaryGreen text-white">
                    <tr>
                      <th className="py-3 px-5 text-left">S.N</th>
                      <th className="py-3 px-5 text-left">Profile</th>
                      <th className="py-3 px-5 text-left">Username</th>
                      <th className="py-3 px-5 text-left">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {community.members.map((item, index) => (
                      <tr
                        key={item._id}
                        className="border-b border-gray-200 hover:bg-gray-100 transition"
                      >
                        <td className="py-3 px-5">{index + 1}</td>
                        <td className="py-3 px-5">
                          <img
                            src={item.profilePic}
                            alt="members_profile"
                            className="w-12 h-12 rounded-full border border-gray-300 shadow-sm object-cover"
                          />
                        </td>
                        <td className="py-3 px-5 font-medium text-gray-700">
                          {item.username}
                        </td>
                        <td className="py-3 px-5 text-gray-600">
                          {item.location}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading community details...</p>
      )}
    </div>
  );
}

export default ExploreCommunity;
