import React from "react";
import { FaUserAlt } from "react-icons/fa";

function Header() {
  return (
    <div>
      <nav className="flex justify-between items-center p-4 bg-[blue] text-white">
        <div>
          <h1 className="text-2xl font-bold">commUNITY</h1>
        </div>
        <div>
          <FaUserAlt className="text-[red] text-3xl cursor-pointer hover:text-red-400" />
        </div>
      </nav>
    </div>
  );
}

export default Header;
