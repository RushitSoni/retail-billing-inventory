import React, { useState,useEffect } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../Redux/Slices/authSlice";
import GoogleIcon from '@mui/icons-material/Google';


const Login = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {  error } = useSelector((state) => state.auth);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };
  const handleGLogin = () => {
    window.open("http://localhost:8000/api/auth/google/login", "_self");
  };
  const navigate = useNavigate()

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
        localStorage.setItem("accessToken", token);
        window.location.href = "/"; 
    }
}, []);


  return (
    <div className={`login-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <motion.div
        className="hero-section"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>Welcome Back to BizTrack</h1>
      </motion.div>

      

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        whileHover={{ scale: 1.025 }}
      >
        <Paper className="login-box" elevation={3}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleLogin}>
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

              <Typography className="forgot-link" onClick={()=> navigate("/forgotpassword")}>Forgot Password?</Typography>

              <Button type="submit" variant="contained" className="login-btn">
                Login
              </Button>
              <Typography className="signup-link">
                Don't have an account? <span>Sign Up</span>
              </Typography>

              <Button
                  onClick={handleGLogin}
                  variant="contained"
                  className="login-btn"
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
  );
};

export default Login;
