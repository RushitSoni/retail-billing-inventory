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

export const fetchBillsByShopAndBranch = createAsyncThunk(
    "bills/fetchByShopAndBranch",
    async ({ shopId, branchId }, thunkAPI) => {
      try {
        const response = await API.get(`/api/bills/shop/${shopId}/branch/${branchId}`);
        return response.data.bills;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch bills");
      }
    }
  );

  export const fetchBillsByShop = createAsyncThunk(
    "bills/fetchByShop",
    async ({ shopId }, thunkAPI) => {
      try {
        const response = await API.get(`/api/bills/shop/${shopId}`);
        return response.data.bills;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch bills");
      }
    }
  );
  

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
            })

            //by shop,branchid
            .addCase(fetchBillsByShopAndBranch.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBillsByShopAndBranch.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchBillsByShopAndBranch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
             //by shopId
             .addCase(fetchBillsByShop.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBillsByShop.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchBillsByShop.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default billSlice.reducer;
