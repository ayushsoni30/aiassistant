import express from "express"
import { Login, logOut, signUp } from "../controllers/authcontroll.js"

// taking only router function from express
const authRouter=express.Router() 
authRouter.post("/signup",signUp)
authRouter.post("/signin",Login)
authRouter.post("/logout",logOut)


export default authRouter 