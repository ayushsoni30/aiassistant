import React, { useRef, useState } from "react";
import Card from "../cards/Card";
import { MdDoNotStep, MdUpload } from "react-icons/md";
import image3 from "../assets/image3.avif";
import image5 from "../assets/image5.jpg";

const Customize = () => {
  const [frontendImage, setfrontendImage] = useState(null);
  const [backendImage, setbackendImage] = useState(null);
  const inputImage = useRef();

  const handleImage = (e) => {
    console.log(e);
    const file = e.target.files[0];
    setbackendImage(file);
    setfrontendImage(URL.createObjectURL(file));
  };
  return (
    <div className="w-full min-h-screen bg-linear-to-t from-black to-blue-600 flex flex-col justify-center items-center p-5">
      {/* Heading */}
      <h1 className="text-blue-300 text-4xl md:text-5xl font-bold mb-10 text-center">
        Select your Avatar
      </h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-5">
        <Card image={image5} />

        <Card image={image3} />

        <div
          className="h-50 w-50 md:h-70 md:w-70 bg-black rounded-lg border-2 border-blue-600 flex flex-col justify-center items-center gap-4 cursor-pointer hover:border-white hover:shadow-2xl hover:shadow-blue-400 transition-all relative overflow-hidden"
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
      <button className=" mt-30 min-w-80 h-15 rounded-4xl text-3xl font-bold text-blue-300 border-2 border-blue-500 ">
        Next
      </button>
    </div>
  );
};

export default Customize;
