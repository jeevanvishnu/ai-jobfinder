import type { Request, Response } from "express";
import { Resume } from "../model/resume.model.ts";

const normalizeString = (value: unknown) => {
    if (typeof value !== "string") {
        return "";
    }

    return value.trim();
};

const extractUserId = (user: Request["user"]) => {
    if (!user || typeof user !== "object") {
        return null;
    }

    const maybeUser = user as { id?: unknown; _id?: unknown };

    const id = normalizeString(maybeUser.id);
    if (id) {
        return id;
    }

    const objectId = normalizeString(maybeUser._id);
    if (objectId) {
        return objectId;
    }

    return null;
};

export const getLatestResume = async (req: Request, res: Response) => {
    try {
        const userId = extractUserId(req.user);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const resume = await Resume.findOne({ userId }).sort({ createdAt: -1 }).lean();

        if (!resume) {
            return res.status(404).json({ message: "No resume found" });
        }

        return res.status(200).json({
            resumeId: resume._id,
            skills: resume.parsedData?.skills ?? [],
            experience: resume.parsedData?.experience ?? [],
            education: resume.parsedData?.education ?? [],
            projects: resume.parsedData?.projects ?? [],
            certifications: resume.parsedData?.certifications ?? [],
            originalName: resume.originalName ?? "",
            createdAt: resume.createdAt,
        });
    } catch (error) {
        console.log("getLatestResume error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
