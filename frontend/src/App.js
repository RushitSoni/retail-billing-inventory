import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './Components/NavBar/NavBar';
import Footer from './Components/Footer/Footer';
import Home from './Components/HomePage/Home';
import AboutUs from './Components/AboutUs/AboutUs';



const App = () => {
 
  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <div className={darkMode ? 'dark' : 'light'}>
     <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutUs" element={<AboutUs/>} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
