const Shop = require("../Model/Shop");

// Create a new shop
exports.createShop = async (req, res) => {
  try {
    const { owner ,name, category, logo, description, branches } = req.body;
    const newShop = new Shop({ owner,name, category, logo, description, branches });
    await newShop.save();
    res.status(201).json({ message: "Shop created successfully", shop: newShop });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: "Error creating shop", error });
  }
};

// Get all shops
exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find();
    res.status(200).json(shops);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shops", error });
  }
};

// Get a single shop by ID
exports.getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    res.status(200).json(shop);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shop", error });
  }
};

// Update a shop
exports.updateShop = async (req, res) => {
  try {
    const updatedShop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedShop) return res.status(404).json({ message: "Shop not found" });
    res.status(200).json({ message: "Shop updated", shop: updatedShop });
  } catch (error) {
    res.status(500).json({ message: "Error updating shop", error });
  }
};

// Delete a shop
exports.deleteShop = async (req, res) => {
  try {
    const deletedShop = await Shop.findByIdAndDelete(req.params.id);
    if (!deletedShop) return res.status(404).json({ message: "Shop not found" });
    res.status(200).json({ message: "Shop deleted" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error deleting shop", error });
  }
};
