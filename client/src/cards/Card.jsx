import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext";

const Card = ({ image }) => {
  const { selectedImage, setselectedImage, setfrontendImage, setbackendImage } =
    useContext(userDataContext);

  const isSelected = selectedImage === image;

  const handleClick = () => {
    // Selecting a preset card clears any uploaded image, so only
    // one selection source is active at a time.
    setfrontendImage(null);
    setbackendImage(null);
    setselectedImage(image);
  };

  return (
    <div
      className={`h-50 w-50 md:h-70 md:w-70 bg-black rounded-lg shadow-lg overflow-hidden border-2 cursor-pointer transition-all
        ${
          isSelected
            ? "border-amber-400 shadow-2xl shadow-blue-400"
            : "border-blue-600 hover:border-amber-100 hover:shadow-2xl hover:shadow-blue-400"
        }`}
      onClick={handleClick}
    >
      <img src={image} alt="Card" className="h-full w-full object-cover" />
    </div>
  );
};

export default Card;