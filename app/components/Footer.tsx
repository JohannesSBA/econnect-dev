import React from "react";
import { AiFillFacebook, AiFillInstagram, AiFillYoutube } from "react-icons/ai";

const Footer = () => {
  return (
    <div className="w-full flex flex-col gap-2 h-64 dark:bg-blue-950 bg-indigo-400">
      <div className="flex flex-col md:flex-row justify-between w-full px-24 mt-12">
        <div className="md:w-24 text-center">Econnnect</div>
        <div className="flex gap-4 w-full text-sm text-center justify-center m-4 -translate-x-6 md:translate-x-6">
          <h1>Job Listings</h1>
          <h1>About Us</h1>
          <h1>Contact Us</h1>
          <h1>FAQs</h1>
        </div>
        <div className="flex gap-5 justify-center py-4">
          <AiFillFacebook />
          <AiFillInstagram />
          <AiFillYoutube />
        </div>
      </div>
      <div className=" w-1/2 mx-auto h-1 bg-white"></div>
      <div className="flex justify-center text-[8px] md:text-medium gap-2">
        <p>&copy; 2023 Econnect. All rights reserved.</p>
        <p>Privacy Policy</p>
        <p>Terms and Conditions</p>
        <p>Cookie Policy</p>
      </div>
    </div>
  );
};

export default Footer;
