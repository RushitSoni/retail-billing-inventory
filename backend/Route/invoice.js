const express = require("express");
const router = express.Router();
const sendEmail = require('../utils/sendEmail');
const multer = require("multer");
const upload = multer({ dest: "invoices/" });
const fs = require("fs");



router.post("/", upload.single("file"), async (req, res) => {
    try {
        const customerEmail = req.body.email;
        const filePath = req.file.path;

        const emailContent = `
            <h2>Invoice from Your Shop</h2>
            <p>Dear Customer,</p>
            <p>Please find your invoice attached.</p>
            <p>Thank you for your purchase!</p>
        `;

        await sendEmail(customerEmail, "Your Invoice", emailContent, filePath);

        res.json({ success: true, message: "Invoice sent successfully!" });

        // Delete file after sending email
        setTimeout(() => fs.unlinkSync(filePath), 30000);
    } catch (error) {
        console.error("Error sending invoice:", error);
        res.status(500).json({ success: false, message: "Failed to send invoice" });
    }
});


module.exports = router