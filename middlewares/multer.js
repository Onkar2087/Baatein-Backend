// 19
// 20 - Sidebar.jsx
// 18 - cloudinary.js

// Multer - middleware
// Jaise hi hum image ko frontend se bhejenge, multer usko [request.file] mei rakh dega and usko public folder mei store kara lenge. Phir usko [request.file.path] mei uska path mil jayega jo hum cloudinary.js mei bhejenge. Phir vo cloudinary par upload karke usse public folder se delete kar denge and db mei store kar denge.

import fs from "fs"
import path from "path"
import multer from "multer"

const uploadPath = path.resolve("public")

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true })
}
const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        // 1st parameter - error [null]
        // 2nd parameter - destination
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
}
})

// upload - name of multer middleware - will put in between [just like we put isAuth]



// import multer from "multer"

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "./public")
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + "-" + file.originalname)
//     }
// })

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        cb(new Error("Only images allowed"), false)
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    }
})