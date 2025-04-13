import React, { useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import "./ResetPassword.css";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {resetPassword} from "../../../Redux/Slices/authSlice"
import { jwtDecode } from "jwt-decode";
import Toast from "../../Shared_Module/Toast/Toast";
import { addAuditLog } from "../../../Redux/Slices/auditLogSlice";

export default function ResetPassword() {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [newPassword, setNewPassword] = useState("");
  const { token } = useParams();
  const decoded = jwtDecode(token); // ✅ Decode JWT Token
  // console.log(decoded)
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { message, error } = useSelector((state) => state.auth);
    const [toast, setToast] = useState({ open: false, message: "", type: "success" });
  
    const showToast = (msg, type) => {
      setToast({ open: true, message: msg, type });
    };
  
   
  
  

    const handleReset = async (e) => {
      try{
        e.preventDefault();
        await dispatch(resetPassword({ token, newPassword })).unwrap();

        await  dispatch(
          addAuditLog({
            user: decoded.name,
            operation: "UPDATE",
            module: "Login",
            message: "Password Reset.",
          })
        );

        showToast("Password Reset successfully!", "success")
      }
      catch(err){
        showToast("Updation Failed!", "error")
        console.log(err)
      }

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
                value={decoded.name}
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
                value={decoded.email}
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
                Remembered your password? <span onClick={()=>{navigate("/login")}}>Login</span>
              </Typography>
            </motion.div>
          </form>
          {message && <p>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </Paper>
      </motion.div>
      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, open: false })} />

    </div>
  );
}
