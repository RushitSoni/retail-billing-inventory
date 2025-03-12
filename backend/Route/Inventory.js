const express = require("express");
const router = express.Router();
const inventoryController = require("../Controller/Inventory");


router.put("/reduce-stock", inventoryController.reduceStock);
router.get("/", inventoryController.getInventory);
router.get("/:id", inventoryController.getInventoryById);
router.post("/", inventoryController.addInventory);
router.put("/:id", inventoryController.updateInventory);
router.delete("/:id", inventoryController.deleteInventory);
router.get("/shop/:shopId/branch/:branchId", inventoryController.getInventoryByShopAndBranch);



module.exports = router;
