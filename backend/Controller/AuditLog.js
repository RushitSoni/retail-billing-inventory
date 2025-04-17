const AuditLog = require("../Model/AuditLog");

//  Fetch Audit Logs
const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 });
    res.status(200).json({ logs });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch audit logs" });
  }
};

// Add Audit Log 
const addAuditLog = async (req, res) => {
  try {
    const newLog = await AuditLog.create(req.body);
    res.status(201).json({ log: newLog });
  } catch (error) {
    //console.log(error.message)
    res.status(500).json({ message: "Failed to add audit log" });
  }
};

//  Delete Audit Log
const deleteAuditLog = async (req, res) => {
  try {
    const { id } = req.params;
    await AuditLog.findByIdAndDelete(id);
    res.status(200).json({ message: "Audit log deleted", id });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete audit log" });
  }
};

module.exports = { getAuditLogs, addAuditLog, deleteAuditLog };
