import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, fetchProfile } from "../features/Auth/authSlice";
import { removeFromWishlist } from "../features/Wishlist/wishlistSlice";
import { useNavigate } from "react-router-dom";
import { 
  FaSignOutAlt, 
  FaHeart, 
  FaTrash, 
  FaUser, 
  FaEnvelope, 
  FaBriefcase,
  FaShoppingBag,
  FaStar,
  FaEdit
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import RemoveItemModal from "../components/Alertmodal"

const ProfileSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [modalMode, setModalMode] = useState(null); 

  useEffect(() => {
    if (token && !user) dispatch(fetchProfile());
  }, [dispatch, token, user]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleLogoutClick = () => {
    setModalMode("logout");
    setModalItem({ title: "your account"});
    setShowModal(true);
  };

  const handleRemoveWishlist = (item) => {
    setModalMode("wishlist");
    setModalItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalItem(null);
    setModalMode(null);
  };

  const handleConfirm = () => {
    if (modalMode === "logout") {
      dispatch(logout());
      navigate("/");
    } else if (modalMode === "wishlist" && modalItem) {
      dispatch(removeFromWishlist(modalItem.id));
    }
    handleCloseModal();
  };

  return (
    <div className="min-h-screen pb-20 mt-2">
      {/* Header Section with Gradient */}
      <div className="bg-slate-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0  rounded-full blur-xl opacity-50"></div>
              <img
                src={user?.avatar || "https://via.placeholder.com/150"}
                alt="Avatar"
                className="relative w-32 h-32 rounded-full shadow-2xl border-4 border-white object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-purple-500 rounded-full p-2 border-4 border-white">
                <FaEdit className="text-white text-sm" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">{user?.name || "User"}</h1>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <HiSparkles className="text-yellow-300" />
              <span className="capitalize">{user?.role || "Customer"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10">
        {/* Profile Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-4 rounded-full">
                <FaEnvelope className="text-purple-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="font-semibold text-gray-800 break-all">{user?.email || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-pink-100 p-4 rounded-full">
                <FaBriefcase className="text-pink-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Role</p>
                <p className="font-semibold text-gray-800 capitalize">{user?.role || "Customer"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <FaHeart className="text-blue-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Wishlist Items</p>
                <p className="font-semibold text-gray-800 text-2xl">{wishlistItems.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-pill hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FaShoppingBag /> Continue Shopping
          </button>
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6  rounded-pill transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Wishlist Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <div className="bg-red-100 p-3 rounded-full">
                <FaHeart className="text-red-500 text-2xl" />
              </div>
              My Wishlist
            </h2>
            {wishlistItems.length > 0 && (
              <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
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
                      src={item.image}
                      alt={item.title}
                      className="w-full h-56 object-cover hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Wishlist
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h4 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 hover:text-purple-600 transition-colors cursor-pointer"
                        onClick={() => navigate(`/products/${item.id}`)}>
                      {item.title}
                    </h4>
                    
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-sm" />
                      ))}
                      <span className="text-gray-500 text-sm ml-1">(5.0)</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <p className="text-purple-600 font-bold text-2xl">
                        ${item.price.toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveWishlist(item)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-pill transition-all duration-300 hover:scale-110"
                        title="Remove from wishlist"
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
        </div>
      </div>

      <RemoveItemModal
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        item={
          modalMode === "logout"
            ? { title: "your account", size: "" }
            : modalItem
        }
      />
    </div>
  );
};

export default ProfileSection;
