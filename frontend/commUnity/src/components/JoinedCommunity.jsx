// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function JoinedCommunity() {
//   const [communities, setCommunities] = useState([]);
//   const [error, setError] = useState();
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchCommunity = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           "http://localhost:4000/users/joined_communities",
//           { withCredentials: true }
//         );

//         setCommunities(response.data);
//       } catch (error) {
//         setError(
//           error.response?.data?.message || "failed to fetch communities"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCommunity();
//   }, []);

//   return (
//     <div className="p-5 mt-20">
//       <h1 className="text-2xl text-center md:text-left ml-0 md:ml-30">
//         Communities You Have Joined
//       </h1>
//       <hr class="h-0.5 bg-gray-800 border-none w-4/5 mx-auto" />

//       {loading ? (
//         <p className="text-center text-gray-500">Loading...</p>
//       ) : error ? (
//         <p className="text-center text-red-500">{error}</p>
//       ) : communities.length > 0 ? (
//         <div className="grid md:grid-cols-2 gap-6 md:gap-0 place-items-center mt-20">
//           {communities.map((item) => (
//             <div
//               key={item._id}
//               className="bg-white shadow-lg rounded-lg overflow-hidden p-4 border border-gray-200 w-3/4"
//             >
//               <img
//                 src={item.image}
//                 alt="community_profile"
//                 className="w-full h-40 object-cover rounded-lg"
//               />
//               <div className="p-3">
//                 <h2 className="text-xl font-semibold text-gray-900">
//                   {item.name}
//                 </h2>
//                 <p className="text-gray-600 text-sm">{item.subtitle}</p>
//                 <p className="mt-2 text-gray-700">{item.description}</p>
//                 <p className="mt-2 text-sm text-gray-500">
//                   <strong>Privacy:</strong> {item.privacy}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   <strong>Members:</strong> {item.members.length}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   <strong>Created:</strong>{" "}
//                   {new Date(item.createdAt).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-center text-gray-500">No communities found.</p>
//       )}
//     </div>
//   );
// }

// export default JoinedCommunity;
import React from 'react'

function JoinedCommunity() {
  return (
    <div>JoinedCommunity</div>
  )
}

export default JoinedCommunity