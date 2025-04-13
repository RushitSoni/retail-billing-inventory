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
  TablePagination,
  TextField,
  Collapse,
  Box,
} from "@mui/material";
import { XSquare, ChevronDown, ChevronUp } from "lucide-react";
import { fetchBills, deleteBill } from "../../../Redux/Slices/billSlice";
import "./BillList.css";
import { addAuditLog } from "../../../Redux/Slices/auditLogSlice";
import Toast from "../../Shared_Module/Toast/Toast"

export default function BillList() {

  const darkMode = useSelector((state) => state.theme.darkMode);
  const user = useSelector((state)=>state.auth.user)
  const dispatch = useDispatch();
  const initialBills = useSelector((state) => state.bills.list);
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });

  const showToast = (msg, type) => {
    setToast({ open: true, message: msg, type });
  };
  
  useEffect(() => {
    dispatch(fetchBills());
  }, [dispatch]);

  useEffect(() => {
    setBills(initialBills);
  }, [initialBills]);

  const [bills, setBills] = useState("");
  const [order, setOrder] = useState("asc"); // Sorting order
  const [orderBy, setOrderBy] = useState("name"); // Sorting column
  const [page, setPage] = useState(0); // Pagination page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
  const [search, setSearch] = useState(""); // Search input
  const [selectedBill, setSelectedBill] = useState(1); // New state to manage selected product
  const [openRows, setOpenRows] = useState({});

  // Sorting logic
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedBills = [...bills].sort((a, b) => {
    let valueA = a[orderBy];
    let valueB = b[orderBy];
  
    // Handle nested property (customer.name)
    if (orderBy === "customer") {
      valueA = a.customer?.name || "";
      valueB = b.customer?.name || "";
    }
  
    if (order === "asc") return valueA > valueB ? 1 : -1;
    return valueA < valueB ? 1 : -1;
  });

  const filteredBills = sortedBills.filter((bill) =>
    (bill.customer?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const selectBill = (bill) => {
    setSearch(bill.customer?.name || "");
    setSelectedBill(1);
  };

  // Pagination logic
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id) => {

    try{
      await dispatch(deleteBill(id)).unwrap(); // Assuming you have a deleteInventory action

      await dispatch(
            addAuditLog({
              user: user.name,
              operation: "DELETE",
              module: "Shop",
              message: `Deleted Bill.`,
            })
          );
      
          
      showToast("Bill deleted successfully!", "success");
  
      dispatch(fetchBills());
    }
    catch(err){
      showToast("Deletion Failed!", "error")
      console.log(err)
    }

   
  };


  const toggleRow = (id) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bill-section">
      <TextField
        label="Search Item"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setSelectedBill(0);
        }}
        fullWidth
        variant="filled"
        className="input-field"
        autoComplete="off"
        sx={{
          "& label": { color: "gray" }, // Default label color
          "& label.Mui-focused": { color: "gray" }, // Focused label color
          "& .MuiInputBase-input": { color: "gray" }, // Input text color
          "& .MuiFilledInput-root": { backgroundColor: "transparent" }, // Remove background
          "& .MuiFilledInput-underline:before": {
            borderBottomColor: "gray",
          }, // Default underline
          "& .MuiFilledInput-underline:after": {
            borderBottomColor: "gray",
          }, // Focused underline
        }}
      />
      {/* Suggestions List */}
      {search && !selectedBill && filteredBills.length > 0 && (
        <ul className="suggestions-list">
          {[
            ...new Map(
              filteredBills.map((bill) => [bill.customer?.name, bill])
            ).values(),
          ].map((bill, index) => (
            <li key={index} onClick={() => selectBill(bill)}>
              {bill.customer?.name || "Unknown"}
            </li>
          ))}
          {/* {filteredBills.map((bill, index) => (
            <li key={index} onClick={() => selectBill(bill)}>
              {bill.customer?.name || "Unknown"}
            </li>
          ))} */}
        </ul>
      )}
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
              <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                <TableSortLabel
                  active={orderBy === "customer"}
                  direction={orderBy === "customer" ? order : "asc"}
                  onClick={() => handleSort("customer")}
                >
                  Customer
                </TableSortLabel>
              </TableCell>

              <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                Items
              </TableCell>

              <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                
                <TableSortLabel
                  active={orderBy === "grandTotal"}
                  direction={orderBy === "grandTotal" ? order : "asc"}
                  onClick={() => handleSort("grandTotal")}
                >
                 Grand Total
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredBills
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((bill) => (
                <React.Fragment key={bill._id}>
                  {/* Main Row */}
                  <TableRow>
                    <TableCell>{bill.customer?.name || "Unknown"}</TableCell>

                    <TableCell>
                      <IconButton
                        onClick={() => toggleRow(bill._id)}
                        sx={{
                         
                          color: darkMode ? "#fff" : "#000",
                          
                        }}
                      >
                        {openRows[bill._id] ? <ChevronUp /> : <ChevronDown />}
                      </IconButton>
                    </TableCell>

                    <TableCell>{bill.grandTotal}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(bill._id)}
                      >
                        <XSquare />
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {/* Collapsible Row (Items) */}
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                    >
                      <Collapse
                        in={openRows[bill._id]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ margin: 1 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Item Name</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Total</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {bill.items.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell>{item.price}</TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>{item.total}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={filteredBills.length}
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
