import React from "react";

import GoogleButton from "react-google-button";
import share from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";

import { auth, db } from "../Firebase/config";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

const Login = ({}) => {
  const navigate = useNavigate();

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    // signInWithRedirect(auth, provider);
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user.providerData;
        localStorage.setItem("user", JSON.stringify(user));
        const { displayName, email, photoURL, uid } =
          result.user.providerData[0];
        console.log(displayName, email, photoURL, uid);
        console.log(user);
        const docRef = doc(db, "Users", `${uid}`);
        const docSnap = await getDoc(docRef);

        if (user !== null) {
          if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            navigate("/");
          } else {
            console.log("No such document! so Creating");
            const setUser = await setDoc(doc(db, "Users", `${uid}`), {
              name: displayName,
              email: email,
              image: photoURL,
              _id: uid,
              createdAt: serverTimestamp(),
            });
            console.log("user was created");
            navigate("/");
          }
        }
      })
      .catch((error) => {
        console.log("error:", error);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <div className="flex flex-col justify-start items-center h-screen">
      <div className="relative w-full h-full">
        <video
          src={share}
          type="video"
          loop
          muted
          controls={false}
          autoPlay
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute top-0 bottom-0 right-0 left-0 bg-black/70  w-full h-full flex flex-col items-center justify-center">
        <div className="p-5 justify-center">
          <img src={logo} className="w-[130px]" alt="logo" />
        </div>
        <div claclassName="mt-20">
          {" "}
          <GoogleButton onClick={googleSignIn} />
        </div>
      </div>
    </div>
  );
};

export default Login;
