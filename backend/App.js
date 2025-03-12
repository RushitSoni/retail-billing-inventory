const express = require('express')
const  app = express()
const  dotenv = require('dotenv')
const connectMongoDB = require('./Connection')
const cors = require('cors')

const cookieParser = require('cookie-parser') 
dotenv.config()

const PORT = process.env.PORT
// const loginRoutes = require("./Route/Login");
// const registerRoutes = require("./Route/Register");
// const logoutRoutes = require("./Route/Logout")
// const verifyEmail = require("./Route/VerifyEmail")
// const forgotPasswordRoutes = require("./Route/ForgotPassword")
// const resetPasswordRoutes = require("./Route/ResetPassword")
const authRoutes = require("./Route/auth")
const invoiceEmailRoute = require("./Route/invoice")

const authenticateUser = require("./Middleware/auth")
const authorizeRoles = require("./Middleware/authorization")
const customerRoutes = require("./Route/Customer")
const billRoutes = require("./Route/Bill")
const shopRoutes = require("./Route/Shop");
const inventoryRoutes = require("./Route/Inventory");

const session = require("express-session");
const passport = require("passport");
require("./Middleware/passportConfig"); 

// Middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(session({ secret: "your_secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//Connect to MongoDB
connectMongoDB()


// app.use("/api/register", registerRoutes);
// app.use("/api/login", loginRoutes);
// app.use("/api/logout",authenticateUser, logoutRoutes);
// app.use("/api/verify-email",verifyEmail)
// app.use("/api/forgot-password",forgotPasswordRoutes)
// app.use("/api/reset-password",resetPasswordRoutes)
app.use("/api/auth",authRoutes)
app.use("/send-invoice-email",invoiceEmailRoute)
app.use("/api/customers", customerRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/inventory", inventoryRoutes);

app.get("/aboutUs", authenticateUser, authorizeRoles("admin"), (req, res) => {
    res.send("Hello! Rushit Soni");
});





app.listen(PORT,()=>{
    console.log(`Server started at http://localhost:${PORT}`)
})