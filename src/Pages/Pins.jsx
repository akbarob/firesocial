import React, { useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";

import CreatePin from "../Components/CreatePin";
import Navbar from "../Components/Navbar";
import Feed from "../Components/Feed";
import PinDetails from "../Components/PinDetails";
import Search from "../Components/Search";

const Pins = ({ user, isFetching }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="px-2 md:px-5 mx-auto w-full">
      <div className="bg-gray-50">
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user}
        />
      </div>
      <div className=" w-full relative justify-center items-center flex">
        {!user && !isFetching && (
          <div className="absolute flex justify-center">
            <button
              className="flex fixed bottom-10 items-center bg-red-500 p-6 rounded-full shadow-2xl opacity-50 hover:opacity-100 transition-all duration-150  z-50 "
              onClick={() => {
                navigate("/login");
              }}
            >
              Login to use the APP
            </button>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Feed user={user} />} />
          <Route path="/category/:categoryId" element={<Feed />} />

          <Route
            path="/pin-detail/:pinId"
            element={<PinDetails user={user} />}
          />
          <Route path="/create-pin/" element={<CreatePin user={user} />} />

          <Route
            path="/search"
            element={
              <Search
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                user={user}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Pins;
