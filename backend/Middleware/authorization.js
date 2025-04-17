const jwt = require("jsonwebtoken");
const User = require("../Model/User");

const ACCESS_SECRET = process.env.JWT_SECRET;



//  Role-Based Authorization Middleware
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
       
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Denied: You do not have permission" });
        }
        next();
    };
};

module.exports = authorizeRoles ;
