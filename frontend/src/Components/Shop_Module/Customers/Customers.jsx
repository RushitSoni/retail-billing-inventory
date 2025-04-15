import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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
} from "@mui/material";
import { Eye } from "lucide-react";
import "./Customers.css";
import { fetchCustomerByShopAndBranch } from "../../../Redux/Slices/customerSlice";


export default function Customers() {

  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();
  const { shopId, branchId } = useParams();
  const fetchedCustomers = useSelector((state)=>state.customers.list)
  const navigate = useNavigate()
  const [customers,setCustomers] = useState([])
  const [order, setOrder] = useState("asc"); // Sorting order
  const [orderBy, setOrderBy] = useState("name"); // Sorting column
  const [page, setPage] = useState(0); // Pagination page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
  const [search, setSearch] = useState(""); // Search input
  const [selectedCustomer, setSelectedCustomer] = useState(1); // New state to manage selected product


  useEffect(() => {
    dispatch(fetchCustomerByShopAndBranch({shopId,branchId}));
  }, [dispatch,shopId,branchId]);

  useEffect(() => {
    setCustomers(fetchedCustomers)
  }, [fetchedCustomers]);

  // Sorting logic
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    if (order === "asc") return a[orderBy] > b[orderBy] ? 1 : -1;
    return a[orderBy] < b[orderBy] ? 1 : -1;
  });

  const filteredCustomers = sortedCustomers.filter((customer) =>
    (customer.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const selectCustomer = (customer) => {
    setSearch(customer.name || "");
    setSelectedCustomer(1);
  };

  // Pagination logic
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>

      <div className="bill-section">
        <TextField
          label="Search Customer By Name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedCustomer(0);
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
        {search && !selectedCustomer && filteredCustomers.length > 0 && (
          <ul className="suggestions-list">
            {filteredCustomers.map((customer, index) => (
              <li key={index} onClick={() => selectCustomer(customer)}>
                {customer.name || ""}
              </li>
            ))}
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
                {["name", "phone","email"].map((col) => (
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
              {filteredCustomers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.email}</TableCell>

                    <TableCell>
                      <IconButton
                        color="success"
                        onClick={() => {
                           navigate(`/customer/${customer._id}`)
                        }}
                      >
                        <Eye />
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
          count={filteredCustomers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            backgroundColor: darkMode ? "#333" : "#fff",
            color: darkMode ? "#fff" : "#000",
          }}
        />
      </div>
    </div>
  );
}
