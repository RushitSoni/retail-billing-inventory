const express = require("express");
const upload = require("../Middleware/upload");

const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
  try {
    res.json({ imageUrl: req.file.path }); // Cloudinary returns a URL
  } catch (error) {
    res.status(500).json({ error: "Image upload failed" });
  }
});



  

module.exports = router;
