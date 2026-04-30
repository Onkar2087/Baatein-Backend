// 6
// 7 - token.js
// 5 - auth.controllers.js

// File to handle all the routes of authentications

import express from "express";
import { logIn, logOut, signUp } from "../controllers/auth.controller.js";

// Taking only Router() function of express
const authRouter = express.Router()

authRouter.post("/signup", signUp)
authRouter.post("/login", logIn)
authRouter.get("/logout", logOut)


export default authRouter