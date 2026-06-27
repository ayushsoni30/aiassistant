import React from "react";
import bg from "../assets/image.png";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
function Signin() {
  

  const [showPassword, setShowPassword] = useState(false);
  // help in to navigate already signin to the signup page
  const navigate = useNavigate();
  

const [formData, setFormData] = useState({
  password: "",
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};
  
  return (
    
    <div className="relative w-full h-screen overflow-hidden flex justify-center items-center ">
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 "
        style={{
          backgroundImage: `url(${bg})`,
          filter: "blur(5px) brightness(0.8) saturate(1.9)",
        }}
      />
      <form className="w-[80%] h-150 max-w-125 bg-[#0000005e] shadow-lg shadow-blue-500 rounded-2xl backdrop-blur-md flex flex-col items-center gap-5 justify-center px-8 relative z-10 ">
       
        <h1 className="text-white text-[30px] font-bold mb-8">
          Register To
          <span className="text-green-500 font-bold"> Virtural Assistant</span>
        </h1>
        <input
          className="w-full h-10 border-2 bg-transparent text-white border-green-500 outline-none placeholder:text-gray-400 px-5 py-5 rounded-4xl"
          type="text"
          placeholder="Enter Your Name.."
        />
        <input
          className="w-full h-10 border-2 bg-transparent text-white border-green-500 outline-none placeholder:text-gray-400 px-5 py-5 rounded-4xl"
          type="email"
          placeholder="Enter Email"
        />
        <div className="relative w-full ">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Enter your password"
    value={formData.password}
    onChange={handleChange}
    required
    className="w-full h-10 border-2 rounded-4xl border border-green-500 bg-transparent px-4 py-3 pr-12 text-white placeholder-gray-400 outline-none "
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
  >
    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
  </button>
</div>
        <button className=" mt-5 min-w-80 h-15  bg-white rounded-4xl text-3xl font-bold text-green-500 border-2 border-green-500">Sign Up</button>
        
      </form>
    </div>
  );
}

export default Signin;
