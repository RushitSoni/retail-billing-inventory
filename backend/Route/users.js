const express = require("express");
const { getAllUsers ,getUserById,updateUserName} = require("../Controller/users");

const router = express.Router();

// ✅ Fetch all users (Only accessible to admins)
router.get("/",getAllUsers);
router.get("/:userId", getUserById);
router.put("/:id/name", updateUserName);

module.exports = router;
