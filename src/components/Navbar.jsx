import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaUserCircle, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { useNavigate, NavLink } from "react-router-dom";
import toast from "react-hot-toast";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const isLoggedIn = !!token;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

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
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 bg-black bg-opacity-90 text-white shadow-lg"
      style={{
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundImage: `url('https://react-shop-siza.vercel.app/assets/AbstractDesign-5_Gpi5_9.svg')`,
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

        <div className="p-5 hidden md:flex items-center gap-20 backdrop-blur-md bg-zinc-900 bg-opacity-70 px-6 py-2 rounded-full text-sm font-xl shadow-inner shadow-2xl">
          <NavLink
            to="/"
            className="text-white text-lg hover:text-purple-400 transition"
            style={{ textDecoration: "none" }}
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className="text-white text-lg hover:text-purple-400 transition"
            style={{ textDecoration: "none" }}
          >
            Products
          </NavLink>
          <NavLink
            to="/about"
            className="text-white text-lg hover:text-purple-400 transition"
            style={{ textDecoration: "none" }}
          >
            About
          </NavLink>
        </div>

        <div className="flex items-center gap-4 text-lg">
          {!isLoggedIn && (
            <button
              className="flex items-center gap-1 hover:text-purple-400 transition duration-200"
              onClick={handleClick}
            >
              <FiLogIn /> <span className="hidden sm:inline">Login</span>
            </button>
          )}

          <FaUserCircle
            onClick={() => handleProtectedAction("/profile")}
            className={`text-2xl cursor-pointer transition duration-200 ${
              isLoggedIn ? "hover:text-purple-400" : "opacity-60"
            }`}
            title={isLoggedIn ? "Profile" : "Login required"}
          />

          <FaShoppingCart
            onClick={() => handleProtectedAction("/cart")}
            className={`text-xl cursor-pointer transition duration-200 ${
              isLoggedIn ? "hover:text-purple-400" : "opacity-60"
            }`}
            title={isLoggedIn ? "Cart" : "Login required"}
          />

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
            style={{ textDecoration: "none" }}
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className="text-white text-lg hover:text-purple-400 transition"
            onClick={() => setMenuOpen(false)}
            style={{ textDecoration: "none" }}
          >
            Products
          </NavLink>
          <NavLink
            to="/about"
            className="text-white text-lg hover:text-purple-400 transition"
            onClick={() => setMenuOpen(false)}
            style={{ textDecoration: "none" }}
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
