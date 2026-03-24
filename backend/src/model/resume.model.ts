import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
    {
        title: String,
        company: String,
        location: String,
        start_date: String,
        end_date: String,
        description: {
            type: [String],
            default: [],
        },
    },
    { _id: false },
);

const educationSchema = new mongoose.Schema(
    {
        institution: String,
        location: String,
        year: String,
        qualification: String,
        board: String,
    },
    { _id: false },
);

const projectSchema = new mongoose.Schema(
    {
        name: String,
        year: String,
        start_date: String,
        end_date: String,
        github: String,
        description: {
            type: [String],
            default: [],
        },
    },
    { _id: false },
);

const certificationSchema = new mongoose.Schema(
    {
        name: String,
        issuer: String,
        year: String,
        issue_date: String,
        expiry_date: String,
        credential_id: String,
        credential_url: String,
    },
    { _id: false },
);

const resumeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fileUrl: {
            type: String,
        },
        originalName: {
            type: String,
        },
        parsedData: {
            skills: {
                type: [String],
                default: [],
            },
            experience: {
                type: [experienceSchema],
                default: [],
            },
            education: {
                type: [educationSchema],
                default: [],
            },
            projects: {
                type: [projectSchema],
                default: [],
            },
            certifications: {
                type: [certificationSchema],
                default: [],
            },
        },
        rawAiResponse: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

resumeSchema.index({ userId: 1, createdAt: -1 });

export const Resume = mongoose.model("Resume", resumeSchema);
