// 10
// 11 - user.controllers.js
// 9 - Login.jsx

// Middleware for authorization - is user authenticated or not? - If yes show them their data
// We have generated token and inserted in the cookies - Will take id from cookies[token] and show it

// Cookies se token ko uthana hai
// Token mei se user ki id ko dhoondhna hai
// Vo id ko userId mei daalna hai

import jwt from "jsonwebtoken"

// next - middleware has this function ["I'm done here, move on to the next handler."]
// next -  If permits, will got to next function/middleware and if rejects here will return from here
const isAuth = async (req, res, next) =>{
    let token = req.cookies.token
    if(!token){
        return res.status(400).json({message:"Token is not found"});
    }

    try {
        let verifyToken = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = verifyToken.userId
        next()
    } catch (err) {
        return res.status(403).json({ message: "Invalid token"});
    }
}

// Now when we use this isAuth anywhere, we will get userId in req.userId
export default isAuth