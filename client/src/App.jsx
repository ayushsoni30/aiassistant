import React from 'react'
import { Route,Routes } from 'react-router-dom'
import SignUp from './pages/SignUp.jsx'
import Signin from './pages/Signin.jsx'
const App = () => {

  return (

    <Routes>
    <Route path="/signup" element={<SignUp/>}/>
    <Route path="/signin" element={<Signin/>}/>
   </Routes>
  )}
export default App


