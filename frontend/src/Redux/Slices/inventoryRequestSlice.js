import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/axiosInstance";
// import { selectInventoryList } from "./inventorySlice";

// ✅ Fetch Requests by Shop
export const fetchRequestsByShop = createAsyncThunk(
  "inventoryRequests/fetchByShop",
  async (shopId, thunkAPI) => {
    try {
      const response = await API.get(`/api/inventory-requests/${shopId}`);
      return response.data.requests;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch requests");
    }
  }
);

// ✅ Create a New Inventory Request
export const createInventoryRequest = createAsyncThunk(
  "inventoryRequests/create",
  async (requestData, thunkAPI) => {
    try {
      const response = await API.post("/api/inventory-requests", requestData);
      return response.data.request;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create request");
    }
  }
);

// ✅ Update Inventory Request Status
export const updateRequestStatus = createAsyncThunk(
  "inventoryRequests/updateStatus",
  async ({ id, updateData }, thunkAPI) => {
    console.log("Hello")
    try {
      const response = await API.put(`/api/inventory-requests/${id}`, updateData);
      return response.data.request;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update request");
    }
  }
);





// ✅ Inventory Request Slice
const inventoryRequestSlice = createSlice({
  name: "inventoryRequests",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequestsByShop.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRequestsByShop.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchRequestsByShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createInventoryRequest.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      .addCase(updateRequestStatus.fulfilled, (state, action) => {

         const updatedRequest = action.payload;

         // Find the index of the updated request in the state
         const index = state.list.findIndex((req) => req._id === updatedRequest._id);
         if (index !== -1) {
           state.list[index] = updatedRequest;
         }

        // ✅ If request is accepted or partially accepted, update inventories
        // if (["Accepted", "Partially Accepted"].includes(updatedRequest.status)) {
        //   updatedRequest.items.forEach((item) => {
        //     if (item.approvedQuantity > 0) {
        //       // Update sender's branch inventory
        //       const inventoryList = selectInventoryList(state);
        //       const senderInventory = inventoryList?.find(
        //         (inv) => inv.branchId === updatedRequest.fromBranchId && inv._id === item.inventoryId._id
        //       );
        //       if (senderInventory) {
        //         senderInventory.stock += item.approvedQuantity;
        //       }

        //       // Update receiver's branch inventory
        //       const receiverInventory = inventoryList?.find(
        //         (inv) => inv.branchId === updatedRequest.toBranchId && inv.name === item.inventoryId.name
        //       );

        //       if (receiverInventory) {
        //         receiverInventory.stock -= item.approvedQuantity;
        //       } 
        //     }
        //   });
        // }

      
       
      })
      
      .addCase(updateRequestStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default inventoryRequestSlice.reducer;
