import React, { useState ,useEffect} from "react";
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
} from "@mui/material";
import "./Bill.css";
import generateInvoice from "../../../utils/invoiceGenerator";
import { addCustomer,fetchCustomers } from "../../../Redux/Slices/customerSlice";
import { addBill } from "../../../Redux/Slices/billSlice";
import { Country, State, City }  from 'country-state-city';
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BillingPage() {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
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
  const [installments, setInstallments] = useState(false);
  const [numInstallments, setNumInstallments] = useState(1);
  const [installmentPeriod, setInstallmentPeriod] = useState(1);
  const [open, setOpen] = useState(false);

  const [countries, ] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);
  const [cities,setCities] = useState([]);
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
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };
  const handleSubmit = () => {

    const customerData = {
      ...customer, // Keep all other fields unchanged
      state: customer.state.name, 
      country: customer.country.name 
    };
    dispatch(addCustomer(customerData));
    handleClose();
  };

  // Dummy customers (Replace this with actual DB fetching logic)
  const customers = list
  
  const items = [
    { name: "Laptop", price: 50000 },
    { name: "Mouse", price: 500 },
    { name: "Keyboard", price: 1500 },
  ];

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
        ? items.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
          )
        : []
    );
  };

  const addItemToBill = (item) => {
    setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    setItemSearch("");
    setFilteredItems([]);
  };

  const updateItemQuantity = (index, newQuantity) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].quantity = newQuantity;
    setSelectedItems(updatedItems);
  };

  const deleteItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const grandTotal = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
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

    if (selectedItems.length === 0) {
      alert("Please add items before generating the bill!");
      return;
    }

    const installmentPlannedDates =generateInstallmentPlan()

    const billData = {
      customer: customerDetails?._id || "",
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
            installmentDates: installmentPlannedDates
          }
        : { enabled: false },
    };

    dispatch(addBill(billData));

    generateInvoice(
      "Gayatri Jewellers",
      "Rushit Soni",
      customerDetails,
      selectedItems,
      grandTotal,
      installmentPlannedDates
    );
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
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
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
                onChange={(e) =>{
                  setCustomer({ ...customer, state: e.target.value }); 
                  setCities(City.getCitiesOfState(countryCode, e.target.value.isoCode));
                }
                  
                }
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
                onChange={(e) =>
                  {
                    setCustomer({ ...customer, country: e.target.value }); 

                    setCountryCode(e.target.value.isoCode);
                    setStates(State.getStatesOfCountry(e.target.value.isoCode));
                }
              }
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
                                            {customerDetails.state} , 
                                            {customerDetails.country} , <br />
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
            {selectedItems.length > 0 &&
              selectedItems.map((item, index) => (
                <div key={index} className="item-row">
                  <span>
                    {item.name} - ₹{item.price}{" "}
                  </span>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItemQuantity(index, parseInt(e.target.value))
                    }
                    min="1"
                  />
                  <button onClick={() => deleteItem(index)}>Delete</button>
                </div>
              ))}
          </div>
        </div>

        {/* Total section*/}

        <div className="total-section">
          <div className="grand-total-row">
            <h3>Grand Total: ₹{grandTotal}</h3>
            <label>
              <input
                type="checkbox"
                checked={installments}
                onChange={(e) => setInstallments(e.target.checked)}
              />{" "}
              Installments
            </label>
          </div>

          {installments && (
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
          )}
          <button className="generate-bill" onClick={handleInvoiceGeneration}>
            Generate Bill
          </button>
        </div>
      </motion.div>
    </div>
  );
}
