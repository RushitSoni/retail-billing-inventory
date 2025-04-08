const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true
    },
    billingStaffIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // Array of User references for billing staff
    }]
});


const ShopSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true

    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    logo: {
        type: String
    }, // Store image as Base64
    description: {
        type: String
    },
    branches: [BranchSchema], // Array of branches
}, {
    timestamps: true
});

module.exports = mongoose.model("Shop", ShopSchema);