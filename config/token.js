// 7 - till now signin, login, logout - controller and route working fine
// 8 - frontend(Signup.jsx)
// 6 - auth.routes.js

// Brings in the `jsonwebtoken` library, which helps us **create and verify tokens**.
import jwt from "jsonwebtoken"

// Generating token and parsing inside cookies
const genToken = (id) => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables.");
        }

        // sign - creates a JWT token
        const token = jwt.sign(
            { userId: id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "5d" }
        );
        return token;
    } catch (error) {
        console.error("❌ Generate token error:", error);
        throw new Error("Token generation failed");
    }
};

export default genToken;
