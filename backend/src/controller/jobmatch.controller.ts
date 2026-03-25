import type { Request, Response } from "express";
import { fetchData } from "../lib/rapidjob.ts";

export const getJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await fetchData();
        console.log(jobs,"jobs");
        return res.status(200).json(jobs);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};