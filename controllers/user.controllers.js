// 11
// 12 - user.routes.js
// 10 - isAuth.js

// User controllers - user kaise fetch kare, get karein, search karein etc...

import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

// Controller to fetch current user details - id se find karlenge
// id kaha se milegi? - User ka route bana lete h [user.routes.js]
export const getCurrentUser = async (req, res) => {
    try {
        // coming from auth middleware
        const userId = req.userId; 
        const user = await User.findById(userId).select("-password");

        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `Current user error: ${error.message}` });
    }
};

// Controller to edit profile - Image+Name
// Setting up multer[middleware] + cloudinary

// 1) multer - Jab image frontend se aayegi toh usse 1 public folder mei store karayega [jo folder hum choose karenge] - fir us folder ka path cloudinary ko dedenge

// 2) cloudinary - online platform jaha images ko upload kar sakte hai, fir vo humei 1 url dega jo hum apne db mei store karenge [cloudinary.js]
export const editprofile = async (req, res) => {
    try {
        let {name} = req.body;
        let image;
        // req.file mei image milegi, tabhi upload kar payenge 
        if(req.file){
            image = await uploadOnCloudinary(req.file.path)
        }

        // new:true - sends the latest data, otherwise needs to refresh to get the lastest dp
        let user = await User.findByIdAndUpdate(req.userId,{
            name,
            image
        }, {new:true})

        if(!user){
            return res.status(400).json({message:"User not found"})
        }

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `Profile error: ${error.message}` });
    }
} 

// Controller to find other users
export const getOtherUsers = async (req, res) => {
    try {
        // Getting all users, except our own as to communicate using mdb operators [our id -> req.userId]
        let users = await User.find({
            _id : {$ne:req.userId}
        }).select("-password")
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({message:`get other user ${error}`})
    }
}

export const search = async (req, res)=>{
    try {
        // from frontend
        let {query} = req.query
        if(!query){
            return res.status(400).json({message:"Query is required"})
        }
        let users = await User.find({
            $or:[
                // Search for both uppercase + lowercase 
                {name:{$regex:query, $options:"i"}},
                {userName:{$regex:query, $options:"i"}},
            ]
        }).select("-password")
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({message:`Search Error ${error}`})
    }
}