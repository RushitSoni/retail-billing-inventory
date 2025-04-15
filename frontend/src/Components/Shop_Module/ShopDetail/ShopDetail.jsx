import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchShopById,
  updateShop,
  deleteShop,
} from "../../../Redux/Slices/shopSlice";
import { State, City } from "country-state-city";
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
import { Trash2, X, Plus, Pencil } from "lucide-react";
import "./ShopDetail.css";
import { fetchAllUsers } from "../../../Redux/Slices/userSlice";
import { addAuditLog } from "../../../Redux/Slices/auditLogSlice";
import { categories } from "../../../utils/categories";
import Toast from "../../Shared_Module/Toast/Toast";

const ShopDetail = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentShop } = useSelector((state) => state.shops);
  const user = useSelector((state) => state.auth.user);
  const [userDetails, setUserDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState({}); // Object to store searchTerm per branch

  //console.log(userDetails)
  const [userDetailsDialog, setUserDetailsDialog] = useState(null);
  const [searchTermDialog, setSearchTermDialog] = useState(""); // Object to store searchTerm per branch
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
    managerId: "",
  });

  // const [countryCode, setCountryCode] = useState("");
  const [states] = useState(State.getStatesOfCountry("IN"));
  const [cities, setCities] = useState([]);
  const [branchCities, setBranchCities] = useState({});
  // const [countries] = useState(Country.getAllCountries());

  const [open, setOpen] = useState(false);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const { users } = useSelector((state) => state.users);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const showToast = (msg, type) => {
    setToast({ open: true, message: msg, type });
  };

  //console.log(users)

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchShopById(shopId));
  }, [dispatch, shopId]);

  useEffect(() => {
    if (currentShop) {
      setShop(currentShop);
      setUserDetails(() => {
        const details = {};
        currentShop?.branches?.forEach((branch) => {
          if (branch.managerId) {
            details[branch._id] = branch.managerId; // Store managerId initially
          }
        });
        return details;
      });

      const initialSearch = {};
      currentShop.branches.forEach((branch) => {
        initialSearch[branch._id] = branch.managerId?.name || ""; // Initialize with manager name
      });
      setSearchTerm(initialSearch);
    }
  }, [currentShop]);

  useEffect(() => {
    const initialCities = {};

    shop.branches.forEach((branch) => {
      if (branch.state) {
        const selectedState = states.find(
          (state) => state.name === branch.state
        );
        if (selectedState) {
          initialCities[branch._id] = City.getCitiesOfState(
            "IN",
            selectedState.isoCode
          );
        }
      }
    });

    setBranchCities(initialCities);
  }, [shop.branches, states]); // Runs when shop branches or states change

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setBranch({
      name: "",
      address: "",
      country: null,
      state: null,
      city: "",
      pincode: "",
      managerId: "",
    });
  };

  const handleChange = (e) => {
    setShop({ ...shop, [e.target.name]: e.target.value });
  };

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.imageUrl) {
        setShop({ ...shop, logo: data.imageUrl });
      } else {
        alert("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      dispatch(updateShop({ id: shopId, updatedData: shop })).unwrap();

      await dispatch(
        addAuditLog({
          user: user.name,
          operation: "UPDATE",
          module: "Shop",
          message: `Updated shop ${shop.name}`,
        })
      );

      showToast("Shop updated successfully!", "success");

      setBranch({
        name: "",
        address: "",
        country: null,
        state: null,
        city: "",
        pincode: "",
        managerId: "",
      });
    } catch (error) {
      showToast("Updation Failed!", "error");
      console.log("Shop updation failed : ", error);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteShop(shopId)).unwrap();

      await dispatch(
        addAuditLog({
          user: user.name,
          operation: "DELETE",
          module: "Shop",
          message: `Deleted shop ${shop.name}`,
        })
      );

      showToast("Shop deleted successfully!", "success");

      setTimeout(() => navigate("/shops"), 3000);
    } catch (error) {
      showToast("Deletion Failed!", "error");
      console.log("Shop updation failed : ", error);
    }
  };

  const handleBranchChange = (branchId, field, value) => {
    const updatedBranches = shop.branches.map((branch) =>
      branch._id === branchId ? { ...branch, [field]: value } : branch
    );
    console.log(updatedBranches);
    setShop({ ...shop, branches: updatedBranches });

    // If state is changed, update cities for this branch
    if (field === "state") {
      const selectedState = states.find((state) => state.name === value);
      if (selectedState) {
        setBranchCities((prevCities) => ({
          ...prevCities,
          [branchId]: City.getCitiesOfState("IN", selectedState.isoCode),
        }));
      }
    }
  };

  const handleAddBranch = () => {
    const newBranch = {
      name: branch.name,
      address: branch.address,
      country: "India",
      state: branch.state.name,
      city: branch.city,
      pincode: branch.pincode,
      managerId: branch.managerId,
    };

    const updatedShop = {
      ...shop,
      branches: [...shop.branches, newBranch],
    };

    setShop(updatedShop);
    console.log(shop);
    // Dispatch update to Redux
    dispatch(updateShop({ id: shopId, updatedData: updatedShop }));
    dispatch(fetchShopById(shopId));
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

  const updateSearchTerm = (branchId, value) => {
    setSearchTerm((prev) => ({ ...prev, [branchId]: value }));
  };

  const [filteredUsers, setFilteredUsers] = useState([]);

  // const selectUser = (user) => {
  //   setSearchTerm(user.name);
  //   setUserDetails(user);
  //   setFilteredUsers([]); // Hide suggestions after selection
  // };
  const selectUser = (user, branchId) => {
    if (branchId === "dialog") {
      setSearchTermDialog(user.name);
      setUserDetailsDialog(user);
    } else {
      updateSearchTerm(branchId, user.name);
      setUserDetails((prev) => ({
        ...prev,
        [branchId]: user, // Branch-wise manager details store kar rahe
      }));
    }

    setFilteredUsers([]); // Hide suggestions after selection
  };

  const handleSearch = (branchId, value) => {
    updateSearchTerm(branchId, value);

    if (value.length > 0) {
      const matches = users.filter((user) =>
        user.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(matches);
    } else {
      setFilteredUsers([]);
    }
  };
  const handleSearchD = (e) => {
    const value = e.target.value;
    setSearchTermDialog(value);

    if (value.length > 0) {
      const matches = users.filter((user) =>
        user.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(matches);
    } else {
      setFilteredUsers([]);
    }
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
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
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
                backgroundColor: "#28a745",
                color: "white",
                "&:hover": {
                  backgroundColor: "#218838",
                },
              }}
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
                height: "auto",
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

              <FormControl
                fullWidth
                variant="filled"
                sx={textFieldStyles}
                autoFocus
                margin="dense"
              >
                <InputLabel>Country</InputLabel>
                <Select value="India" required disabled>
                  <MenuItem value="India">India</MenuItem>
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                variant="filled"
                sx={textFieldStyles}
                autoFocus
                margin="dense"
              >
                <InputLabel>State</InputLabel>
                <Select
                  value={branch.state || ""}
                  onChange={(e) => {
                    setBranch({ ...branch, state: e.target.value });
                    setCities(
                      City.getCitiesOfState("IN", e.target.value.isoCode)
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
                sx={textFieldStyles}
                autoFocus
                margin="dense"
              >
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

              <TextField
                margin="dense"
                name="manager"
                label="Manager Name"
                type="text"
                fullWidth
                autoFocus
                variant="filled"
                value={searchTermDialog}
                onChange={handleSearchD}
                required
                error={branch.managerId?.name}
                helperText={
                  branch.managerId?.name ? "Choose Manager For Branch." : ""
                }
                autoComplete="off"
                sx={textFieldStyles}
              />

              {/* Suggestions List */}
              {filteredUsers.length > 0 && (
                <ul className="suggestions-list">
                  {filteredUsers.map((user, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        selectUser(user, "dialog");
                        setBranch({ ...branch, managerId: user._id });
                      }}
                    >
                      {user.name || ""}
                    </li>
                  ))}
                </ul>
              )}
              {userDetailsDialog && (
                <div className="customer-details">
                  <div className="detail-col">
                    <p>
                      <strong>Name:</strong> {userDetailsDialog.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {userDetailsDialog.email}
                    </p>
                  </div>
                </div>
              )}
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
                  !/^\d{6}$/.test(branch.pincode) ||
                  !branch.managerId
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
              <Grid item xs={12} key={branch._id}>
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
                          handleBranchChange(branch._id, "name", e.target.value)
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
                          handleBranchChange(
                            branch._id,
                            "address",
                            e.target.value
                          )
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
                        sx={{ textFieldStyles }}
                      >
                        <InputLabel>Country</InputLabel>
                        <Select
                          value="India"
                          // onChange={(e) => {
                          //   handleBranchChange(
                          //     branch._id,
                          //     "country",
                          //     e.target.value.name
                          //   );

                          //   setCountryCode(e.target.value.isoCode);
                          //   setStates(
                          //     State.getStatesOfCountry(e.target.value.isoCode)
                          //   );
                          // }}
                          disabled
                          required
                        >
                          {/* {countries.map((country) => (
                            <MenuItem key={country.isoCode} value={country}>
                              {country.name}
                            </MenuItem>
                          ))} */}
                          <MenuItem value="India">India</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                      <FormControl
                        fullWidth
                        variant="filled"
                        sx={{ textFieldStyles }}
                      >
                        <InputLabel>State</InputLabel>

                        <Select
                          value={branch.state}
                          onChange={(e) => {
                            handleBranchChange(
                              branch._id,
                              "state",
                              e.target.value
                            );
                          }}
                          required
                        >
                          {states.length > 0 ? (
                            states.map((state) => (
                              <MenuItem key={state.isoCode} value={state.name}>
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
                        sx={{ textFieldStyles }}
                      >
                        <InputLabel>City</InputLabel>
                        <Select
                          value={branch.city}
                          onChange={(e) => {
                            handleBranchChange(
                              branch._id,
                              "city",
                              e.target.value
                            );
                          }}
                          required
                        >
                          {branchCities[branch._id]?.map((city) => (
                            <MenuItem key={city.name} value={city.name}>
                              {city.name}
                            </MenuItem>
                          )) || (
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
                          handleBranchChange(
                            branch._id,
                            "pincode",
                            e.target.value
                          )
                        }
                        fullWidth
                        variant="filled"
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Manager"
                        value={searchTerm[branch._id] || ""}
                        onChange={(e) =>
                          handleSearch(branch._id, e.target.value)
                        }
                        fullWidth
                        variant="filled"
                        sx={textFieldStyles}
                      />
                      {/* Suggestions List */}
                      {filteredUsers.length > 0 && (
                        <ul className="suggestions-list">
                          {filteredUsers.map((user, index) => (
                            <li
                              key={index}
                              onClick={() => {
                                selectUser(user, branch._id);
                                handleBranchChange(
                                  branch._id,
                                  "managerId",
                                  user._id
                                );
                              }}
                            >
                              {user.name || ""}
                            </li>
                          ))}
                        </ul>
                      )}
                      {userDetails[branch._id] && (
                        <div className="customer-details">
                          <div className="detail-col">
                            <p>
                              <strong>Name:</strong>{" "}
                              {userDetails[branch._id].name}
                            </p>
                            <p>
                              <strong>Email:</strong>{" "}
                              {userDetails[branch._id].email}
                            </p>
                          </div>
                        </div>
                      )}
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="flex-end">
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
            startIcon={<Pencil size={18} />}
            onClick={handleUpdate}
            sx={{
              backgroundColor: "#28a745",
              color: "white",
              "&:hover": {
                backgroundColor: "#218838",
              },
            }}
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
      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
};

export default ShopDetail;
