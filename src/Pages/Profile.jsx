import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, fetchProfile } from "../features/Auth/authSlice";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaEnvelope,
  FaBriefcase,
  FaShoppingBag,
  FaEdit,
  FaUserCog,
  FaHeart,
  FaShoppingCart,
  FaListAlt,
  FaLock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import RemoveItemModal from "../components/Alertmodal";

const ProfileSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme); // ✅ Get current theme

  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [modalMode, setModalMode] = useState(null);

  useEffect(() => {
    if (token && !user) dispatch(fetchProfile());
  }, [dispatch, token, user]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ✅ Apply theme to document root
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark", "red");
    document.documentElement.classList.add(mode);
  }, [mode]);

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
    <div className="min-h-screen pb-20 mt-2 transition-colors duration-500 bg-[rgba(var(--background))] text-[rgba(var(--copy-primary))]">
      {/* HEADER */}
      <div className="py-20 border-b border-[rgba(var(--border))] bg-[rgba(var(--card))] text-[rgba(var(--copy-primary))] shadow-md">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <img
                src={user?.avatar || 'https://via.placeholder.com/150'}
                alt="Avatar"
                className="w-32 h-32 rounded-full shadow-2xl border-4 border-[rgba(var(--border))] object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-[rgba(var(--cta-text))] p-2 rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform">
                <FaEdit className="text-[rgba(var(--cta))] text-lg" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">{user?.name || 'User'}</h1>
            <div className="flex items-center gap-2 bg-[rgba(var(--cta))] text-[rgba(var(--cta-text))] px-4 py-2 rounded-full">
              <HiSparkles className="text-yellow-300" />
              <span className="capitalize">{user?.role || 'Customer'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="max-w-6xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <InfoCard
            icon={<FaEnvelope className="text-[rgba(var(--cta))] text-2xl" />}
            label="Email"
            value={user?.email || 'N/A'}
          />
          <InfoCard
            icon={<FaBriefcase className="text-[rgba(var(--cta-active))] text-2xl" />}
            label="Role"
            value={user?.role || 'Customer'}
          />
          <InfoCard
            icon={<FaShoppingBag className="text-[rgba(var(--grape))] text-2xl" />}
            label="Member Since"
            value={
              user?.creationAt
                ? new Date(user.creationAt).toLocaleDateString()
                : 'N/A'
            }
          />
        </div>

        {/* ACCOUNT LINKS */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-[rgba(var(--copy-primary))]">
            Manage Your Account
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 cards">
            <AccountLink to="/profile" icon={<FaUserCog />} label="Edit Profile" />
            <AccountLink to="/orders" icon={<FaListAlt />} label="My Orders" />
            <AccountLink to="/cart" icon={<FaShoppingCart />} label="My Cart" />
            <AccountLink to="/wishlist" icon={<FaHeart />} label="Wishlist" />
            <AccountLink to="/profile" icon={<FaLock />} label="Change Password" />
            <AccountLink
              to="/profile/addresses"
              icon={<FaMapMarkerAlt />}
              label="Manage Addresses"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 bg-[rgba(var(--cta))] text-[rgba(var(--cta-text))] px-6 py-2.5 rounded-pill hover:bg-[rgba(var(--cta-active))] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FaShoppingBag /> Continue Shopping
          </button>
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-pill transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* MODAL */}
      <RemoveItemModal
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        item={modalItem}
      />
    </div>
  );
};

// --- SMALL COMPONENTS ---
const InfoCard = ({ icon, label, value }) => (
  <div className="bg-[rgba(var(--card))] rounded-2xl shadow-lg p-6 border border-[rgba(var(--border))] transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
    <div className="flex items-center gap-4">
      <div className="p-4 rounded-full bg-[rgba(var(--cta),0.1)]">{icon}</div>
      <div>
        <p className="text-[rgba(var(--copy-secondary))] text-sm">{label}</p>
        <p className="font-semibold text-[rgba(var(--copy-primary))] break-all">{value}</p>
      </div>
    </div>
  </div>
);

const AccountLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className="flex flex-col items-center justify-center gap-3 bg-[rgba(var(--card))] rounded-2xl p-6 shadow-md hover:shadow-xl border border-[rgba(var(--border))] transition-all duration-300 transform hover:-translate-y-1 hover:bg-[rgba(var(--cta),0.05)]"
  >
    <div className="text-3xl text-[rgba(var(--cta))]">{icon}</div>
    <span className="font-medium text-[rgba(var(--copy-primary))]">{label}</span>
  </NavLink>
);

export default ProfileSection;
