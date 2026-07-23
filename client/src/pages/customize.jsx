import React, { useContext, useRef } from "react";
import Card from "../cards/Card";
import { MdUpload } from "react-icons/md";
import image3 from "../assets/image3.avif";
import image5 from "../assets/image5.jpg";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Customize2 from "./Customize2";

const Customize = () => {
  const {
    frontendImage,
    setfrontendImage,
    setbackendImage,
    selectedImage,
    setselectedImage,
  } = useContext(userDataContext);
  const navigate=useNavigate()

  const inputImage = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Uploading an image clears any preset card selection.
    setselectedImage(null);
    setbackendImage(file);
    setfrontendImage(URL.createObjectURL(file));
  };

  const hasChoice = Boolean(frontendImage || selectedImage);

  return (
    <div className="w-full min-h-screen bg-linear-to-t from-black to-blue-700 flex flex-col justify-center items-center p-5">
      <h1 className="text-blue-300 text-4xl md:text-5xl font-bold mb-10 text-center">
        Select your Avatar
      </h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-5">
        <Card image={image5} />
        <Card image={image3} />

        <div
          className={`h-50 w-50 md:h-70 md:w-70 bg-black rounded-lg border-2 flex flex-col justify-center items-center gap-4 cursor-pointer transition-all relative overflow-hidden
            ${
              frontendImage
                ? "border-amber-300 shadow-2xl shadow-blue-400"
                : "border-blue-600 hover:border-white hover:shadow-2xl hover:shadow-blue-400"
            }`}
          onClick={() => inputImage.current.click()}
        >
          {!frontendImage && (
            <>
              <MdUpload className="text-white h-8 w-8 md:h-12 md:w-12" />
              <p className="text-white font-medium text-lg md:text-xl">
                Upload Image
              </p>
            </>
          )}

          {frontendImage && (
            <img
              src={frontendImage}
              className="absolute inset-0 h-full w-full object-cover rounded-lg"
              alt="uploaded avatar"
            />
          )}

          <input
            type="file"
            accept="image/*"
            ref={inputImage}
            hidden
            onChange={handleImage}
          />
        </div>
      </div>

      <button
        disabled={!hasChoice}
        className={`mt-30 min-w-80 h-15 cursor-pointer rounded-4xl text-3xl font-bold border-2 transition-all
          ${
            hasChoice
              ? "text-blue-300 border-blue-500 hover:bg-blue-500 hover:text-white"
              : "text-gray-500 border-gray-600 cursor-not-allowed"
          }`}
      onClick={() => navigate("/customize2")}>
        Next
      </button>
    </div>
  );
};

export default Customize;