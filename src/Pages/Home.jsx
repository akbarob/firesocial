import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
// import { AIFillCloseCirle } from "react-icons/ai";

import { Sidebar, Profile, Spinner } from "../components";

import logo from "../assets/logo.png";
import { useRef } from "react";
import Pins from "./Pins";
import UserSlice, { setUser } from "../Redux/Features/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGetUsersQuery } from "../Redux/Services/socialApi";
import { fetchUser } from "../utils/fetchUser";

const Home = () => {
  const dispatch = useDispatch();
  // const user = useSelector((state) => state.user.user);
  const { data: user, isFetching, error } = useGetUsersQuery();

  const navigate = useNavigate();
  const [ToggleSidebar, setToggleSidebar] = useState(false);
  if (isFetching) return <Spinner messsage={"loading!!!!!!"} />;

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-all duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            className="cursor-pointer "
            size={40}
            onClick={() => setToggleSidebar(!ToggleSidebar)}
          />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>

          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="logo" className="w-28" />
          </Link>
        </div>
      </div>
      {ToggleSidebar && (
        <div className=" fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in md:hidden">
          <div className="absolute w-full flex justify-end">
            <AiFillCloseCircle
              size={30}
              onClick={() => setToggleSidebar(!ToggleSidebar)}
              className="cursor-pointer"
            />
          </div>
          <Sidebar user={user && user} closeToggle={setToggleSidebar} />
        </div>
      )}
      <div className="pb-2 flex flex-1 h-screen overflow-y-auto">
        <Routes>
          <Route
            path="user-profile/:userId"
            element={<Profile user={user} />}
          />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
