import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./BranchDetails.css"; // Updated CSS
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BillList from "../BillList/BillList";
import BranchCharts from "../BranchCharts/BranchCharts";
import { fetchShopById } from "../../../Redux/Slices/shopSlice";
import Reports from "../Reports/Reports";
import Staff from "../Staff/Staff";
import InventoryTransfer from "../Inventory_Transfer/InventoryTransfer";
import Customers from "../Customers/Customers";

const tabs = [
  { id: 0, label: "Bills" },
  { id: 1, label: "Staff" },
  { id: 2, label: "Customers" },
  { id: 3, label: "Analytics" },
  { id: 4, label: "Generate Reports" },
  { id: 5, label: "Inventory Transfer" },
];

export default function TabsComponent() {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();
  const shop = useSelector((state) => state.shops.currentShop);
  const [selectedTab, setSelectedTab] = useState(0);

  const { shopId, branchId } = useParams();

  useEffect(() => {
    dispatch(fetchShopById(shopId));
  }, [dispatch, shopId]);

  const getBranchName = () => {
    if (!shop || !shop.branches) return "";

    const branch = shop.branches.find((b) => b._id === branchId);
    return branch ? branch.name : "Branch Not Found";
  };

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
          {selectedTab === 0 && <BillList />}
          {selectedTab === 1 && <Staff />}
          {selectedTab === 2 && <Customers/>}
          {selectedTab === 3 && (
            <BranchCharts shopId={shopId} branchId={branchId} />
          )}
          {selectedTab === 4 && (
            <Reports
              shopId={shopId}
              branchId={branchId}
              branchName={getBranchName()}
            />
          )}
          {selectedTab === 5 && <InventoryTransfer></InventoryTransfer>}
        </div>
      </motion.div>
    </div>
  );
}
