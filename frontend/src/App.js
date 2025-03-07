import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './Components/NavBar/NavBar';
import Footer from './Components/Footer/Footer';
import Home from './Components/HomePage/Home';
import AboutUs from './Components/AboutUs/AboutUs';
import Login from './Components/Login_Module/Login/Login';
import SignUp from './Components/Login_Module/SignUp/SignUp';
import ForgotPassword from './Components/Login_Module/ForgotPassword/ForgotPassword';
import ResetPassword from './Components/Login_Module/ResetPassword/ResetPassword';
import VerifyEmail from './Components/Login_Module/VerifyEmail/VerifyEmail';
import GoogleAuthSuccess from './Components/Login_Module/GoogleAuthSuccess/GoogleAuthSuccess';
import Bill from './Components/Billing_Module/Bill/Bill';
import CustomerDetails from './Components/Billing_Module/CustomerDetails/CustomerDetails';



const App = () => {
 
  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <div className={darkMode ? 'dark' : 'light'} style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
     <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutUs" element={<AboutUs/>} />
          <Route path="/login" element={<Login/>} />
          <Route path='/signup' element={<SignUp/>}/>
          <Route path="/forgotpassword" element={<ForgotPassword/>} />
          <Route path="/reset-password/:token" element={<ResetPassword/>} />
          <Route path="/verify-email/:token" element={<VerifyEmail/>} />
          <Route path='/google-auth-success' element={<GoogleAuthSuccess/>}/>
          <Route path="/billing" element={<Bill/>}/>
          <Route path="/customer/:id" element={<CustomerDetails/>}/>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
