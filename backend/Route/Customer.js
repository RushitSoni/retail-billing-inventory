const express = require("express");
const {
    addCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    getCustomersByShop,
    getCustomersByShopAndBranch
} = require("../Controller/Customer");

const router = express.Router();

router.post("/add", addCustomer);
router.get("/getAll", getAllCustomers);
router.get("/:id", getCustomerById);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);
router.get("/shop/:shopId/branch/:branchId",getCustomersByShopAndBranch);
router.get("/shop/:shopId", getCustomersByShop);


module.exports = router;