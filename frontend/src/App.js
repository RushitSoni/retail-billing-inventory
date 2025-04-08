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
import NewShop from './Components/Billing_Module/NewShop/NewShop.jsx'
import Shops from './Components/Billing_Module/Shops/Shops.jsx'
import ShopDetail from './Components/Billing_Module/ShopDetail/ShopDetail.jsx';
import Inventory from './Components/Inventory_Module/Inventory.jsx';
import BranchDetails from './Components/Billing_Module/BranchDetails/BranchDetails.jsx'
import ShopAnalytics from './Components/Billing_Module/ShopAnalytics/ShopAnalytics.jsx';
import Admin from './Components/Admin/Admin.jsx'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute.jsx'
import Unauthorized from './Components/Unauthorized/Unauthorized.jsx';
import Profile from './Components/Profile/Profile.jsx';

const App = () => {
 
  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <div className={darkMode ? 'dark' : 'light'} style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
     <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Admin/>
              </ProtectedRoute>
          } 
          />
          <Route path="/aboutUs" element={<AboutUs/>} />
          <Route path="/unauthorized" element={<Unauthorized/>}/>


          <Route path="/login" element={<Login/>} />
          <Route path='/signup' element={<SignUp/>}/>
          <Route path="/forgotpassword" element={<ForgotPassword/>} />
          <Route path="/reset-password/:token" element={<ResetPassword/>} />
          <Route path="/verify-email/:token" element={<VerifyEmail/>} />
          <Route path='/google-auth-success' element={<GoogleAuthSuccess/>}/>


          <Route path="/billing" element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <Bill/>
            </ProtectedRoute>
            }
          />
          <Route path="/customer/:id" element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <CustomerDetails/>
            </ProtectedRoute>
            }
          />
          <Route path="/newShop"element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <NewShop/>
            </ProtectedRoute>
            }
          />
          <Route path="/shops" element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <Shops/>
            </ProtectedRoute>
            }/>
          <Route path="/shop/:shopId" element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <ShopDetail/>
            </ProtectedRoute>
            } />
          <Route path="/analytics/:shopId" element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <ShopAnalytics/>
            </ProtectedRoute>
            }/>
          <Route path="/shop/:shopId/:branchId" element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <BranchDetails/>
            </ProtectedRoute>
            } />
          <Route path="/inventory" element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <Inventory/>
            </ProtectedRoute>
            } />


          <Route path="/user-profile/:userId" element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <Profile/>
            </ProtectedRoute>
            } />

         

        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
