import React, { useEffect, useState } from "react";
import axios from "axios";

function MyAccount() {
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/users/profile",
          { withCredentials: true }
        );

        // console.log(response.data);
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

  return (
    <div className="font-primary mt-20 w-3/4 mx-auto">
      {/* header-section */}
      <div className="flex flex-col md:flex-row items-center gap-5 bg-gradient-to-br from-primaryRed to-black rounded-t-2xl p-4">
        <div className="overflow-hidden rounded-full w-30 md:w-40 h-30 md:h-40 shadow-2xl shadow-black/80">
          <img
            src={data.user.profilePic}
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-2xl md:text-7xl font-extrabold text-white uppercase drop-shadow-xl">
          <span className="font-normal text-sm lowercase">Profile</span>
          <br />
          {data.user.username}
        </h1>
      </div>

      {/* description-section */}
      <div className="">
        <div className="block md:flex justify-between">
          <h1 className="text-2xl md:text-4xl">{data.user.location}</h1>
          <p>Community joined: {data.user.memberOf.length}</p>
        </div>
        
      </div>
    </div>
  );
}

export default MyAccount;
