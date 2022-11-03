import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../Firebase/config";
import { categories } from "../Utils/data";
// import { fetchUser } from "../Utils/fetchUser";
import Spinner from "./Spinner";
import { useForm } from "react-hook-form";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { uuidv4 } from "@firebase/util";

const CreatePin = ({ user }) => {
  console.log(user);
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [text, setText] = useState("Upload");

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const navigate = useNavigate();
  const errorRef = useRef(null);
  // console.log(imagePreview);
  console.log(imageFile);
  console.log(imageUrl);

  const handleImageAsFile = (e) => {
    setLoading(true);
    const image = e.target.files[0];
    setImageFile((imageFile) => image);
    // changeHandler();
  };

  useEffect(() => {
    let fileReader,
      isCancel = false;
    if (imageFile) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setImagePreview(result);
        }
      };
      fileReader.readAsDataURL(imageFile);
    }
    setLoading(false);
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [imageFile]);

  const uploadPin = async (downloadURL) => {
    console.log(`next to Uploading Pin now `);

    if (title && about && destination && imageFile && category) {
      setText("Uploading...");
      const docRef = await addDoc(collection(db, "Pins"), {
        title,
        destination,
        about,
        image: downloadURL,
        userId: user._id,
        postedBy: [{ _id: user._id, image: user.image, name: user.name }],
        category,
        createdAt: serverTimestamp(),
      });
      console.log(` Pin has been uploaded image `);
      setText("Upload");
      navigate("/");
    } else {
      setText("Upload");
      setFields(true);
      setTimeout(() => setFields(false), 2000);
      errorRef.current.scrollIntoView({ behavior: "smooth" });
      console.log(` Pin Failed to be uploaded  `);
    }
  };

  const uploadImage = (e) => {
    // Upload file and metadata to the object 'images/mountains.jpg'
    setText("Uploading...");
    console.log(` Uploading image `);
    const storageRef = ref(storage, `images/${imageFile.name + uuidv4()} `);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImageUrl({ img: downloadURL });
          uploadPin(downloadURL);
        });
      }
    );
    console.log(`image has been uploaded `);
  };

  // file && UploadFile()

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p
          className="text-red-500 mb-5 text-xl transiton-all duration-150 ease-in-out"
          ref={errorRef}
        >
          {" "}
          FIll in all Fields
        </p>
      )}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full h-full flex-col">
          <div className="flex justify-center items-centerflex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && <Spinner />}
            {!imageFile ? (
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className=" text-xl">Click to Upload</p>
                  </div>
                  <p className="mt-32 text-gray-400">
                    {" "}
                    Recommendation: use high-quality JPG,SVG, PNG, GIF or TIFF
                    less than 20mb
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  accept=".png, .jpg, .jpeg"
                  onChange={handleImageAsFile}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative h-full">
                {imagePreview ? (
                  <div>
                    {" "}
                    <img src={imagePreview} className="h-[50%] w-[50%]" />{" "}
                    <p>{imageFile.name}</p>
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    imagePreview(null);
                  }}
                  className="absolute bottom-3 right-3 p-3 rounded-full text-xl cursor-pointer bg-white outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        <div></div>
        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your Title"
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2 "
          />
          {user && (
            <div className="flex gap-2 my-2 items-center bg-white ounded-lg">
              <img
                src={user.image}
                className="w-10 h-10 rounded-full object-cover"
                alt="user-profile"
              />
              <p className="font-bold "> {user.userName}</p>
            </div>
          )}
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="What is your pin about?"
            className="outline-none text-base sm:text-xl border-b-2 border-gray-200 p-2 "
          />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add a destination link"
            className="outline-none text-base sm:text-xl border-b-2 border-gray-200 p-2 "
          />
          <div className="flex flex-col ">
            <p className="mb-2 font-semibold text-lg sm:text-xl ">
              Choose Pin category
            </p>
            <select
              onChange={(e) => setCategory(e.target.value)}
              className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
            >
              <option value="other" className="bg-white ">
                select category
              </option>
              {categories.map((category) => {
                return (
                  <option
                    className="text-base border-0 outline-none capitalize bg-white text-black "
                    key={category.name}
                  >
                    {category.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex justify-end items-end mt-5">
            {" "}
            <button
              type="button"
              onClick={uploadImage}
              className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              // disabled={progress !== null && progress < 100}
            >
              {text}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
