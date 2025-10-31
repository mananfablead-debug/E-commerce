import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../features/cart/cartSlice";
import {selectAddress} from "../features/Address/addressSlice";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import emptyCartAnimation from "../assets/Shopping Cart Loader.json";
import { StripeCheckoutButton } from "../components/StripeCheckoutButton";
import RemoveItemModal from "../components/Alertmodal";
import {
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaTags,
  FaMapMarkerAlt,
  FaEdit,
} from "react-icons/fa";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const { addresses, selectedAddress } = useSelector((state) => state.address);

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
    if (item === "all") {
      dispatch(clearCart());
    } else {
      dispatch(removeFromCart({ id: item.id, size: item.size }));
    }
    handleCloseModal();
  };

  const handleQuantityChange = (id, size, quantity) => {
    if (quantity > 0) dispatch(updateQuantity({ id, size, quantity }));
  };

  const handleSelectAddress = (addr) => {
    dispatch(selectAddress(addr));
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleBrowse = () => navigate("/products");

  return (
    <div className="min-h-screen pb-20 mt-4 bg-[rgba(var(--background))] text-[rgba(var(--copy-primary))] transition-colors duration-500">
      {/* Header */}
      <div className="bg-[rgba(var(--cta))] text-[rgba(var(--cta-text))] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6 opacity-90 hover:opacity-100 transition-colors"
          >
            <FaArrowLeft /> Back
          </button>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-[rgba(var(--cta-text),0.2)] backdrop-blur-sm p-4 rounded-full">
                <FaShoppingCart className="text-3xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Shopping Cart</h1>
                <p className="opacity-90 mt-1">
                  {totalItems} {totalItems === 1 ? "item" : "items"} in your
                  cart
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setItemToRemove("all");
                setShowModal(true);
              }}
              className="text-sm bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-pill transition-all duration-300"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="max-w-6xl mx-auto px-6 -mt-8">
        {cartItems.length === 0 ? (
          <div className="bg-[rgba(var(--card))] rounded-2xl shadow-xl p-12 text-center">
            <div className="w-72 h-72 mb-6 mx-auto">
              <Lottie animationData={emptyCartAnimation} loop={true} />
            </div>
            <h3 className="text-3xl font-bold mb-3 text-[rgba(var(--copy-primary))]">
              Your cart is empty
            </h3>
            <p className="text-[rgba(var(--copy-secondary))] text-lg mb-8 max-w-md mx-auto">
              Looks like you haven't added anything yet. Start shopping now!
            </p>
            <button
              onClick={handleBrowse}
              className="bg-[rgba(var(--cta))] hover:bg-[rgba(var(--cta-active))] text-[rgba(var(--cta-text))] px-4 py-2 rounded-pill text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
                  className="bg-[rgba(var(--card))] rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-[rgba(var(--border))]"
                >
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="relative w-full md:w-48 h-48 bg-[rgba(var(--background),0.5)] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1 p-6 w-full">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold mb-2">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-[rgba(var(--copy-secondary))]">
                            <FaTags className="text-[rgba(var(--cta))]" />
                            <span className="font-semibold">
                              Size: {item.size}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleShowModal(item)}
                          className="bg-red-100 hover:bg-red-200 text-red-600 p-3 rounded-pill transition-all duration-300 hover:scale-110"
                        >
                          <FaTrash />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3 bg-[rgba(var(--background),0.5)] rounded-full p-1">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.size,
                                item.quantity - 1
                              )
                            }
                            className="bg-[rgba(var(--card))] hover:bg-[rgba(var(--cta),0.1)] text-[rgba(var(--cta))] w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                          >
                            <FaMinus className="text-xs" />
                          </button>
                          <span className="font-bold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.size,
                                item.quantity + 1
                              )
                            }
                            className="bg-[rgba(var(--card))] hover:bg-[rgba(var(--cta),0.1)] text-[rgba(var(--cta))] w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-[rgba(var(--copy-secondary))] text-sm">
                            Total
                          </p>
                          <p className="text-2xl font-bold text-[rgba(var(--cta))]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[rgba(var(--card))] rounded-2xl shadow-xl p-6 sticky top-24 border border-[rgba(var(--border))]">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 ">
                  <FaShoppingCart className="text-[rgba(var(--cta))]" />
                  Order Summary
                </h3>
                
                  {/* 🏠 Delivery Address Section */}
                  <div className="mb-6 mt-3 border-t border-[rgba(var(--border))] pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-lg font-semibold flex items-center gap-2">
                        <FaMapMarkerAlt className="text-[rgba(var(--cta))]" />
                        Delivery Address
                      </h5>
                      <button
                        onClick={() => navigate("/profile/addresses")}
                        className="flex items-center gap-1 text-[rgba(var(--cta))] text-sm hover:underline"
                      >
                        <FaEdit />
                      </button>
                    </div>

                    {Array.isArray(addresses) && addresses.length > 0 ? (
                      <div className="space-y-2">
                        {addresses.map((addr) => (
                          <label
                            key={addr.id}
                            className={`w-full flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition-all ${selectedAddress?.id === addr.id
                                ? "border-[rgba(var(--cta))] bg-[rgba(var(--cta),0.1)]"
                                : "hover:border-[rgba(var(--cta),0.5)]"
                              }`}
                          >
                            <input
                              type="radio"
                              name="selectedAddress"
                              checked={selectedAddress?.id === addr.id}
                              onChange={() => dispatch({ type: "address/selectAddress", payload: addr })}
                              className="text-[rgba(var(--cta))] focus:ring-[rgba(var(--cta))]"
                            />
                            <div>
                              <p className="font-semibold">{addr.street}, {addr.city}</p>
                              <p className="text-sm text-[rgba(var(--copy-secondary))]">
                                {addr.postalCode}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[rgba(var(--copy-secondary))] text-sm">
                        No saved addresses yet.
                      </p>
                    )}
                  </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[rgba(var(--copy-secondary))]">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-semibold text-[rgba(var(--copy-primary))]">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[rgba(var(--copy-secondary))]">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="border-t border-[rgba(var(--border))] pt-4">
                    <div className="flex justify-between">
                      <span className="text-xl font-bold">Total</span>
                      <span className="text-2xl font-bold text-[rgba(var(--cta))]">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout */}
                <div className="space-y-3">
                  {selectedAddress ? (
                    <StripeCheckoutButton />
                  ) : (
                    <button
                      onClick={() => navigate("/profile/addresses")}
                      className="w-full bg-[rgba(var(--cta))] text-[rgba(var(--cta-text))] px-6 py-3 rounded-full font-semibold hover:bg-[rgba(var(--cta-active))] transition-all"
                    >
                      Select Delivery Address
                    </button>
                  )}

                  <button
                    onClick={handleBrowse}
                    className="mt-2 w-full bg-[rgba(var(--cta),0.1)] hover:bg-[rgba(var(--cta),0.2)] text-[rgba(var(--cta))] px-6 py-3 rounded-full font-semibold transition-all duration-300"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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
