import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../Firebase/config";
import { fetchUser } from "../../utils/fetchUser";
import { setUser } from "../Features/UserSlice";
export const socialApi = createApi({
  reducerPath: "socialApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getUsers: builder.query({
      async queryFn() {
        const userInfo = fetchUser();
        // console.log(user);
        try {
          const q = query(
            collection(db, "Users"),
            where("_id", "==", userInfo.uid)
          );
          const querySnapshot = await getDocs(q);
          let user = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const _id = doc.id;
            user.push({ _id, ...data });
            // console.log(user);
          });
          return { data: user[0] };
        } catch (err) {
          console.log("error getting user:", err);
        }
      },
    }),
    getFeed: builder.query({
      async queryFn() {
        try {
          const q = query(collection(db, "Pins"), orderBy("createdAT", "desc"));
          const querySnapshot = await getDocs(q);
          let pins = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const _id = doc.id;
            pins.push({ _id, ...data });
            console.log(pins);
          });
          return { data: pins };
        } catch (err) {
          console.log("error getting user:", err);
        }
      },
    }),
    getFeedByCategory: builder.query({
      async queryFn(categoryId) {
        try {
          const q = query(
            collection(db, "Pins"),
            where("category", "==", `${categoryId}`),
            orderBy("createdAT", "desc")
          );
          const docSnap = await getDocs(q);
          let pins = [];
          docSnap.forEach((doc) => {
            const data = doc.data();
            const _id = doc.id;
            pins.push({ _id, ...data });
            console.log("FeedByCategory", pins);
          });
          return { data: pins };
        } catch (err) {
          console.log("error getting FeedByCategory:", err);
        }
      },
    }),
  }),
});

export const { useGetUsersQuery, useGetFeedQuery, useGetFeedByCategoryQuery } =
  socialApi;
