import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, CircularProgress, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import axios from "axios";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/verify-email/${token}`
        );
        console.log(response)

        if (response.data && response.data.message) {
          setMessage(response.data.message);
        } else {
          setMessage("Email successfully verified!");
        }
      } catch (err) {
        console.error("Verification Error:", err);

        // Error response check
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Invalid or Expired Link");
        }
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className={`verify-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <motion.div
        className="hero-section"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>Email Verification</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        whileHover={{ scale: 1.025 }}
      >
        <Paper className="verify-box" elevation={3}>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography className="error-text">{error}</Typography>
          ) : (
            <Typography className="message-text">{message}</Typography>
          )}

          <Button
            variant="contained"
            className="back-btn"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </Button>
        </Paper>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
