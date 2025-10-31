import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../features/Wishlist/wishlistSlice";
import wishlistanimation from "../assets/Wishlist.json";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaTrash, FaStar } from "react-icons/fa";

const Wishlist = () => {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleRemoveWishlist = (item) => {
    setModalItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalItem(null);
  };

  const handleConfirmRemove = () => {
    if (modalItem) {
      dispatch(removeFromWishlist(modalItem.id));
      setShowModal(false);
      setModalItem(null);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-8 bg-[rgba(var(--background))] text-[rgba(var(--copy-primary))] transition-colors duration-500  shadow-xl mt-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 mt-3">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <div className="bg-[rgba(var(--cta),0.1)] p-3 rounded-full">
            <FaHeart className="text-[rgba(var(--cta))] text-2xl" />
          </div>
          My Wishlist
        </h2>

        {wishlistItems.length > 0 && (
          <span className="bg-[rgba(var(--cta),0.1)] text-[rgba(var(--cta))] px-4 py-2 rounded-full font-semibold">
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      {/* Empty Wishlist */}
      {wishlistItems.length === 0 ? (
        <div className="text-center py-12 flex flex-col items-center justify-center">
          <div className="w-64 h-64 mb-6">
            <Lottie animationData={wishlistanimation} loop={true} />
          </div>
          <p className="text-[rgba(var(--copy-secondary))] text-lg mb-2">
            Your wishlist is empty
          </p>
          <p className="text-[rgba(var(--copy-secondary))] mb-6">
            Start adding items you love!
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-[rgba(var(--cta))] hover:bg-[rgba(var(--cta-active))] text-[rgba(var(--cta-text))] px-4 py-2 rounded-pill transition-all duration-300"
          >
            Browse Products
          </button>
        </div>
      ) : (
        // Wishlist Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-[rgba(var(--card))] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-[rgba(var(--border))]"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  onClick={() => navigate(`/products/${item.id}`)}
                  src={item.image}
                  alt={item.title}
                  className="w-full h-56 object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                />
                <div className="absolute top-3 right-3 bg-[rgba(var(--cta))] text-[rgba(var(--cta-text))] px-3 py-1 rounded-full text-sm font-semibold">
                  Wishlist
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h4
                  onClick={() => navigate(`/products/${item.id}`)}
                  className="font-bold text-lg mb-2 line-clamp-2 hover:text-[rgba(var(--cta))] transition-colors cursor-pointer"
                >
                  {item.title}
                </h4>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                  <span className="text-[rgba(var(--copy-secondary))] text-sm ml-1">
                    (5.0)
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <p className="text-[rgba(var(--cta))] font-bold text-2xl">
                    ${item.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemoveWishlist(item)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-pill transition-all duration-300 hover:scale-110"
                  >
                    <FaTrash />
                  </button>
                </div>

                <button
                  onClick={() => navigate(`/products/${item.id}`)}
                  className="w-full bg-gradient-to-r from-[rgba(var(--cta))] to-pink-600 text-[rgba(var(--cta-text))] py-2 rounded-pill font-semibold hover:from-[rgba(var(--cta-active))] hover:to-pink-700 transition-all duration-300"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            role="dialog"
            aria-modal="true"
            className="bg-[rgba(var(--card))] rounded-xl shadow-lg p-6 w-90 text-center"
          >
            <h3 className="text-lg font-bold mb-2 text-[rgba(var(--copy-primary))]">
              Remove Item
            </h3>
            <p className="text-[rgba(var(--copy-secondary))] mb-6">
              Are you sure you want to remove this item from your wishlist?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleConfirmRemove}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-pill transition"
              >
                Yes, Remove
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-[rgba(var(--border),0.3)] hover:bg-[rgba(var(--border),0.5)] text-[rgba(var(--copy-primary))] px-4 py-2 rounded-pill transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
