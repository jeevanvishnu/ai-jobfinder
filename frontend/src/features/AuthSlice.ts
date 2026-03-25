import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

type AuthUser = Record<string, unknown>;

type LoginPayload = {
    email: string;
    password: string;
};

type SignupPayload = {
    name: string;
    email: string;
    password: string;
};

type AuthResponse = {
    user?: AuthUser;
    accessToken?: string | null;
    token?: string | null;
    [key: string]: unknown;
};

type AuthState = {
    token: string | null;
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
};

const initialState: AuthState = {
    token: null,
    user: null,
    loading: false,
    error: null,
};

const api = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/auth";

const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        if (!error.response) {
            return "Unable to reach the server. Please check your internet connection.";
        }

        return error.response?.data?.message ?? error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Something went wrong. Please try again.";
};

export const loginUser = createAsyncThunk<
    AuthResponse,
    LoginPayload,
    { rejectValue: string }
>(
    "auth/loginUser",
    async (userData, thunkApi) => {
        try {
            const res = await axios.post<AuthResponse>(`${api}/login`, userData, {
                withCredentials: true,
            });
            return res.data;
        } catch (error) {
            return thunkApi.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const signupUser = createAsyncThunk<
    AuthResponse,
    SignupPayload,
    { rejectValue: string }
>(
    "auth/signupUser",
    async (userData, thunkApi) => {
        try {
            const res = await axios.post<AuthResponse>(`${api}/register`, userData, {
                withCredentials: true,
            });
            return res.data;
        } catch (error) {
            return thunkApi.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const fetchCurrentUser = createAsyncThunk<
    AuthResponse,
    void,
    { rejectValue: string }
>(
    "auth/fetchCurrentUser",
    async (_, thunkApi) => {
        try {
            const res = await axios.get<AuthResponse>(`${api}/me`, {
                withCredentials: true,
            });
            return res.data;
        } catch (error) {
            return thunkApi.rejectWithValue(getErrorMessage(error));
        }
    }
);

// Refresh Access Token
export const refreshAccessToken = createAsyncThunk<
    AuthResponse,
    void,
    { rejectValue: string }
>(
    "auth/refreshAccessToken",
    async (_, thunkApi) => {
        try {
            const res = await axios.get<AuthResponse>(`${api}/refresh-token`, {
                withCredentials: true,
            });
            return res.data;
        } catch (error) {
            return thunkApi.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const startGoogleAuth = () => {
    window.location.assign(`${api}/google`);
};


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuthError: (state) => {
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload.user ?? action.payload;
                state.token = action.payload.accessToken ?? action.payload.token ?? null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Unable to sign in. Please try again.";
            })
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload.user ?? action.payload;
                state.token = action.payload.accessToken ?? action.payload.token ?? null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Unable to create your account. Please try again.";
            })
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload.user ?? action.payload;
                state.token = action.payload.accessToken ?? action.payload.token ?? null;
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(refreshAccessToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload.user ?? action.payload;
                state.token = action.payload.accessToken ?? action.payload.token ?? null;
            })
            .addCase(refreshAccessToken.rejected, (state) => {
                state.loading = false;
                state.error = null;
            });
    },
});

export const { clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;
