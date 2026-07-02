import express from "express"
import { getCurrentUser } from "../controllers/user.controller.js"
import  isAuth from "../middleware/isauth.js"

// taking only router function from express
const userRouter=express.Router() 

userRouter.get("/Current",isAuth ,getCurrentUser)


export default userRouter