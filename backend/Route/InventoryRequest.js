const express = require("express");
const router = express.Router();
const {
    createInventoryRequest,
    getRequestsByShop,
    updateRequestStatus,
} = require("../Controller/InventoryRequest");

router.post("/", createInventoryRequest);
router.get("/:shopId", getRequestsByShop);
router.put("/:id", updateRequestStatus);

module.exports = router;