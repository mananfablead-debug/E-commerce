import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, fetchProfile } from "../features/Auth/authSlice";
import { useNavigate } from "react-router-dom";
import { 
  FaSignOutAlt, 
  FaEnvelope, 
  FaBriefcase,
  FaShoppingBag,
  FaEdit
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import RemoveItemModal from "../components/Alertmodal";

const ProfileSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

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
    setModalItem({ title: "your account" });
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
    }
    handleCloseModal();
  };

  return (
    <div className="min-h-screen pb-20 mt-2">

      <div className="bg-slate-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full blur-xl opacity-50"></div>
              <img
                src={user?.avatar || "https://via.placeholder.com/150"}
                alt="Avatar"
                className="relative w-32 h-32 rounded-full shadow-2xl border-4 border-white object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-purple-500 rounded-full p-2 border-4 border-white cursor-pointer">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-4 rounded-full">
                <FaEnvelope className="text-purple-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="font-semibold text-gray-800 break-all">
                  {user?.email || "N/A"}
                </p>
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
                <p className="font-semibold text-gray-800 capitalize">
                  {user?.role || "Customer"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <FaShoppingBag className="text-blue-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Member Since</p>
                <p className="font-semibold text-gray-800">
                  {user?.creationAt
                    ? new Date(user.creationAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-pill hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FaShoppingBag /> Continue Shopping
          </button>
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-pill transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <RemoveItemModal
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        item={{ title: "your account" }}
      />
    </div>
  );
};

export default ProfileSection;
