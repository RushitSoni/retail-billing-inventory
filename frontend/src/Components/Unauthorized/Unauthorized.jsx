import React from "react";
import { Button, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SquareArrowOutUpRight } from "lucide-react";

import "./Unauthorized.css";

const Unauthorized = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const navigate = useNavigate();
 

  const handleExplore = async () => {
   
    navigate("/");
  };

  return (
    <div
      className={`auth-success-container ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        whileHover={{ scale: 1.025 }}
      >
        <Paper className="auth-box" elevation={3}>
          <motion.div
            className="hero-section"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
           <h3>❌ Unauthorized Access!</h3>
           <p>You do not have permission to view this page.</p>
          </motion.div>

          <Button
            variant="contained"
            className="explore-btn"
            onClick={handleExplore}
            sx={{
                gap:"0.5rem"
            }}
          >
            Explore <SquareArrowOutUpRight size={20} />
          </Button>
        </Paper>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
