import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaShoppingCart } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 px-6 md:px-20"
        style={{
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundImage: `url('https://react-shop-siza.vercel.app/assets/AbstractDesign-5_Gpi5_9.svg')`,
      }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold">
            React <span className="text-purple-500">Shop</span>
          </h2>
          <p className="text-gray-300">
            Your one-stop shop for quality tech products. Fast shipping, authentic items, and excellent support.
          </p>
          <div className="flex gap-4 text-gray-400 text-lg">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li><NavLink to="/" className="hover:text-purple-500 transition" style={{textDecoration:"none"}}>Home</NavLink></li>
            <li><NavLink to="/products" className="hover:text-purple-500 transition" style={{textDecoration:"none"}}>Products</NavLink></li>
            <li><NavLink to="/about" className="hover:text-purple-500 transition"style={{textDecoration:"none"}}>About</NavLink></li>
            <li><NavLink to="#" className="hover:text-purple-500 transition"style={{textDecoration:"none"}}>Contact</NavLink></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-2">Newsletter</h3>
          <p className="text-gray-300">Subscribe to get updates on new products and offers.</p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-lg text-white w-full sm:w-auto flex-1"
            />
            <button className="bg-purple-500 px-4 py-2 rounded-pill hover:bg-purple-600 transition">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className=" border-t border-gray-700 mt-10 pt-4 text-center text-gray-400 text-sm "> 
      </div>
       <div className="flex justify-center p-1">
          &copy;{new Date().getFullYear()} React Shop. All rights reserved.
        </div>
    </footer>
  );
};

export default Footer;
