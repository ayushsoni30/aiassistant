import React from 'react'
import { Route,Routes } from 'react-router-dom'
import SignUp from './pages/SignUp.jsx'
import Signin from './pages/Signin.jsx'
import Customize from './pages/customize.jsx'
import Home from './pages/Home.jsx'
import { useContext } from 'react'
import { userDataContext } from './context/UserContext.jsx'
import { Navigate } from 'react-router-dom'
import Customize2 from './pages/Customize2.jsx'

const App = () => {
  const { userData, loading } = useContext(userDataContext);

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xl font-semibold tracking-wider text-blue-400">Initializing Virtual Assistant...</p>
      </div>
    );
  }

  const isConfigured = Boolean(userData?.assistantImage && userData?.assistantName);

  return (
    <Routes>
      <Route
        path="/"
        element={
          !userData ? (
            <Navigate to="/signin" />
          ) : isConfigured ? (
            <Home />
          ) : (
            <Navigate to="/customize" />
          )
        }
      />
      <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
      <Route path="/signin" element={!userData ? <Signin /> : <Navigate to="/" />} />
      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to="/signin" />}
      />
      <Route
        path="/customize2"
        element={userData ? <Customize2 /> : <Navigate to="/signin" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
export default App;


