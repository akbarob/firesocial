import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import logo from "../assets/logo.png";
import { categories } from "../utils/data";
// import { GoogleLogout } from "react-google-login";

const Sidebar = ({ user, closeToggle }) => {
  const logout = (res) => {
    console.log("response:", res);
    navigate("/login");
    localStorage.clear();
  };
  console.log(user);
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };
  const isNotActiveStyle =
    "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration 200 ease-in-out capitalize";
  const isActiveStyle =
    "flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration 200 ease-in-out capitalize";

  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-auto min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <Link
          className="flex px-5 gap-2 pt-1 w-190 items-center"
          to="/"
          onClickCapture={handleCloseSidebar}
        >
          <img src={logo} alt="logo" />
        </Link>
      </div>
      <div className="flex flex-col gap-5">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? isActiveStyle : isNotActiveStyle
          }
          onClickCapture={handleCloseSidebar}
        >
          <RiHomeFill />
          home
        </NavLink>
        <h3 className="text-base mt-2 px-5 2xl:text-xl">Discover Categories</h3>
        {categories.slice(0, categories.length - 1).map((category) => (
          <NavLink
            to={`/category/${category.name}`}
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClickCapture={handleCloseSidebar}
            key={category.name}
          >
            <img
              src={category.image}
              className="w-8 h-8 rounded-full shadow-sm"
              alt="category"
            />
            {category.name}
          </NavLink>
        ))}
      </div>
      {user && (
        <Link
          to={`user-profile/${user._id}`}
          className="flex my-5 gap-2 items-center bg-white rounded-md shadow-lg mx-4"
          onClickCapture={handleCloseSidebar}
        >
          <img
            src={user.image}
            className="w-10 h-10 rounded-full"
            alt="user-image"
          />
          <p className="text-black font-semibold">{user.userName}</p>
        </Link>
      )}
      {user && <div></div>}
    </div>
  );
};

export default Sidebar;
