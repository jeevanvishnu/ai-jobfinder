import type { Request, Response } from "express";
import { PDFParse } from "pdf-parse";
import { prompt } from "../config/prompt.ts";
import { Resume } from "../model/resume.model.ts";
import "dotenv/config";

type ParsedResumeData = {
    skills: string[];
    experience: Array<Record<string, unknown>>;
    education: Array<Record<string, unknown>>;
    projects: Array<Record<string, unknown>>;
    certifications: Array<Record<string, unknown>>;
};

const normalizeString = (value: unknown) => {
    if (typeof value !== "string") {
        return "";
    }

    return value.trim();
};

const normalizeStringArray = (value: unknown) => {
    if (!Array.isArray(value)) {
        return [];
    }

    const seen = new Set<string>();
    const result: string[] = [];

    for (const item of value) {
        const normalized = normalizeString(item);
        if (!normalized) continue;

        const key = normalized.toLowerCase();
        if (seen.has(key)) continue;

        seen.add(key);
        result.push(normalized);
    }

    return result;
};

const normalizeObjectArray = (value: unknown) => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.filter((item): item is Record<string, unknown> => {
        return Boolean(item) && typeof item === "object" && !Array.isArray(item);
    });
};

const normalizeExperience = (value: unknown) => {
    return normalizeObjectArray(value).map((item) => ({
        title: normalizeString(item.title),
        company: normalizeString(item.company),
        location: normalizeString(item.location),
        start_date: normalizeString(item.start_date),
        end_date: normalizeString(item.end_date),
        description: normalizeStringArray(item.description),
    }));
};

const normalizeEducation = (value: unknown) => {
    return normalizeObjectArray(value).map((item) => ({
        institution: normalizeString(item.institution),
        location: normalizeString(item.location),
        year: normalizeString(item.year),
        qualification: normalizeString(item.qualification),
        board: normalizeString(item.board),
    }));
};

const normalizeProjects = (value: unknown) => {
    return normalizeObjectArray(value).map((item) => ({
        name: normalizeString(item.name),
        year: normalizeString(item.year),
        start_date: normalizeString(item.start_date),
        end_date: normalizeString(item.end_date),
        github: normalizeString(item.github),
        description: normalizeStringArray(item.description),
    }));
};

const normalizeCertifications = (value: unknown) => {
    return normalizeObjectArray(value).map((item) => ({
        name: normalizeString(item.name),
        issuer: normalizeString(item.issuer),
        year: normalizeString(item.year),
        issue_date: normalizeString(item.issue_date),
        expiry_date: normalizeString(item.expiry_date),
        credential_id: normalizeString(item.credential_id),
        credential_url: normalizeString(item.credential_url),
    }));
};

const extractFirstJsonObject = (value: string) => {
    const startIndex = value.indexOf("{");
    if (startIndex === -1) {
        return null;
    }

    let depth = 0;

    for (let index = startIndex; index < value.length; index += 1) {
        const character = value[index];

        if (character === "{") depth += 1;
        if (character === "}") depth -= 1;

        if (depth === 0) {
            return value.slice(startIndex, index + 1);
        }
    }

    return null;
};

const parseAiResponse = (aiResponse: string): ParsedResumeData => {
    const baseData: ParsedResumeData = {
        skills: [],
        experience: [],
        education: [],
        projects: [],
        certifications: [],
    };

    const cleanedResponse = aiResponse
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();

    const jsonString = extractFirstJsonObject(cleanedResponse) ?? cleanedResponse;

    try {
        const parsed = JSON.parse(jsonString) as Record<string, unknown>;

        return {
            skills: normalizeStringArray(parsed.skills),
            experience: normalizeExperience(parsed.experience),
            education: normalizeEducation(parsed.education),
            projects: normalizeProjects(parsed.projects),
            certifications: normalizeCertifications(parsed.certifications),
        };
    } catch {
        return baseData;
    }
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

const extractFilePath = (file: Express.Multer.File) => {
    const maybePath = (file as Express.Multer.File & { path?: unknown }).path;
    return typeof maybePath === "string" ? maybePath : undefined;
};

export const uploadResume = async (req: Request, res: Response) => {
    try {
        if (!process.env.OPENROUTER_API_KEY) {
            return res.status(500).json({ message: "OpenRouter API key is not configured" });
        }

        const userId = extractUserId(req.user);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        if (file.mimetype !== "application/pdf") {
            return res.status(400).json({ message: "Please upload a PDF file" });
        }

        if (!file.buffer) {
            return res.status(400).json({ message: "Unable to read uploaded file" });
        }

        const parser = new PDFParse({ data: file.buffer });
        let resumeText = "";

        try {
            const data = await parser.getText();
            resumeText = data.text?.trim() ?? "";
        } finally {
            await parser.destroy();
        }

        if (!resumeText) {
            return res.status(400).json({ message: "No text found in the resume" });
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b:free",
                messages: [
                    {
                        role: "user",
                        content: `${prompt}\n\nResume text:\n${resumeText}`,
                    },
                ],
            }),
        });

        const responseBody = await response.json();

        if (!response.ok) {
            const message =
                responseBody?.error?.message ||
                responseBody?.message ||
                "Failed to get AI response from OpenRouter";

            return res.status(response.status || 502).json({ message });
        }

        const aiResponse = normalizeString(responseBody?.choices?.[0]?.message?.content);
        if (!aiResponse) {
            return res.status(502).json({ message: "AI response was empty" });
        }

        const parsedData = parseAiResponse(aiResponse);

        const resume = await Resume.create({
            userId,
            fileUrl: extractFilePath(file),
            originalName: file.originalname,
            parsedData,
            rawAiResponse: aiResponse,
        });

        return res.status(200).json({
            resumeId: resume._id,
            skills: resume.parsedData.skills,
            experience: resume.parsedData.experience,
            education: resume.parsedData.education,
            projects: resume.parsedData.projects,
            certifications: resume.parsedData.certifications,
        });
    } catch (error) {
        console.log("uploadResume error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
