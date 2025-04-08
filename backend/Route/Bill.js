const express = require("express");
const router = express.Router();
const billController = require("../Controller/Bill");

router.post("/", billController.createBill);
router.get("/", billController.getBills);
router.get("/:id", billController.getBillById);
router.delete("/:id", billController.deleteBill);
router.get("/shop/:shopId/branch/:branchId", billController.getBillsByShopAndBranch);
router.get("/shop/:shopId", billController.getBillsByShop);

module.exports = router;

