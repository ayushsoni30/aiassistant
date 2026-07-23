import React from "react";

const Customize2 = () => {
  return (
    <div 
    className="w-full min-h-screen bg-linear-to-t from-black to-blue-700 flex flex-col justify-center items-center p-5">
        
            
       <div className="w-full  min-h-screen flex flex-col justify-start items-center p-5">
  <h1 className="text-blue-300 text-4xl md:text-5xl font-bold mt-10 mb-10 text-center">
    Enter Your Assistant Name
  </h1>
   <input
  className="max-w-100 w-full h-10 border-3 bg-transparent text-black border-black placeholder:text-black px-5 py-5 rounded-4xl font-sans font-bold font-2xl"
  type="text"
  placeholder="Enter Name"
required />
 
</div>

    </div>
  );
};

export default Customize2;
