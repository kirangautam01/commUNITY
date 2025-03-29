import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function ExploreCommunity() {
  const location = useLocation();
  const item = location.state?.item; // This expects 'item' to be passed through navigation state
  const [community, setCommunity] = useState(null); // Initialize with null
  const [message, setMessage] = useState(""); // Correct use of useState

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        // Use backticks for template literals
        const response = await axios.get(
          `http://localhost:4000/users/explore/${item}`
        );

        if (response.data) {
          setCommunity(response.data); // Set community data from the response
        }
      } catch (error) {
        setMessage("Error fetching community details");
        console.log("error fetching community",error);
        toast.error(message); // Show an error toast with the message
      }
    };

    if (item) {
      fetchCommunity(); // Fetch data only if 'item' exists
    }
  }, [item, message]); // Add message to dependency array

  return (
    <div>
      <Toaster />
      <h1>Explore Community</h1>
      {community ? (
        <div>
          <h2>{community.name}</h2>
          <p>{community.description}</p>
          <p>
            <strong>Location:</strong> {community.location}
          </p>
          <p>
            <strong>Privacy:</strong> {community.privacy}
          </p>
          <p>
            <strong>Members:</strong> {community.members?.length}
          </p>
          
          <p>
            <strong>community id:</strong> {community.communityId}
          </p>
          
          <p>
            <strong>genre :</strong> {community.genre}
          </p>
          
          <p>
            <strong>subtitle:</strong> {community.subtitle}
          </p>
          
          {/* Render any other community details */}
        </div>
      ) : (
        <p>Loading community details...</p>
      )}
    </div>
  );
}

export default ExploreCommunity;
