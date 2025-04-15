import React, { useEffect, useState } from "react";
import { Button, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SquareArrowOutUpRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser } from "../../../Redux/Slices/authSlice"; // Import action
import { jwtDecode } from "jwt-decode";
import { addAuditLog } from "../../../Redux/Slices/auditLogSlice";
import "./GoogleAuthSuccess.css";

const GoogleAuthSuccess = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [, setAccessToken] = useState(null);
  const [, setRefreshToken] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const access = searchParams.get("accessToken");
    const refresh = searchParams.get("refreshToken");

    if (access && refresh) {
      setAccessToken(access);
      setRefreshToken(refresh);
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
    } else {
      // Redirect to login if tokens are missing
      navigate("/login");
    }

    try {
      const decoded = jwtDecode(searchParams.get("accessToken")); // ✅ Decode JWT Token
      console.log(decoded)
      dispatch(
        setUser({
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
        })
      ); // ✅ Update Redux User
      dispatch(
        addAuditLog({
          user: decoded.name,
          operation: "LOGIN",
          module: "Login",
          message: `Logged in via google.`,
        })
      );
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/login"); // If decoding fails, redirect to login
    }
  }, [dispatch, searchParams, navigate]);

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
            <h3>✅ Google Authentication Done!</h3>
          </motion.div>

          <Button
            variant="contained"
            className="explore-btn"
            onClick={handleExplore}
            sx={{
              gap: "0.5rem",
            }}
          >
            Explore <SquareArrowOutUpRight size={20} />
          </Button>
        </Paper>
      </motion.div>
    </div>
  );
};

export default GoogleAuthSuccess;
