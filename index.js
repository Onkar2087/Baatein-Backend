// 1
// 2 - .env
import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/message.routes.js"
import { app, server } from "./socket/socket.js"
import rateLimit from "express-rate-limit"
// You're telling the dotenv library to load your .env file and make the variables inside it available to your app using process.env.
dotenv.config()
app.set("trust proxy", 1)
const port = process.env.PORT || 5000


const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 requests
    message: {
        message: "Too many requests, please try again later"
    }
})

// Can acess all the express properties, through app now
// Importing through socket.js in the project - later
// const app = express()

// Add this before any routes, Have to use this middleware, everytime need to extract data from body [request => req.body ]
app.use(express.json()) // <-- Missing! Required to parse JSON POST bodies

app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

// The option credentials: true means the server allows sending cookies or authentication information along with those requests. This is important if your app needs to keep users logged in across sites or requests.
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

// Will come in front of url of authentication routes 
// [middleware] - with the use of app.use()
app.use("/api/auth", authLimiter, authRouter)
app.use("/api/user", userRouter)
app.use("/api/message", messageRouter)


// Creating server
app.get("/", (req, res) => {
    res.send("hello")
})

// Listening server
const startServer = async () => {
    try {
        await connectDb() // ✅ wait for DB connection
        server.listen(port, () => {
            console.log(`✅ Server listening at port ${port}`);
        })
    } catch (error) {
        console.error("❌ Failed to connect to DB:", error);
        process.exit(1)
    }
}

startServer()
