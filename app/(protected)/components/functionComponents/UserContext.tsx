"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface UserContextType {
  userInfo: any;
  setUserInfo: React.Dispatch<React.SetStateAction<any>>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: any) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.post("/api/user/get", {});
        if (res.status === 200) {
          const data = await res.data;
          setUserInfo(data);
        } else {
          console.error("Error fetching user data:", res.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserInfo(null); // Optionally handle the state
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
