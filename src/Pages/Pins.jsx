import React, { useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { Navbar, Feed, PinDetails, Search, CreatePin } from "../components";

const Pins = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="px-2 md:px-5 mx-auto">
      <div className="bg-gray-50">
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user}
        />
      </div>
      <div className="h-[80vh] w-full">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/category/:categoryId" element={<Feed />} />

          <Route
            path="/pin-detail/:pinId"
            element={<PinDetails user={user} />}
          />
          <Route path="/create-pin/" element={<CreatePin user={user} />} />

          <Route
            path="/search"
            element={
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Pins;
