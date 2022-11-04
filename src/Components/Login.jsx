import React, { useRef } from "react";

import GoogleButton from "react-google-button";
import share from "../assets/share.mp4";
import { ReactComponent as FireLogo } from "../assets/colored-Firesocial.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import { setUser } from "../Redux/Features/UserSlice";
import { toast } from "react-toastify";

const Login = ({}) => {
  const notify = () => {
    toast.success("Logged succesfully !", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    // signInWithRedirect(auth, provider);
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        notify();
        const user = result.user.providerData[0];
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
            dispatch(setUser(user));
          } else {
            console.log("No such document! so Creating");
            await setDoc(doc(db, "Users", `${uid}`), {
              name: displayName,
              email: email,
              image: photoURL,
              _id: uid,
              createdAt: serverTimestamp(),
            });
            console.log("user was created");
            navigate("/");
            // dispatch(setUser(user));
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
  const ref = useRef(null);

  return (
    <div className="flex flex-col justify-start items-center h-full">
      <div className="relative w-full h-full">
        <video
          ref={ref}
          src={share}
          type="video"
          loop
          muted={true}
          aria-controls="false"
          controls={false}
          autoPlay
          playsInline
          className="w-full h-screen object-cover"
        />
      </div>
      <div className="absolute top-0 bottom-0 right-0 left-0 bg-black/70  w-full h-screen flex flex-col items-center justify-center">
        <div className="p-5 justify-center">
          <FireLogo className="h-20" />
        </div>
        <div className="mt-20">
          {" "}
          <GoogleButton onClick={googleSignIn} />
        </div>
      </div>
    </div>
  );
};

export default Login;
