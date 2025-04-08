import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  FormControl,
  Select,
  InputLabel
} from "@mui/material";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import "./NewShop.css";
import { useDispatch, useSelector } from "react-redux";
import { addShop } from "../../../Redux/Slices/shopSlice";

const ShopCreation = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const owner = useSelector((state)=>state.auth.user._id)
  console.log(owner)
  const dispatch = useDispatch();
  const [shop, setShop] = useState({
    owner:owner,
    name: "",
    category: "",
    logo: "",
    description: "",
    branches: [],
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(shop)
    dispatch(addShop(shop));
    setShop({
      owner:owner,
      name: "",
      category: "",
      logo: "",
      description: "",
      branches: [],
    });
  };

  const defaultImage =
    "https://th.bing.com/th/id/OIP.NPEIfMNVMZyX4ou00Ull2wAAAA?rs=1&pid=ImgDetMain";

  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];

  //   if (file) {
  //     // Validate file type
  //     if (!file.type.startsWith("image/")) {
  //       alert("Please upload a valid image file.");
  //       return;
  //     }

  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setShop({ ...shop, logo: reader.result });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
  
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
  
    try {
      const response = await fetch("http://localhost:8000/api/upload", {
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
  

  const handleChange = (e) => {
    setShop({ ...shop, [e.target.name]: e.target.value });
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
          Create New Shop
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
                autoFocus
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
                    src={shop.logo || defaultImage}
                    alt="Shop Logo"
                    style={{ objectFit: "cover" }}
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
                autoFocus
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
                autoFocus
                margin="dense"
                variant="filled"
                multiline
                rows={4}
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

        <div className="shop-actions">
          <Button
            variant="contained"
            color="primary"
            startIcon={<Save size={18} />}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ShopCreation;
