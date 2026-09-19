import React, { useContext, useRef } from "react";
import Card from "../cards/Card";
import { MdUpload } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import image3 from "../assets/image3.avif";
import image5 from "../assets/image5.jpg";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Customize = () => {
  const {
    userData,
    frontendImage,
    setfrontendImage,
    setbackendImage,
    selectedImage,
    setselectedImage,
  } = useContext(userDataContext);
  const navigate = useNavigate();

  const inputImage = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setselectedImage(null);
    setbackendImage(file);
    setfrontendImage(URL.createObjectURL(file));
  };

  const hasChoice = Boolean(frontendImage || selectedImage);
  const isConfigured = Boolean(userData?.assistantImage && userData?.assistantName);

  return (
    <div className="w-full min-h-screen bg-linear-to-t from-black via-slate-950 to-blue-900 flex flex-col justify-center items-center p-5 relative">
      {isConfigured && (
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/20 transition-all cursor-pointer backdrop-blur-md"
        >
          <IoArrowBack size={18} /> Back to Assistant
        </button>
      )}

      <div className="text-center max-w-xl mb-10">
        <span className="text-blue-400 font-semibold tracking-widest text-sm uppercase">Step 1 of 2</span>
        <h1 className="text-white text-4xl md:text-5xl font-extrabold mt-2 tracking-tight">
          Select Your Avatar
        </h1>
        <p className="text-gray-300 mt-2 text-base md:text-lg">
          Choose a preset avatar or upload your custom virtual assistant portrait
        </p>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-6">
        <Card image={image5} />
        <Card image={image3} />

        <div
          className={`h-50 w-50 md:h-70 md:w-70 bg-black/70 rounded-2xl border-2 flex flex-col justify-center items-center gap-4 cursor-pointer transition-all duration-300 relative overflow-hidden backdrop-blur-md
            ${
              frontendImage
                ? "border-blue-400 shadow-2xl shadow-blue-500/50 scale-105"
                : "border-blue-600/70 hover:border-white hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-102"
            }`}
          onClick={() => inputImage.current.click()}
        >
          {!frontendImage && (
            <>
              <div className="p-4 bg-blue-600/20 rounded-full text-blue-400">
                <MdUpload className="h-8 w-8 md:h-10 md:w-10" />
              </div>
              <p className="text-white font-medium text-base md:text-lg">
                Upload Custom
              </p>
              <span className="text-xs text-gray-400">PNG, JPG, or WEBP</span>
            </>
          )}

          {frontendImage && (
            <img
              src={frontendImage}
              className="absolute inset-0 h-full w-full object-cover rounded-2xl"
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
        className={`mt-14 px-12 py-3.5 rounded-full text-2xl font-bold border-2 transition-all duration-300 cursor-pointer shadow-lg
          ${
            hasChoice
              ? "bg-blue-600 border-blue-400 text-white hover:bg-blue-500 hover:shadow-blue-500/50 hover:scale-105"
              : "bg-transparent text-gray-500 border-gray-700 cursor-not-allowed"
          }`}
        onClick={() => navigate("/customize2")}
      >
        Continue to Naming →
      </button>
    </div>
  );
};

export default Customize;