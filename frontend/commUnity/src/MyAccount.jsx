import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
// import AccountEdit from "./components/UserSettingForm";
import Setting from "./Setting";
import { FaBeer } from "react-icons/fa";

function MyAccount() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [data, setData] = useState();
  const fileInputRef = useRef(null); // to trigger hidden input
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/users/profile`, {
          withCredentials: true,
        });
        setData(response.data);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return <div>loading...</div>;
  }

  // 👇 this triggers hidden file input
  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  // -------------------------------------------------------- actual picture change logic
  const pictureChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);
    try {
      const response = await axios.patch(
        `${backendUrl}/users/changeProfile`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // update local state with new image
      setData((prevData) => ({
        ...prevData,
        user: {
          ...prevData.user,
          profilePic: response.data.profilePic,
        },
      }));
      toast.success("Picture updated successfully");
    } catch (error) {
      console.error("Error uploading picture:", error);
      toast.error("error updating profile.");
    }
  };

  // -------------------------------------------------------- logout function
  const handleLogout = async () => {
    try {
      await axios.get(`${backendUrl}/users/logout`, {
        withCredentials: true,
      });

      // Clear any localStorage values if used
      localStorage.clear();

      // Redirect to login
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="font-primary mt-20 w-3/4 mx-auto">
      <Toaster />
      {/* header-section */}

      {/* DUSI CODE  */}
      {/* <div>
      <button
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="flex items-center gap-2 px-5 py-2 text-lg cursor-pointer bg-green-500 text-white border-none rounded-md perspective-1000"
      >
        <span
          className={`inline-block transition-transform duration-700 ${
            hover ? 'flip-and-move' : 'rotate-x-0'
          }`}
        >
          hello
        </span>
        <FaBeer size={20} />
      </button>

      
      <style>
        {`
          .perspective-1000 {
            perspective: 1000px;
          }
          .rotate-x-0 {
            transform: rotateX(0deg) translateY(0);
          }
          .flip-and-move {
            transform: rotateX(360deg) translateY(8px);
          }
        `}
      </style>
    </div> */}

      <div className="relative bg-gradient-to-br from-primaryRed to-black rounded-t-2xl p-4 text-white">
        <p className="float-right hover:cursor-pointer" onClick={handleLogout}>
          logout
        </p>

        <div className="flex flex-col md:flex-row items-center gap-5 ">
          <div className="relative rounded-full w-30 md:w-40 h-30 md:h-40 shadow-2xl shadow-black/80">
            <img
              src={data.user.profilePic || "/images/default.png"}
              alt="profile"
              className="w-full h-full object-cover rounded-full"
            />
            <FaCamera
              className="text-white absolute bottom-3 right-3 md:right-4 md:bottom-4 hover:cursor-pointer"
              onClick={handleIconClick}
            />
            {/* Hidden input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={pictureChange}
              accept="image/*"
              name="profilePic"
              className="hidden"
            />
          </div>
          <h1 className="text-2xl md:text-7xl font-extrabold text-white uppercase drop-shadow-xl">
            <span className="font-normal text-sm lowercase">Profile</span>
            <br />
            {data.user.username}
          </h1>
        </div>
      </div>

      {/* description-section */}
      <div className="">
        <div className="block md:flex justify-between">
          <h1 className="text-2xl md:text-4xl">{data.user.location}</h1>
          <p>Community joined: {data.user.memberOf.length}</p>
        </div>
      </div>

      {/* <AccountEdit /> */}
      <Setting />
    </div>
  );
}

export default MyAccount;
