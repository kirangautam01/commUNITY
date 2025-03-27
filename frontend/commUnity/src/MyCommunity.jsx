import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import { IoClose } from "react-icons/io5";

function MyCommunity() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [spin, setSpin] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/posts/?limit=20"
        );
        // Slice the array to get only first 30 posts
        const first30Posts = response.data.slice(0, 30);
        setPosts(first30Posts); // response.data is already the array of posts
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  const handleClick = () => {
    setShowForm(true);
    setSpin(true);
    setTimeout(() => {
      setSpin(false);
    }, 1000);
  };

  return (
    <div className="mt-20 ml-20 font-primary box-border">
      {/* create-community */}
      <div className="space-y-5">
        <h1 className="text-2xl">Create Community</h1>
        <div
          onClick={handleClick}
          className="group w-1/5 h-40 bg-gray-500 grid place-items-center rounded-2xl transition-all duration-200 ease-in-out hover:bg-gray-400 hover:border-3 hover:border-primaryBlue"
        >
          <FaPlus
            className={`text-3xl text-white ${spin ? "animate-spin_once" : ""}`}
          />
        </div>
      </div>

      {showForm && (
        <div className="relative animate-fall w-5/6 bg-gray-200 p-20 rounded-2xl mt-10">
          <IoClose
            onClick={() => setShowForm(false)}
            className="absolute top-10 right-10 size-10 cursor-pointer "
          />
          <form
            className="[&_input,&_textarea,&_select]:border-b-2 grid gap-5 w-2/3 mx-auto [&_input,&_textarea,&_select]:outline-none text-lg"
            action="http://localhost:4000/users/create_community"
            method="post"
          >
            <div className="grid">
              <label>Enter Commnity Name</label>
              <input />
            </div>
            <div className="grid">
              <label>Subtitle</label>
              <input />
            </div>
            <div className="grid">
              <label>Description</label>
              <textarea />
            </div>
            <div className="grid">
              <label>privacy</label>
              <select>
                <option>private</option>
                <option>public</option>
              </select>
            </div>
            <div className="grid">
              <label>Community profile</label>
              <input type="file" />
            </div>
            <input
              type="submit"
              className="w-1/2 bg-primaryBlue border-none rounded-xl p-1 mx-auto hover:bg-sky-300 hover:cursor-pointer"
            />
          </form>
        </div>
      )}

      {/* joined community list */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Latest Posts</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Post ID: {post.id} | User ID: {post.userId}
                </p>
                <p className="text-gray-700 line-clamp-3">{post.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyCommunity;
