import { User } from "@/app/types/db";
import React from "react";

interface ListingProps {
  id: string;
  user: any;
}

const AllListings: React.FC<ListingProps> = ({ id, user }) => {
  if (id === undefined) return;
  if (user === undefined) return;

  return <div>{user.jobListing}</div>;
};

export default AllListings;
