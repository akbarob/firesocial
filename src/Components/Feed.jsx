import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetFeedByCategoryQuery,
  useGetFeedQuery,
} from "../Redux/Services/socialApi";
// import Error from "./Error";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
const Feed = ({ user }) => {
  const [loading, setLoading] = useState(true);

  const [pins, setPins] = useState(false);
  const { categoryId } = useParams();

  const { data: Feed, isFetching, error } = useGetFeedQuery();
  const { data: FeedCategory } = useGetFeedByCategoryQuery(categoryId);

  useEffect(() => {
    setLoading(true);
    if (categoryId) {
      console.log(categoryId);
      setPins(FeedCategory);
      setLoading(false);
    } else {
      setPins(Feed);
      setLoading(false);
    }
  }, [categoryId, Feed, FeedCategory]);
  if (loading || isFetching)
    return <Spinner message="Adding new ideas to your feed!" />;
  if (!pins?.length)
    return (
      <div className="h-[80vh] flex items-center">
        <h1 className="text-center font-semibold">No Pins Available</h1>
      </div>
    );

  // if (error) return <Error />;
  return (
    <div className="mx-auto h-full">
      {pins && <MasonryLayout pins={pins} user={user} />}
    </div>
  );
};

export default Feed;
