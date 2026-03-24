import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

type ResumeData = {
    resumeId?: string;
    skills: string[];
    experience?: unknown[];
    education?: unknown[];
    projects?: unknown[];
    certifications?: unknown[];
    originalName?: string;
    createdAt?: string;
};

interface DashboardState {
    loading: boolean;
    fetchingResume: boolean;
    error: string | null;
    resume: ResumeData | null;
}

const initialState: DashboardState = {
    loading: false,
    fetchingResume: false,
    error: null,
    resume: null,
}

export const fetchLatestResume = createAsyncThunk<ResumeData | null, void, { rejectValue: string }>(
    "dashboard/fetchLatestResume",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<ResumeData>(
                "http://localhost:3000/api/dashboard/resume",
                {
                    withCredentials: true,
                },
            );

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    return null;
                }

                const errorMessage = (error.response?.data as { message?: string } | undefined)?.message;
                return rejectWithValue(errorMessage ?? "Failed to load saved resume.");
            }

            return rejectWithValue("Failed to load saved resume.");
        }
    }
);

export const uploadResume = createAsyncThunk<ResumeData, File, { rejectValue: string }>(
    "dashboard/uploadResume",
    async (resume: File, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("resume", resume);

            const response = await axios.post(
                "http://localhost:3000/api/dashboard/upload-resume",
                formData,
                {
                    withCredentials: true,
                },
            );

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = (error.response?.data as { message?: string } | undefined)?.message;
                return rejectWithValue(errorMessage ?? "Failed to upload resume.");
            }

            return rejectWithValue("Failed to upload resume.");
        }
    }
);

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLatestResume.pending, (state) => {
                state.fetchingResume = true;
                state.error = null;
            })
            .addCase(fetchLatestResume.fulfilled, (state, action) => {
                state.fetchingResume = false;
                state.error = null;
                state.resume = action.payload;
            })
            .addCase(fetchLatestResume.rejected, (state, action) => {
                state.fetchingResume = false;
                state.error = action.payload ?? action.error.message ?? "Failed to load saved resume.";
            })
            .addCase(uploadResume.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadResume.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.resume = action.payload;
            })
            .addCase(uploadResume.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? action.error.message ?? "Failed to upload resume.";
            });
    },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;

