// 3
// 4 - user.model.js
// 2 - .env
// Code to connect db using MONGODB_URL

import mongoose from "mongoose";

// Function to connect db, and async - as we don't know how much time to connect to the db
const connectDb = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("db connected");
    } catch (error) {
        console.log("db error");
        process.exit(1);
    }
}

// Call this functionin index.js, when server starts listening
export default connectDb