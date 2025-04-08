const InventoryRequest = require("../Model/InventoryRequest");
const Inventory = require("../Model/Inventory")
const mongoose = require('mongoose')
// ✅ Create a new inventory transfer request
exports.createInventoryRequest = async (req, res) => {
  try {
    const request = await InventoryRequest.create(req.body);
    res.status(201).json({ success: true, request });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all requests for a specific shop
exports.getRequestsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const requests = await InventoryRequest.find({ shopId })
      .populate("fromBranchId toBranchId items.inventoryId");
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update request status (Approve, Reject, Partially Accept)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, items, fromBranchId, toBranchId, shopId } = req.body;
   

    const updatedRequest = await InventoryRequest.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }
   
    if (status === "Accepted" || status === "Partially Accepted") {
      
      

      
        for (const item of items) {
          if (item.approvedQuantity > 0) {

            // Increace
            await Inventory.findOneAndUpdate(
              { shopId, branchId: fromBranchId, _id: item.inventoryId._id },
              { $inc: { stock: item.approvedQuantity } },
              { new: true }
            );

            //Decrease
           await Inventory.findOneAndUpdate(
              { shopId, branchId: toBranchId, name: item.inventoryId.name },
              { $inc: { stock: -item.approvedQuantity } },
              { new: true }
            );

           

          }
        }

    
     
    }
    
    res.json({ success: true, request: updatedRequest });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
};
