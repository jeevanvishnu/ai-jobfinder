import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config"

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // If passport session already authenticated the user, proceed
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    // Also just check if req.user exists (fallback if isAuthenticated isn't available)
    if (req.user) {
        return next();
    }

    const token = req.cookies.accessToken || req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    try {
        const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || process.env.ACCESSTOKNE_SECRECT;
        const decoded = jwt.verify(token, secret as string);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};