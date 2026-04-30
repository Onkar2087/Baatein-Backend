// 24
// 25 - message.controllers.js
// 23 - message.model.js

import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    messages:[{
        // Message Model - reference
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    }
    ]
}, {timestamps:true})
conversationSchema.index({ participants: 1 })

const Conversation = mongoose.model("Conversation", conversationSchema)

export default Conversation