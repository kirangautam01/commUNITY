import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import YourCommunity from "./components/YourCommunity";
import JoinedCommunity from "./components/JoinedCommunity";

function MyCommunity() {
  const [showForm, setShowForm] = useState(false);
  const [spin, setSpin] = useState(false);

  const handleClick = () => {
    setShowForm(true);
    setSpin(true);
    setTimeout(() => {
      setSpin(false);
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    console.log("form data: ", formData);

    try {
      const response = await axios.post(
        "http://localhost:4000/users/create_community",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        toast.success(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage); // Fix here
    }
  };

  return (
    <div className="mt-20 font-primary box-border">
      <Toaster />
      <div className="space-y-5">
        <h1 className="text-2xl ml-0 md:ml-30 text-center md:text-left">
          Create Community
        </h1>
        <div
          onClick={handleClick}
          className="animate-pulse w-3/4 md:w-1/5 h-40 mx-auto md:mx-30 bg-gray-500 grid place-items-center rounded-2xl transition-all duration-200 ease-in-out hover:bg-gray-400 hover:border-3 hover:border-primaryBlue"
        >
          <FaPlus
            className={`text-3xl text-white ${spin ? "animate-spin_once" : ""}`}
          />
        </div>
      </div>

      {showForm && (
        <div className="relative animate-fall w-5/6 bg-gray-200 p-0 md:p-20 rounded-2xl mt-10 mx-auto overflow-hidden">
          <IoClose
            onClick={() => setShowForm(false)}
            className="absolute top-5 md:top-10 right-5 md:right-10 size-5 md:size-10 cursor-pointer "
          />
          <form
            className="mx-auto [&_input,&_textarea,&_select]:border-b-2 grid gap-5 w-2/3 my-10 md:my-0 [&_input,&_textarea,&_select]:outline-none [&_input,&_textarea,&_select]:focus:bg-gray-300 [&_input,&_textarea,&_select]:w-full"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="grid text-lg md:text-xl">
              <label>Enter Commnity Name</label>
              <input name="name" />
            </div>
            <div className="grid text-lg md:text-xl">
              <label>Purpose/Subtitle</label>
              <input name="subtitle" />
            </div>
            <div className="grid text-lg md:text-xl">
              <label>Description</label>
              <textarea name="description" />
            </div>
            <div className="grid text-lg md:text-xl">
              <label>Location</label>
              <input name="location" />
            </div>
            <div className="grid text-lg md:text-xl">
              <label>Genre</label>
              <select name="genre">
                <option value="General">General</option>
                <option value="Business">Business</option>
                <option value="Education">Education</option>
                <option value="Technology">Technology</option>
                <option value="Sports">Sports</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="grid text-lg md:text-xl">
              <label>privacy</label>
              <select name="privacy">
                <option value="private">private</option>
                <option value="public">public</option>
              </select>
            </div>
            <div className="grid text-lg md:text-xl">
              <label>Community profile</label>
              <input type="file" name="image" />
            </div>
            <button
              type="submit"
              className="w-1/2 bg-primaryBlue border-none rounded-xl p-1 mx-auto hover:bg-sky-300 hover:cursor-pointer outline-none focus:bg-sky-300"
            >
              submit
            </button>
          </form>
        </div>
      )}

      <YourCommunity />
      <JoinedCommunity />
    </div>
  );
}

export default MyCommunity;
