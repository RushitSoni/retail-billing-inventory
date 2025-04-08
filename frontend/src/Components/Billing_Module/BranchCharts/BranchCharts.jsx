import React, { useEffect, useState } from "react";
import "./BranchCharts.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { BarChart, Bar } from "recharts";
import { ResponsiveContainer } from "recharts";
import {
  fetchBillsByShop,
  fetchBillsByShopAndBranch,
} from "../../../Redux/Slices/billSlice";
import {
  fetchInventoryByShop,
  fetchInventoryByShopAndBranch,
} from "../../../Redux/Slices/inventorySlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerByShop,fetchCustomerByShopAndBranch } from "../../../Redux/Slices/customerSlice";

const COLORS = [
  "#4CAF50",
  "#8BC34A",
  "#FF9800",
  "#FF5722",
  "#03A9F4",
  "#673AB7",
  "#9C27B0",
  "#FFEB3B",
  "#F44336",
];

const BranchCharts = (props) => {
  const dispatch = useDispatch();
  const bills = useSelector((state) => state.bills.list); // Assuming bills are stored in Redux state
  const [salesData, setSalesData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [topCustomersData, setTopCustomersData] = useState([]);
  const [shopBranchData, setShopBranchData] = useState([]);

  const inventory = useSelector((state) => state.inventory.list);
  const [stockData, setStockData] = useState([]);

  const customers = useSelector((state) => state.customers.list);
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    if (props.shopId && props.branchId) {
      if (props.branchId === "all") {
        dispatch(fetchCustomerByShop({
          shopId: props.shopId
        }));
      } else {
        dispatch(
          fetchCustomerByShopAndBranch({
            shopId: props.shopId,
            branchId: props.branchId,
          })
        );
      }
    }
  }, [props.shopId, props.branchId,dispatch]);

  useEffect(() => {
   
      setCustomerData(transformCustomerData(customers, bills));
    
  }, [customers, bills]);

  useEffect(() => {
    if (props.shopId && props.branchId) {
      if (props.branchId === "all") {
        dispatch(fetchBillsByShop({ shopId: props.shopId }));
      } else {
        dispatch(
          fetchBillsByShopAndBranch({
            shopId: props.shopId,
            branchId: props.branchId,
          })
        );
      }
    }
  }, [props.shopId, props.branchId, dispatch]);

  useEffect(() => {
    console.log(bills);
    setSalesData(transformSalesData(bills));
    setProductData(transformProductData(bills));
    setTopCustomersData(transformTopCustomers(bills));
    setShopBranchData(transformShopBranchData(bills));
  }, [bills]);

  useEffect(() => {
    if (props.shopId && props.branchId) {
      if (props.branchId === "all") {
        dispatch(fetchInventoryByShop({
          shopId: props.shopId
        }));
      } else {
        dispatch(
          fetchInventoryByShopAndBranch({
            shopId: props.shopId,
            branchId: props.branchId,
          })
        );
      }
    }
  }, [props.shopId, props.branchId, dispatch]);
  // console.log("Redux State",Array.isArray(initialProducts))
  useEffect(() => {
    setStockData(transformStockData(inventory));
  }, [inventory]);

  const transformStockData = (inventory) => {
    return inventory.map((item) => ({
      product: item.name,
      stock: item.stock,
    }));
  };
  // Function to transform API data into required format
  const transformSalesData = (bills) => {
    const salesMap = {};

    bills.forEach((bill) => {
      const month = new Date(bill.createdAt).toLocaleString("en-US", {
        month: "short",
      });

      if (!salesMap[month]) {
        salesMap[month] = 0;
      }

      salesMap[month] += bill.grandTotal;
    });

    return Object.keys(salesMap).map((month) => ({
      month,
      sales: salesMap[month],
    }));
  };

  const transformProductData = (bills) => {
    const productMap = {};

    bills.forEach((bill) => {
      bill.items.forEach((item) => {
        if (!productMap[item.name]) {
          productMap[item.name] = 0;
        }
        productMap[item.name] += item.total;
      });
    });

    return Object.keys(productMap).map((name) => ({
      name,
      value: productMap[name],
    }));
  };
  const transformCustomerData = (customers, bills) => {
    const customerMap = {};

    bills.forEach((bill) => {
      const month = new Date(bill.createdAt).toLocaleString("en-US", {
        month: "short",
      });

      if (!customerMap[month]) {
        customerMap[month] = { month, newCustomers: 0, totalBills: 0 };
      }

      customerMap[month].totalBills += 1;
    });

    customers.forEach((customer) => {
      const month = new Date(customer.createdAt).toLocaleString("en-US", {
        month: "short",
      });

      if (!customerMap[month]) {
        customerMap[month] = { month, newCustomers: 0, totalBills: 0 };
      }

      customerMap[month].newCustomers += 1; // Assuming all fetched customers are new for now
    });

    console.log(customerMap);

    Object.keys(customerMap).forEach((month) => {
      customerMap[month].returningCustomers = Math.max(
        customerMap[month].totalBills - customerMap[month].newCustomers,
        0
      );
    });

    

    return Object.values(customerMap);
  };

  const transformTopCustomers = (bills) => {
    const customerMap = {};

    bills.forEach((bill) => {
      const customerId = bill.customer._id;

      if (!customerMap[customerId]) {
        customerMap[customerId] = {
          customer: bill.customer.name,
          purchases: 0,
        };
      }

      customerMap[customerId].purchases += bill.grandTotal;
    });

    console.log(customerMap);
    // Convert to array, sort by purchases (desc), and get top 5
    return Object.values(customerMap)
      .sort((a, b) => b.purchases - a.purchases)
      .slice(0, 5);
  };

  const transformShopBranchData = (bills) => {
    const shopBranchMap = {};
    const branchSet = new Set();

    bills.forEach((bill) => {
      const { shopId, branchId } = bill;
      console.log(bill);

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

      shopBranchMap[shopKey][branchKey] += bill.grandTotal;
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

  return (
    <div className="dashboard-grid">
      {/* Sales  Analysis (Line Chart) */}
      <div className="chart-container">
        <h2>Sales Analysis</h2>
        {salesData.length>0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#28a745" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{margin:"5rem"}}>No Data Available.</div>
        )}
      </div>

      {/* Product Performance (Pie Chart) */}
      <div className="chart-container">
        <h2>Product Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={productData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
            >
              {productData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Stock & Inventory Management (Bar Chart) */}
      <div className="chart-container">
        <h2>Stock & Inventory Management</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="stock" fill="#28a745" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Shop & Branch Performance (Grouped Bar Chart) */}
      {props.branchId === "all" ? (
        <div className="chart-container">
          <h2>Branch Wise Sales Data</h2>
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
        </div>
      ) : (
        <div></div>
      )}

      {/* Customer Growth & Engagement (Stacked Bar Chart) */}
      <div className="chart-container">
        <h2>Customer Growth & Engagement</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={customerData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="newCustomers" stackId="a" fill="#82ca9d" />
            <Bar dataKey="returningCustomers" stackId="a" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Customers & Purchase Behavior (Horizontal Bar Chart) */}
      <div className="chart-container">
        <h2>Top Customers & Purchase Behavior</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart layout="vertical" data={topCustomersData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              dataKey="customer"
              type="category"
              tick={{ angle: 0 }}
              width={100}
              tickFormatter={(value) =>
                value.length > 15 ? `${value.substring(0, 15)}...` : value
              }
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="purchases" fill="#FFBB28" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BranchCharts;
