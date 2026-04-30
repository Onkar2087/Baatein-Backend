// 25
// 26 - message.routes.js
// 24 - conversation.model.js

import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId } from "../socket/socket.js";
import {io} from "../socket/socket.js"

export const sendMessage = async (req, res) => {
    try {
        let sender = req.userId;
        let {receiver} = req.params;
        const participants = [sender, receiver].sort()
        let {message} = req.body;
        let image;

        if (!message && !req.file) {
            return res.status(400).json({
            message: "Message or image is required"
            })
        }


        if(req.file){
            image = await uploadOnCloudinary(req.file.path)
        }
        // Checking if the conversation is new or old
        let conversation = await Conversation.findOne({
            participants: participants
        })

        let newMessage = await Message.create({
            sender, receiver, message, image
        })

        if(!conversation){
            conversation = await Conversation.create({
                participants: participants,
                messages: [newMessage._id]
            })
        }
        else{
            conversation.messages.push(newMessage._id)
            await conversation.save()
        }
        // message will be send instantly, [dont need to refresh]
        // io.emit - to all users
        // io.to - sending particularly to someone
        const receiverSocketId = getReceiverSocketId(receiver)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }
        
        return res.status(201).json(newMessage)
    } catch (error) {
        return res.status(500).json({message:`Send Message Error ${error}`})
    }
}

// To get all the messages of Conversation
export const getMessages = async (req, res) => {
    try {
        let sender = req.userId;
        let {receiver} = req.params;
        let { cursor } = req.query;
        // populate means
        const participants = [sender, receiver].sort()
        let conversation = await Conversation.findOne({
            participants: participants
        }).populate({
            path: "messages",
    match: cursor
        ? { _id: { $lt: cursor } }
        : {},
    options: {
        limit: 20,
        sort: { createdAt: -1 } }
        });

        if(!conversation){
            return res.status(400).json({message:"Conversation not found"});
        }
        return res.status(200).json(conversation?.messages)
        
    } catch (error) {
        return res.status(500).json({message:`Get Message Error ${error}`})
    }
}