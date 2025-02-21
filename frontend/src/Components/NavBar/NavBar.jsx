import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Sun, Moon, User, Menu, X } from "lucide-react"; 
import "./NavBar.css";
import { motion } from "framer-motion";
import logo from '../Assests/bizTrack_logo.png';
import {toggleDarkMode}from '../../Redux/Slices/themeSlice' 
import { useNavigate } from "react-router-dom";

export default function NavBar() {

  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate()

  return (
    <header className={`header ${darkMode ? "dark" : "light"}`}>
      <div className="nav-left">
        <motion.img
          src={logo}
          alt="BizTrack"
          className={`logo ${darkMode ? "dark-logo" : "light-logo"}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          onClick={() => navigate("/")}
        />
        
        

        <ul className={`menu ${menuOpen ? "open" : ""}`}>
          <motion.li whileHover={{ scale: 1.1 }}>Admin</motion.li>
          <motion.li whileHover={{ scale: 1.1 }}>Billing</motion.li>
          <motion.li whileHover={{ scale: 1.1 }}>Inventory</motion.li>
          <motion.li whileHover={{ scale: 1.1 }} onClick={() => navigate("/aboutUs")}>About Us</motion.li>
        </ul>
      </div>

      <div className="nav-right">

        <motion.button 
          className={`menu-button ${darkMode ? "dark-button" : "light-button"}`}
          onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
        <motion.button className={`profile-button ${darkMode ? "dark-button" : "light-button"}`} whileHover={{ scale: 1.1 }}>
          <User size={20} />
        </motion.button>
        <motion.button
          className={`theme-toggle ${darkMode ? "dark-button" : "light-button"}`}
          onClick={() => dispatch(toggleDarkMode())}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>
      </div>
    </header>
  );
}
