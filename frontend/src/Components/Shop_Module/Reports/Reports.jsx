import React, { useEffect } from "react";
import "./Reports.css";
import { Download } from "lucide-react";
import { generateExcelReport } from "../../../utils/excelReport";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerByShopAndBranch } from "../../../Redux/Slices/customerSlice";
import { fetchBillsByShopAndBranch } from "../../../Redux/Slices/billSlice";
import { fetchInventoryByShopAndBranch } from "../../../Redux/Slices/inventorySlice";
import { addAuditLog } from "../../../Redux/Slices/auditLogSlice";

const Reports = ({ shopId, branchId, branchName }) => {
  const dispatch = useDispatch();
  const bills = useSelector((state) => state.bills.list);
  const inventory = useSelector((state) => state.inventory.list);
  const customers = useSelector((state) => state.customers.list);
  const user = useSelector((state)=>state.auth.user)
console.log(inventory)
  useEffect(() => {
    dispatch(fetchCustomerByShopAndBranch({ shopId, branchId}));
    dispatch(fetchBillsByShopAndBranch({ shopId, branchId}));

    if (shopId && branchId) {
      dispatch(fetchInventoryByShopAndBranch({ shopId, branchId }));
    }
  }, [shopId, branchId, dispatch]);

  const formattedBillData = [];

  bills.forEach((entry) => {
    if (entry.items && entry.items.length > 0) {
      entry.items.forEach((item) => {
        formattedBillData.push({
          "Customer Name": entry.customer?.name || "N/A",
          "Item Name": item.name,
          "Item Price": item.price,
          "Item Quantity": item.quantity,
          "Total Price": item.price * item.quantity,
          "Grand Total": entry.grandTotal,
          "Created At": entry.createdAt
            ? new Date(entry.createdAt).toLocaleDateString()
            : "N/A",
        });
      });
    } else {
      // If no items, just push the main bill data
      formattedBillData.push({
        "Customer Name": entry.customer?.name || "N/A",
        "Item Name": "No Items",
        "Item Price": "",
        "Item Quantity": "",
        "Total Price": "",
        "Grand Total": entry.grandTotal,
        "Created At": entry.createdAt
          ? new Date(entry.createdAt).toLocaleDateString()
          : "N/A",
      });
    }
  });

  const formattedCustomerData = customers.map((customer) => ({
    "Customer Name": customer.name,
    Phone: customer.phone,
    Email: customer.email,
    Address: customer.address,
    City: customer.city,
    State: customer.state,
    Country: customer.country,
    Pincode: customer.pincode,
    "Created At": customer.createdAt
      ? new Date(customer.createdAt).toLocaleDateString()
      : "N/A",
  }));

  const formattedInventoryData = inventory.map((item) => ({
    "Item Name": item.name,
    Price: item.price,
    Stock: item.stock,
    "CGST (%)": item.cgst,
    "SGST (%)": item.sgst,
    "Discount (%)": item.discount,
    "Shop ID": item.shopId.name,
    "Branch ID": branchName,
    "Created At": item.createdAt
      ? new Date(item.createdAt).toLocaleDateString()
      : "N/A",
    "Updated At": item.updatedAt
      ? new Date(item.updatedAt).toLocaleDateString()
      : "N/A",
  }));

  // Define headers for Excel reports
  const reports = [
    {
      id: "customers",
      label: "Customer Report",
      data: formattedCustomerData,
      headers: [
        "Customer Name",
        "Phone",
        "Email",
        "Address",
        "City",
        "State",
        "Country",
        "Pincode",
        "Created At",
      ],
      filename: "Customers.xlsx",
    },
    {
      id: "bills",
      label: "Bills Report",
      data: formattedBillData,
      headers: [
        "Customer Name",
        "Item Name",
        "Item Price",
        "Item Quantity",
        "Total Price",
        "Grand Total",
        "Created At",
      ],
      filename: "Bills.xlsx",
    },
    {
      id: "inventory",
      label: "Inventory Report",
      data: formattedInventoryData,
      headers: [
        "Item Name",
        "Price",
        "Stock",
        "CGST (%)",
        "SGST (%)",
        "Discount (%)",
        "Shop ID",
        "Branch ID",
        "Created At",
        "Updated At",
      ],
      filename: `Inventory_${branchName}.xlsx`,
    },
  ];

  return (
    <div className="reports-tab">
      <h2 className="reports-title">Reports</h2>
      <ul className="reports-list">
        {reports.map((report) => (
          <li key={report.id} className="report-item">
            <span>{report.label}</span>

            <button
              className="details-btn"
              onClick={() =>{

                generateExcelReport({
                  data: report.data,
                  headers: report.headers,
                  filename: report.filename,
                })

                
                dispatch(
                  addAuditLog({
                    user: user.name,
                    operation: "REPORT",
                    module: "Shop",
                    message: `${report.label} generated for ${branchName}.`,
                  })
                );
              }
               

                                
              }
            >
              <Download size={20} /> Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reports;
