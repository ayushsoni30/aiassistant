import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
const uploadOnCloudinary = async () => {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  try {
    // Upload an image
    const uploadResult = await cloudinary.uploader
    .upload(filePath) //image uploadeed 
    fs.unlinkSync(filePath)// image deleted
    return uploadResult.secure_url
    
  }
  catch (error) {
     fs.unlinkSync(filePath)
     return res.status(500).json({message:"cloudinary error"})
  }
}
export default uploadOnCloudinary
