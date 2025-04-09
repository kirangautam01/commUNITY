import React, { useEffect, useState } from "react";
import { VscSettings } from "react-icons/vsc";
import { IoIosInformationCircle } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import FindCommunities from "./FindCommunities";

function SearchCommunity() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [showFilter, setShowFilter] = useState(false);
  const [mainSearchValue, setMainSearchValue] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [message, setMessage] = useState();
  const navigate = useNavigate();
  const [toggleRecommend, setToggleRecommend] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    genre: "",
    privacy: "",
    createdYear: "",
  });

  const handleMainSearch = (e) => {
    setMainSearchValue(e.target.value);
    // console.log(mainSearchValue);
  };

  const handleClick = (communityId) => {
    navigate("/community/explore", { state: { communityId } });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // console.log(formData);
  };

  //--------------------------------------------------------------------------------- SEARCH FUNCTION
  const heroSearch = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/users/search_community`,
        {
          params: { searchValue: mainSearchValue }, // Pass as query parameter
        }
      );

      if (response.status === 200) {
        if (response.data.length === 0) {
          toast.error("No community found");
        } else {
          setSearchData(response.data);
        }
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Error during search";
      toast.error(errMsg);
    }
  };
  //---------------------------------------------------------------------------------   FILTER FUNCTION
  const filterSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/users/filter_community`,
        formData
      );

      if (response.status === 200) {
        const successMessage = response.data.message;
        setFilterData(response.data.data);
        toast.success(successMessage);
        console.log(response.data);
      }
    } catch (error) {
      if (error.response) {
        const errMsg = error.response.data.message || "Something went wrong!";
        toast.error(errMsg);
      } else {
        toast.error("Network error, please try again.");
      }
    }
  };

  //---------------------------------------------------------------------------------  toggle recommend communities
  useEffect(() => {
    const toggleRecommendCommunity = () => {
      if (searchData.length > 0 || filterData.length > 0) {
        setToggleRecommend(false);
      }
    };
    toggleRecommendCommunity();
  }, [searchData, filterData]);

  return (
    <>
      <Toaster />

      <div className="flex flex-col items-center justify-center p-6 font-primary text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black mb-4">
          Find a Community
        </h1>

        <div className="w-full flex flex-col items-center">
          {/* ****************************************************************************** search bar */}
          <div className="flex items-center w-full justify-center gap-5">
            <div className="flex flex-grow items-center max-w-lg bg-white shadow-md rounded-full overflow-hidden p-2 focus-within:ring-2 focus-within:ring-primaryBlue">
              <input
                type="text"
                className="w-full px-4 py-2 text-gray-700 outline-none"
                placeholder="Enter community id ..."
                onChange={(e) => handleMainSearch(e)}
              />
              <VscSettings
                onClick={() => setShowFilter(!showFilter)}
                className="text-2xl text-gray-500 hover:text-primaryBlue cursor-pointer transition duration-300"
              />
            </div>
            <CiSearch
              onClick={heroSearch}
              className="size-10 transition-all duration-300 ease hover:scale-105 hover:-rotate-15 hover:cursor-pointer"
              strokeWidth={1}
            />
          </div>

          {/* Small Message */}
          <div className="flex animate-smallFall items-center mt-2 text-sm text-cyan-800">
            <IoIosInformationCircle className="text-lg mr-2" />
            <span>
              If you don't know the community ID, use filters to refine your
              search.
            </span>
          </div>
        </div>

        {/* ****************************************************************************** Filter Form */}
        <form
          className={`${
            showFilter
              ? "grid animate-smallFall mt-4 gap-3 w-full max-w-sm p-4 bg-white shadow-md rounded-lg"
              : "hidden"
          }`}
          onSubmit={filterSearch}
        >
          <input
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            placeholder="Name"
            name="name"
            onChange={handleChange}
            value={formData.name}
          />
          <input
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            placeholder="Location"
            name="location"
            onChange={handleChange}
            value={formData.location}
          />

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Genre:
            </label>
            <select
              name="genre"
              onChange={handleChange}
              value={formData.genre}
              className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
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
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Privacy:
            </label>
            <select
              name="privacy"
              value={formData.privacy}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <input
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            placeholder="created year"
            name="createdYear"
            value={formData.createdYear}
            onChange={handleChange}
          />
          <input
            type="submit"
            value="Filter"
            className="mt-4 w-full p-2 rounded-md bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>
      </div>
      {/* ****************************************************************************** searchData display */}

      {searchData?.length > 0 && (
        <div className="font-primary">
          <h1 className="text-2xl font-semibold text-gray-800 text-center md:text-left md:pl-8 mt-20">
            Searched communities
          </h1>
          <hr className="h-0.5 bg-gradient-to-r from-blue-500 to-green-500 border-none w-[calc(100%-3rem)] mx-auto" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mt-5">
            {searchData.map((item) => (
              <div
                key={item._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden p-5 border border-gray-200 w-full max-w-sm mx-auto transition-all duration-300 hover:shadow-2xl"
              >
                {/* Community Image */}
                <img
                  src={item.image}
                  alt="community_profile"
                  className="w-full h-44 object-cover rounded-lg"
                />

                {/* Community Details */}
                <div className="mt-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {item.name}
                  </h2>
                  <p className="text-gray-600 text-sm">{item.location}</p>
                  <p className="mt-2 text-gray-700 line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Explore Button */}
                <button
                  onClick={() => handleClick(item._id)}
                  className="mt-4 w-full bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-700 hover:scale-105"
                >
                  Explore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ****************************************************************************** FILTER DATA */}
      {filterData?.length > 0 && (
        <div className="font-primary">
          <h1 className="text-2xl font-semibold text-gray-800 text-center md:text-left md:pl-8 mt-20">
            Filtered communities
          </h1>
          <hr className="h-0.5 bg-gradient-to-r from-blue-500 to-green-500 border-none w-[calc(100%-3rem)] mx-auto" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mt-5">
            {filterData.map((item) => (
              <div
                key={item._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden p-5 border border-gray-200 w-full max-w-sm mx-auto transition-all duration-300 hover:shadow-2xl"
              >
                {/* Community Image */}
                <img
                  src={item.image}
                  alt="community_profile"
                  className="w-full h-44 object-cover rounded-lg"
                />

                {/* Community Details */}
                <div className="mt-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {item.name}
                  </h2>
                  <p className="text-gray-600 text-sm">{item.location}</p>
                  <p className="mt-2 text-gray-700 line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Explore Button */}
                <button
                  onClick={() => handleClick(item._id)}
                  className="mt-4 w-full bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-700 hover:scale-105"
                >
                  Explore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <FindCommunities display={toggleRecommend} />
    </>
  );
}

export default SearchCommunity;
