import { Button, Image } from "@nextui-org/react";
import React from "react";
import { MdGroups } from "react-icons/md";
import UserPicture from "./UserPicture";
import { GiWaterDrop } from "react-icons/gi";

interface sideProps {
  user: any;
  posts: any;
  applications: any;
}

const SideInfo = ({ user, posts, applications }: sideProps) => {
  const connections = (user.friends ?? []).concat(user.friendsOf ?? []);

  return (
    <div className="h-full rounded-2xl w-full bg-white flex flex-col items-center">
      <div className="border-b border-black p-4">
        <UserPicture />
      </div>
      <div className="border-y border-slate-200 rounded-md w-full flex justify-between p-3">
        <div className="flex text-slate-500 font-semibold text-sm gap-2">
          <MdGroups />
          <h2>Your Connections</h2>
        </div>
        <h2 className="text-blue-400">{connections.length}</h2>
      </div>
      <div className="border-y border-slate-200 rounded-md w-full flex justify-between p-3">
        <div className="flex text-slate-500 font-semibold text-sm gap-2 text-center">
          <MdGroups />
          <h2>Your Posts</h2>
        </div>
        <h2 className="text-blue-400">{posts?.length ?? 0}</h2>
      </div>
      <div className="border-y border-slate-200 rounded-md w-full flex justify-between p-3">
        <div className="flex text-slate-500 font-semibold text-sm gap-2">
          <MdGroups />
          <h2>Open Job Applications</h2>
        </div>
        <h2 className="text-blue-400">{applications?.length ?? 0}</h2>
      </div>
      <a
        href="/dashboard/profile"
        className="w-full h-full flex justify-center"
      >
        <Button variant="light" className=" w-full" href="/profile">
          View Your Profile
        </Button>
      </a>
      <div className="my-6 p-4">
        <Image
          width={400}
          alt="Advertisement"
          src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
        />
      </div>
      <div className="">
        <div className="grid grid-cols-4 text-center gap-2 text-black font-light text-xs">
          <p>About</p>
          <p>Accessibility</p>
          <p>Privacy & Terms</p>
          <p>FAQ&apos;s</p>
          <div className="col-start-2">
            <p>Advertising</p>
          </div>
          <p>Contact</p>
        </div>
        <div className="text-center gap-2 pb-4 text-black text-xs font-light pt-4 flex justify-center">
          <GiWaterDrop />
          Econnect Corporation © 2024
        </div>
      </div>
    </div>
  );
};

export default SideInfo;
