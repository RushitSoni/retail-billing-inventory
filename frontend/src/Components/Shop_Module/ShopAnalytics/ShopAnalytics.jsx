import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./ShopAnalytics.css"; // Updated CSS
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchShopById } from "../../../Redux/Slices/shopSlice";
import BranchCharts from "../BranchCharts/BranchCharts";

export default function ShopAnalytics() {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("all");
  const fetchedShop = useSelector((state) => state.shops.currentShop);
  const [tabs, setTabs] = useState([]);

  const { shopId } = useParams();

  useEffect(() => {
    dispatch(fetchShopById(shopId));
  }, [dispatch, shopId]);

  useEffect(() => {
    setTabs(transformShopTabs(fetchedShop));
  }, [fetchedShop]);

  const transformShopTabs = (shop) => {
    if (!shop || !shop.branches) return [{ id: "all", label: "All" }];

    return [
      { id: "all", label: "All" },
      ...shop.branches.map((branch) => ({
        id: branch._id,
        label: branch.name,
      })),
    ];
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
          {selectedTab === "all" && <BranchCharts shopId={shopId} branchId='all' />}
          {fetchedShop?.branches.some(
            (branch) => branch._id === selectedTab
          ) && <BranchCharts shopId={shopId} branchId={selectedTab} />}
        </div>
      </motion.div>
    </div>
  );
}
