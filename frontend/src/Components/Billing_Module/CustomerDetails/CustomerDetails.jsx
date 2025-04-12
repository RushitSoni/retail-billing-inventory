import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Divider,
  Grid,
  MenuItem,
  FormControl,
  Select,
  InputLabel
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Trash2, Pencil} from "lucide-react";
import { Country, State, City }  from 'country-state-city';
import {fetchCustomerById,updateCustomer, deleteCustomer} from '../../../Redux/Slices/customerSlice'
import {addAuditLog} from "../../../Redux/Slices/auditLogSlice"
import Toast from "../../Shared_Module/Toast/Toast"
import './CustomerDetails.css'

const CustomerDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const currentCustomer = useSelector((state) => state.customers.currentCustomer)
  const user = useSelector((state)=>state.auth.user)

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

  const [countries, ] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);
  const [cities,setCities] = useState([]);
  const [countryCode, setCountryCode] = useState();
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });

  



  useEffect(() => {
    if (id) {
        dispatch(fetchCustomerById(id));
    }
  }, [dispatch, id]);

  // Update local state when Redux state updates
  useEffect(() => {
    if (currentCustomer) {
      const updatedCountry = countries.find((c) => c.name === currentCustomer.country) || "";
      const updatedStates = updatedCountry ? State.getStatesOfCountry(updatedCountry.isoCode) : [];
      const updatedState = updatedStates.find((s) => s.name === currentCustomer.state) || "";
      const updatedCities = updatedState ? City.getCitiesOfState(updatedCountry.isoCode, updatedState.isoCode) : [];
      const updatedCity = updatedCities.find((c) => c.name === currentCustomer.city) || "";
  
      setCustomer({
        ...currentCustomer,
        country: updatedCountry,
        state: updatedState,
        city: updatedCity ? updatedCity.name : "",  // ✅ Ensure it's a string
      });
  
      setStates(updatedStates);
      setCities(updatedCities);
    }
  }, [currentCustomer, countries]);
  

  
  

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });

  };

  const handleUpdate = async () => {
    try {
      console.log(id,customer)
      await dispatch(updateCustomer({ id, updatedData:{
        ...customer, // Keep all other fields unchanged
        state: customer.state.name, 
        country: customer.country.name 
      }  })).unwrap();
      dispatch(
       addAuditLog({
          user: user.name,
          operation: "UPDATE",
          module: "Customer",
          message: `Updated Customer ${customer.name}`,
        })
      );
      showToast("Updated customer successfully!", "success")
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };
  

  const handleDelete = async () => {
      try {
        await dispatch(deleteCustomer(id)).unwrap()
        dispatch(
          addAuditLog({
             user: user.name,
             operation: "DELETE",
             module: "Customer",
             message: `Deleted Customer ${customer.name}`,
           })
         )
         showToast("Deleted customer successfully!", "success")

         setTimeout(()=>navigate("/billing"), 3000)
         
        
        
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    
  };
  const showToast = (msg, type) => {
    setToast({ open: true, message: msg, type });
  };
  

  return (
    <div className={`customer-container ${darkMode ? "dark" : "light"}`}>
      <motion.div
        initial={{ opacity: 0, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        whileHover={{ scale: 1.005 }}
       className="customer-card"
      >
        <div  sx={{  }}>
          
            <Typography variant="h5" sx={{ mb: 3 }}>
              Details Of Customer:
            </Typography>

            <div className="contact-section">
            
                 {/* Personal Details Section */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  name="name"
                  value={customer.name}
                  onChange={handleChange}
                  fullWidth
                  autoFocus
                  required
                  margin="dense"
                  type="text"
                  variant="filled"
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
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Phone"
                  name="phone"
                  value={customer.phone}
                  onChange={handleChange}
                  fullWidth
                  autoFocus
                  required
                  margin="dense"
                  type="text"
                  variant="filled"
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
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Email"
                  name="email"
                  value={customer.email}
                  onChange={handleChange}
                  fullWidth
                  autoFocus
                  required
                  margin="dense"
                  type="text"
                  variant="filled"
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
              </Grid>
            </Grid>
            </div>

           

            <Divider sx={{ my: 5, bgcolor: "black", height: 1 }} />


           <div className="address-section">

             {/* Address Section */}
             <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  name="address"
                  value={customer.address}
                  onChange={handleChange}
                  fullWidth
                  autoFocus
                  required
                  margin="dense"
                  type="text"
                  variant="filled"
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
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth variant="filled"  sx={{
                
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
              }}>
                  <InputLabel>Country</InputLabel>
                  <Select
                  value={customer.country }
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
              </Grid>

              <Grid item xs={4}>
                <FormControl fullWidth variant="filled"
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
                }} >
                  <InputLabel>State</InputLabel>
                  <Select
                     value={customer.state ? customer.state : ""}
                    onChange={(e) => {
                      setCustomer({ ...customer, state: e.target.value }); 
                      setCities(City.getCitiesOfState(countryCode, e.target.value.isoCode));

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
              </Grid>

              <Grid item xs={4}>
                <FormControl fullWidth variant="filled"  sx={{
                
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
              }} >
                  <InputLabel>City</InputLabel>
                  <Select
                    value={customer.city }
                    onChange={(e) => {
                      setCustomer({ ...customer, city: e.target.value })

                    }}
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
              </Grid>

              <Grid item xs={6}>
                <TextField
               
               
                  label="Pincode"
                  name="pincode"
                  value={customer.pincode}
                  onChange={handleChange}
                  fullWidth
                  autoFocus
                  required
                  margin="dense"
                  type="text"
                  variant="filled"
                  
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
              </Grid>
            </Grid>
           </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "1.5rem",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#28a745",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#218838",
                  },
                }}
                startIcon={<Pencil size={18} />}
                onClick={handleUpdate}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Trash2 size={18} />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          
        </div>
      </motion.div>
      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, open: false })} />
    </div>
  );
};

export default CustomerDetails;
