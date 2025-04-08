import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/axiosInstance";

// ✅ Fetch Audit Logs
export const fetchAuditLogs = createAsyncThunk("auditLogs/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await API.get("/api/audit-logs");
    return response.data.logs;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch audit logs");
  }
});

// ✅ Add Audit Log
export const addAuditLog = createAsyncThunk("auditLogs/add", async (logData, thunkAPI) => {
  try {
    const response = await API.post("/api/audit-logs", logData);
    return response.data.log;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to add audit log");
  }
});

// ❌ Delete Audit Log
export const deleteAuditLog = createAsyncThunk("auditLogs/delete", async (id, thunkAPI) => {
  try {
    await API.delete(`/api/audit-logs/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete audit log");
  }
});

// ✅ Audit Log Slice
const auditLogSlice = createSlice({
  name: "auditLogs",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔄 Fetch Audit Logs
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ➕ Add Audit Log
      .addCase(addAuditLog.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      // ❌ Delete Audit Log
      .addCase(deleteAuditLog.fulfilled, (state, action) => {
        state.list = state.list.filter(log => log._id !== action.payload);
      });
  },
});

export default auditLogSlice.reducer;
