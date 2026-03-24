import express from "express";
import { upload } from "../config/upload.ts";
import { uploadResume } from "../controller/uploadResume.controller.ts";

const router = express.Router();

router.post("/upload-resume", upload.single("resume"), uploadResume);

export default router;