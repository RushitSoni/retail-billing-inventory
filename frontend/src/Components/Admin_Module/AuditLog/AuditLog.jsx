import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TableSortLabel,
  TablePagination
} from "@mui/material";
import { XSquare } from "lucide-react";
import "./AuditLog.css";
import { addAuditLog, deleteAuditLog, fetchAuditLogs } from "../../../Redux/Slices/auditLogSlice";
import Toast from '../../Shared_Module/Toast/Toast'

export default function AuditLog() {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const user = useSelector((state)=>state.auth.user)
  const dispatch = useDispatch();
  const logs = useSelector((state) => state.auditLogs.list);


  
  useEffect(() => {
    dispatch(fetchAuditLogs());
  }, [dispatch]);


  const [order, setOrder] = useState("asc"); // Sorting order
  const [orderBy, setOrderBy] = useState("user"); // Sorting column
  const [page, setPage] = useState(0); // Pagination page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });

  const showToast = (msg, type) => {
    setToast({ open: true, message: msg, type });
  };


  // Sorting logic
  const handleSort = (property) => {

    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedLogs = [...logs].sort((a, b) => {
    if (order === "asc") return a[orderBy] > b[orderBy] ? 1 : -1;
    return a[orderBy] < b[orderBy] ? 1 : -1;
  });

  // Pagination logic
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };




  const handleRemoveLog = async (id) => {
    try{
      await dispatch(deleteAuditLog(id)).then(()=>showToast("AuditLog deleted successfully!", "success"));
      await dispatch(
        addAuditLog({
          user: user.name,
          operation: "DELETE",
          module: "Admin",
          message: "Audit Log Deleted.",
        })
      );
    }
    catch(err){
      showToast("AuditLog deletion Failed!", "error")
      console.log(err)
    }
   
  };

  return (
    <div className="main-section">
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: darkMode ? "#333" : "#fff",
          color: darkMode ? "#fff" : "#000",
          "& .MuiTableCell-root": {
            color: darkMode ? "#fff" : "#000",
          },
          "& .MuiTableSortLabel-root": {
            color: darkMode ? "#fff !important" : "#000 !important",
          },
          "& .MuiTableSortLabel-root.Mui-active": {
            color: "#1976d2 !important",
          },
          "& .MuiTableSortLabel-icon": {
            color: "#1976d2 !important", // ✅ Change arrow color
          },
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {["user", "operation","module","message"].map((col) => (
                <TableCell
                  key={col}
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                >
                  <TableSortLabel
                    active={orderBy === col}
                    direction={orderBy === col ? order : "asc"}
                    onClick={() => handleSort(col)}
                  >
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedLogs
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.operation}</TableCell>
                  <TableCell>{log.module}</TableCell>
                  <TableCell>{log.message}</TableCell>

                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => {
                        handleRemoveLog(log._id);
                      }}
                    >
                      <XSquare />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={logs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          backgroundColor: darkMode ? "#333" : "#fff",
          color: darkMode ? "#fff" : "#000",
        }}
      />

      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, open: false })} />


    </div>
  );
}
