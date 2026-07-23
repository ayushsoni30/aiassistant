import React, { useContext } from "react";
import bg from "../assets/image.png";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/userContext";
import axios from "axios"



function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  // help in to navigate already signin to the signup page
  const navigate = useNavigate();
const [email, setemail] = useState("")
const [pswrd, setpswrd] = useState("")
const {serverUrl} =useContext(userDataContext)
const [err, seterr] = useState("")
const [loading, setloading] = useState(false)
const handleSingin = async(e)=>{
  e.preventDefault()
  seterr("")
  setloading(true)
  try {
    let result = await axios.post(`${serverUrl}/api/auth/signin`,{ email ,password: pswrd},{withCredentials:true})
    console.log(result)
    setloading(false)
    navigate("/")
  } catch (error) {
    setloading(false)
    console.log("Error:",error)
    seterr(error.response.data.message)
    
  }
  
} 
  return (
    
    <div className="relative w-full h-screen overflow-hidden flex justify-center items-center ">
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 "
        style={{
          backgroundImage: `url(${bg})`,
          filter: "blur(7px) brightness(0.5) saturate(0.9)",
        }}
      />
      <form className="w-[80%] h-150 max-w-125 bg-[#0000005e] shadow-lg shadow-black rounded-2xl backdrop-blur-lg flex flex-col items-center gap-5 justify-center px-8 relative z-10 " onSubmit={handleSingin}>
       
        <h1 className="text-white text-[30px] font-bold mb-8">
          Signin To
          <span className="text-blue-500 font-bold"> Virtural Assistant</span>
        </h1>
        <input
          className="w-full h-10 border-2 bg-transparent text-white border-blue-500 outline-none placeholder:text-gray-400 px-5 py-5 rounded-4xl"
          type="email"
          placeholder="Enter Email"
        required onChange={(e)=>setemail(e.target.value)}value={email}/>
        <div className="relative w-full ">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Enter your password"
    className="w-full h-10 border-2 rounded-4xl border-blue-500 bg-transparent px-4 py-3 pr-12 text-white placeholder-gray-400 outline-none "
  required onChange={(e)=>setpswrd(e.target.value)} value={pswrd}/>
 {err.length>0  && <p className="text-red-600">
*{err}
  </p>}
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
  >
    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
  </button>
</div>
        <button className=" mt-5 min-w-80 h-15  bg-white rounded-4xl text-3xl font-bold text-blue-500 border-2 border-blue-500" disabled={loading}>{loading?"loading..":"Sign In"}</button>
        
        <p className="text-white text-xl mt-10 cursor-pointer" onClick={()=>navigate("/signup")}>Want To Create A New Account ?<span className="text-blue-500"> Sign Up</span></p>
      </form>
    </div>

  );
}

export default Signin;
