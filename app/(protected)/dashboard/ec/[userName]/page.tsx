import { getUserContent } from "@/app/helpers/getUser";
import React from "react";

const page = async ({ params }: { params: { userName: string } }) => {
  const userInfo = await getUserContent("");
  return <div className="text-white">My Post: {params.userName}</div>;
};

export default page;
