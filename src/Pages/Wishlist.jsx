import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../features/Wishlist/wishlistSlice";
import { useNavigate } from "react-router-dom";
import {
  FaHeart, FaTrash, FaStar
} from "react-icons/fa";

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
    <div className="bg-white rounded-2xl shadow-xl p-8 mt-5">
      <div className="flex items-center justify-between mb-6 mt-3">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <div className="bg-red-100 p-3 rounded-full">
            <FaHeart className="text-red-500 text-2xl" />
          </div>
          My Wishlist
        </h2>
        {wishlistItems.length > 0 && (
          <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold">
            {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaHeart className="text-gray-400 text-5xl" />
          </div>
          <p className="text-gray-500 text-lg mb-2">Your wishlist is empty</p>
          <p className="text-gray-400 mb-6">Start adding items you love!</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full transition-all duration-300"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-gray-50 to-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="relative overflow-hidden">
                <img
                  onClick={() => navigate(`/products/${item.id}`)}
                  src={item.image}
                  alt={item.title}
                  className="w-full h-56 object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                />
                <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Wishlist
                </div>
              </div>

              <div className="p-5">
                <h4
                  onClick={() => navigate(`/products/${item.id}`)}
                  className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 hover:text-purple-600 transition-colors cursor-pointer"
                >
                  {item.title}
                </h4>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                  <span className="text-gray-500 text-sm ml-1">(5.0)</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <p className="text-purple-600 font-bold text-2xl">${item.price.toFixed(2)}</p>
                  <button
                    onClick={() => handleRemoveWishlist(item)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-pill transition-all duration-300 hover:scale-110"
                  >
                    <FaTrash />
                  </button>
                </div>

                <button
                  onClick={() => navigate(`/products/${item.id}`)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-pill font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-90 text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Remove Item</h3>
            <p className="text-gray-600 mb-6">
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
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-pill transition"
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
