import { uuidv4 } from "@firebase/util";
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
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../Firebase/config";
import { fetchUser } from "../../utils/fetchUser";
import { setUser } from "../Features/UserSlice";
export const socialApi = createApi({
  reducerPath: "socialApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Post", "User"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      async queryFn() {
        const userInfo = fetchUser();
        console.log(userInfo);

        try {
          const q = query(
            collection(db, "Users"),
            where("_id", "==", userInfo?.uid)
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
      providesTags: ["User"],
    }),
    getFeed: builder.query({
      async queryFn() {
        try {
          const q = query(collection(db, "Pins"), orderBy("createdAt", "desc"));
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
          console.log("error getting pins:", err);
        }
      },
      providesTags: ["Post"],
    }),
    getFeedByCategory: builder.query({
      async queryFn(categoryId) {
        try {
          const q = query(
            collection(db, "Pins"),
            where("category", "==", `${categoryId}`),
            orderBy("createdAt", "desc")
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
      providesTags: ["Post"],
    }),
    getFeedBySearch: builder.query({
      async queryFn(searchTerm) {
        try {
          const q = query(
            collection(db, "Pins"),
            where("category", ">=", `${searchTerm}`),
            orderBy("category", "desc")
          );
          const docSnap = await getDocs(q);
          let pins = [];
          docSnap.forEach((doc) => {
            const data = doc.data();
            const _id = doc.id;
            pins.push({ _id, ...data });
            console.log("FeedBySearch", pins);
          });
          return { data: pins };
        } catch (err) {
          console.log("error getting FeedByCategory:", err);
        }
      },
    }),
    savePost: builder.mutation({
      queryFn({ _id, userId }) {
        console.log({ _id, userId });
        try {
          const pinRef = doc(db, "Pins", `${_id}`);
          updateDoc(pinRef, {
            save: arrayUnion(`${userId}`),
          });

          console.log(`saved ${userId} in ${_id}`);
          // window.location.reload();
        } catch (err) {
          console.log("error updating pin:", err);
        }
        return { data: "saved" };
      },
      invalidatesTags: ["Post"],
    }),
    unSavePost: builder.mutation({
      queryFn({ _id, userId }) {
        console.log({ _id, userId });
        try {
          const pinRef = doc(db, "Pins", `${_id}`);
          updateDoc(pinRef, {
            save: arrayRemove(`${userId}`),
          });
          console.log(`Unsaved ${userId} in ${_id}`);
          // window.location.reload();
        } catch (err) {
          console.log("error updating pin:", err);
        }
        return { data: "unsaved" };
      },
      invalidatesTags: ["Post"],
    }),
    getPinDetail: builder.query({
      async queryFn(_id) {
        try {
          const docRef = doc(db, "Pins", `${_id}`);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            // let pins = [];
            const data = docSnap.data();
            const _id = docSnap.id;
            // pins.push({ _id, ...data });
            // console.log("doc data:", pins);
            return { data: { _id, ...data } };
          } else {
            console.log("No such document!");
          }
        } catch (err) {
          console.log(`error fetching Pin: ${_id}`, err);
        }
      },
      providesTags: ["Post"],
    }),
    getMorePinDetails: builder.query({
      async queryFn({ category, morePin }) {
        console.log(category, morePin);
        try {
          const q = query(
            collection(db, "Pins"),
            where("category", "==", `${category}`)
            // orderBy("Document ID", "desc")
          );
          const docSnap = await getDocs(q);
          let pins = [];
          docSnap.forEach((doc) => {
            const data = doc.data();
            const _id = doc.id;
            pins.push({ _id, ...data });
            console.log("MorePinDetails", pins);
          });
          return { data: pins };
        } catch (err) {
          console.log("error getting MorePinDetails:", err);
        }
      },
      providesTags: ["Post"],
    }),
    addComment: builder.mutation({
      async queryFn({ _id, comment, userId }) {
        console.log(_id, userId, comment);

        try {
          const userRef = doc(db, `Users/${userId}`);
          const userSnap = await getDoc(userRef);
          console.log(userSnap.data());
          const pinRef = doc(db, "Pins", `${_id}`);
          updateDoc(pinRef, {
            comments: arrayUnion({
              comment,
              _key: uuidv4(),
              postedBy: userSnap.data(),
            }),
          });
          console.log(`comment posted in pins/${_id}`);
          // window.location.reload();
        } catch (err) {
          console.log("error posting comment:", err);
        }
        return { data: "comment posted" };
      },
      invalidatesTags: ["Post"],
    }),
    getUserCreatedPin: builder.query({
      async queryFn(userId) {
        try {
          const q = query(
            collection(db, "Pins"),
            where("userId", "==", `${userId}`)
          );
          const docSnap = await getDocs(q);
          let pins = [];
          docSnap.forEach((doc) => {
            const data = doc.data();
            const _id = doc.id;
            pins.push({ _id, ...data });
            console.log("UserCreated", pins);
          });
          return { data: pins };
        } catch (err) {
          console.log(err);
        }
        return { data: "userCreated" };
      },
    }),
    getUserSavedPin: builder.query({
      async queryFn(userId) {
        try {
          const q = query(
            collection(db, "Pins"),
            where("save", "array-contains", `${userId}`)
          );
          const docSnap = await getDocs(q);
          let pins = [];
          docSnap.forEach((doc) => {
            const data = doc.data();
            const _id = doc.id;
            pins.push({ _id, ...data });
            console.log("UserSaved", pins);
          });
          return { data: pins };
        } catch (err) {
          console.log(err);
        }
      },
    }),
    DeletePin: builder.mutation({
      async queryFn(pinId) {
        try {
          await deleteDoc(doc(db, "Pins", pinId));
          console.log("Pin deleted-:", pinId);
          return { data: "Pin deleted" };
        } catch (err) {
          console.log(err);
        }
      },
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetFeedQuery,
  useGetFeedByCategoryQuery,
  useGetFeedBySearchQuery,
  useSavePostMutation,
  useUnSavePostMutation,
  useGetPinDetailQuery,
  useGetMorePinDetailsQuery,
  useAddCommentMutation,
  useGetUserCreatedPinQuery,
  useGetUserSavedPinQuery,
  useDeletePinMutation,
} = socialApi;
