import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/axiosInstance";

// ✅ Fetch Inventory
export const fetchInventory = createAsyncThunk("inventory/fetchAll", async (_, thunkAPI) => {
    try {
        const response = await API.get("/api/inventory");
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch inventory");
    }
});

// ✅ Add Inventory Item
export const addInventory = createAsyncThunk("inventory/add", async (itemData, thunkAPI) => {
    try {
        const response = await API.post("/api/inventory", itemData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to add item");
    }
});

// ✅ Get Inventory Item by ID
export const fetchInventoryById = createAsyncThunk("inventory/fetchById", async (id, thunkAPI) => {
    try {
        const response = await API.get(`/api/inventory/${id}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch item");
    }
});

// ✅ Update Inventory Item
export const updateInventory = createAsyncThunk("inventory/update", async ({ id, updatedData }, thunkAPI) => {
    try {
        const response = await API.put(`/api/inventory/${id}`, updatedData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update item");
    }
});

// ✅ Delete Inventory Item
export const deleteInventory = createAsyncThunk("inventory/delete", async (id, thunkAPI) => {
    try {
        await API.delete(`/api/inventory/${id}`);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete item");
    }
});

// ✅ Fetch Inventory by Shop & Branch ID
export const fetchInventoryByShopAndBranch = createAsyncThunk(
    "inventory/fetchByShopBranch",
    async ({ shopId, branchId }, thunkAPI) => {
        try {
            const response = await API.get(`/api/inventory/shop/${shopId}/branch/${branchId}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch inventory by shop and branch");
        }
    }
);
export const reduceInventoryStock = createAsyncThunk(
    "inventory/reduceStock",
    async ({ items }, thunkAPI) => {
        try {
            const response = await API.put("/api/inventory/reduce-stock", { items });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to reduce stock");
        }
    }
);



// ✅ Inventory Slice
const inventorySlice = createSlice({
    name: "inventory",
    initialState: {
        list: [],
        currentItem: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

        
            // 🔄 Fetch Inventory
            .addCase(fetchInventory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchInventory.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchInventory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ➕ Add Inventory Item
            .addCase(addInventory.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })

            // 🔄 Fetch Inventory by Shop & Branch ID
            .addCase(fetchInventoryByShopAndBranch.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchInventoryByShopAndBranch.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchInventoryByShopAndBranch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 🔍 Get Inventory Item by ID
            .addCase(fetchInventoryById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchInventoryById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentItem = action.payload;
            })
            .addCase(fetchInventoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✏️ Update Inventory Item
            .addCase(updateInventory.fulfilled, (state, action) => {
                const index = state.list.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })

            // 🗑️ Delete Inventory Item
            .addCase(deleteInventory.fulfilled, (state, action) => {
                state.list = state.list.filter(item => item._id !== action.payload);
            })
            .addCase(reduceInventoryStock.fulfilled, (state, action) => {
                action.payload.forEach(updatedItem => {
                    const index = state.list.findIndex(item => item._id === updatedItem._id);
                    if (index !== -1) {
                        state.list[index].stock = updatedItem.stock; // Update stock in state
                    }
                });
            });
            
    },
});

export default inventorySlice.reducer;
