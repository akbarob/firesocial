import React, { useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";

import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { useEffect } from "react";
import {
  useGetFeedQuery,
  useGetUserCreatedPinQuery,
  useGetUserSavedPinQuery,
} from "../Redux/Services/socialApi";
import { toast } from "react-toastify";
import { auth } from "../Firebase/config";
import { signOut } from "firebase/auth";

const Profile = ({ user }) => {
  // console.log(user);
  const navigate = useNavigate();
  const { userId } = useParams();

  const [pins, setPins] = useState([]);
  const [text, setText] = useState("created");
  const [activeBtn, setActiveBtn] = useState("created");
  const { data: Saved } = useGetUserSavedPinQuery(userId);
  // console.log(Saved);
  const { data: Created } = useGetUserCreatedPinQuery(userId);
  // const { data: feed } = useGetFeedQuery();
  // console.log(feed);
  // get random image from unsplash
  console.log("text:", text);
  console.log("saved", Saved);
  console.log(pins);

  const logout = () => {
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

  useEffect(() => {
    if (text === "created") {
      setPins(Created);
      console.log("created");
    } else {
      setPins(Saved);
      console.log("useEffect ran");
    }
    console.log(pins);
  }, [text, Saved, Created]);
  const randomImage =
    "https://source.unsplash.com/1600x900/?nature,sport,technology";

  const activeBtnStyles =
    "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
  const notActiveBtnStyles =
    "bg-primary text-black font-bold p-2 rounded-full w-20 outline-none";
  return (
    <div className="relative py-2 h-full justify-center mx-auto w-full">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7 ">
          <div className="flex flex-col justify-center items-center ">
            <img
              src={randomImage}
              className="w-full h-[200px]  shadow-lg object-cover"
              alt="banner_img"
            />
            <img
              src={user?.image}
              className="w-20 h-20 rounded-full -mt-10 shadow-2xl"
              alt="user_img"
            />
            <h1 className="font-bold text-3xl text-center mt-3"></h1>
            <div className="absolute z-10  top-0 right-0">
              {user && (
                <button
                  className="p-2 bg-red-500 rounded-full text-white mt-2"
                  onClick={logout}
                >
                  Log out
                </button>
              )}
            </div>
          </div>
          <div className="text-center mb-7">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("created");
              }}
              className={`${
                activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              created
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("saved");
              }}
              className={`${
                activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              saved
            </button>
          </div>
          {pins?.length ? (
            <div className="px-2">
              <MasonryLayout pins={pins} user={user} />
            </div>
          ) : (
            <div className="flex justify-center font-bold items-center text-xl w-full mt-2 ">
              {" "}
              No pins found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
