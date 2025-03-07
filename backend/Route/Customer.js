const express = require("express");
const {
    addCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
} = require("../Controller/Customer");

const router = express.Router();

router.post("/add", addCustomer);
router.get("/getAll", getAllCustomers);
router.get("/:id", getCustomerById);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);


module.exports = router;