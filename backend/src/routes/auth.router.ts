import express from "express"
import { register, login, logout, me, refreshAccessToken } from "../controller/auth.controller.ts";
import { checkRateLimiter } from "../middleware/checkRateLimiter.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import passport from "../config/passport.ts";
const router = express.Router();

router.post("/register", checkRateLimiter, register);
router.post("/login", checkRateLimiter, login);
router.post("/logout", logout);
router.get("/me", authMiddleware, me);
router.get("/refresh-token", refreshAccessToken);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${CLIENT_URL}/login` }), (req, res) => {
    res.redirect(`${CLIENT_URL}/auth/google/callback`);
});
export default router;
