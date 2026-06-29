import User from "../models/user.model.js"
export const getCurrentUser = async(req ,res)=>{

    try {
        const userId=req.userId
        const user = await User.findById(userId).select("-password")
        if(!user){
            res.status(400).json({message :"user not found"})
        }
         res.status(200).json(user)
    } catch (error) {
        res.status(400).json({message :" getCurrentUSer Error"})
    }}
