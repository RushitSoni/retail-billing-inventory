import React, { useEffect, useState } from "react";
import "./AdminCharts.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { BarChart, Bar } from "recharts";
import { ResponsiveContainer } from "recharts";
import { fetchBills } from "../../../Redux/Slices/billSlice";
import { fetchInventory } from "../../../Redux/Slices/inventorySlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "../../../Redux/Slices/customerSlice";
import { fetchShops } from "../../../Redux/Slices/shopSlice";

const AdminCharts = (props) => {
  const dispatch = useDispatch();
  const bills = useSelector((state) => state.bills.list);
  const customers = useSelector((state) => state.customers.list);
  const shops = useSelector((state) => state.shops.list);
  const inventory = useSelector((state) => state.inventory.list);

  const [growthData, setGrowthData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [topShopsData, setTopShopsData] = useState([]);
  const [shopBranchData, setShopBranchData] = useState([]);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchShops());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchBills());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  useEffect(() => {
    setGrowthData(transformGrowthData(bills, customers, shops, inventory));
  }, [bills, customers, shops, inventory]);

  useEffect(() => {
    setInventoryData(transformInventoryData(inventory));
  }, [inventory]);

  useEffect(() => {
    setTopShopsData(transformTopShops(bills));
    setShopBranchData(transformShopBranchData(bills));
  }, [bills]);

  // Functions to transform API data into required format
  const transformGrowthData = (bills, customers, shops, inventory) => {
    const growthMap = {};

    bills.forEach((bill) => {
      const month = new Date(bill.createdAt).toLocaleString("en-US", {
        month: "short",
      });

      if (!growthMap[month]) {
        growthMap[month] = {
          month,
          users: 0,
          shops: 0,
          bills: 0,
          inventory: 0,
        };
      }

      growthMap[month].bills += 1;
    });

    customers.forEach((customer) => {
      const month = new Date(customer.createdAt).toLocaleString("en-US", {
        month: "short",
      });

      if (!growthMap[month]) {
        growthMap[month] = {
          month,
          users: 0,
          shops: 0,
          bills: 0,
          inventory: 0,
        };
      }

      growthMap[month].users += 1;
    });

    shops.forEach((shop) => {
      const month = new Date(shop.createdAt).toLocaleString("en-US", {
        month: "short",
      });

      if (!growthMap[month]) {
        growthMap[month] = {
          month,
          users: 0,
          shops: 0,
          bills: 0,
          inventory: 0,
        };
      }

      growthMap[month].shops += 1;
    });

    inventory.forEach((inventory) => {
      const month = new Date(inventory.createdAt).toLocaleString("en-US", {
        month: "short",
      });

      if (!growthMap[month]) {
        growthMap[month] = {
          month,
          users: 0,
          shops: 0,
          bills: 0,
          inventory: 0,
        };
      }

      growthMap[month].inventory += 1;
    });

    return Object.values(growthMap);
  };

  const transformShopBranchData = (bills) => {
    const shopBranchMap = {};
    const branchSet = new Set();

    bills.forEach((bill) => {
      const { shopId, branchId } = bill;

      const branch = shopId?.branches?.find((b) => b._id === branchId);
      const branchName = branch ? branch.name : `Branch ${branchId}`;

      const shopKey = `${shopId?.name}_${shopId?._id}`;
      const branchKey = `${branchName}`;

      branchSet.add(branchKey);

      if (!shopBranchMap[shopKey]) {
        shopBranchMap[shopKey] = { shop: shopId?.name };
      }

      if (!shopBranchMap[shopKey][branchKey]) {
        shopBranchMap[shopKey][branchKey] = 0;
      }

      shopBranchMap[shopKey][branchKey] += 1;
    });

    return {
      data: Object.values(shopBranchMap),
      branches: Array.from(branchSet),
    };
  };

  const transformInventoryData = (inventories) => {
    // console.log(inventories)
    const shopBranchMap = {};
    const branchSet = new Set();

    inventories.forEach((inventory) => {
      const { shopId, branchId } = inventory;

      const branch = shopId?.branches?.find((b) => b._id === branchId);
      const branchName = branch ? branch.name : `Branch ${branchId}`;

      const shopKey = `${shopId?.name}_${shopId?._id}`;
      const branchKey = `${branchName}`;

      branchSet.add(branchKey); // Collect all unique branches

      if (!shopBranchMap[shopKey]) {
        shopBranchMap[shopKey] = { shop: shopId?.name };
      }

      if (!shopBranchMap[shopKey][branchKey]) {
        shopBranchMap[shopKey][branchKey] = 0;
      }

      shopBranchMap[shopKey][branchKey] += 1; // Counting inventory items per branch
    });

    console.log({
      data: Object.values(shopBranchMap),
      branches: Array.from(branchSet),
    });

    return {
      data: Object.values(shopBranchMap),
      branches: Array.from(branchSet),
    };
  };

  const transformTopShops = (bills) => {
    const shopMap = {};

    bills.forEach((bill) => {
      const shopId = bill.shopId;
      const shopKey = `${shopId?.name}_${shopId?._id}`;

      if (!shopMap[shopKey]) {
        shopMap[shopKey] = { shop: shopId?.name, bills: 0 };
      }

      shopMap[shopKey].bills += 1;
    });

    console.log(shopMap);
    // Convert to array, sort by purchases (desc), and get top 5
    return Object.values(shopMap)
      .sort((a, b) => b.bills - a.bills)
      .slice(0, 5);
  };

  return (
    <div className="dashboard-grid">
      {/* Sales  Analysis (Line Chart) */}
      <div className="chart-container">
        <h2>Growth Analysis</h2>
        {growthData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#28a745"
                name="Customers"
              />
              <Line
                type="monotone"
                dataKey="shops"
                stroke="#007bff"
                name="Shops"
              />
              <Line
                type="monotone"
                dataKey="bills"
                stroke="#ff9800"
                name="Bills"
              />
              <Line
                type="monotone"
                dataKey="inventory"
                stroke="#9C27B0"
                name="Inventory"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ margin: "5rem" }}>No Data Available.</div>
        )}
      </div>

      {/* Shop & Branch Performance*/}
      <div className="chart-container">
        <h2>Bill Count per Shop & Branch</h2>
        {shopBranchData ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={shopBranchData?.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="shop" />
              <YAxis />
              <Tooltip />
              <Legend />
              {shopBranchData?.branches?.map((branch, index) => (
                <Bar
                  key={branch}
                  dataKey={branch}
                  fill={
                    ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"][
                      index % 5
                    ]
                  }
                  name={branch}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ margin: "5rem" }}>No Data Available.</div>
        )}
      </div>

      <div className="chart-container">
        <h2>Inventory Count per Shop & Branch</h2>
        {inventoryData ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inventoryData?.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="shop" />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* Dynamically render bars based on available branches */}
              {inventoryData?.branches?.map((branch, index) => (
                <Bar
                  key={branch}
                  dataKey={branch}
                  fill={
                    ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"][
                      index % 5
                    ]
                  }
                  name={branch}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ margin: "5rem" }}>No Data Available.</div>
        )}
      </div>

      {/* Top Customers & Purchase Behavior (Horizontal Bar Chart) */}
      <div className="chart-container">
        <h2>Top Shops By Bills Generated</h2>
        {topShopsData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={topShopsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                dataKey="shop"
                type="category"
                tick={{ angle: 0 }}
                width={100}
                tickFormatter={(value) =>
                  value.length > 15 ? `${value.substring(0, 15)}...` : value
                }
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="bills" fill="#008000" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ margin: "5rem" }}>No Data Available.</div>
        )}
      </div>
    </div>
  );
};

export default AdminCharts;
