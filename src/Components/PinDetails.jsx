import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MdDownloadForOffline } from "react-icons/md";

import { v4 as uuidv4 } from "uuid";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { IoCompassOutline } from "react-icons/io5";
import {
  useAddCommentMutation,
  useGetMorePinDetailsQuery,
  useGetPinDetailQuery,
} from "../Redux/Services/socialApi";

const PinDetails = ({ user }) => {
  const { pinId } = useParams();

  const [comment, setcomment] = useState("");
  const [addingComment, setaddingComment] = useState(null);

  const _id = pinId;
  const userId = user?._id;
  const { data: pinDetail, isFetching, error } = useGetPinDetailQuery(_id);
  console.log(pinDetail);
  const category = pinDetail?.category;
  const morePin = pinDetail?.pinId;
  const { data: morePins } = useGetMorePinDetailsQuery({ category, morePin });
  // console.log(morePin, userId, comment);
  const [addComment, { isFetching: isUpdating }] = useAddCommentMutation();

  // const [pinDetail, setpinDetail] = useState(null);

  console.log(user);

  if (isFetching) return <Spinner message="Loading Details" />;

  console.log(pinDetail);
  return (
    <div className="flex flex-col">
      <div className="flex xl:flex-row flex-col m-auto bg-white  max-w-[1200px] border-[32px]">
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img src={pinDetail?.image} className="rounded-t-3xl rounded-b-lg" />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items justify-between">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-9 h-9 items-center rounded-full flex  text-dark text-xl justify-center text-dark opacity-75 hover:opacity-100 hover:shadow-md outline-none"
              >
                <MdDownloadForOffline />
              </a>{" "}
            </div>
            <a href={pinDetail?.destination} target="_blank" rel="noreferrence">
              {pinDetail?.destination}
            </a>
          </div>
          <div>
            <h1 className="text-4xl font-bold break-words mt-3">
              {pinDetail?.title}
            </h1>
            <p className="mt-3">{pinDetail?.about}</p>
          </div>
          <Link
            to={`user-profile/${pinDetail?._id}`}
            className="flex gap-2 mt-5 items-center bg-white rounded-lg"
          >
            <img
              src={pinDetail?.postedBy.image}
              className="w-8 h-8 rounded-full  object-cover"
              alt="userprofile"
            />
            <p className="font-bold capitalize">
              {pinDetail?.postedBy.userName}
            </p>
          </Link>{" "}
          <h2 className="mt-5 text-2xl">Comments</h2>
          <div className="max-h-370 overflow-y-auto">
            {pinDetail?.comments?.map((comment, i) => (
              <div
                className="flex  gap-2 mt-5 items-center bg-white rounded-lg"
                key={i}
              >
                <img
                  src={comment.postedBy?.image}
                  alt="user"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{comment?.postedBy?.userName}</p>
                  <p className="">{comment?.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap mt-6 gap-3">
            {user && (
              <Link
                to={`user-profile/${pinDetail?._id}`}
                className="w-10 h-10 rounded-full cursor-pointer"
              >
                <img
                  src={user?.image}
                  className="w-8 h-8 rounded-full  object-cover"
                  alt="userprofile"
                />
              </Link>
            )}
            {!user && (
              <p className="text-base text text-red-400 flex items-center">
                Login in to Comment
              </p>
            )}
            <input
              className="flex-1 border-gray-100 outline-none border-2 p-2 focus:border-gray-300 rounded-lg"
              type={`text`}
              placeholder="add comment"
              value={comment}
              onChange={(e) => setcomment(e.target.value)}
            />
            {console.log("comment:", comment)}
            <button
              disabled={!user || !comment}
              onClick={() => {
                addComment({ _id, userId, comment });
                setcomment("");
              }}
              className={`bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none `}
              type="button"
            >
              {isFetching ? "posting the comment..." : "post"}
            </button>
          </div>
        </div>
      </div>
      {morePins?.length > 0 ? (
        <>
          <h2 className="text-center font-bold text-2x mt-8 mb-4 ">
            {" "}
            More like this
          </h2>
          <MasonryLayout pins={morePins} />
        </>
      ) : (
        <Spinner message={`loading more pins`} />
      )}
    </div>
  );
};

export default PinDetails;
