import React, { useEffect, useState } from "react";
import { useGetFeedBySearchQuery } from "../Redux/Services/socialApi";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
const Search = ({ searchTerm, user }) => {
  const { data, isFetching, error } = useGetFeedBySearchQuery(searchTerm);
  const [pins, setPins] = useState();
  useEffect(() => {
    setPins(data);
  }, [data]);
  console.log(searchTerm);
  console.log(data);
  return (
    <div>
      {isFetching && <Spinner message={`Searching for Pins`} />}
      {pins?.length !== 0 && <MasonryLayout pins={pins} user={user} />}
      {pins?.length === 0 && searchTerm !== "" && !isFetching && (
        <div className="mt-10text-center text-xl ">NO pins found!</div>
      )}
    </div>
  );
};

export default Search;
