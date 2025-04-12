import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchShopById, updateShop } from "../../../Redux/Slices/shopSlice";
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
import { PlusSquare, XSquare } from "lucide-react";
import "./Staff.css";
import { fetchAllUsers } from "../../../Redux/Slices/userSlice";
import Toast from "../../Shared_Module/Toast/Toast"
import {addAuditLog} from "../../../Redux/Slices/auditLogSlice"

export default function Staff() {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();
  const { shopId, branchId } = useParams();
  const initialShop = useSelector((state) => state.shops.currentShop);
  const [staff, setStaff] = useState([]);
  const user = useSelector((state)=>state.auth.user)
  //console.log(staff)
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });

  const showToast = (msg, type) => {
    setToast({ open: true, message: msg, type });
  };

  const { users } = useSelector((state) => state.users);
  //console.log(users)

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchShopById(shopId));
  }, [dispatch, shopId]);

  useEffect(() => {
    if (initialShop && branchId) {
      // Find the branch and set its staff
      const branch = initialShop.branches?.find((b) => b._id === branchId);
      if (branch) {
        setStaff(branch.billingStaffIds || []);
      }
    }
  }, [initialShop, branchId]);

  const [order, setOrder] = useState("asc"); // Sorting order
  const [orderBy, setOrderBy] = useState("name"); // Sorting column
  const [page, setPage] = useState(0); // Pagination page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
  const [search, setSearch] = useState(""); // Search input
  const [selectedStaff, setSelectedStaff] = useState(1); // New state to manage selected product

  // Sorting logic
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedStaff = [...staff].sort((a, b) => {
    if (order === "asc") return a[orderBy] > b[orderBy] ? 1 : -1;
    return a[orderBy] < b[orderBy] ? 1 : -1;
  });

  const filteredStaff = sortedStaff.filter((staff) =>
    (staff.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const selectStaff = (staff) => {
    setSearch(staff.name || "");
    setSelectedStaff(1);
  };

  // Pagination logic
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userDetails, setUserDetails] = useState(null);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchTerm(query);

    if (query.length > 0) {
      const matches = users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(matches);
    } else {
      setFilteredUsers([]);
    }
  };

  const selectUser = (user) => {
    setSearchTerm(user.name);
    setUserDetails(user);
    setFilteredUsers([]); // Hide suggestions after selection
  };

  const handleAddStaff = () => {
    if (!userDetails) return;

    // Find the branch to update
    const updatedBranches = initialShop.branches.map((branch) => {
      if (branch._id === branchId) {
        // Prevent duplicate entries
        const staffExists = branch.billingStaffIds?.some(
          (staff) => staff._id === userDetails._id
        );
  
        if (staffExists){
          alert("Staff Member Already Exists!")
          return branch;
        } 

        
        return {
          ...branch,
          billingStaffIds: [...(branch.billingStaffIds || []), userDetails._id],
        };
      }
      return branch;
    });

    // Dispatch updateShop action with correct parameters
    try{
      dispatch(
        updateShop({
          id: initialShop._id,
          updatedData: { branches: updatedBranches },
        })
      ).unwrap();
      dispatch(fetchShopById(shopId));
  
      // Clear selection
      setUserDetails(null);
      setSearchTerm("");

      dispatch(
        addAuditLog({
          user: user.name,
          operation: "CREATE",
          module: "Shop",
          message: `Staff member added.`,
        })
      );

      showToast("Staff member added successfully!", "success")

    }
    catch(error){
      console.log("Staff not added : ",error.message)
    }
    
  };

  const handleRemoveStaff = (staffId) => {
    if (!staffId) return;

    // Update branches by filtering out the staffId from billingStaffIds
    const updatedBranches = initialShop.branches.map((branch) => {
      if (branch._id === branchId) {
        return {
          ...branch,
          billingStaffIds: branch.billingStaffIds?.filter(
            (staff) => staff._id !== staffId
          ),
        };
      }
      return branch;
    });

    // Dispatch updateShop action with correct parameters
    try{

      dispatch(
        updateShop({
          id: initialShop._id,
          updatedData: { branches: updatedBranches },
        })
      );
      dispatch(fetchShopById(shopId));


      dispatch(
        addAuditLog({
          user: user.name,
          operation: "DELETE",
          module: "Shop",
          message: `Staff member deleted.`,
        })
      );

      showToast("Staff member deleted successfully!", "success")

    }
    catch(error){
      console.log("Error During Staff Deletion : ",error.message)
    }
    
  };

  return (
    <div>
      <div className="bill-section">
        <TextField
          label="Search User"
          value={searchTerm}
          onChange={handleSearch}
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
        {filteredUsers.length > 0 && (
          <ul className="suggestions-list">
            {filteredUsers.map((user, index) => (
              <li key={index} onClick={() => selectUser(user)}>
                {user.name}
              </li>
            ))}
          </ul>
        )}

        {/* Show Customer Details if Selected */}
        {userDetails && (
          <div className="customer-details">
            <div className="detail-col">
              <p>
                <strong>Name:</strong> {userDetails.name}
              </p>
              <p>
                <strong>Email:</strong> {userDetails.email}
              </p>

              <button className="details-btn" onClick={handleAddStaff}>
                <PlusSquare size={20} /> ADD
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bill-section">
        <TextField
          label="Search Staff Member By Name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedStaff(0);
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
        {search && !selectedStaff && filteredStaff.length > 0 && (
          <ul className="suggestions-list">
            {filteredStaff.map((staff, index) => (
              <li key={index} onClick={() => selectStaff(staff)}>
                {staff.name || ""}
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
                {["name", "email"].map((col) => (
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
              {filteredStaff
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((staff) => (
                  <TableRow key={staff._id}>
                    <TableCell>{staff.name}</TableCell>
                    <TableCell>{staff.email}</TableCell>

                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => {
                          handleRemoveStaff(staff._id);
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
          count={filteredStaff.length}
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
      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, open: false })} />
    </div>
  );
}
