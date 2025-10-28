import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import emptyCartAnimation from "../assets/Shopping Cart Loader.json";
import { StripeCheckoutButton } from "../components/StripeCheckoutButton";
import RemoveItemModal from "../components/Alertmodal"
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowLeft, FaTags } from "react-icons/fa";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  const [showModal, setShowModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleShowModal = (item) => {
    setItemToRemove(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setItemToRemove(null);
    setShowModal(false);
  };

  const handleConfirmRemove = (item) => {
    dispatch(removeFromCart({ id: item.id, size: item.size }));
    handleCloseModal();
  };

  const handleQuantityChange = (id, size, quantity) => {
    if (quantity > 0) dispatch(updateQuantity({ id, size, quantity }));
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const handleBrowse = () => navigate("/products");

  return (
    <div className="min-h-screen pb-20 mt-4">
      <div className="bg-slate-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6 text-white/90 hover:text-white transition-colors"
          >
            <FaArrowLeft /> Back
          </button>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <FaShoppingCart className="text-3xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Shopping Cart</h1>
                <p className="text-white/80 mt-1">
                  {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/orders")}
              className="text-sm bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-all duration-300"
            >
              View Order History
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-8">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-72 h-72 mb-6 mx-auto">
              <Lottie animationData={emptyCartAnimation} loop={true} />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-3">Your cart is empty</h3>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it with amazing products!
            </p>
            <button
              onClick={handleBrowse}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-pill text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id + item.size}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row items-center">
                    {/* Product Image */}
                    <div className="relative w-full md:w-48 h-48 bg-gray-100 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      {item.quantity > 1 && (
                        <div className="absolute top-3 left-3 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          x{item.quantity}
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 p-6 w-full">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaTags className="text-purple-500" />
                            <span className="font-semibold">Size: {item.size}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleShowModal(item)}
                          className="bg-red-100 hover:bg-red-200 text-red-600 p-3 rounded-pill transition-all duration-300 hover:scale-110"
                          title="Remove item"
                        >
                          <FaTrash />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1)}
                            className="bg-white hover:bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                          >
                            <FaMinus className="text-xs" />
                          </button>
                          <span className="font-bold text-gray-800 w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)}
                            className="bg-white hover:bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-gray-500 text-sm">Total</p>
                          <p className="text-2xl font-bold text-purple-600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-gray-400 text-sm">
                              ${item.price.toFixed(2)} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FaShoppingCart className="text-purple-600" />
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="font-semibold">Included</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-xl font-bold text-gray-800">Total</span>
                      <span className="text-2xl font-bold text-purple-600">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <StripeCheckoutButton  />
                  <button
                    onClick={handleBrowse}
                    className="mt-2 w-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-6 py-3 rounded-full font-semibold hover:from-purple-200 hover:to-pink-200 transition-all duration-300"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm text-purple-700 font-semibold mb-1">
                    🎉 Free shipping on orders over $10
                  </p>
                  <p className="text-xs text-purple-600">
                    Secure checkout with encrypted payment processing
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* External Modal Component */}
      <RemoveItemModal
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmRemove}
        item={itemToRemove}
      />
    </div>
  );
};

export default CartPage;
