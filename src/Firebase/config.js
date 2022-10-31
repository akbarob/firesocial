// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdoNXRKokn9Y-SbaE9a0Fv0xCAff6Dj-U",
  authDomain: "firesocial-c821c.firebaseapp.com",
  projectId: "firesocial-c821c",
  storageBucket: "firesocial-c821c.appspot.com",
  messagingSenderId: "648575819850",
  appId: "1:648575819850:web:b35f4ffca8b46dfa5786b3",
  measurementId: "G-3YJ90SF0RP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
