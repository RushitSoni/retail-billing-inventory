import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaReceipt, FaBox, FaChartLine } from "react-icons/fa";
import "./Home.css";
import { useNavigate } from "react-router-dom";



export default function Home() {
    
  const darkMode = useSelector((state) => state.theme.darkMode);
  const navigate = useNavigate()

  return (
    <div className={`landing-container ${darkMode ? "dark-mode" : "light-mode"}`}>
    {/* Hero Section */}
    <motion.div 
      className="hero-section"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h1>Welcome to BizTrack</h1>
      <p>Your one-stop solution for seamless billing & inventory management.</p>
      <motion.button 
        whileHover={{ scale: 1.1 }} 
        transition={{ duration: 0.3 }}
        className="cta-button"
        onClick={()=> navigate("/newShop")}
      >
        Get Started
      </motion.button>
    </motion.div>

    {/* Features Section */}
    <div className="features-section">
      <motion.div 
        className="feature-block"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        whileHover={{ scale: 1.075 }} 
      >
        <FaReceipt size={30} />
        <h3>Easy Billing</h3>
        <p>Generate invoices quickly and track payments seamlessly.</p>
      </motion.div>

      <motion.div 
        className="feature-block"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        whileHover={{ scale: 1.075 }} 
      >
        <FaBox size={30} />
        <h3>Smart Inventory</h3>
        <p>Keep your stock updated with real-time inventory tracking.</p>
      </motion.div>

      <motion.div 
        className="feature-block"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        whileHover={{ scale: 1.075 }} 
      >
        <FaChartLine size={30} />
        <h3>Insightful Reports</h3>
        <p>Analyze sales trends and make data-driven decisions.</p>
      </motion.div>
    </div>
  </div>
  )
}
