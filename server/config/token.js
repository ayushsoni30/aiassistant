import jwt from "jsonwebtoken"
const genToken = async (UserId)=>{
    try {
        const token = await jwt.sign({userID},process.env.JWT_SECRET, {expiresIn:"10d"})
        return token
    } catch (error) {
        console.log("Error:-", error)
        
    }
}
export default genToken