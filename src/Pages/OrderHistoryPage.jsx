import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaArrowLeft, FaShoppingBag, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { deleteOrder, clearOrders } from "../features/cart/cartSlice";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import OrderAnimation from "../assets/Order Received imagery.json";
import Lottie from "lottie-react";

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.cart.orders);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenModal = (mode, order = null) => {
    setModalMode(mode);
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalMode(null);
    setSelectedOrder(null);
  };

  const handleConfirm = () => {
    if (modalMode === "deleteOne" && selectedOrder) {
      dispatch(deleteOrder(selectedOrder.id));
      toast.success("Order deleted successfully 🗑️");
    } else if (modalMode === "deleteAll") {
      dispatch(clearOrders());
      toast.success("All orders cleared 🧹");
    }
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-16 px-6 mt-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-5">
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 font-medium transition"
          >
            <FaArrowLeft /> Back
          </button>

          {orders.length > 0 && (
            <button
              onClick={() => handleOpenModal("deleteAll")}
              className="flex items-center gap-2 bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-full font-semibold transition"
            >
              <FaTrashAlt /> Delete All
            </button>
          )}
        </div>

        <h1 className="mb-5 text-4xl font-extrabold mb-10 flex items-center justify-center gap-3 text-purple-700 drop-shadow-md">
          <FaShoppingBag /> My Order History
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl shadow-md">
            {/* <FaShoppingBag className="text-gray-300 text-6xl mx-auto mb-4" /> */}
            <div className="w-72 h-62  mx-auto">
            <Lottie animationData={OrderAnimation} loop={true}/>
            </div>
            <p className="text-gray-600 text-lg mb-2">You have no previous orders yet.</p>
            <p className="text-gray-400 mb-6">Place your first order now!</p>
            <button
              onClick={() => navigate("/products")}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-pill transition"
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
                  className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition transform hover:-translate-y-1 border border-gray-100"
                >
                  <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        Order #{order.id}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {new Date(order.date).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>

                  <div className="space-y-2 mb-6">
                    {order.items.map((item) => (
                      <div
                        key={item.id + item.size}
                        className="flex justify-between text-gray-700"
                      >
                        <p>
                          {item.title} ({item.size}) × {item.quantity}
                        </p>
                        <p>${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleOpenModal("deleteOne", order)}
                      className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-full font-semibold transition"
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <ConfirmModal
        show={modalOpen}
        title={
          modalMode === "deleteAll"
            ? "Delete All Orders?"
            : "Delete This Order?"
        }
        message={
          modalMode === "deleteAll"
            ? "This will permanently remove all your past orders. Are you sure?"
            : "Are you sure you want to delete this order from history?"
        }
        onConfirm={handleConfirm}
        onCancel={handleCloseModal}
      />
    </div>
  );
};

export default OrderHistoryPage;
