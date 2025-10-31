import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaArrowLeft, FaShoppingBag, FaTrashAlt, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { deleteOrder, clearOrders } from "../features/cart/cartSlice";
import Lottie from "lottie-react";
import OrderAnimation from "../assets/Order Received imagery.json";

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.cart.orders);
  const mode = useSelector((state) => state.theme.mode);
  const { selectedAddress } = useSelector((state) => state.address); // 🏠 from addressSlice

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div
      className={`min-h-screen py-16 px-6 mt-4 transition-colors duration-500 ${
        mode === "dark"
          ? "bg-[rgba(var(--background))] text-[rgba(var(--copy-primary))]"
          : "bg-gradient-to-br from-purple-50 to-white text-gray-800"
      }`}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <button
            onClick={() => navigate("/products")}
            className={`flex items-center gap-2 font-medium transition ${
              mode === "dark"
                ? "text-[rgba(var(--copy-secondary))] hover:text-[rgba(var(--cta))]"
                : "text-gray-600 hover:text-purple-600"
            }`}
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        <h1
          className={`mb-5 text-4xl font-extrabold mb-10 flex items-center justify-center gap-3 drop-shadow-md ${
            mode === "dark" ? "text-[rgba(var(--cta))]" : "text-purple-700"
          }`}
        >
          <FaShoppingBag /> My Order History
        </h1>

        {/* No Orders */}
        {orders.length === 0 ? (
          <div
            className={`text-center py-10 rounded-2xl shadow-md ${
              mode === "dark" ? "bg-[rgba(var(--card))]" : "bg-white"
            }`}
          >
            <div className="w-72 h-62 mx-auto">
              <Lottie animationData={OrderAnimation} loop={true} />
            </div>
            <p
              className={`text-lg mb-2 ${
                mode === "dark"
                  ? "text-[rgba(var(--copy-primary))]"
                  : "text-gray-600"
              }`}
            >
              You have no previous orders yet.
            </p>
            <p
              className={`mb-6 ${
                mode === "dark"
                  ? "text-[rgba(var(--copy-secondary))]"
                  : "text-gray-400"
              }`}
            >
              Place your first order now!
            </p>
            <button
              onClick={() => navigate("/products")}
              className={`px-3 py-2 rounded-pill transition text-white ${
                mode === "dark"
                  ? "bg-[rgba(var(--cta))] hover:bg-[rgba(var(--cta-active))]"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders
              .slice()
              .reverse()
              .map((order) => (
                <div
                  key={order.id}
                  className={`shadow-xl rounded-2xl p-6 hover:shadow-2xl transition transform hover:-translate-y-1 border ${
                    mode === "dark"
                      ? "bg-[rgba(var(--card))] border-[rgba(var(--border))]"
                      : "bg-white border-gray-100"
                  }`}
                >
                  {/* Order Info */}
                  <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <div>
                      <p
                        className={`text-lg font-semibold ${
                          mode === "dark"
                            ? "text-[rgba(var(--copy-primary))]"
                            : "text-gray-800"
                        }`}
                      >
                        Order #{order.id}
                      </p>
                      <p
                        className={`text-sm ${
                          mode === "dark"
                            ? "text-[rgba(var(--copy-secondary))]"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(order.date).toLocaleString()}
                      </p>
                    </div>
                    <p
                      className={`text-2xl font-bold ${
                        mode === "dark"
                          ? "text-[rgba(var(--cta))]"
                          : "text-purple-600"
                      }`}
                    >
                      ${order.total.toFixed(2)}
                    </p>
                  </div>

                  {/* Ordered Items */}
                  <div className="space-y-2 mb-6">
                    {order.items.map((item) => (
                      <div
                        key={item.id + item.size}
                        className={`flex justify-between ${
                          mode === "dark"
                            ? "text-[rgba(var(--copy-primary))]"
                            : "text-gray-700"
                        }`}
                      >
                        <p>
                          {item.title} ({item.size}) × {item.quantity}
                        </p>
                        <p>${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* 📦 Selected Delivery Address */}
                  {order.address && (
                    <div className="mt-4 border-t pt-3 text-sm flex items-start gap-2">
                      <FaMapMarkerAlt
                        className={`mt-1 ${mode === "dark"
                            ? "text-[rgba(var(--cta))]"
                            : "text-purple-600"
                          }`}
                      />
                      <div>
                        <p className="font-semibold">
                          Delivery to: {order.address.street}, {order.address.city}
                        </p>
                        <p
                          className={`${mode === "dark"
                              ? "text-[rgba(var(--copy-secondary))]"
                              : "text-gray-500"
                            }`}
                        >
                          {order.address.postalCode}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
