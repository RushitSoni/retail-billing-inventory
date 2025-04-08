const Bill = require("../Model/Bill");
const Customer = require("../Model/Customer");
const Inventory = require("../Model/Inventory");
const InventoryRequest = require("../Model/InventoryRequest");
const Shop = require("../Model/Shop");

// Create a new shop
exports.createShop = async (req, res) => {
  try {
    const {
      owner,
      name,
      category,
      logo,
      description,
      branches
    } = req.body;
    const newShop = new Shop({
      owner,
      name,
      category,
      logo,
      description,
      branches
    });
    await newShop.save();
    res.status(201).json({
      message: "Shop created successfully",
      shop: newShop
    });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: "Error creating shop",
      error
    });
  }
};

// Get all shops
exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find()
      .populate("owner") // Fetches full owner details
      .populate("branches.managerId") // Fetches full manager details
      .populate("branches.billingStaffIds")
      .populate("branches");
    res.status(200).json(shops);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching shops",
      error
    });
  }
};

// Get a single shop by ID
exports.getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)
      .populate("owner") // Fetches full owner details
      .populate("branches.managerId") // Fetches full manager details
      .populate("branches.billingStaffIds")
      .populate("branches")
      
    if (!shop) return res.status(404).json({
      message: "Shop not found"
    });
    res.status(200).json(shop);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching shop",
      error
    });
  }
};

// Update a shop
exports.updateShop = async (req, res) => {
  try {
    const updatedShop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updatedShop) return res.status(404).json({
      message: "Shop not found"
    });
    res.status(200).json({
      message: "Shop updated",
      shop: updatedShop
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating shop",
      error
    });
  }
};

// Delete a shop
exports.deleteShop = async (req, res) => {
  try {

    const shopId = req.params.id;

    // Delete related data by matching shopId
    await Inventory.deleteMany({ shopId });
    await Bill.deleteMany({ shopId });
    await Customer.deleteMany({ shopId });
    await InventoryRequest.deleteMany({ shopId });
    
    const deletedShop = await Shop.findByIdAndDelete(req.params.id);
    if (!deletedShop) return res.status(404).json({
      message: "Shop not found"
    });
    res.status(200).json({
      message: "Shop deleted"
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Error deleting shop",
      error
    });
  }
};


exports.getUserShops = async (req, res) => {
  try {
      const userId = req.params.userId;

      // Fetch shops where the user is an owner (Include all branches)
      const ownerShops = await Shop.find({ owner: userId })
      .populate("owner") // Fetches full owner details
      .populate("branches.managerId") // Fetches full manager details
      .populate("branches.billingStaffIds")
      .populate("branches");

      // Fetch shops where the user is a manager (Include only the managed branch)
      const managerShops = await Shop.find({ "branches.managerId": userId })
      .populate("owner") // Fetches full owner details
      .populate("branches.managerId") // Fetches full manager details
      const filteredManagerShops = managerShops.map(shop => ({
          ...shop.toObject(),
          branches: shop.branches.filter(branch => branch.managerId._id == userId)
      }));
      console.log(filteredManagerShops)
      // Fetch shops where the user is in billingStaffIds (Include only relevant branches)
      const billingShops = await Shop.find({ "branches.billingStaffIds": userId })
      .populate("owner") // Fetches full owner details
      .populate("branches.managerId") // Fetches full manager details

      const filteredBillingShops = billingShops.map(shop => ({
          ...shop.toObject(),
          branches: shop.branches.filter(branch => branch.billingStaffIds.includes(userId))
      }));

      // Merge results, avoiding duplicate shop entries
      const shopMap = new Map();

      [...ownerShops, ...filteredManagerShops, ...filteredBillingShops].forEach(shop => {
          if (!shopMap.has(shop._id.toString())) {
              shopMap.set(shop._id.toString(), shop);
          } else {
              // Merge branches if shop exists in multiple conditions
              const existingShop = shopMap.get(shop._id.toString());
              existingShop.branches = [
                  ...new Map([...existingShop.branches, ...shop.branches].map(b => [b._id.toString(), b])).values()
              ];
          }
      });

      res.json(Array.from(shopMap.values()));
  } catch (error) {
      console.error("Error fetching shops:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};