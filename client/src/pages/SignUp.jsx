import React from "react";
import bg from "../assets/image.png";

function SignUp() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{
          backgroundImage: `url(${bg})`,
          filter: "blur(5px) brightness(0.8) saturate(1.9)",
        }}
      />
    </div>
  );
}

export default SignUp;
