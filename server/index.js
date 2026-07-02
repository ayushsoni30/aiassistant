import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectdb from "./config/dbconnection.js";
import authRouter from "./routes/auth_routes.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import userRouter from "./routes/user.routes.js";



const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
const port=process.env.PORT || 5000
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)


app.listen(port,()=>{
    connectdb()
    console.log("server started")
    })  