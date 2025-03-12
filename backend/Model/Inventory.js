const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    gst: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    
}, {
    timestamps: true
});

module.exports = mongoose.model("Inventory", InventorySchema);