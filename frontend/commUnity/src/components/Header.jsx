import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { RiMenuFold4Line } from "react-icons/ri";
import { IoIosArrowBack } from "react-icons/io";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const username = localStorage.getItem("userName");
  return (
    <>
      <div className="md:px-4 overflow-hidden flex justify-between md:mt-4 font-primary font-bold">
        <NavLink to="/">
          <img
            src="/images/logo.jpeg"
            alt="logo"
            className="pl-4 md:pl-0 min-w-[135px] h-12 transition-all duration-400 hover:scale-110 cursor-pointer first:self-center"
          />
        </NavLink>
        <nav
          className={`transition-left duration-400 ease-in-out ${
            showMenu ? "left-0" : "-left-full"
          } md:block absolute md:static bg-sky-400 md:bg-white h-lvh md:h-auto md:w-auto w-screen z-50`}
        >
          <ul className="flex flex-col md:flex-row justify-around items-center md:space-x-6 md:space-y-0 space-y-20 md:mt-0 mt-20 md:text-base text-2xl">
            <NavLink to="/events">
              <li
                onClick={() => setShowMenu(false)}
                className="flex gap-2 md:block w-full cursor-pointer px-4 py-1 rounded-2xl transition-all duration-300 hover:bg-primaryBlue hover:text-white hover:shadow-lg hover:scale-105"
              >
                <img
                  src="/images/event.png"
                  alt="event"
                  className="size-10 mx-auto"
                />
                Events
              </li>
            </NavLink>

            <NavLink to="notice">
              <li
                onClick={() => setShowMenu(false)}
                className="flex gap-2 md:block w-full cursor-pointer px-4 py-1 rounded-2xl transition-all duration-300 hover:bg-primaryBlue hover:text-white hover:shadow-lg hover:scale-105 "
              >
                <img
                  src="/images/notice.png"
                  alt="notice"
                  className="size-10 mx-auto "
                />
                Notice Board
              </li>
            </NavLink>
            <NavLink to="community">
              <li
                onClick={() => setShowMenu(false)}
                className="flex gap-2 md:block w-full cursor-pointer px-4 py-1 rounded-2xl transition-all duration-300 hover:bg-primaryBlue hover:text-white hover:shadow-lg hover:scale-105 "
              >
                <img
                  src="/images/union.png"
                  alt="event"
                  className="size-10 mx-auto"
                />
                My Community
              </li>
            </NavLink>
            <NavLink to="/account">
              <li
                onClick={() => setShowMenu(false)}
                className="flex gap-2 md:block cursor-pointer px-4 py-1 rounded-2xl transition-all duration-300 bg-primaryRed hover:text-white hover:shadow-lg hover:scale-105"
              >
                <img src="/images/user.png" alt="user_profile" className="size-10 rounded-full object-cover mx-auto"/>
                {username}
              </li>
            </NavLink>
          </ul>
          <IoIosArrowBack
            onClick={() => setShowMenu(false)}
            className="md:hidden absolute top-0 right-0 text-4xl m-7 cursor-pointer"
          />
          <p className="absolute bottom-3 font-medium text-center text-sm px-10 block md:hidden">
            All rights reserved | @copyright 2025 | commUNITY-Roman Gautam
          </p>
        </nav>
        <RiMenuFold4Line
          onClick={() => setShowMenu(true)} //menu
          className="mr-4 md:hidden text-primaryBlue size-8 cursor-pointer self-center"
        />
      </div>
      <hr class="h-0.5 bg-primaryBlue border-none mx-auto mt-2" />
    </>
  );
}

export default Header;
