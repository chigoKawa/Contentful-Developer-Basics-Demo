"use client";
import LocaleSwitcher from "../locale-switching/locale-switcher";
import React from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const bgImage =
  "https://images.ctfassets.net/m5vihs7hhhu6/6vGMEoaebHzVLnYQKWzP8r/6b240e791691ca51d7740da012efb8c8/pexels-roman-odintsov-4869223.jpg?w=1920&h=1080&fit=fill";

const Footer = () => {
  const thisyear = new Date().getFullYear();
  // const getRandomLogo = () =>
  //   `https://api.dicebear.com/8.x/icons/svg?seed=coffee`;
  return (
    <footer
      style={{ backgroundImage: `url(${bgImage})` }}
      className="border-b relative bg-[#3B2F2F] text-white p-2  bg-cover bg-center bg-no-repeat bg-blend-soft-lightx bg-blend-overlay"
    >
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex justify-center  sm:justify-start">
            <p className="text-2xl font-bold  sm:text-3xl text-white">
              ☕ Chi Coffee
            </p>
            {/* <Avatar className="w-40 h-40">
              <AvatarImage src={getRandomLogo()} alt="@shadcn" />
              <AvatarFallback>Your Logo</AvatarFallback>
            </Avatar> */}
          </div>

          <div className="flex flex-col gap-4">
            <LocaleSwitcher />
            <p className="mt-4 text-center text-sm  lg:mt-0 lg:text-right">
              No Copyright &copy; {thisyear}. Free to use.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
