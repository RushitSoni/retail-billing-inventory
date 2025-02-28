import React, { useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import "./SignUp.css";
import { useDispatch, useSelector } from "react-redux";
import {registerUser} from "../../../Redux/Slices/authSlice"
import GoogleIcon from '@mui/icons-material/Google';
//import { useNavigate } from "react-router-dom";

export default function SignUp() {

  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const navigate = useNavigate()
  const {error } = useSelector((state) => state.auth);
  
  const handleSignup = (e) => {
    e.preventDefault();
    dispatch(registerUser({ name:name , email: email, password: password }))
  };
  const handleG = () => {
    window.open("http://localhost:8000/api/auth/google/signup", "_self");
  };

  
  return (
    <div className={`signup-container ${darkMode ? "dark-mode" : "light-mode"}`}>
    <motion.div
      className="hero-section"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h1>Create Your BizTrack Account</h1>
    </motion.div>

    

    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      whileHover={{ scale: 1.025 }}
    >
      <Paper className="signup-box" elevation={3}>
      {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSignup}>
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
              className="input-field"
              onChange={(e) => setName(e.target.value)}
              sx={{
                "& label": { color: "gray" }, // Default label color
                "& label.Mui-focused": { color: "gray" }, // Focused label color
                "& .MuiInputBase-input": { color: "gray" }, // Input text color
                "& .MuiFilledInput-root": { backgroundColor: "transparent" }, // Remove background
                "& .MuiFilledInput-underline:before": { borderBottomColor: "gray" }, // Default underline
                "& .MuiFilledInput-underline:after": { borderBottomColor: "gray" }, // Focused underline
            }}
            />

            <TextField
              label="Email"
              type="email"
              variant="filled"
              fullWidth
              required
              className="input-field"
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

            <TextField
              label="Password"
              type="password"
              variant="filled"
              fullWidth
              required
              className="input-field"
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                "& label": { color: "gray" }, // Default label color
                "& label.Mui-focused": { color: "gray" }, // Focused label color
                "& .MuiInputBase-input": { color: "gray" }, // Input text color
                "& .MuiFilledInput-root": { backgroundColor: "transparent" }, // Remove background
                "& .MuiFilledInput-underline:before": { borderBottomColor: "gray" }, // Default underline
                "& .MuiFilledInput-underline:after": { borderBottomColor: "gray" }, // Focused underline
            }}
            />

            <Button type="submit" variant="contained" className="signup-btn">
              Sign Up
            </Button>
            <Typography className="signup-link">
              Already have an account? <span>Login</span>
            </Typography>


            <Button
                  onClick={handleG}
                  variant="contained"
                  className="signup-btn"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                <GoogleIcon sx={{ fontSize: 20 }} /> 
                Login with Google
              </Button>
          </motion.div>
        </form>
      </Paper>
    </motion.div>
  </div>
  )
}
