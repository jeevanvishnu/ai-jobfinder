import jwt from "jsonwebtoken"
import crypto from "crypto"
import "dotenv/config"

export const generateAccessToken = (user:any)=>{
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET 
    const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRE 

    if (!accessTokenSecret) {
        throw new Error("Missing ACCESS_TOKEN_SECRET environment variable.");
    }

    return jwt.sign({ user: user._id }, accessTokenSecret, { expiresIn: accessTokenExpiry })
}

export const generateRefreshToken = ()=>{
    return crypto.randomBytes(64).toString("hex")
}

export const hashToken = (token:string)=>{
    return crypto.createHash("sha256").update(token).digest("hex")
}
