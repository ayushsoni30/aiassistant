
//checking weather user is authorize or not
import jwt from "jsonwebtoken"
const isAuth = async (req,res,next)=>{
    try {
       const token=req.cookies.token
        if(!token){
            return res.status(400).json({message:"token not found"})
        }

        const verifyToken=await jwt.verify(token,process.env.JWT_TOKEN)
        req.userId=verifyToken.userId

        next()

    } catch (error) {
        console.log("ERROR of isAuth",error)
    }
}
export default isAuth