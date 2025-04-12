const express = require("express");
const { getAuditLogs, addAuditLog, deleteAuditLog } = require("../Controller/AuditLog");
const authorizeRoles = require("../Middleware/authorization")
const authenticateUser = require("../Middleware/auth")

const router = express.Router();

router.get("/",authenticateUser,authorizeRoles("admin"), getAuditLogs);
router.post("/", addAuditLog);
router.delete("/:id",authenticateUser, authorizeRoles("admin"),deleteAuditLog);

module.exports = router;
