"use client";
// components/AddFriendComponent.tsx
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@nextui-org/react";

interface addFriend {
  id: string;
}

const AddFriendComponent: React.FC<addFriend> = ({ id }) => {
  const handleAddFriend = async () => {
    try {
      // Make a POST request to the API endpoint
      const response = await axios.post("/api/friends/add", {
        id,
      });

      // Handle the response
      console.log(response.status);
      if (response.status === 200) {
        toast.success("Friend Request Sent");
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      toast.error("Error adding friend, Please try again later");
      console.error("Error adding friend:", error);
    }
  };

  return (
    <Button color="primary" variant="shadow" onClick={handleAddFriend}>
      Add Friend
    </Button>
  );
};

export default AddFriendComponent;
