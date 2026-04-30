// 5
// 6 - auth.routes.js
// 4 - user.model.js

// File related to all the authentication controllers/functions
// 1) SignUp Controller
// 2) LogIn Controller
// 3) LogOut Controller

import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signUp = async (req, res)=>{
    try {
        // i) Fetching necessary data   from frontend
        const {userName, email, password} = req.body
        if (!email || !password || !userName) {
    return res.status(400).json({ message: "All fields required" })
}
        
        const checkUserByUserName = await User.findOne({userName})
        if(checkUserByUserName){
            return res.status(400).json({message: "Username already exists!"})
        }

        const checkUserByEmail = await User.findOne({email})
        if(checkUserByEmail){
            return res.status(400).json({message: "Email already exists!"})
        }

        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const numberRegex = /[0-9]/;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long!" });
        }

        if (!uppercaseRegex.test(password)) {
            return res.status(400).json({ message: "Password must include at least one uppercase letter!" });
        }

        if (!lowercaseRegex.test(password)) {
            return res.status(400).json({ message: "Password must include at least one lowercase letter!" });
        }

        if (!numberRegex.test(password)) {
            return res.status(400).json({ message: "Password must include at least one number!" });
        }

        if (!specialCharRegex.test(password)) {
            return res.status(400).json({ message: "Password must include at least one special character!" });
        }


        // ii) Hashing using bcryptjs + salt = number
        const hasshedPassword = await bcrypt.hash(password, 10)

        // iii) Create user
        const user = await User.create({
            userName,
            email,
            password:hasshedPassword
        })

        // MongoDb stores a user id in [user._id]
        // iv) Generating token
        const token =  genToken(user._id)

        // "token" - key and storing token against that key
        // cookie name = "token"
        // Storing a token in cookie in browser
        // v) parse the token in cookies
        res.cookie("token", token, {
            // This means the cookie can only be used by the web server and cannot be accessed by JavaScript running on the webpage. This helps protect the cookie from being stolen by malicious scripts.
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            // This means the cookie will only be sent with requests that come from the same website. It makes the cookie safer by preventing other websites from using it
            secure: process.env.NODE_ENV === "production",
sameSite: "None",
            // This means the cookie will be sent over both HTTP and HTTPS connections. If this were true, it would only be sent over secure HTTPS connections. Usually, for security, you want this to be true on a live (production) website.
        })

        // 201 - sucessful signup
        const userWithoutPassword = user.toObject()
        delete userWithoutPassword.password
        return res.status(201).json({
    ...userWithoutPassword,
    token   
})
    } catch (error) {
        return res.status(500).json({message:`Signup error ${error}`})
    }
}

export const logIn = async (req, res)=>{
    try {
        // i) input details
        const {email, password} = req.body
        if (!email || !password) {
    return res.status(400).json({ message: "All fields required" })
}

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "User doesn't exists!"})
        }

        // ii) Compare passwords using Bcryptjs
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:"Incorrect Password"})
        }

        // MongoDb stores a user id in [user._id]
        // iii) Generating token using JWT
        const token = await genToken(user._id)

        // "token" - key
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None"
        })


        const userWithoutPassword = user.toObject()
        delete userWithoutPassword.password
        return res.status(200).json({
    ...userWithoutPassword,
    token   // 👈 ADD THIS
})

    } catch (error) {
        return res.status(500).json({message:`Login error ${error}`})
    }
}

export const logOut = async (req, res)=>{
    try {
        res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None"
})
        return res.status(200).json({message:"Log out sucessfully"});
    } catch (error) {
        return res.status(500).json({message:`Logout error ${error}`})
    }
}