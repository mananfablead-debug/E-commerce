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
import { useNavigate, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "../features/Auth/authSlice";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { token, user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items); // 🟣 Get cart items from Redux
  const isLoggedIn = !!token;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClick = () => navigate("/login");

  const handleProtectedAction = (route) => {
    if (!isLoggedIn) {
      toast.error("Please login first to access this page.", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        icon: "🔒",
      });
      return;
    }
    navigate(route);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    toast.success("Logged out successfully!", {
      style: {
        borderRadius: "10px",
        background: "#222",
        color: "#fff",
      },
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 bg-black bg-opacity-90 text-white shadow-lg "
      style={{
        backgroundImage: `url('https://react-shop-siza.vercel.app/assets/AbstractDesign-5_Gpi5_9.svg')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mx-auto flex justify-between items-center py-3 px-6">
        <div className="flex items-center gap-2">
          <span
            className="text-4xl font-extrabold text-white tracking-wide cursor-pointer"
            onClick={() => navigate("/")}
          >
            React <span className="text-purple-500">Shop</span>
          </span>
        </div>

        <div className="navbar p-5 hidden md:flex items-center gap-20 backdrop-blur-md bg-zinc-900 bg-opacity-70 px-6 py-2 rounded-full text-sm font-xl shadow-inner shadow-2xl">
          <NavLink
            to="/"
            className="text-white text-lg hover:text-purple-400 transition"
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className="text-white text-lg hover:text-purple-400 transition"
          >
            Products
          </NavLink>
          <NavLink
            to="/about"
            className="text-white text-lg hover:text-purple-400 transition"
          >
            About
          </NavLink>
        </div>

        <div className="flex items-center gap-4 text-lg relative">
          {!isLoggedIn && (
            <button
              className="flex items-center gap-1 hover:text-purple-400 transition duration-200"
              onClick={handleClick}
            >
              <FiLogIn /> <span className="hidden sm:inline">Login</span>
            </button>
          )}

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


          <div className="relative cursor-pointer">
            <FaShoppingCart
              onClick={() => handleProtectedAction("/cart")}
              className={`text-xl transition duration-200 ${
                isLoggedIn ? "hover:text-purple-400" : "opacity-60"
              }`}
              title={isLoggedIn ? "Cart" : "Login required"}
            />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md ">
                {cartItems.length}
              </span>
            )}
          </div>

          <button
            className="md:hidden text-2xl hover:text-purple-400 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col items-center border-t border-gray-700 bg-black bg-opacity-95 py-6 space-y-4">
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
