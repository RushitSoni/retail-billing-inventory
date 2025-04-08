const Bill = require("../Model/Bill");

exports.createBill = async (req, res) => {
  try {
    const { customer,biller,shopId,branchId, items, grandTotal, installments } = req.body;
    
    // Create new bill
    const bill = new Bill({
      customer,
      biller,
      shopId,
      branchId,
      items,
      grandTotal,
      installments
    });

    await bill.save();
    res.status(201).json({ success: true, bill });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

exports.getBills = async (req, res) => {
  try {
    const bills = await Bill.find().populate("customer")
    .populate("biller")
    .populate("shopId") ;

    res.json({ success: true, bills });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
    .populate("customer")
    .populate("biller")
    .populate("shopId");
    if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });

    res.json({ success: true, bill });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteBill = async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Bill deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getBillsByShopAndBranch = async (req, res) => {
  try {
    const { shopId, branchId } = req.params;
    const bills = await Bill.find({ shopId, branchId })
      .populate("customer")
      .populate("biller")
      .populate("shopId");

    res.json({ success: true, bills });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getBillsByShop = async (req, res) => {
  try {
    const { shopId} = req.params;
    const bills = await Bill.find({ shopId })
      .populate("customer")
      .populate("biller")
      .populate("shopId");

    res.json({ success: true, bills });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
