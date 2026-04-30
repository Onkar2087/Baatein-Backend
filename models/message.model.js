// 23
// 24 - conversation.model.js
// 22 - getOtherUsers.jsx

// Creating a Message model for a chat application using Mongoose, which is a way to talk to a MongoDB database in JavaScript.

import mongoose from "mongoose"

// What a message in our chat app should look like
const messageSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        default:""
    },
    image:{
        type:String,
        default:""
    }
}, {timestamps:true})

const Message = mongoose.model("Message", messageSchema)
export default Message