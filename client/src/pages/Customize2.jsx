import React, { useState, useContext } from "react";
import { userDataContext } from "../context/UserContext";

const Customize2 = () => {
  const { userData } = useContext(userDataContext);
  const [AssistantName, setAssistantName] = useState("");
  return (
    <div 
    className="w-full min-h-screen bg-linear-to-t from-black to-blue-700 flex flex-col justify-center items-center p-5">
        
            
       <div className="w-full  min-h-screen flex flex-col justify-start items-center p-5">
  <h1 className="text-white text-4xl md:text-3xl mt-10 mb-10 text-center">
    Enter Your Assistant Name
  </h1>
   <input
  className="max-w-100 w-full h-10 border-2  text-white border-white placeholder:text-white px-5 py-7 rounded-4xl font-sans text-xl"
  type="text"
  placeholder="eg. Comatozze"
required />
<button className="mt-5 min-w-70 h-15 bg-white rounded-4xl text-3xl font-bold text-blue-500 border-2 border-blue-500">
  Start
</button>

 
</div>
    </div>
  );
};

export default Customize2;
