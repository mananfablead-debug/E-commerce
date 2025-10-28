import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomNavbar from "./components/Navbar";
import HeroSection from "./Pages/HeroSection";
import { TopBrands } from "./Pages/Advetice";
import { NewArrivals } from "./Pages/NewProduct";
import { ProductsSection } from "./Pages/Product";
import { AllProductsPage } from "./Pages/AllProduct";
import LoginPage from "./Pages/Login";
import ProductDetailPage from "./Pages/Details";
import AboutSection from "./Pages/About";
import Footer from "./components/Footer";
import ProfileSection from "./Pages/Profile";
import CartPage from "./Pages/Cart";
import SuccessPage from "./Pages/SuccessPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import AddProductPage from "./Pages/AddProductPage";
import EditProductPage from "./Pages/EditProductPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import OrderHistoryPage from "./Pages/OrderHistoryPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <GoogleOAuthProvider clientId="380793290073-e2v4i24c8ivivd36om6f86th3vtn4a3a.apps.googleusercontent.com">
      <CustomNavbar />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <TopBrands />
              <NewArrivals />
              <ProductsSection />
              <AboutSection />
            </>
          }
        />
        <Route path="/products" element={<AllProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/about" element={<AboutSection/>}/>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileSection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AboutSection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <SuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-product"
          element={
            <ProtectedRoute>
              <AddProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-product/:id"
          element={
            <ProtectedRoute>
              <EditProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </GoogleOAuthProvider>
  );
}

export default App;
