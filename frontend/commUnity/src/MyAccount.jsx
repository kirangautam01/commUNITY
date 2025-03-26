import React, { useEffect, useState } from "react";
import axios from "axios";

function MyAccount() {
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/users/profile",
            {withCredentials: true,}
        );

        console.log(response.data);
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
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default MyAccount;
