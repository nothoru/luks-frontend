// src/App.jsx

import { useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import AdminLayout from "./components/AdminComponents/AdminLayout";

// Admin/Staff Pages
import Dashboard from "./components/AdminComponents/Dashboard";
import Feedback from "./components/AdminComponents/Feedback";
import Menu_Management from "./components/AdminComponents/Menu_Management";
import Menu_order from "./components/AdminComponents/Menu_Order";
import Order from "./components/AdminComponents/Orders";
import Sales from "./components/AdminComponents/Sales";
import Profile from "./components/AdminComponents/Profile";
import StaffManagement from "./components/AdminComponents/Staff_Management";
import StaffAdminLogin from "./pages/Customers/Employees/StaffAdminLogin";
import FaceLogin from "./pages/Customers/Employees/FaceLogin";
import SalesRecommendation from "./components/AdminComponents/SalesRecommendation";

import { CartProvider } from "././context/CartContext";
import Home from "./pages/Customers/Home";
import Menu from "./pages/Customers/Menu";
import Cart from "./pages/Customers/Cart";
import About from "./pages/Customers/About";
import Orders from "./pages/Customers/Orders";
import CustomerFeedback from "./pages/Customers/CustomerFeedback";
import CustomerProfile from "./pages/Customers/Profile";
import FAQ from "./pages/Customers/FAQ";
import TermsAndConditions from "./pages/Customers/TermsAndConditions";

//Authentication Page
import Login from "./pages/Customers/Authentication/Login";
import Signup from "./pages/Customers/Authentication/Signup";
import Contact from "./pages/Customers/Contact";
import CheckEmailPage from "./pages/Customers/Authentication/CheckEmailPage";
import ForgotPassword from "./pages/Customers/Authentication/ForgotPassword";
import ResetPassword from "./pages/Customers/Authentication/ResetPassword";
import AccountActivationPage from "./pages/Customers/Authentication/AccountActivationPage";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <BrowserRouter>
            <AuthProvider>
              <CartProvider>
                <Routes>
                  {/* --- Public Customer Routes --- */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/feedback" element={<CustomerFeedback />} />
                  <Route path="/profile" element={<CustomerProfile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route
                    path="/terms-and-conditions"
                    element={<TermsAndConditions />}
                  />{" "}
                  <Route
                    path="/check-email-for-activation"
                    element={<CheckEmailPage />}
                  />{" "}
                  <Route
                    path="/activate/:uid/:token"
                    element={<AccountActivationPage />}
                  />
                  <Route path="/forgot-password" element={<ForgotPassword />} />{" "}
                  <Route
                    path="/reset-password/:uid/:token"
                    element={<ResetPassword />}
                  />{" "}
                  <Route path="/faq" element={<FAQ />} />
                  {/* --- Staff/Admin Login --- */}
                  <Route path="/staff-login" element={<StaffAdminLogin />} />
                  <Route path="/face-login" element={<FaceLogin />} />
                  {/* --- Admin/Staff Protected Routes --- */}
                  <Route
                    element={<PrivateRoute allowedRoles={["admin", "staff"]} />}
                  >
                    <Route
                      path="/admin/*"
                      element={
                        <AdminLayout>
                          <Routes>
                            {/* All admin routes are now children of the layout */}
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="orders" element={<Order />} />
                            <Route path="sales" element={<Sales />} />
                            <Route
                              path="sales-recommendation"
                              element={<SalesRecommendation />}
                            />
                            <Route path="menu_order" element={<Menu_order />} />
                            <Route path="feedback" element={<Feedback />} />
                            <Route
                              path="menu_management"
                              element={<Menu_Management />}
                            />
                            <Route
                              path="staff_management"
                              element={<StaffManagement />}
                            />
                            <Route path="profile" element={<Profile />} />
                          </Routes>
                        </AdminLayout>
                      }
                    />
                  </Route>
                </Routes>
              </CartProvider>
            </AuthProvider>
          </BrowserRouter>
        </CssBaseline>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
