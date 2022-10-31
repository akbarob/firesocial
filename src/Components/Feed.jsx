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
const Feed = () => {
  console.log("cateory page");
  const [loading, setLoading] = useState(true);
  // // const [error, setError] = useState(false);

  const [pins, setPins] = useState(false);
  console.log(pins);
  const { categoryId } = useParams();

  const { data: Feed, isFetching, error } = useGetFeedQuery();
  const { data: FeedCategory } = useGetFeedByCategoryQuery(categoryId);
  console.log("feed:", Feed);
  console.log("FeedCategory:", FeedCategory);

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
    return <Spinner message="we are adding new ideas to your feed!" />;
  if (!pins?.length)
    return <h1 className="text-center font-semibold">No Pins Available</h1>;
  // if (error) return <Error />;
  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;
