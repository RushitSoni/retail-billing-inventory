const Inventory = require("../Model/Inventory");
const Shop = require("../Model/Shop");

// Get all inventory items
exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate("shopId");
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single inventory item by ID
exports.getInventoryById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new inventory item (Validates branch ID inside shop)
exports.addInventory = async (req, res) => {
  try {
    const { name, price, stock, cgst,sgst, discount, shopId, branchId, itemId } = req.body;

    // Validate if shop exists
    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    // Check if branchId exists inside shop.branches array
    const branchExists = shop.branches.some(branch => branch._id.toString() === branchId);
    if (!branchExists) return res.status(400).json({ message: "Invalid branch ID for this shop" });

    const newItem = new Inventory({ name, price, stock, cgst,sgst, discount, shopId, branchId, itemId });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ message: error.message });
  }
};

// Update an inventory item
exports.updateInventory = async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ message: "Item not found" });
    res.json(updatedItem);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message });
  }
};

// Delete an inventory item
exports.deleteInventory = async (req, res) => {
  try {
    const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInventoryByShopAndBranch = async (req, res) => {
  try {
      const { shopId, branchId } = req.params;
      const filter = {};

      if (shopId) filter.shopId = shopId;
      if (branchId) filter.branchId = branchId;

      const inventory = await Inventory.find(filter);
      res.status(200).json(inventory);
  } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory by shop and branch", error: error.message });
  }
};

exports.getInventoryByShop = async (req, res) => {
  try {
      const { shopId } = req.params;
      const filter = {};

      if (shopId) filter.shopId = shopId;
      
      const inventory = await Inventory.find(filter);
      res.status(200).json(inventory);
  } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory by shop and branch", error: error.message });
  }
};




exports.reduceStock = async (req, res) => {
    const { items } = req.body;

    try {
        const updatedItems = await Promise.all(
            items.map(async ({ id, quantity }) => {
                const item = await Inventory.findById(id);
                if (!item) return null;

                item.stock = Math.max(0, item.stock - quantity); // Ensure stock never goes below 0
                await item.save();
                return item;
            })
        );

        res.json(updatedItems.filter(item => item !== null)); // Remove null (if any items were not found)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Server error", error });
    }
};
