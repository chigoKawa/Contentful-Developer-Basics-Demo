"use client";
import React from "react";
import Link from "next/link";

import { SquareArrowOutUpRight } from "lucide-react";

const bgImage =
  "https://images.ctfassets.net/m5vihs7hhhu6/6vGMEoaebHzVLnYQKWzP8r/6b240e791691ca51d7740da012efb8c8/pexels-roman-odintsov-4869223.jpg?w=1920&h=1080&fit=fill";

const NavBar = () => {
  return (
    <div
      style={{ backgroundImage: `url(${bgImage})` }}
      className="border-b relative bg-[#3B2F2F] text-white p-2  bg-cover bg-center bg-no-repeat bg-blend-soft-lightx bg-blend-overlay"
    >
      <header className="border-bx border-gray-200x bg-[#3B2F2F]c text-white  ">
        <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 sm:py-6 lg:px-8">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-2xl font-bold  sm:text-3xl text-white">
                ☕ Chi Coffee
              </p>

              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400"></p>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="inline-flex items-center justify-center gap-1.5 rounded-sm border border-gray-200 bg-white px-5 py-3 text-gray-900 transition hover:text-gray-700 focus:ring-3 focus:outline-hidden dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:hover:text-gray-200"
                type="button"
              >
                <span className="text-sm font-medium">
                  <Link
                    target="_blank"
                    href="https://github.com/chigoKawa/Contentful-Developer-Basics-Demo"
                  >
                    Get this code
                  </Link>{" "}
                </span>
                <SquareArrowOutUpRight size={15} />
              </button>
              {/* 
              <button
                className="inline-block rounded-sm bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:ring-3 focus:outline-hidden"
                type="button"
              >
                Create Post
              </button> */}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default NavBar;
