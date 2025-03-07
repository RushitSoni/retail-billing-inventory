const Customer = require("../Model/Customer");

// Add a new customer
exports.addCustomer = async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json({
            success: true,
            customer
        });
    } catch (error) {
        console.log(error.message)
        res.status(400).json({
            success: false,
            message: error.message
            
        });
    }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().sort({
            createdAt: -1
        });
        res.status(200).json({
            success: true,
            customers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ✅ Get Customer by ID
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }
        res.status(200).json({ success: true, customer });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching customer" });
    }
};


// ✅ Update Customer
exports.updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }
        res.status(200).json({ success: true, customer });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating customer" });
    }
};

// ✅ Delete Customer
exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }
        res.status(200).json({ success: true, message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting customer" });
    }
};