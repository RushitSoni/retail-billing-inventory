import React, { useEffect } from "react";
import "./Shops.css";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { fetchShops } from "../../../Redux/Slices/shopSlice";
import { BarChart, Pencil, Plus } from "lucide-react";
import { Grid, Button } from "@mui/material";
const ShopDetails = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: shops } = useSelector((state) => state.shops);
  useEffect(() => {
    dispatch(fetchShops());
  }, [dispatch]);

  return (
    <div className={`shop-container ${darkMode ? "dark" : "light"}`}>
      <Grid container className="add-shop-btn-container">
        <Grid item>
          <Button
            variant="contained"
            startIcon={<Plus />}
            onClick={() => navigate("/newShop")}
            sx={{
              mt: 5,
              mb: 0,
              backgroundColor: "#28a745",
              color: "white",
              "&:hover": {
                backgroundColor: "#218838",
              },
            }}
          >
            Add Shop
          </Button>
        </Grid>
      </Grid>

      {shops.map((shop, shopIndex) => (
        <motion.div
          key={shopIndex}
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          whileHover={{ scale: 1.005 }}
          className="shop-card"
        >
          {/* Shop Details */}
          <div className="shop-details">

          <div className="shop-details-left">
            <div className="shop-logo-container">
              <img src={shop.logo} alt="Shop Logo" className="shop-logo" />
            </div>
            <div className="shop-info">
              <h1 className="shop-name">{shop.name}</h1>
              <p className="shop-description">{shop.description}</p>
            </div>
            </div>

            <div className="shop-details-right">
            <button
                    className="details-btn"
                    onClick={() => navigate(`/analytics/${shop._id}`)}
                  >
                    <BarChart size={20} />
                  </button>
            {/* Navigate Button */}
            <button
              className="details-btn"
              onClick={() => navigate(`/shop/${shop._id}`)}
            >
              <Pencil size={20} />
            </button>
            </div>
          </div>

          {/* Branches */}
          <div className="branches-container">
            <div className="branches-list">
              {shop.branches.map((branch, branchIndex) => (
                <div key={branchIndex} className="branch-item">
                  <div>
                    <h3>{branch.name}</h3>
                    <p>
                      {branch.address}, {branch.city}, {branch.state} -{" "}
                      {branch.pincode}
                    </p>
                    <p>Managed By {branch.managerId}</p>
                  </div>
                  <button
                    className="details-btn"
                    onClick={() => navigate(`/shop/${shop._id}/${branch._id}`)}
                  >
                    <BarChart size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ShopDetails;
