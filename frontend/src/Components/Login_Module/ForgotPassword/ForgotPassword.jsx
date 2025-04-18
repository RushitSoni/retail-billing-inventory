import React, { useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import "./ForgotPassword.css";
import {forgotPassword} from "../../../Redux/Slices/authSlice"
import { useDispatch, useSelector } from "react-redux";
import Toast from "../../Shared_Module/Toast/Toast"
import { useNavigate } from "react-router-dom";


export default function ForgotPassword() {

    const darkMode = useSelector((state) => state.theme.darkMode);
    const [email, setEmail] = useState("");

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { message, error} = useSelector((state) => state.auth);

    const [toast, setToast] = useState({ open: false, message: "", type: "success" });
  
    const showToast = (msg, type) => {
      setToast({ open: true, message: msg, type });
    };
  
   

  
  
    const handleReset = async (e) => {
      try{
        e.preventDefault();
        await dispatch(forgotPassword(email)).unwrap();


        showToast("Reset password link sent to your registered email successfully!", "success")
        
      }
      catch(err){
        showToast("Issue in sending Reset password link to your registered email!", "error")
        console.log(err)
      }
     
    };
  return (
    <div className={`forgot-password-container ${darkMode ? "dark-mode" : "light-mode"}`}>
    <motion.div
      className="forgot-hero-section"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h1>Reset Your Password</h1>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      whileHover={{ scale: 1.025 }}
    >
      <Paper className="forgot-password-box" elevation={3}>
        <form onSubmit={handleReset}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <TextField
              label="Email"
              type="email"
              variant="filled"
              fullWidth
              required
              className="forgot-input-field"
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                "& label": { color: "gray" }, // Default label color
                "& label.Mui-focused": { color: "gray" }, // Focused label color
                "& .MuiInputBase-input": { color: "gray" }, // Input text color
                "& .MuiFilledInput-root": { backgroundColor: "transparent" }, // Remove background
                "& .MuiFilledInput-underline:before": { borderBottomColor: "gray" }, // Default underline
                "& .MuiFilledInput-underline:after": { borderBottomColor: "gray" }, // Focused underline
            }}
            />

            <Button type="submit" variant="contained" className="forgot-btn">
              Send Reset Link
            </Button>
            <Typography className="forgot-signup-link">
              Remembered your password? <span onClick={()=> navigate("/login")}>Login</span>
            </Typography>
          </motion.div>

          
        </form>
        {message && <p>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Paper>
    </motion.div>
    <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, open: false })} />

  </div>
  )
}
