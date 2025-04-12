import React, { useEffect } from "react";
import "./AdminReports.css";
import { Download } from "lucide-react";
import { generateExcelReport } from "../../../utils/excelReport";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../../Redux/Slices/userSlice";
import { addAuditLog, fetchAuditLogs } from "../../../Redux/Slices/auditLogSlice";
import { fetchShops } from "../../../Redux/Slices/shopSlice";

const AdminReports = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const shops = useSelector((state) => state.shops.list);
  const auditLogs = useSelector((state) => state.auditLogs.list);
  const user = useSelector((state)=>state.auth.user)

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAuditLogs());
    dispatch(fetchShops());
  }, [dispatch]);

  const formattedShopData = [];
  shops.forEach((shop) => {
    if (shop.branches && shop.branches.length > 0) {
      shop.branches.forEach((branch) => {
        formattedShopData.push({
          "Shop Name": shop.name,
          Owner: shop.owner?.name,
          Category: shop.category,
          Logo: shop.logo,
          Description: shop.description,
          "Branch Name": branch.name,
          "Manager":branch.managerId || "N/A",
          "Branch Location": `${branch.address}, ${branch.city}, ${branch.state}, ${branch.country}, ${branch.incode}` || "N/A",
         
        });
      });
    } else {
      // If no branches, push only shop details
      formattedShopData.push({
        "Shop Name": shop.name,
        "Owner ID": shop.owner,
        Category: shop.category,
        Logo: shop.logo,
        Description: shop.description,
        "Branch Name": "No Branches",
        "Manager": "",
        "Branch Location": ""
      });
    }
  });

  const formattedUserData = users.map((user) => ({
    "User Name": user.name,
    Email: user.email,
    Role: user.role,
    "Is Verified": user.isVerified ? "Yes" : "No",
    "Created At": user.createdAt
      ? new Date(user.createdAt).toLocaleDateString()
      : "N/A",
    "Updated At": user.updatedAt
      ? new Date(user.updatedAt).toLocaleDateString()
      : "N/A",
  }));
  

  const formattedAuditLogData = auditLogs.map((log) => ({
    "User": log.user,
    "Operation": log.operation,
    "Module": log.module,
    "Message": log.message,
    "Created At": log.createdAt
      ? new Date(log.createdAt).toLocaleDateString()
      : "N/A",
    "Updated At": log.updatedAt
      ? new Date(log.updatedAt).toLocaleDateString()
      : "N/A",
  }));
  
  const reports = [
    {
        id: "shops",
        label: "Shop Report",
        data: formattedShopData,
        headers: [
          "Shop Name",
          "Owner ID",
          "Category",
          "Logo",
          "Description",
          "Branch Name",
          "Manager",
          "Branch Location"
        ],
        filename: "Shops.xlsx",
      },
      {
        id: "users",
        label: "User Report",
        data: formattedUserData,
        headers: [
          "User Name",
          "Email",
          "Role",
          "Is Verified",
          "Created At",
          "Updated At",
        ],
        filename: "Users.xlsx",
      },
      {
        id: "auditLogs",
        label: "Audit Log Report",
        data: formattedAuditLogData,
        headers: [
          "User",
          "Operation",
          "Module",
          "Message",
          "Created At",
          "Updated At",
        ],
        filename: "AuditLogs.xlsx",
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
              onClick={() =>
               {

                generateExcelReport({
                  data: report.data,
                  headers: report.headers,
                  filename: report.filename,
                })

                dispatch(
                  addAuditLog({
                    user: user.name,
                    operation: "REPORT",
                    module: "Admin",
                    message: `${report.label} generated.`,
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

export default AdminReports;
