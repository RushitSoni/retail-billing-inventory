import { React, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  // Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Edit, XSquare, Plus } from "lucide-react";
import { fetchUserShops } from "../../Redux/Slices/shopSlice";
import {
  addInventory,
  updateInventory,
  deleteInventory,
  fetchInventoryByShopAndBranch,
} from "../../Redux/Slices/inventorySlice";
import "./Inventory.css";
import Toast from "../Shared_Module/Toast/Toast";
import { addAuditLog } from "../../Redux/Slices/auditLogSlice";

export default function Inventory() {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();
  const shops = useSelector((state) => state.shops.list);
  const initialProducts = useSelector((state) => state.inventory.list);
  const user = useSelector((state)=>state.auth.user)
  const [selectedShop, setSelectedShop] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  
  useEffect(() => {
    if (selectedShop && selectedBranch) {
      dispatch(
        fetchInventoryByShopAndBranch({
          shopId: selectedShop._id,
          branchId: selectedBranch._id,
        })
      );
    }
  }, [selectedShop, selectedBranch, dispatch]);
  
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
   dispatch(fetchUserShops(user?._id))
  }, [dispatch,user]);

 
  const [products, setProducts] = useState("");
  const [order, setOrder] = useState("asc"); // Sorting order
  const [orderBy, setOrderBy] = useState("name"); // Sorting column
  const [page, setPage] = useState(0); // Pagination page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
  const [search, setSearch] = useState(""); // Search input
  const [selectedProduct, setSelectedProduct] = useState(1); // New state to manage selected product
  const [openModal, setOpenModal] = useState(false);
  const [edit, setEdit] = useState(0);
  const [editProduct, setEditProduct] = useState(null);
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

  const sortedProducts = [...products].sort((a, b) => {
    if (order === "asc") return a[orderBy] > b[orderBy] ? 1 : -1;
    return a[orderBy] < b[orderBy] ? 1 : -1;
  });

  const filteredProducts = sortedProducts.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectProduct = (product) => {
    setSearch(product.name);
    setSelectedProduct(1); // Hide suggestions after selection
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
    await dispatch(deleteInventory(id)).unwrap(); // Assuming you have a deleteInventory action

    await dispatch(
      addAuditLog({
        user: user.name,
        operation: "DELETE",
        module: "Inventory",
        message: `Deleted Inventory.`,
      })
    );

    
    showToast("Inventory item deleted successfully!", "success");

    if (selectedShop && selectedBranch) {
      dispatch(
        fetchInventoryByShopAndBranch({
          shopId: selectedShop._id,
          branchId: selectedBranch._id,
        })
      );
    }
  };

  const handleAddOrEdit = async (e) => {
    if (!editProduct) return;

    const productData = {
      name: editProduct.name,
      price: editProduct.price,
      stock: editProduct.stock,
      cgst: editProduct.cgst,
      sgst: editProduct.sgst,
      discount: editProduct.discount,
      shopId: selectedShop ? selectedShop._id : "",
      branchId: selectedBranch ? selectedBranch._id : "",
    };

    try {
      if (edit) {
        //console.log(editProduct._id, productData);
        await dispatch(
          updateInventory({ id: editProduct._id, updatedData: productData })
        ).unwrap();

        await dispatch(
          addAuditLog({
            user: user.name,
            operation: "UPDATE",
            module: "Inventory",
            message: `Updated Inventory ${productData.name}.`,
          })
        );
    
        
        showToast("Inventory item updated successfully!", "success");
      } else {
        await dispatch(addInventory(productData)).unwrap();
        
        await dispatch(
          addAuditLog({
            user: user.name,
            operation: "CREATE",
            module: "Inventory",
            message: `Added Inventory ${productData.name}.`,
          })
        );
    
        
        showToast("Inventory item added successfully!", "success");
      }

      if (selectedShop && selectedBranch) {
        dispatch(
          fetchInventoryByShopAndBranch({
            shopId: selectedShop._id,
            branchId: selectedBranch._id,
          })
        );
      }
      setOpenModal(false);
      setEditProduct(null);
      setEdit(0);
      
    } catch (error) {
      console.error("Error saving inventory item:", error);
    }
  };

  const columnNames = {
    cgst: "CGST(%)",
    sgst: "SGST(%)",
    discount: "Discount (%)",
  };

  return (
    <div className={`inventory-container ${darkMode ? "dark" : "light"}`}>
      <motion.div
        className="inventory-box"
        initial={{ opacity: 0, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        whileHover={{ scale: 1.005 }}
      >
        {/* <Typography variant="h5" sx={{ mt: 5 }}>
          Inventory:
        </Typography> */}
        <div className="table-section">
          {/* Shop Dropdown */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl
                fullWidth
                variant="filled"
                sx={{
                  mb: 2,
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
              >
                <InputLabel>Shop</InputLabel>
                <Select
                  value={selectedShop.name}
                  onChange={(e) => {
                    setSelectedShop(e.target.value);
                    setSelectedBranch(""); // Reset branch when shop changes
                  }}
                >
                  {shops.map((shop) => (
                    <MenuItem key={shop._id} value={shop}>
                      {shop.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Branch Dropdown (Based on Selected Shop) */}
            <Grid item xs={6}>
              <FormControl
                fullWidth
                variant="filled"
                sx={{
                  mb: 2,
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
              >
                <InputLabel>Branch</InputLabel>
                <Select
                  value={selectedBranch?.name}
                  onChange={(e) => {
                    console.log(e.target.value, selectedShop["branches"]);
                    setSelectedBranch(e.target.value);
                  }}
                  disabled={!selectedShop} // Disable if no shop selected
                >
                  {selectedShop?.branches?.map((branch) => (
                    <MenuItem key={branch._id} value={branch}>
                      {branch.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </div>

        <div className="table-section">
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <Button
              variant="contained" // Use 'contained' for background color
              startIcon={<Plus />}
              onClick={() => {
                setOpenModal(true);
                setEdit(0);
              }}
              sx={{
                mt: 2,
                mb: 2,
                backgroundColor: "#28a745",
                color: "white",
                "&:hover": {
                  backgroundColor: "#218838",
                },
              }}
            >
              Add Item
            </Button>
          </Grid>
          <TextField
            label="Search Item"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedProduct(0);
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
          {search && !selectedProduct && filteredProducts.length > 0 && (
            <ul className="suggestions-list">
              {filteredProducts.map((product, index) => (
                <li key={index} onClick={() => selectProduct(product)}>
                  {product.name}
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
                  {["name", "price", "stock", "cgst","sgst", "discount"].map((col) => (
                    <TableCell
                      key={col}
                      sx={{ fontWeight: "bold", fontSize: "1rem"}}
                     
                    >
                      <TableSortLabel
                        active={orderBy === col}
                        direction={orderBy === col ? order : "asc"}
                        onClick={() => handleSort(col)}
                      >
                       {columnNames[col] || col.charAt(0).toUpperCase() + col.slice(1)}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>{product.cgst}</TableCell>
                      <TableCell>{product.sgst}</TableCell>
                      <TableCell>{product.discount}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setEditProduct(product);
                            setEdit(1);
                            setOpenModal(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => {
                            handleDelete(product._id);
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
            count={filteredProducts.length}
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
      </motion.div>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{
          "& .MuiDialog-container": {
            scrollbarWidth: "none", // Firefox
            "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari, Edge
          },
          "& .MuiPaper-root": {
            backgroundColor: darkMode ? "#222" : "#fff",
            color: darkMode ? "white" : "black",
            borderRadius: "12px",
            transition: "all 0.3s ease-in-out",
            height: "70vh",
            width: { xs: "95vw", sm: "90vw", md: "60vw" },
            padding: "20px",
            overflow: "auto", // Prevents scrollbars inside the modal
          },
          "& .MuiDialogContent-root": {
            overflow: "auto", // Hides scrollbars inside DialogContent
            scrollbarWidth: "none", // Firefox
            "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari, Edge
          },
        }}
      >
        <DialogTitle>{edit ? "Edit Item" : "Add Item"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Item Name"
            onChange={(e) =>
              setEditProduct({ ...editProduct, name: e.target.value })
            }
            autoFocus
            required
            margin="dense"
            name="name"
            type="text"
            variant="filled"
            value={editProduct?.name || ""}
            className="input-field"
            sx={{
              mb: 2,
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
          <TextField
            fullWidth
            label="Price"
            onChange={(e) =>
              setEditProduct({ ...editProduct, price: e.target.value })
            }
            autoFocus
            required
            margin="dense"
            name="price"
            type="number"
            inputProps={{ min: 0 }}
            variant="filled"
            value={editProduct?.price || ""}
            className="input-field"
            sx={{
              mb: 2,
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
          <TextField
            fullWidth
            label="Stock"
            onChange={(e) =>
              setEditProduct({ ...editProduct, stock: e.target.value })
            }
            autoFocus
            required
            margin="dense"
            name="stock"
            type="number"
            inputProps={{ min: 0 }}
            variant="filled"
            value={editProduct?.stock || ""}
            className="input-field"
            sx={{
              mb: 2,
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
          <TextField
            fullWidth
            label="CGST(%)"
            onChange={(e) =>
              setEditProduct({ ...editProduct, cgst: e.target.value })
            }
            autoFocus
            required
            margin="dense"
            name="cgst"
            type="number"
            inputProps={{ min: 0 }}
            variant="filled"
            value={editProduct?.cgst || ""}
            className="input-field"
            sx={{
              mb: 2,
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
            <TextField
            fullWidth
            label="SGST(%)"
            inputProps={{ min: 0 }}
            onChange={(e) =>
              setEditProduct({ ...editProduct, sgst: e.target.value })
            }
            autoFocus
            required
            margin="dense"
            name="sgst"
            type="number"
            variant="filled"
            value={editProduct?.sgst || ""}
            className="input-field"
            sx={{
              mb: 2,
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
          <TextField
            fullWidth
            label="Discount(%)"
            onChange={(e) =>
              setEditProduct({ ...editProduct, discount: e.target.value })
            }
            autoFocus
            required
            margin="dense"
            name="discount"
            inputProps={{ min: 0 }}
            type="number"
            variant="filled"
            value={editProduct?.discount || ""}
            className="input-field"
            sx={{
              mb: 2,
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
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenModal(false);
              setEditProduct(null);
            }}
            color="secondary"
            sx={{
              backgroundColor: darkMode ? "#444" : "#f0f0f0",
              color: darkMode ? "white" : "black",
              "&:hover": {
                backgroundColor: darkMode ? "#666" : "#ddd",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleAddOrEdit(editProduct)}
            color="primary"
            disabled={
              !editProduct?.name ||
              !editProduct?.price ||
              !editProduct?.stock ||
              !editProduct?.cgst ||
              !editProduct?.sgst ||
              !editProduct?.discount
            }
            sx={{
              backgroundColor: "#28a745",
              color: "white",
              "&:hover": {
                backgroundColor: "#218838",
              },
            }}
          >
            {edit ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, open: false })} />
    </div>
  );
}
