import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import API from "../../API/axiosInstance";

// ✅ Fetch Customers
export const fetchCustomers = createAsyncThunk("customers/fetchAll", async (_, thunkAPI) => {
    try {
        const response = await API.get("/api/customers/getAll");
        return response.data.customers;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch customers");
    }
});

// ✅ Add Customer
export const addCustomer = createAsyncThunk("customers/add", async (customerData, thunkAPI) => {
    try {
        const response = await API.post("/api/customers/add", customerData);
        return response.data.customer;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to add customer");
    }
});
// ✅ Get Customer by ID
export const fetchCustomerById = createAsyncThunk("customers/fetchById", async (id, thunkAPI) => {
    try {
        const response = await API.get(`/api/customers/${id}`);
        return response.data.customer;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch customer");
    }
});

// ✅ Update Customer
export const updateCustomer = createAsyncThunk("customers/update", async ({ id, updatedData }, thunkAPI) => {
    try {
        const response = await API.put(`/api/customers/${id}`, updatedData);
        return response.data.customer;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update customer");
    }
});

// ✅ Delete Customer
export const deleteCustomer = createAsyncThunk("customers/delete", async (id, thunkAPI) => {
    try {
        await API.delete(`/api/customers/${id}`);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete customer");
    }
});


// ✅ Customer Slice
const customerSlice = createSlice({
    name: "customers",
    initialState: {
        list: [],
        currentCustomer: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // 🔄 Fetch Customers
            .addCase(fetchCustomers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ➕ Add Customer
            .addCase(addCustomer.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })

              // 🔍 Get Customer by ID
              .addCase(fetchCustomerById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCustomerById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCustomer = action.payload;
            })
            .addCase(fetchCustomerById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

             // ✏️ Update Customer
             .addCase(updateCustomer.fulfilled, (state, action) => {
                const index = state.list.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })

            // 🗑️ Delete Customer
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.list = state.list.filter(c => c._id !== action.payload);
            });

    },
});

export default customerSlice.reducer;