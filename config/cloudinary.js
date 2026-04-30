// 18
// 19 - multer.js
// 17 - Profile.jsx

// Google - Cloudinary [code]

// File Path ko cloudinary par upload karana hai fir vo url dega jo return karana hai

import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({
        cloud_name:process.env.CLOUD_NAME,
        api_key:process.env.API_KEY,
        api_secret:process.env.API_SECRET
    })
const uploadOnCloudinary = async (filePath) =>{
    if (!filePath) return null;
    try {
        // uploadResult - object
        const uploadResult = await cloudinary.uploader.upload(filePath)

        // Now the image is upload on cloudinary, now we will delete it from the public folder created using multer - fs
        // unlinkSync - jaha-jaha vo path hoga vo path delete kar dega

        await fs.promises.unlink(filePath);

        return uploadResult.secure_url
    } catch (error) {
        if (filePath) await fs.promises.unlink(filePath).catch(()=>{});
        throw new Error("Cloudinary upload failed");
    }
}

export default uploadOnCloudinary