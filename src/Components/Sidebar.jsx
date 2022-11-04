import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import logo from "../assets/logo.png";
import { IoLogOut, IoLogIn } from "react-icons/io5";
import { categories } from "../utils/data";
import { ReactComponent as FireLogo } from "../assets/colored-Firesocial.svg";
import { toast } from "react-toastify";
import { auth } from "../Firebase/config";
import { signOut } from "firebase/auth";
// import { GoogleLogout } from "react-google-login";

const Sidebar = ({ user, closeToggle }) => {
  const navigate = useNavigate();
  const logout = (res) => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/login");
        localStorage.clear();
        toast.success("Logged out !", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((error) => {
        console.error(error);
        // An error happened.
      });
    // console.log("response:", res);
  };
  console.log(user);
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };
  const isNotActiveStyle =
    "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration 200 ease-in-out capitalize";
  const isActiveStyle =
    "flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration 200 ease-in-out capitalize text-[#447EEF] border-[#447EEF]";

  return (
    <div className="flex flex-col bg-white h-full overflow-y-auto min-w-[240px] hide-scrollbar z-50">
      <div className="flex flex-col">
        <Link
          className="flex px-5 gap-2 pt-1 w-190 items-center"
          to="/"
          onClickCapture={handleCloseSidebar}
        >
          <FireLogo className="w-22 h-20" />
        </Link>
      </div>
      <div className="flex flex-col gap-5 relative">
        {!user && (
          <button
            className=" absolute -top-6 right-5 mr-4 bg-red-500 text-white rounded-lg px-4 py-3 my-5 shadow-lg flex items-center "
            onClick={() => {
              navigate("/login");
            }}
          >
            Login <IoLogIn size={20} className="ml-2 -mb-0.5" />
          </button>
        )}

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
        <div className="flex justify-between items-center">
          <Link
            to={`user-profile/${user._id}`}
            className="flex my-5 gap-2 items-center bg-white rounded-md shadow-lg mx-4"
            onClickCapture={handleCloseSidebar}
          >
            <img
              src={user?.image}
              className="w-10 h-10 rounded-full"
              alt="user_pic"
            />
            <p className="text-black font-semibold">{user?.name}</p>
          </Link>
          <button
            className="mr-4 bg-red-500 text-white rounded-lg px-4 py-3 my-5 shadow-lg flex items-center "
            onClick={logout}
          >
            Logout <IoLogOut size={20} className="ml-2 -mb-0.5" />
          </button>
        </div>
      )}
      {user && <div></div>}
    </div>
  );
};

export default Sidebar;
