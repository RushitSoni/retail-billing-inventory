const express = require('express')
const  app = express()
const  dotenv = require('dotenv')
const connectMongoDB = require('./Connection')
const cors = require('cors')

const cookieParser = require('cookie-parser') 
dotenv.config()

const PORT = process.env.PORT

const authRoutes = require("./Route/auth")
const invoiceEmailRoute = require("./Route/invoice")

const authenticateUser = require("./Middleware/auth")
const customerRoutes = require("./Route/Customer")
const billRoutes = require("./Route/Bill")
const shopRoutes = require("./Route/Shop");
const inventoryRoutes = require("./Route/Inventory");
const userRoutes = require("./Route/users")
const inventoryRequestRoutes = require("./Route/InventoryRequest")
const uploadRoutes = require("./Route/upload");
const auditLogRoutes = require("./Route/AuditLog")

const session = require("express-session");
const passport = require("passport");
require("./Middleware/passportConfig"); 



// Middlewares
app.use(cors({origin: `${process.env.CLIENT_URL}`, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(session({ secret: "your_secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//Connect to MongoDB
connectMongoDB()


app.use("/api/auth",authRoutes)
app.use("/send-invoice-email",invoiceEmailRoute)
app.use("/api/customers",authenticateUser, customerRoutes);
app.use("/api/bills",authenticateUser, billRoutes);
app.use("/api/shops",authenticateUser, shopRoutes);
app.use("/api/inventory",authenticateUser, inventoryRoutes);
app.use("/api/users",authenticateUser, userRoutes);
app.use("/api/inventory-requests",authenticateUser,inventoryRequestRoutes)
app.use("/api/upload", uploadRoutes);
app.use("/api/audit-logs",auditLogRoutes)




app.listen(PORT,()=>{
    console.log(`Server started at ${process.env.BACKEND_SERVER_URL}`)
})