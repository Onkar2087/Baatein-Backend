// 4
// 5 - auth.controller.js 
// 3 - db.js
// User Schema - properties/qualities which the user will have
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    // image tpye - string because we will store cloudinary link
    image:{
        type:String,
        default:""
    }
}, {timestamps:true})
// Timestamps - gives [createdAt, updatedAt]
userSchema.index({ email: 1 })
userSchema.index({ userName: 1 })
// Creating model based on Schema
const User = mongoose.model("User", userSchema);

export default User;