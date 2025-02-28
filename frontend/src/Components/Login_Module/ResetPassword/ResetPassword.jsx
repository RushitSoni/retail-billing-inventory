import React, { useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import "./ResetPassword.css";
import { useSelector,useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {resetPassword} from "../../../Redux/Slices/authSlice"

export default function ResetPassword() {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [newPassword, setNewPassword] = useState("");
  const { token } = useParams();
    
    const dispatch = useDispatch();
    const { message, error } = useSelector((state) => state.auth);

    const handleReset = (e) => {
      e.preventDefault();
      dispatch(resetPassword({ token, newPassword }));
    };

   

  return (
    <div
      className={`reset-password-container ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <motion.div
        className="reset-hero-section"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>Set New Password</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        whileHover={{ scale: 1.025 }}
      >
        <Paper className="reset-password-box" elevation={3}>
          <form onSubmit={handleReset}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <TextField
                label="Full Name"
                type="text"
                variant="filled"
                fullWidth
                required
                disabled
                className="reset-input-field"
                value="John Doe"
                sx={{
                  "& label": { color: "gray" },
                  "& label.Mui-focused": { color: "gray" },
                  "& .MuiInputBase-input": { color: "gray" },
                  "& .MuiFilledInput-root": { backgroundColor: "transparent" },
                  "& .MuiFilledInput-underline:before": {
                    borderBottomColor: "gray",
                  },
                  "& .MuiFilledInput-underline:after": {
                    borderBottomColor: "gray",
                  },
                  "& .Mui-disabled": {
                    color: "gray !important", // ✅ Ensures text remains gray even when disabled
                    WebkitTextFillColor: "gray !important", // ✅ Fix for WebKit browsers
                  },
                }}
              />

              <TextField
                label="Email"
                type="email"
                variant="filled"
                fullWidth
                required
                disabled
                className="reset-input-field"
                value="xyz@gmail.com"
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
                  },  "& .Mui-disabled": {
                    color: "gray !important", // ✅ Ensures text remains gray even when disabled
                    WebkitTextFillColor: "gray !important", // ✅ Fix for WebKit browsers
                  },
                }}
              />

              <TextField
                label="New Password"
                type="password"
                variant="filled"
                fullWidth
                required
                className="reset-input-field"
                onChange={(e) => setNewPassword(e.target.value)}
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

              <Button type="submit" variant="contained" className="reset-btn">
                Reset Password
              </Button>
              <Typography className="reset-login-link">
                Remembered your password? <span>Login</span>
              </Typography>
            </motion.div>
          </form>
          {message && <p>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </Paper>
      </motion.div>
    </div>
  );
}
