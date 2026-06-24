import mongoose from "mongoose"


const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("database connected successfully")
    } catch(error) {
        console.log("DB Error:", error.message) 
    }
}
export default connectdb


