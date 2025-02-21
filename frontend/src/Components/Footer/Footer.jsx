import React from 'react'
import { useSelector } from 'react-redux';
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import "./Footer.css";

export default function Footer() {

  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 1.5 }}
      className={`${darkMode ? "dark-footer" : "light-footer"}`}
    >
      <div className="footer-container">
       
        <motion.div 
          className="footer-column"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        >
          <h3>BizTrack</h3>
          <p>123 Business St, City, Country</p>
          <p>support@biztrack.com</p>
        </motion.div>
        
        
        <motion.div 
          className="footer-column"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.4 }}
        >
          <h3>Quick Links</h3>
          
            <a href="/">Home</a>
            <a href="/">About Us</a>
            <a href="/">Billing</a>
            <a href="/">Inventory</a>

         
          
        </motion.div>
        
        
        <motion.div 
          className="footer-column"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, delay: 0.6 }}
        >
          <h3>Follow Us</h3>
          <div className="social-icons">
            <motion.a href="#" whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
              <FaFacebook />
            </motion.a>
            <motion.a href="#" whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
              <FaTwitter />
            </motion.a>
            <motion.a href="#" whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
              <FaInstagram />
            </motion.a>
          </div>
        </motion.div>
      </div>
      
      
      <motion.div 
        className="copyright"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.8 }}
      >
        <p>© 2025 BizTrack. All rights reserved.</p>
      </motion.div>
    </motion.footer>
  )
}
