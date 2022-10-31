import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { fetchUser } from "../Utils/fetchUser";

const Pin = ({ pin: { postedBy, image, destination, _id, save } }) => {
  const navigate = useNavigate();
  const [postHovered, setPostHoverd] = useState(false);

  const user = fetchUser();
  const alreadySaved = !!save?.filter(
    (item) => item.postedBy._id === user?.googleId
  )?.length;
  const savePin = (id) => {
    // if (!alreadySaved) {
    //   client
    //     .patch(id)
    //     .setIfMissing({ save: [] })
    //     .insert("after", "save[-1]", [
    //       {
    //         _key: uuidv4(),
    //         userId: user.googleId,
    //         postedBy: {
    //           _type: "postedBy",
    //           _ref: user.googleId,
    //         },
    //       },
    //     ])
    //     .commit()
    //     .then(() => {
    //       window.location.reload();
    //     });
    // }
  };
  const DeletePin = (id) => {
    // client.delete(id).then(() => {
    //   window.location.reload();
    // });
  };
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
            className="absolute top-0  w-full h-full flex flex-col justify-between p-2 z-50"
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
                    savePin(_id);
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
                    savePin(_id);
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
              {postedBy?._id === user?.googleId && (
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
        <p className="font-bold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
