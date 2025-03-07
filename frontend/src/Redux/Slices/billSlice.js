import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/axiosInstance";

// ✅ Fetch Bills
export const fetchBills = createAsyncThunk("bills/fetchAll", async (_, thunkAPI) => {
    try {
        const response = await API.get("/api/bills");
        return response.data.bills;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch bills");
    }
});

// ✅ Add Bill
export const addBill = createAsyncThunk("bills/add", async (billData, thunkAPI) => {
    try {
        const response = await API.post("/api/bills", billData);
        return response.data.bill;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to add bill");
    }
});

// ❌ Delete Bill
export const deleteBill = createAsyncThunk("bills/delete", async (id, thunkAPI) => {
    try {
        await API.delete(`/api/bills/${id}`);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete bill");
    }
});

// ✅ Bill Slice
const billSlice = createSlice({
    name: "bills",
    initialState: {
        list: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // 🔄 Fetch Bills
            .addCase(fetchBills.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBills.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchBills.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ➕ Add Bill
            .addCase(addBill.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })

            // ❌ Delete Bill
            .addCase(deleteBill.fulfilled, (state, action) => {
                state.list = state.list.filter(bill => bill._id !== action.payload);
            });
    },
});

export default billSlice.reducer;
