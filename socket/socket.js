// 31
// 30 - message.Slice.js 

// Socket.io - real time communication [no lags], server baar-baar dekhta rahega ki koi ['NAYA'] message hai humare liye
// Server request karne se pehle hi data ko update kar dega - [matlab] - server khud se hi message bhej dega, tumhe request nahi karni padegi baar-baar[reload nahi karna padega]
// Server and Client dono ke liye socket.io ke alag package hai [Backend Frontend handshake]
// Backend [socket.io] - Frontend - [socket.io-client]
// Http se server banayenge, then usse socket-io mei convert karenge[Backsocket], then jo humara server index.js mei bana hua hai usse replace kar denge
import http from "http"
import express from "express"
import { Server } from "socket.io"
import jwt from "jsonwebtoken"

let app = express()

const server = http.createServer(app)
// io ke through events emit karenge
const io = new Server(server,{
    cors:{
        origin:process.env.CLIENT_URL
    }
})

const userSocketMap = {};

// Function jismei id bheje aur uski sockedid mil jaaye humein
export const getReceiverSocketId = (receiver)=>{
    return userSocketMap[receiver]
}

// io ke saath connect karte h frontend ke saath
// "connection" event - used for multiplexing [fired when any user logIn through frontend - and this will tell about its socketId (that a user is connected)]
// io.on - everytime you want to connect backend with frontend
// in socket-io, user ko socket bolte hai, logIn karte hi, ye usse 1 socket-id issue kar dega

    // emit - backend se frontend ko bhejna h real time mei
    // "getOnlineUsers" - [event ka naam]
    // 2nd paranter - message/data jo bhejna h
    // can access this event in frontend with same name
    // In frontend - on [receive]
    // In backend - emit [send]
    
    io.on("connection", (socket) => {
    let userId;

    try {
        // 👇 get token from frontend
        const token = socket.handshake.auth.token;

        if (!token) {
            return socket.disconnect();
        }

        // 👇 verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        userId = decoded.userId;

        // 👇 map user to socket
        userSocketMap[userId] = socket.id;

        io.emit("getOnlineUsers", Object.keys(userSocketMap));

    } catch (error) {
        console.log("Socket auth error:", error.message);
        return socket.disconnect();
    }

    // disconnect
    socket.on("disconnect", () => {
        if (userId) {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });

    // logout
    socket.on("logout", () => {
        if (userId) {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
});

export {app, server, io}