import express from "express"
import { getCurrentUser } from "../controllers/user.controller.js"


// taking only router function from express
const userRouter=express.Router() 

authRouter.post("/Current",getCurrentUser)


export default userRouter