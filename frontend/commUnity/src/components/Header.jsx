import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { RiMenuFold4Line } from "react-icons/ri";
import { IoIosArrowBack } from "react-icons/io";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
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
          } md:block absolute md:static bg-sky-400 md:bg-white h-lvh md:h-auto md:w-auto w-screen`}
        >
          <ul className="flex flex-col md:flex-row justify-around items-center md:space-x-6 md:space-y-0 space-y-20 md:mt-0 mt-20 md:text-base text-2xl">
            <NavLink to="/events">
              <li
                onClick={() => setShowMenu(false)}
                className={`w-full cursor-pointer px-4 py-1 rounded-2xl transition-all duration-300 hover:bg-primaryBlue hover:text-white hover:shadow-lg hover:scale-105`}
              >
                Events
              </li>
            </NavLink>

            <NavLink to="notice">
              <li
                onClick={() => setShowMenu(false)}
                className="w-full cursor-pointer px-4 py-1 rounded-2xl transition-all duration-300 hover:bg-primaryBlue hover:text-white hover:shadow-lg hover:scale-105 "
              >
                Notice Board
              </li>
            </NavLink>
            <NavLink to="community">
              <li
                onClick={() => setShowMenu(false)}
                className="w-full cursor-pointer px-4 py-1 rounded-2xl transition-all duration-300 hover:bg-primaryBlue hover:text-white hover:shadow-lg hover:scale-105 "
              >
                My Community
              </li>
            </NavLink>
            <NavLink to="/account">
              <li
                onClick={() => setShowMenu(false)}
                className="cursor-pointer px-4 py-1 rounded-2xl transition-all duration-300 bg-primaryRed hover:text-white hover:shadow-lg hover:scale-105"
              >
                My Account
              </li>
            </NavLink>
          </ul>
          <IoIosArrowBack
            onClick={() => setShowMenu(false)}
            className="md:hidden absolute top-0 right-0 text-4xl m-7 cursor-pointer"
          />
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
