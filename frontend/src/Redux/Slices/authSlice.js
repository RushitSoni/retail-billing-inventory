import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/axiosInstance"; // API.js ka use kar raha hoon
import {jwtDecode} from "jwt-decode"; 

// ✅ Login User
export const loginUser = createAsyncThunk("auth/loginUser", async (userData, thunkAPI) => {
  try {
    const response = await API.post("/api/auth/login", userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

// ✅ Google OAuth Login
export const googleLogin = createAsyncThunk("auth/googleLogin", async (_, thunkAPI) => {
  try {
    const response = await API.get("/api/auth/google/callback", { withCredentials: true });
    console.log(response.data)
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Google login failed");
  }
});

// ✅ Register User
export const registerUser = createAsyncThunk("auth/registerUser", async (userData, thunkAPI) => {
  try {
    const response = await API.post("/api/auth/register", userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Registration failed");
  }
});

// ✅ Logout User
export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, thunkAPI) => {
  try {
    await API.post("/api/auth/logout");
    return true;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Logout failed");
  }
});

// ✅ Forgot Password
export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email, thunkAPI) => {
  try {
    const response = await API.post("/api/auth/forgot-password", { email });
    return response.data.message;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Something went wrong");
  }
});

// ✅ Reset Password
export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ token, newPassword }, thunkAPI) => {
  try {
    const response = await API.post(`/api/auth/reset-password/${token}`, { newPassword });
    return response.data.message;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Something went wrong");
  }
});




const token = localStorage.getItem("accessToken");
let user = null;

if (token) {
    try {
        const decoded = jwtDecode(token); // Decode token to get user info
        console.log(decoded)
        user = { _id: decoded.id, role: decoded.role ,name:decoded.name}; // Adjust fields as per your JWT payload
    } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("accessToken"); // Remove invalid token
    }
}
console.log("User from slice. ", user, token)

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user,
    loading: false,
    error: null,
    message: null,
    token,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
    },
    setUser: (state, action) => {
      console.log(action.payload)
      state.user = action.payload;
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
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
    
        // ✅ Store Access Token in LocalStorage
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
     .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
    
        // ❌ Remove Token from LocalStorage
        localStorage.removeItem("accessToken");
      })
     .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        
        // ✅ Store Google Login Token
        console.log("Hiiii")
        localStorage.setItem("accessToken", action.payload.accessToken);
        
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { logout,setUser } = authSlice.actions;
export default authSlice.reducer;
