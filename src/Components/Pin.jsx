import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { fetchUser } from "../Utils/fetchUser";
import {
  useGetFeedQuery,
  useSavePostMutation,
  useUnSavePostMutation,
} from "../Redux/Services/socialApi";
import Spinner from "./Spinner";

const Pin = ({ user, pin: { postedBy, image, destination, _id, save } }) => {
  const { data: Feed, isFetching, error: feederror } = useGetFeedQuery();
  const navigate = useNavigate();
  const [postHovered, setPostHoverd] = useState(false);
  const [savePost, { isLoading: isUpdating, error: savedError }] =
    useSavePostMutation();
  const [unSavePost, { error: Unsavederror }] = useUnSavePostMutation();
  console.log(user);
  // console.log(error);
  // useEffect(() => {
  //   fetchUser();
  // }, []);
  // const user = fetchUser();
  const userId = user?._id;
  // console.log(postedBy?._id, user);
  const alreadySaved = !!save?.filter((item) => item === user?._id)?.length;
  // console.log(alreadySaved);
  const DeletePin = (id) => {
    // client.delete(id).then(() => {
    //   window.location.reload();
    // });
  };
  if (isFetching) return <Spinner message={`loading Image`} />;
  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHoverd(true)}
        onMouseLeave={() => setPostHoverd(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img src={image} className="rounded-lg w-full " alt="user-post" />
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-2 "
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 items-center rounded-full flex  text-dark text-xl justify-center text-dark opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    unSavePost({ _id, userId });
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {save?.length} saved
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePost({ _id, userId });
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  save
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white text-sm flex items-center gap-2 text=black font-bold py-2 px-4 opacity-70 hover:opacity-100 hover:shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                >
                  <BsFillArrowRightCircleFill />
                  {destination.length > 10
                    ? ` ${destination.slice(0, 10)}...`
                    : destination}
                </a>
              )}
              {console.log(postedBy?._id, user?.uid)}
              {postedBy?._id === user?.uid && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    DeletePin(_id);
                  }}
                  type="button"
                  className="bg-white opacity-70 hover:bg-red-500 text-black hover:text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none flex items-center"
                >
                  <AiTwotoneDelete className="" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {postedBy && (
        <Link
          to={`user-profile/${postedBy?._id}`}
          className="flex gap-2 mt-2 items-center"
        >
          {" "}
          <img
            src={postedBy?.image}
            className="w-8 h-8 rounded-full  object-cover"
            alt="userprofile"
          />
          <p className="font-bold capitalize">{postedBy?.name}</p>
        </Link>
      )}
    </div>
  );
};

export default Pin;
