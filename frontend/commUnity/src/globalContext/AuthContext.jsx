import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated
    const verifyUser = async () => {
      try {
        const response = await axios.get("http://localhost:4000/users/profile", {
          withCredentials: true, // Ensures cookies are sent with the request
        });
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
