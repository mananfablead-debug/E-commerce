import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; 

const API_URL = "https://api.escuelajs.co/api/v1/auth/login";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, {
        email,
        password,
      });
      localStorage.setItem("token", response.data.access_token);
      return response.data.access_token;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://api.escuelajs.co/api/v1/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch profile");
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async(credentialResponse,{rejectWithValue}) => {
    try{
      const decoded = jwtDecode(credentialResponse.credential);
      const fakeToken  = credentialResponse.credential;
      localStorage.setItem("token",fakeToken);
      localStorage.setItem("google_user",JSON.stringify(decoded));

      return{
        token: fakeToken,
        user: decoded,
      };
    }catch(error){
      return rejectWithValue("Google login failed")
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("google_user")) || null,
    token: localStorage.getItem("token") || null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("google_user")
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
      //profile
      builder
      .addCase(fetchProfile.pending,(state) => {
        state.status = "loading";
      })
      .addCase(fetchProfile.fulfilled,(state,action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected,(state,action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      //Google
      .addCase(loginWithGoogle.pending,(state) => {
        state.status = "loading";
      })
      .addCase(loginWithGoogle.fulfilled,(state,action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginWithGoogle.rejected,(state,action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
