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
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../Firebase/config";
export const socialApi = createApi({
  reducerPath: "socialApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getUsers: builder.query({
      queryFn() {
        return { data: "ok" };
      },
    }),
  }),
});

export const { useGetUsersQuery } = socialApi;
