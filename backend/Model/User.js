const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String, 
      required: true,
      unique: true,
    },
    password: {
      type: String,
      //required: true,
    },
    isVerified:{
      type:Boolean,
      required:true,
      default:false
    },
    role: {
      type: String,
      required: true,
      default: "staff",
    },
    googleId: { 
      type: String, 
      
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema); 
