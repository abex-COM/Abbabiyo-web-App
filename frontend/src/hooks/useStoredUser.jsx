import axios from "axios";
import React, { useEffect, useState } from "react";
import useUserData from "./useUserData";
import baseUrl from "../baseUrl/baseUrl";

const useStoredUser = () => {
  const [storedUser, setStoredUser] = useState({});
  const user = useUserData();
  useEffect(() => {
    const fetchUser = async () => {
      if (!user.id) return;

      try {
        const response = await axios.get(
          `${baseUrl}/api/admin/get-admin/${user.id}`
        );

        setStoredUser(response.data);
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  return { user: storedUser.admin, setUser: setStoredUser };
};

export default useStoredUser;
