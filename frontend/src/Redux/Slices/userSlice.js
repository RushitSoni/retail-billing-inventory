import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/axiosInstance";

// ✅ Fetch All Users (Admin only)
export const fetchAllUsers = createAsyncThunk("users/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await API.get("/api/users");
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch users");
  }
});

// ✅ Fetch User By ID
export const fetchUserById = createAsyncThunk("users/fetchById", async (userId, thunkAPI) => {
  try {
    const response = await API.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch user");
  }
});

// ✅ Update User Name By ID
export const updateUserName = createAsyncThunk("users/updateName", async ({ userId, name }, thunkAPI) => {
  try {
    const response = await API.put(`/api/users/${userId}/name`, { name });
    return response.data.user; // returning updated user
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update user name");
  }
});


const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    currentUser:[],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update user name
      .addCase(updateUserName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserName.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;

      })
      .addCase(updateUserName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
