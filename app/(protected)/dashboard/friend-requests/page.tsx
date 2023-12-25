import React from "react";
import FriendRequests from "../../components/FriendRequests";

const page = () => {
  return (
    <div className="w-screen h-screen scroll bg-green-950 flex">
      <div className="w-1/2"></div>
      <div className="w-1/2 mt-12">
        <FriendRequests />
      </div>
    </div>
  );
};

export default page;
