import React from "react";

const page = ({ params }: { params: { userName: string } }) => {
  return <div className="text-white">My Post: {params.userName}</div>;
};

export default page;
