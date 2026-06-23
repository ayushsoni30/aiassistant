import express from "express"
import dotenv from "dotenv"
import connectdb from "./config/dbconnection.js";


dotenv.config()
const app = express();
const port=process.env.PORT || 5000

app.get("/", (req,res)=>{
    res.send("hello ")
})

connectdb()
app.listen(port,()=>{
    console.log("server started")
})