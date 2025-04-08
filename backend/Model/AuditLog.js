const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
        user: {
            type: String,
            required: true
        }, 
        operation: {
            type: String,
            enum: ["CREATE", "UPDATE", "DELETE"],
            required: true
        }, // Operation type
        module: {
            type: String,
            required: true
        }, 
        message: {
            type: String,
            default:"---"
        }, 
    }, {
        timestamps: true
    } 
);

module.exports = mongoose.model("AuditLog", auditLogSchema);