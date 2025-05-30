const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,

    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    biller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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

module.exports = mongoose.model("Customer", customerSchema);