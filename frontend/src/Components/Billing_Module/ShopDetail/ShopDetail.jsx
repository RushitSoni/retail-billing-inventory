import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchShopById,
  updateShop,
  deleteShop,
} from "../../../Redux/Slices/shopSlice";
import { Country, State, City } from "country-state-city";
import { motion } from "framer-motion";
import {
  TextField,
  Typography,
  Grid,
  MenuItem,
  FormControl,
  Select,
  Button,
  InputLabel,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { Trash2, Save, X, Plus } from "lucide-react";
import "./ShopDetail.css";

const ShopDetail = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentShop } = useSelector((state) => state.shops);
  const [shop, setShop] = useState({
    name: "",
    description: "",
    logo: "",
    category: "",
    branches: [],
  });

  const [branch, setBranch] = useState({
    name: "",
    address: "",
    country: null,
    state: null,
    city: "",
    pincode: "",
    managerId:'65ef5678abcd9012ef345678'
  });

  const [countryCode, setCountryCode] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries] = useState(Country.getAllCountries());

  const [open, setOpen] = useState(false);
  const darkMode = useSelector((state) => state.theme.darkMode);

  useEffect(() => {
    dispatch(fetchShopById(shopId));
  }, [dispatch, shopId]);

  useEffect(() => {
    if (currentShop) {
      setShop(currentShop);
    }
  }, [currentShop]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setShop({ ...shop, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setShop({ ...shop, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    dispatch(updateShop({ id: shopId, updatedData: shop }));
  };

  const handleDelete = async () => {
    dispatch(deleteShop(shopId));
    navigate("/");
  };

  const handleBranchChange = (index, field, value) => {
    // const updatedBranches = [...shop.branches];
    // updatedBranches[index][field] = value;
    // setShop({ ...shop, branches: updatedBranches });

    const updatedBranches = [...shop.branches];
  
  // Clone the branch object before modifying it
  updatedBranches[index] = { ...updatedBranches[index], [field]: value };
  
  setShop({ ...shop, branches: updatedBranches });
  };

  const handleAddBranch = () => {
    const newBranch = {
      name: branch.name,
      address: branch.address,
      country: branch.country.name,
      state: branch.state.name,
      city: branch.city,
      pincode: branch.pincode,
      managerId: branch.managerId
    };
  
    const updatedShop = {
      ...shop,
      branches: [...shop.branches, newBranch],
    };
  
    setShop(updatedShop);
  
    // Dispatch update to Redux
    dispatch(updateShop({ id: shopId, updatedData: updatedShop }));
  
    // Close the modal after adding
    handleClose();
  };
  

  const handleRemoveBranch = (index) => {
    const updatedBranches = shop.branches.filter((_, i) => i !== index);
    setShop({ ...shop, branches: updatedBranches });
  };

  const textFieldStyles = {
    "& label": { color: "gray" }, // Default label color
    "& label.Mui-focused": { color: "gray" }, // Focused label color
    "& .MuiInputBase-input": { color: "gray" }, // Input text color

    "& .MuiFilledInput-underline:before": {
      borderBottomColor: "gray",
    }, // Default underline
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: "gray",
    }, // Focused underline

    // "& .MuiFilledInput-root": { backgroundColor: "transparent" }, // Remove background
  };

  return (
    <div className={`shop-container ${darkMode ? "dark" : "light"}`}>
      <motion.div
        initial={{ opacity: 0, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        whileHover={{ scale: 1.005 }}
        className="shop-card"
      >
        <Typography variant="h5" sx={{ mb: 3 }}>
          Details Of Shops:
        </Typography>

        <div className="shop-section">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Shop Name"
                name="name"
                value={shop.name}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
                variant="filled"
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12}>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="logo-upload"
                onChange={handleImageUpload}
              />
              <label htmlFor="logo-upload">
                <div
                  style={{
                    width: "12rem",
                    height: "12rem",
                    border: "2px dashed gray",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    borderRadius: "1.5rem",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={shop.logo || "/default-logo.png"}
                    alt="Shop Logo"
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
              </label>
              <Typography variant="body2" color="gray" sx={{ m: 1 }}>
                Upload your logo
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControl
                fullWidth
                margin="dense"
                variant="filled"
                sx={textFieldStyles}
              >
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={shop.category}
                  onChange={handleChange}
                >
                  <MenuItem value="Grocery">Grocery</MenuItem>
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Clothing">Clothing</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={shop.description}
                onChange={handleChange}
                fullWidth
                margin="dense"
                variant="filled"
                multiline
                sx={textFieldStyles}
                rows={2}
              />
            </Grid>
          </Grid>
        </div>

        <Typography variant="h5" sx={{ mt: 5, mb: 3 }}>
          Shop Branches:
        </Typography>

        <div className="branch-section">
          {/* Branches Section */}

          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <Button
              variant="contained" // Use 'contained' for background color
              startIcon={<Plus />}
              onClick={handleOpen}
              sx={{
                mt: 2,
                mb: 2,
              }}
              color="primary"
            >
              Add Branch
            </Button>
          </Grid>

          <Dialog
            open={open}
            onClose={handleClose}
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
                overflow: "auto",
              },
              "& .MuiDialogContent-root": {
                overflow: "auto",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
              },
            }}
          >
            <DialogTitle>Add Branch</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                required
                margin="dense"
                name="name"
                label="Branch Name"
                type="text"
                fullWidth
                variant="filled"
                value={branch.name}
                onChange={(e) => {
                    setBranch({ ...branch, name: e.target.value });
                  }}
                sx={textFieldStyles}
              />

              <TextField
                margin="dense"
                name="address"
                label="Address"
                type="text"
                fullWidth
                variant="filled"
                value={branch.address}
                onChange={(e) => {
                    setBranch({ ...branch, address: e.target.value });
                  }}
                required
                autoFocus
                sx={textFieldStyles}
              />

              <FormControl fullWidth variant="filled" sx={textFieldStyles} autoFocus  margin="dense">
                <InputLabel>Country</InputLabel>
                <Select
                  value={branch.country || ""}
                  onChange={(e) => {
                    setBranch({ ...branch, country: e.target.value});
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

              <FormControl fullWidth variant="filled" sx={textFieldStyles} autoFocus  margin="dense">
                <InputLabel>State</InputLabel>
                <Select
                  value={branch.state || ""}
                  onChange={(e) => {
                    setBranch({ ...branch, state: e.target.value });
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

              <FormControl fullWidth variant="filled" sx={textFieldStyles} autoFocus  margin="dense">
                <InputLabel>City</InputLabel>
                <Select
                  value={branch.city || ""}
                  onChange={(e) =>
                    setBranch({ ...branch, city: e.target.value })
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

              <TextField
                margin="dense"
                name="pincode"
                label="Pincode"
                type="text"
                fullWidth
                autoFocus
                variant="filled"
                value={branch.pincode}
                onChange={(e) => {
                    setBranch({ ...branch, pincode: e.target.value });
                }}
                required
                error={branch.pincode && !/^\d{6}$/.test(branch.pincode)}
                helperText={
                  branch.pincode && !/^\d{6}$/.test(branch.pincode)
                    ? "Enter a valid 6-digit pincode"
                    : ""
                }
                sx={textFieldStyles}
              />
            </DialogContent>

            <DialogActions>
              <Button
                onClick={handleClose}
                color="secondary"
                sx={{
                  backgroundColor: darkMode ? "#444" : "#f0f0f0",
                  color: darkMode ? "white" : "black",
                  "&:hover": { backgroundColor: darkMode ? "#666" : "#ddd" },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddBranch}
                color="primary"
                disabled={
                  !branch.name ||
                  !branch.address ||
                  !branch.city ||
                  !branch.state ||
                  !branch.country ||
                  !/^\d{6}$/.test(branch.pincode)
                }
                sx={{
                  backgroundColor: "#28a745",
                  color: "white",
                  "&:hover": { backgroundColor: "#218838" },
                }}
              >
                Add
              </Button>
            </DialogActions>
          </Dialog>

          <Grid container spacing={2}>
            {shop.branches.map((branch, index) => (
              <Grid item xs={12} key={index}>
                <div
                  style={{
                    borderRadius: "12px",
                    padding: "1rem",
                    backgroundColor: darkMode ? "#333" : "#fff",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <TextField
                        label="Branch Name"
                        value={branch.name}
                        onChange={(e) =>
                          handleBranchChange(index, "name", e.target.value)
                        }
                        fullWidth
                        variant="filled"
                        name="name"
                        required
                        margin="dense"
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Address"
                        value={branch.address}
                        onChange={(e) =>
                          handleBranchChange(index, "address", e.target.value)
                        }
                        fullWidth
                        variant="filled"
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl
                        fullWidth
                        variant="filled"
                        sx={{textFieldStyles}}
                      >
                        <InputLabel>Country</InputLabel>
                        <Select
                          value={branch.country}
                          onChange={(e) => {
                            handleBranchChange(index, "country", e.target.value.name)

                            setCountryCode(e.target.value.isoCode);
                            setStates(
                              State.getStatesOfCountry(e.target.value.isoCode)
                            );
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
                      <FormControl
                        fullWidth
                        variant="filled"
                        sx={{textFieldStyles}}
                      >
                        <InputLabel>State</InputLabel>
                        <Select
                          value={branch.state}
                          onChange={(e) => {
                            handleBranchChange(index, "state", e.target.value.name)
                            setCities(
                              City.getCitiesOfState(
                                countryCode,
                                e.target.value.isoCode
                              )
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
                    </Grid>

                    <Grid item xs={4}>
                      <FormControl
                        fullWidth
                        variant="filled"
                        sx={{textFieldStyles}}
                      >
                        <InputLabel>City</InputLabel>
                        <Select
                          value={branch.city}
                          onChange={(e) => {
                            handleBranchChange(index, "address", e.target.value)
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
                        value={branch.pincode}
                        onChange={(e) =>
                          handleBranchChange(index, "pincode", e.target.value)
                        }
                        fullWidth
                        variant="filled"
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={6} display="flex" justifyContent="flex-end">
                      <Button
                        onClick={() => handleRemoveBranch(index)}
                        sx={{
                          backgroundColor: "red",
                          color: "white",
                          "&:hover": { backgroundColor: "darkred" },
                        }}
                      >
                        <X size={20} />
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>

        {/* Action Buttons */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1.5rem",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<Save size={18} />}
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
      </motion.div>
    </div>
  );
};

export default ShopDetail;
