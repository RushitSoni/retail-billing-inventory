const express = require("express");
const { getAuditLogs, addAuditLog, deleteAuditLog } = require("../Controller/AuditLog");


const router = express.Router();

router.get("/", getAuditLogs);
router.post("/", addAuditLog);
router.delete("/:id", deleteAuditLog);

module.exports = router;
