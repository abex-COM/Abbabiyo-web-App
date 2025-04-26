import { useEffect, useState } from "react";
import axios from "axios";

const useUserData = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const userId = JSON.parse(atob(token.split(".")[1])).id; // Decode token to get user ID

        const response = await axios.get(
          `http://localhost:5000/api/admin/get-admin/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(response.data.admin);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchUserData();
  }, []);

  return user;
};

export default useUserData;
