"use client";
// components/AddFriendComponent.tsx
import { useState } from "react";
import axios from "axios";

interface addFriend {
  id: string;
}

const AddFriendComponent: React.FC<addFriend> = ({ id }) => {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleAddFriend = async () => {
    try {
      // Make a POST request to the API endpoint
      const response = await axios.post("/api/friends/add", {
        id,
      });

      // Handle the response
      if (response.status === 200) {
        setSuccessMessage("Friend added successfully!");
        setErrorMessage("");
      } else {
        setErrorMessage("Failed to add friend. Please try again.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      setErrorMessage("An error occurred. Please try again later.");
      setSuccessMessage("");
    }
  };

  return (
    <div>
      <button onClick={handleAddFriend}>Add Friend</button>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default AddFriendComponent;
