import express from "express";
import { upload } from "../config/upload.ts";
import { uploadResume } from "../controller/uploadResume.controller.ts";
import { getLatestResume } from "../controller/dashboard.controller.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { getJobs } from "../controller/jobmatch.controller.ts";
const router = express.Router();

router.get("/resume", authMiddleware, getLatestResume);
router.post("/upload-resume", authMiddleware, upload.single("resume"), uploadResume);
router.get("/jobs", getJobs);

export default router;
