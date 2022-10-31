import React from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();

  if (!user) return null;
  return (
    <div className="flex gap=2 md:gap-5 w-full mt-5 pb-7">
      <div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-non outline-none focus-within:shadow-sm">
        <IoMdSearch size={21} className="ml-1" />
        <input
          type="search"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholde="search"
          value={searchTerm}
          onFocus={() => navigate("/search")}
          className="p=2 w-full bg-white outline-none"
        />
      </div>
      <div className="flex gap-3 ">
        <Link to={`user-profile/${user?._id}`} className="hidden md:block">
          <img
            src={user.image}
            alt="user"
            className="w-14 h-14 rounded-full max-w-none"
          />
        </Link>
        <Link
          to="create-pin"
          className="rounded-lg bg-black text-white w-12 h-12 md:h-12 flex justify-center items-center "
        >
          <IoMdAdd size={40} />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
