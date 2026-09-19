import React, { useState, useEffect, createContext } from "react";
import axios from "axios";

export const userDataContext = createContext();

const UserContext = ({ children }) => {
  const serverUrl = "http://localhost:8000";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setfrontendImage] = useState(null);
  const [backendImage, setbackendImage] = useState(null);
  const [selectedImage, setselectedImage] = useState(null);

  const [loading, setLoading] = useState(true);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${serverUrl}/api/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUserData(null);
      setfrontendImage(null);
      setbackendImage(null);
      setselectedImage(null);
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    loading,
    setLoading,
    handleCurrentUser,
    handleLogout,
    frontendImage,
    setfrontendImage,
    backendImage,
    setbackendImage,
    selectedImage,
    setselectedImage,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
};

export default UserContext;