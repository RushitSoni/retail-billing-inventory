import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Grid,
} from "@mui/material";
import "./Bill.css";
import generateInvoice from "../../../utils/invoiceGenerator";
import {
  addCustomer,
  fetchCustomers,
} from "../../../Redux/Slices/customerSlice";
import { addBill } from "../../../Redux/Slices/billSlice";
import { Country, State, City } from "country-state-city";
import { Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchShops } from "../../../Redux/Slices/shopSlice";
import { fetchInventoryByShopAndBranch } from "../../../Redux/Slices/inventorySlice";
import { reduceInventoryStock } from "../../../Redux/Slices/inventorySlice";
import { addAuditLog } from "../../../Redux/Slices/auditLogSlice";

export default function BillingPage() {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const shops = useSelector((state) => state.shops.list);
  const user = useSelector((state) => state.auth.user);
  const initialProducts = useSelector((state) => state.inventory.list);
  const [selectedShop, setSelectedShop] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [products, setProducts] = useState("");

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
  // console.log("Redux State",Array.isArray(initialProducts))
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    dispatch(fetchShops());
  }, [dispatch]);

  const { list } = useSelector((state) => state.customers);
  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [itemSearch, setItemSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [installments] = useState(false);
  const [numInstallments] = useState(1);
  const [installmentPeriod] = useState(1);
  const [open, setOpen] = useState(false);

  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countryCode, setCountryCode] = useState();

  //Add Customer Modal-popup
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    biller: user._id,
    shopId: "",
    branchId: "",
  });
  const handleOpen = () => {
    if (!selectedShop || !selectedBranch) {
      alert("Please ! select shop and branch of customer first.");
      return
    }
    setOpen(true);
    
  };
  const handleClose = () => setOpen(false);
  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };
  const handleSubmit = () => {
    const customerData = {
      ...customer, // Keep all other fields unchanged
      state: customer.state.name,
      country: customer.country.name,
      shopId: selectedShop._id,
      branchId: selectedBranch._id,
    };
    dispatch(addCustomer(customerData));
    handleClose();
  };

  // Dummy customers (Replace this with actual DB fetching logic)
  const customers = list;

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchTerm(query);

    if (query.length > 0) {
      const matches = customers.filter((customer) =>
        customer.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCustomers(matches);
    } else {
      setFilteredCustomers([]);
    }
  };

  const selectCustomer = (customer) => {
    setSearchTerm(customer.name);
    setCustomerDetails(customer);
    setFilteredCustomers([]); // Hide suggestions after selection
  };

  const handleItemSearch = (event) => {
    const query = event.target.value;
    setItemSearch(query);
    setFilteredItems(
      query.length > 0
        ? products.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
          )
        : []
    );
  };

  const addItemToBill = (item) => {
    if (item.stock) {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
      setItemSearch("");
      setFilteredItems([]);
    } else {
      alert("Out of Stock !");
    }
  };

  const updateItemQuantity = (index, newQuantity) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].quantity = newQuantity;
    setSelectedItems(updatedItems);
  };

  const deleteItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const CGST = selectedItems.reduce(
    (cgst, item) => cgst + 0.01 * item.cgst * item.price,
    0
  );
  const SGST = selectedItems.reduce(
    (sgst, item) => sgst + 0.01 * item.sgst * item.price,
    0
  );

  const discount = selectedItems.reduce(
    (discount, item) => discount + 0.01 * item.discount * item.price,
    0
  );

  const originalTotal = selectedItems.reduce(
    (ogTotal, item) => ogTotal + item.price * item.quantity,
    0
  );

  const grandTotal = selectedItems.reduce(
    (total, item) => total + originalTotal + CGST + SGST - discount,
    0
  );

  const generateInstallmentPlan = () => {
    if (!numInstallments || numInstallments < 1) return [];

    const installmentAmount = (grandTotal / numInstallments).toFixed(2);
    const installments = [];

    let dueDate = new Date();

    for (let i = 1; i <= numInstallments; i++) {
      dueDate.setDate(dueDate.getDate() + parseInt(installmentPeriod));
      installments.push({
        installmentNo: i,
        amount: installmentAmount,
        dueDate: dueDate.toISOString().split("T")[0], // Format: YYYY-MM-DD
      });
    }

    //console.log(installments) ;
    return installments;
  };

  function handleInvoiceGeneration() {
    if (!customerDetails) {
      alert("Please select customer before generating the bill!");
      return;
    }
    if (selectedItems.length === 0 || !customerDetails) {
      alert("Please add items before generating the bill!");
      return;
    }

    const installmentPlannedDates = generateInstallmentPlan();

    const billData = {
      customer: customerDetails?._id || "",
      biller: user._id,
      shopId: selectedShop._id,
      branchId: selectedBranch._id,
      items: selectedItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
      })),
      grandTotal,
      installments: installments
        ? {
            enabled: true,
            numInstallments: numInstallments || 1,
            installmentPeriod: installmentPeriod || 0,
            installmentDates: installmentPlannedDates,
          }
        : { enabled: false },
    };
    console.log(billData);
    dispatch(addBill(billData))
      .unwrap() // Waits for promise resolution and throws if rejected
      .then(() => {
        dispatch(
          reduceInventoryStock({
            items: selectedItems.map((item) => ({
              id: item._id,
              quantity: item.quantity,
            })),
          })
        );
      })
      .catch((error) => {
        console.error("Failed to add bill:", error);
      });

    // dispatch(addBill(billData)).then();
    // dispatch(
    //   reduceInventoryStock({
    //     items: selectedItems.map((item) => ({
    //       id: item._id,
    //       quantity: item.quantity,
    //     })),
    //   })

    // );
    dispatch(
      addAuditLog({
        user: user.name,
        operation: "CREATE",
        module: "Bill",
        message: "Added new Bill.",
      })
    );

    generateInvoice(
      selectedShop,
      user.name,
      customerDetails,
      selectedItems,
      grandTotal,
      installmentPlannedDates
    );

    setSelectedItems([]);
    setCustomerDetails(null);
    setSearchTerm("");
  }

  return (
    <div className={`billing-container ${darkMode ? "dark" : "light"}`}>
      <motion.div
        className="billing-box"
        initial={{ opacity: 0, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        whileHover={{ scale: 1.005 }}
      >
        {" "}
        <div
          className="customer-section"
          style={{ marginTop: "1.5rem", marginBottom: "2rem" }}
        >
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
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            startIcon={<Plus />}
            color="primary"
            onClick={handleOpen}
            sx={{
              backgroundColor: "#28a745",
              color: "white",
              "&:hover": {
                backgroundColor: "#218838",
              },
            }}
          >
            Add Customer
          </Button>
        </Box>
        {/* Add Customer Modal */}
        <Dialog
          open={open}
          onClose={handleClose}
          className="customer-modal"
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
          <DialogTitle>Add Customer</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              name="name"
              label="Customer Name"
              type="text"
              fullWidth
              variant="filled"
              value={customer.name}
              onChange={handleChange}
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
              margin="dense"
              name="phone"
              label="Phone Number"
              type="text"
              fullWidth
              variant="filled"
              value={customer.phone}
              onChange={handleChange}
              required
              error={customer.phone && !/^\d{10}$/.test(customer.phone)}
              helperText={
                customer.phone && !/^\d{10}$/.test(customer.phone)
                  ? "Enter a valid 10-digit phone number"
                  : ""
              }
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
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="filled"
              value={customer.email}
              onChange={handleChange}
              required
              error={customer.email && !/^\S+@\S+\.\S+$/.test(customer.email)}
              helperText={
                customer.email && !/^\S+@\S+\.\S+$/.test(customer.email)
                  ? "Enter a valid email"
                  : ""
              }
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
              margin="dense"
              name="address"
              label="Street Address"
              type="text"
              fullWidth
              variant="filled"
              value={customer.address}
              onChange={handleChange}
              required
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
              <InputLabel>City</InputLabel>
              <Select
                value={customer.city}
                onChange={(e) =>
                  setCustomer({ ...customer, city: e.target.value })
                }
                required
              >
                {cities.length > 0 ? (
                  cities.map((city) => (
                    <MenuItem key={city.name} value={city.name}>
                      {city.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No cities available</MenuItem>
                )}
              </Select>
            </FormControl>

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
              <InputLabel>State</InputLabel>
              <Select
                value={customer.state}
                onChange={(e) => {
                  setCustomer({ ...customer, state: e.target.value });
                  setCities(
                    City.getCitiesOfState(countryCode, e.target.value.isoCode)
                  );
                }}
                required
              >
                {states.length > 0 ? (
                  states.map((state) => (
                    <MenuItem key={state.isoCode} value={state}>
                      {state.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No states available</MenuItem>
                )}
              </Select>
            </FormControl>

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
              <InputLabel>Country</InputLabel>
              <Select
                value={customer.country || ""}
                onChange={(e) => {
                  setCustomer({ ...customer, country: e.target.value });

                  setCountryCode(e.target.value.isoCode);
                  setStates(State.getStatesOfCountry(e.target.value.isoCode));
                }}
                required
              >
                {countries.map((country) => (
                  <MenuItem key={country.isoCode} value={country}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              name="pincode"
              label="Pincode"
              type="text"
              fullWidth
              variant="filled"
              value={customer.pincode}
              onChange={handleChange}
              required
              error={customer.pincode && !/^\d{6}$/.test(customer.pincode)}
              helperText={
                customer.pincode && !/^\d{6}$/.test(customer.pincode)
                  ? "Enter a valid 6-digit pincode"
                  : ""
              }
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
              onClick={handleClose}
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
              onClick={handleSubmit}
              color="primary"
              disabled={
                !customer.name ||
                !/^\d{10}$/.test(customer.phone) ||
                !customer.email ||
                !customer.address ||
                !customer.city ||
                !customer.state ||
                !customer.country ||
                !/^\d{6}$/.test(customer.pincode)
              }
              sx={{
                backgroundColor: "#28a745",
                color: "white",
                "&:hover": {
                  backgroundColor: "#218838",
                },
              }}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
        {/* Customer Search Field */}
        <div className="customer-section">
          <TextField
            label="Search Customer"
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
          {filteredCustomers.length > 0 && (
            <ul className="suggestions-list">
              {filteredCustomers.map((customer, index) => (
                <li key={index} onClick={() => selectCustomer(customer)}>
                  {customer.name}
                </li>
              ))}
            </ul>
          )}

          {/* Show Customer Details if Selected */}
          {customerDetails && (
            <div className="customer-details">
              <div className="detail-col">
                <p>
                  <strong>Name:</strong> {customerDetails.name}
                </p>
                <p>
                  <strong>Phone:</strong> {customerDetails.phone}
                </p>
              </div>
              <div className="detail-col">
                <p>
                  <strong>Email:</strong> {customerDetails.email}
                </p>
                <p>
                  <strong>Address:</strong> {customerDetails.address} ,
                  {customerDetails.city} , <br />
                  {customerDetails.state} ,{customerDetails.country} , <br />
                  {customerDetails.pincode} .
                </p>
              </div>
              <div className="detail-col action-col">
                <Eye
                  className="view-details-icon"
                  size={24}
                  onClick={() => navigate(`/customer/${customerDetails._id}`)}
                />
              </div>
            </div>
          )}
        </div>
        {/* Item Search Section */}
        <div className="item-section">
          <TextField
            label="Search Item"
            value={itemSearch}
            onChange={handleItemSearch}
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
          {filteredItems.length > 0 && (
            <ul className="suggestions-list">
              {filteredItems.map((item, index) => (
                <li key={index} onClick={() => addItemToBill(item)}>
                  {item.name} - ₹{item.price}
                </li>
              ))}
            </ul>
          )}

          {/* Added Items List */}
          <div className="item-list">
            <div className="item-row">
              <span>Item Name</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Available</span>
              <span>CGST(%)</span>
              <span>SGST(%)</span>
              <span>Discount(%)</span>
              <span>Actions</span>
            </div>
            {selectedItems.length > 0 &&
              selectedItems.map((item, index) => (
                <div key={index} className="item-row">
                  <span>{item.name}</span>
                  <span>₹{item.price}</span>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      let value = parseInt(e.target.value, 10) || 1;
                      if (value > item.stock) value = item.stock; // Prevent exceeding max stock
                      // if (value < 1) value = 1; // Prevent going below min value
                      updateItemQuantity(index, value);
                    }}
                    min={1}
                    max={item.stock}
                    disabled={item.stock === 0} // Disables input when stock is 0
                  />

                  <span>{item.stock}</span>
                  <span>{item.cgst}</span>
                  <span>{item.sgst}</span>
                  <span>{item.discount}</span>
                  <button onClick={() => deleteItem(index)}>Delete</button>
                </div>
              ))}
          </div>
        </div>
        {/* Total section*/}
        <div className="total-section">
          <div className="grand-total-row">
            <h4>
              <span>Total:</span> <span>₹{originalTotal.toFixed(2)}</span>
            </h4>
            <h5>
              <span>CGST:</span> <span>₹{CGST.toFixed(2)}</span>
            </h5>
            <h5>
              <span>SGST:</span> <span>₹{SGST.toFixed(2)}</span>
            </h5>
            <h5>
              <span>Discount:</span> <span>₹{discount.toFixed(2)}</span>
            </h5>
            <hr
              style={{
                backgroundColor: "gray",
                height: "1px",
                border: "none",
                width: "100%",
              }}
            />

            <h2>
              <span>Grand Total:</span> <span>₹{grandTotal.toFixed(2)}</span>
            </h2>
            {/* <label>
              <input
                type="checkbox"
                checked={installments}
                onChange={(e) => setInstallments(e.target.checked)}
              />{" "}
              Installments
            </label> */}
          </div>

          {/* {installments && (
            <div className="installment-options">
              <TextField
                label="Number of Installments"
                type="number"
                value={numInstallments}
                onChange={(e) => setNumInstallments(e.target.value)}
                min="1"
                variant="filled"
                className="input-field"
                autoComplete="off"
                fullWidth
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
              <TextField
                label="Installment Period (Days)"
                type="number"
                value={installmentPeriod}
                onChange={(e) => setInstallmentPeriod(e.target.value)}
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
            </div>
          )} */}
          <button className="generate-bill" onClick={handleInvoiceGeneration}>
            Generate Bill
          </button>
        </div>
      </motion.div>
    </div>
  );
}
