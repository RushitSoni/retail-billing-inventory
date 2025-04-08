
const passport = require("passport");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");



require("dotenv").config(); // Load environment variables
const User = require("../Model/User");
const router = express.Router();
const sendEmail = require('../utils/sendEmail');

const CLIENT_URL = process.env.CLIENT_URL;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_SECRET = process.env.JWT_SECRET;
// ✅ User Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // ✅ Check User
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User Not Found!" });

        // ✅ Check Email Verification
        if (!user.isVerified) {
            const token = jwt.sign({ id: user._id }, ACCESS_SECRET, { expiresIn: "1h" });
            const verificationLink = `${process.env.CLIENT_URL}/verify-email/${token}`;
            await sendEmail(email, "Verify Your Email", `Click here to verify: ${verificationLink}`);
            return res.status(403).json({ 
                message: "Please verify your email first. A new verification link has been sent.", 
                verificationLink 
            });
        }

        // ✅ Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials!" });

        // ✅ Generate Access Token (15 min expiry)
        const accessToken = jwt.sign({ id: user._id,role:user.role,name:user.name}, ACCESS_SECRET, { expiresIn: "15m" });

        // ✅ Generate Refresh Token (7 days expiry)
        const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, { expiresIn: "7d" });

        // ✅ Store Refresh Token in HTTPOnly Cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });

        res.json({ 
            message: "Login Successful", 
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },  
            accessToken 
        });

    } catch (err) {
        res.status(500).json({ message: err.message, error: err.message });
    }
});

// ✅ Refresh Token Route (Generate New Access Token)
router.post("/refresh", (req, res) => {
    const refreshToken = req.cookies.refreshToken; // Get from Cookie

    if (!refreshToken) {
        return res.status(403).json({ message: "No refresh token, please login again." });
    }

    jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid refresh token!" });

        // ✅ Generate New Access Token
        const newAccessToken = jwt.sign({ id: user.id }, ACCESS_SECRET, { expiresIn: "15m" });
        res.json({ accessToken: newAccessToken });
    });
});


router.post("/logout", (req, res) => {
    
    res.clearCookie("refreshToken");
    res.clearCookie("token");
    res.json({
        message: "Logged out successfully!"
    });
});


router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create New User
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            isVerified: false,
        
        });

        await newUser.save();

        // Generate JWT Token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        const verificationLink = `${process.env.CLIENT_URL}/verify-email/${token}`;
        const emailContent = `
            <h2>Welcome to BizTrack, ${newUser.name}!</h2>
            <p>Click the link below to verify your email:</p>
            <a href="${verificationLink}" target="_blank" style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none;">Verify Email</a>
            <p>This link expires in 24 hours.</p>
        `;

        // Use newUser.email instead of user.email
        await sendEmail(newUser.email, "Verify Your Email - BizTrack", emailContent);

        res.status(201).json({ 
            message: "User Registered Successfully", 
            user: { _id: newUser._id, name: newUser.name, email: newUser.email },  
            token 
        });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});



// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        // JWT token generate with expiry
        const resetToken = jwt.sign({ id: user._id ,name:user.name,email:user.email}, JWT_SECRET, { expiresIn: "10m" });

        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

        // Use sendEmail function
        await sendEmail(
            email,
            "Password Reset Request",
            `<p>Click the link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`
        );

        res.json({ message: "Password reset link sent to email" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Reset Password Route
router.post("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        // Verify JWT Token
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) return res.status(400).json({ message: "Invalid or expired token" });

        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Hash and update password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Something went wrong. Try again." });
    }
});

router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    console.log("user",user)
    if (!user) {
      return res.status(400).json({ message: "Invalid or Expired Token" });
    }

    if (user.isVerified) {
      return res.json({ message: "Email already verified. You can log in now." });
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: "Email successfully verified! You can now log in." });
  } catch (error) {
    res.status(400).json({ message: "Invalid or Expired Link" });
  }
});

// ✅ Google Signup Route → Only allows new user creation
router.get("/google/signup", (req, res, next) => {
    req.session.isSignup = true; // ✅ Allow new user creation
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

// ✅ Google Login Route → Only allows existing users
router.get("/google/login", (req, res, next) => {
    req.session.isSignup = false; // ❌ Do NOT create new user
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

// ✅ Google Auth Callback (Handles Both Login & Signup)
router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: `${CLIENT_URL}/login?error=AuthFailed`,
        session: false,
    }),
    async (req, res) => {
        if (!req.user) {
            return res.redirect(`${CLIENT_URL}/login?error=AuthFailed`);
        }

        const accessToken = jwt.sign({ id: req.user._id ,name:req.user.name,email:req.user.email,role:req.user.role}, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: req.user._id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        res.redirect(`${CLIENT_URL}/google-auth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    }
);

module.exports = router;
