const express = require("express");
const router = express.Router();
const billController = require("../Controller/Bill");

router.post("/", billController.createBill);
router.get("/", billController.getBills);
router.get("/:id", billController.getBillById);
router.delete("/:id", billController.deleteBill);

module.exports = router;

