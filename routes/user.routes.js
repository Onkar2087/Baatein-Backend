// 12
// 13 - store.js
// 11 - user.controllers.js

// File to handle all the routes of user

import express from "express";
import { editprofile, getCurrentUser, getOtherUsers, search } from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

const userRouter = express.Router()

// isAuth - middleware
userRouter.get("/current",isAuth, getCurrentUser)
userRouter.get("/others",isAuth, getOtherUsers)
// 2 midllewares
// Single image so [upload.single], more than 1 then [upload.fields]
userRouter.put("/profile",isAuth, upload.single("image"), editprofile)
userRouter.get("/search",isAuth, search)


export default userRouter