import express from "express"
import dotenv from "dotenv"
import connectdb from "./config/dbconnection.js";
import authRouter from "./routes/auth_routes.js";
import cookieParser from "cookie-parser";
dotenv.config()


const app = express();
const port=process.env.PORT || 5000
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)


app.listen(port,()=>{
    connectdb()
    console.log("server started")
    })  