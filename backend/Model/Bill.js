const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Customer", 
    required: true 
  },
  items: [
    {
      //itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" }, 
      name: String, 
      price: Number, 
      quantity: Number,
      total:Number,
      _id:false
    },
  ],
  grandTotal: { type: Number, required: true },
  installments: {
    enabled: { type: Boolean, default: false },
    numInstallments: { type: Number, default: 1 },
    installmentPeriod: { type: Number, default: 0 }, // Days between installments
    installmentDates: [] // Due dates for each installment
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bill", billSchema);
