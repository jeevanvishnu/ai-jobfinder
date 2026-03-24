import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../model/user.modle.ts";
import { generateAccessToken, generateRefreshToken, hashToken } from "../lib/generateToken.ts";
import sendEmail from "../emails/resend.ts";

const cookieBaseOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
};


// @desc Register user
// @route POST /api/auth/register
// @access Public
export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, password: hashedPassword });
        try {
            await sendEmail(name, email, process.env.CLIENT_URL);
        } catch (error) {
            console.log("welcome email not sent", error);
        }
        res.status(201).json(user);
    } catch (error: any) {
        console.log("Error  in register controller", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!user.password) {
            return res.status(400).json({ message: "This account is linked with Google. Please use Google sign-in." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken();
        const tokenHash = hashToken(refreshToken);
        user.refreshToken.push({ tokenHash, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        // set cookies refresh token
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        // set cookies access token
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });
        await user.save();
        res.status(200).json({ accessToken, refreshToken, user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Logout user
// @route POST /api/auth/logout
// @access Private
export const logout = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies?.refreshToken
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token is required" });
        }

        const tokenHash = hashToken(refreshToken);
        const user = await User.findOneAndUpdate(
            { "refreshToken.tokenHash": tokenHash },
            { $pull: { refreshToken: { tokenHash: tokenHash } } },
            { new: true }
        );

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.clearCookie("refreshToken", cookieBaseOptions);
        res.clearCookie("accessToken", cookieBaseOptions);
        res.status(200).json({ message: "Logout successful" });
    } catch (error: any) {
        console.log(error.message, "Error in logout controller")
        res.status(500).json({ message: error.message });
    }
};


// refresh token
export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token is required" });
        }

        const tokenHash = hashToken(refreshToken);

        const user = await User.findOne({ "refreshToken.tokenHash": tokenHash });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = user.refreshToken.find((token) => token.tokenHash === tokenHash);
        if (!token) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (token.expiresAt < new Date()) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        //   generate new tokens
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken();
        const newTokenHash = hashToken(newRefreshToken);
        user.refreshToken.push({ tokenHash: newTokenHash, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });
        await user.save();
        res.status(200).json({ message: "Refresh token generated successfully" });
    } catch (error: any) {
        console.log(error.message, "Error in logout controller")
        res.status(500).json({ message: error.message });
    }
};

// @desc Get logged in user (passport session)
// @route GET /api/auth/me
// @access Private
export const me = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById((req.user as { _id: string })._id).select("-password -refreshToken");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

// Refresh Token 

export const refreshAccessToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token is required" });
        }

        const tokenHash = hashToken(refreshToken);

        const user = await User.findOne({ "refreshToken.tokenHash": tokenHash });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = user.refreshToken.find((token) => token.tokenHash === tokenHash);
        if (!token) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (token.expiresAt < new Date()) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        //   generate new tokens
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken();
        const newTokenHash = hashToken(newRefreshToken);
        user.refreshToken.push({ tokenHash: newTokenHash, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });
        await user.save();
        res.status(200).json({ message: "Refresh token generated successfully" });
    } catch (error: any) {
        console.log(error.message, "Error in logout controller")
        res.status(500).json({ message: error.message });
    }
};