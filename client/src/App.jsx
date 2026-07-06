import React from 'react'
import { Route,Routes } from 'react-router-dom'
import SignUp from './pages/SignUp.jsx'
import Signin from './pages/Signin.jsx'
import Customize from './pages/customize.jsx'
import Home from './pages/Home.jsx'
import { useContext } from 'react'
import { userDataContext } from './context/UserContext.jsx'
import { Navigate } from 'react-router-dom'
const App = () => {
const {userData,setUserData} = useContext(userDataContext)
  return (

    <Routes>
    <Route path="/" element={(userData?.assistantImage && userData.assistantName)? <Home /> : <Navigate to ={"/customize"} />} />
    <Route path="/signup" element={!userData ? <SignUp/> : <Navigate to="/"/> }/>
    <Route path="/signin" element={!userData ? <Signin/> : <Navigate to="/"/> }/>
    <Route path="/customize" element={userData ? <Customize/> : <Navigate to="/signin"/> }/>                                    
    
   </Routes>
  )}
export default App


