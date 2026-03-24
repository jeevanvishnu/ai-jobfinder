import type { Request, Response } from "express";
import { PDFParse } from "pdf-parse";
import { prompt } from "../config/prompt.ts";
import 'dotenv/config';



export const uploadResume = async (req: Request, res: Response) => {
  try {
    // OpenRouter API key
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ message: "OpenRouter API key is not configured" });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    const buffer = file.buffer;
    if (!buffer) {
      return res.status(400).json({ message: "Unable to read uploaded file" });
    }

    const parser = new PDFParse({ data: buffer });
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

    const API = process.env.OPENROUTER_API_KEY;
    if (!API) {
      return res.status(500).json({ message: "OpenRouter API key is not configured" });
    }

    // implement openrouter sdk

    let response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b:free',
        messages: [
          {
            role: 'user',
            content: prompt + "\n\n" + resumeText,
          },
        ],
      }),
    });

    const data = await response.json();
    let aiResponse = data?.choices?.[0]?.message?.content || "";

    let skills: string[] = [];
    try {
      // Extract just the JSON part from the response
      const jsonStart = aiResponse.indexOf('{');
      const jsonEnd = aiResponse.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd >= jsonStart) {
        const jsonStr = aiResponse.substring(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(jsonStr);
        if (parsed.skills && Array.isArray(parsed.skills)) {
          skills = parsed.skills;
        }
      }
    } catch (e) {
      console.log("Failed to parse AI response as JSON:", aiResponse, "Error:", e);
    }

    res.status(200).json({ skills });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
