const mongoose = require("mongoose");

const inventoryRequestSchema = new mongoose.Schema({
    fromBranchId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toBranchId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },
    items: [{
        inventoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Inventory",
            required: true
        },
        requestedQuantity: {
            type: Number,
            required: true
        },
        approvedQuantity: {
            type: Number,
            default: 0
        },
    }, ],
    status: {
        type: String,
        enum: ["Pending", "Rejected", "Partially Accepted", "Accepted"],
        default: "Pending",
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("InventoryRequest", inventoryRequestSchema);