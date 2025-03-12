import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/axiosInstance";

// ✅ Fetch Shops
export const fetchShops = createAsyncThunk("shops/fetchAll", async (_, thunkAPI) => {
    try {
        const response = await API.get("/api/shops");
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch shops");
    }
});

// ✅ Add Shop
export const addShop = createAsyncThunk("shops/add", async (shopData, thunkAPI) => {
    try {
        const response = await API.post("/api/shops", shopData);
        return response.data.shop;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to add shop");
    }
});

// ✅ Get Shop by ID
export const fetchShopById = createAsyncThunk("shops/fetchById", async (id, thunkAPI) => {
    try {
        const response = await API.get(`/api/shops/${id}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch shop");
    }
});

// ✅ Update Shop
export const updateShop = createAsyncThunk("shops/update", async ({ id, updatedData }, thunkAPI) => {
    try {
        console.log(id, updatedData)
        const response = await API.put(`/api/shops/${id}`, updatedData);
        return response.data.shop;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update shop");
    }
});

// ✅ Delete Shop
export const deleteShop = createAsyncThunk("shops/delete", async (id, thunkAPI) => {
    try {
        await API.delete(`/api/shops/${id}`);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete shop");
    }
});

// ✅ Shop Slice
const shopSlice = createSlice({
    name: "shops",
    initialState: {
        list: [],
        currentShop: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // 🔄 Fetch Shops
            .addCase(fetchShops.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchShops.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchShops.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ➕ Add Shop
            .addCase(addShop.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })

            // 🔍 Get Shop by ID
            .addCase(fetchShopById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchShopById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentShop = action.payload;
            })
            .addCase(fetchShopById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✏️ Update Shop
            .addCase(updateShop.fulfilled, (state, action) => {
                const index = state.list.findIndex(s => s._id === action.payload._id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })

            // 🗑️ Delete Shop
            .addCase(deleteShop.fulfilled, (state, action) => {
                state.list = state.list.filter(s => s._id !== action.payload);
            });
    },
});

export default shopSlice.reducer;
