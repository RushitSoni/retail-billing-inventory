import { useState } from "react";
import { motion } from "framer-motion";
import "./Admin.css"; // Updated CSS
import { useSelector } from "react-redux";
import AdminCharts from "../AdminCharts/AdminCharts";
import AuditLog from "../AuditLog/AuditLog";
import AdminReports from "../AdminReports/AdminReports";

const tabs = [
  { id: 0, label: "Analytics" },
  { id: 1, label: "Audit Log" },
  { id: 2, label: "Generate Reports" },
];

export default function Admin() {
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [selectedTab, setSelectedTab] = useState(2);
  return (
    <div className={`main-container ${darkMode ? "dark" : "light"}`}>
      <motion.div
        className="analytics-box"
        initial={{ opacity: 0, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        whileHover={{ scale: 1.005 }}
      >
        {/* Tabs List */}
        <div className="tabs-wrapper">
          <div className="tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`tab-button ${
                  selectedTab === tab.id ? "active" : ""
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          {selectedTab === 0 && <AdminCharts/>}
          {selectedTab === 1 && <AuditLog/>}
          {selectedTab === 2 && <AdminReports/>}
         
        </div>
      </motion.div>
    </div>
  );
}
