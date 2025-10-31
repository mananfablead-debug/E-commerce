import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FaUserCircle,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaHeart,
  FaHistory,
} from "react-icons/fa";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "../features/Auth/authSlice";
import { toggleMode } from "../features/Theme/themeSlice";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { token, user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const { mode } = useSelector((state) => state.theme);
  const isLoggedIn = !!token;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleClick = () => navigate("/login");

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(mode);
  }, [mode]);

  const handleProtectedAction = (route) => {
    if (!isLoggedIn) {
      toast.error("Please login first to access this page.", {
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
        icon: "🔒",
      });
      return;
    }
    navigate(route);
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    toast.success("Logged out successfully!", {
      style: { borderRadius: "10px", background: "#222", color: "#fff" },
    });
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hideThemeToggle = ["/", "/about"].includes(location.pathname);

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 bg-black bg-opacity-90 text-white shadow-lg"
      style={{
        backgroundImage: `url('https://react-shop-siza.vercel.app/assets/AbstractDesign-5_Gpi5_9.svg')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-4 md:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span
            className="text-3xl md:text-4xl font-extrabold text-white tracking-wide cursor-pointer"
            onClick={() => navigate("/")}
          >
            React <span className="text-purple-500">Shop</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="ab hidden md:flex items-center gap-20 p-4 backdrop-blur-md bg-zinc-900 bg-opacity-70 px-6 py-2 rounded-full shadow-inner">
          <NavLink to="/" className="text-white text-lg hover:text-purple-400 transition">
            Home
          </NavLink>
          <NavLink to="/products" className="text-white text-lg hover:text-purple-400 transition">
            Products
          </NavLink>
          <NavLink to="/about" className="text-white text-lg hover:text-purple-400 transition">
            About
          </NavLink>
        </div>

        {/* Icons / Actions */}
        <div className="flex items-center gap-4 text-lg relative">
          {!isLoggedIn && (
            <button
              className="flex items-center gap-1 hover:text-purple-400 transition duration-200"
              onClick={handleClick}
            >
              <FiLogIn /> <span className="hidden sm:inline">Login</span>
            </button>
          )}

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <FaUserCircle
              onClick={() => isLoggedIn && setDropdownOpen(!dropdownOpen)}
              className={`text-2xl cursor-pointer transition duration-200 ${
                isLoggedIn ? "hover:text-purple-400" : "opacity-60"
              }`}
              title={isLoggedIn ? "Profile Menu" : "Login required"}
            />
            {dropdownOpen && isLoggedIn && (
              <div className="absolute right-0 mt-3 w-56 bg-white text-gray-800 rounded-xl shadow-lg py-2 z-50 animate-fadeIn">
                <div className="px-4 py-2 border-b border-gray-200 text-sm text-gray-600">
                  Signed in as <br />
                  <span className="font-semibold text-purple-600">
                    {user?.username || user?.name || "User"}
                  </span>
                </div>

                <button
                  onClick={() => handleProtectedAction("/profile")}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-purple-50 transition text-gray-700"
                >
                  <FaUserCircle className="text-purple-500" /> Profile
                </button>

                <button
                  onClick={() => handleProtectedAction("/wishlist")}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-purple-50 transition text-gray-700"
                >
                  <FaHeart className="text-red-500" /> Wishlist
                </button>

                <button
                  onClick={() => handleProtectedAction("/cart")}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-purple-50 transition text-gray-700"
                >
                  <FaShoppingCart className="text-green-500" /> Cart
                </button>

                <button
                  onClick={() => handleProtectedAction("/orders")}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-purple-50 transition text-gray-700"
                >
                  <FaHistory className="text-gray-800" /> Order History
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-semibold transition"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="relative cursor-pointer">
            <FaShoppingCart
              onClick={() => handleProtectedAction("/cart")}
              className={`text-xl transition duration-200 ${
                isLoggedIn ? "hover:text-purple-400" : "opacity-60"
              }`}
              title={isLoggedIn ? "Cart" : "Login required"}
            />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                {cartItems.length}
              </span>
            )}
          </div>

          {/* Theme Toggle */}
          {!hideThemeToggle && (
            <button
              onClick={() => dispatch(toggleMode())}
              className="text-xl hover:text-purple-400 transition hidden sm:block"
              title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
            >
              {mode === "light" ? "🌙" : "☀️"}
            </button>
          )}

          {/* Mobile Menu Icon */}
          <button
            className="md:hidden text-2xl hover:text-purple-400 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="ab md:hidden flex flex-col items-center border-t border-gray-700 bg-black bg-opacity-95 py-6 space-y-5 animate-slideDown">
          <NavLink
            to="/"
            className="text-white text-lg hover:text-purple-400 transition"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className="text-white text-lg hover:text-purple-400 transition"
            onClick={() => setMenuOpen(false)}
          >
            Products
          </NavLink>
          <NavLink
            to="/about"
            className="text-white text-lg hover:text-purple-400 transition"
            onClick={() => setMenuOpen(false)}
          >
            About
          </NavLink>

          {!isLoggedIn && (
            <button
              className="flex items-center gap-1 text-white hover:text-purple-400 transition"
              onClick={() => {
                setMenuOpen(false);
                handleClick();
              }}
            >
              <FiLogIn /> Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
