import React from "react";
import { useSelector } from "react-redux";
import { FaArrowLeft, FaShoppingBag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const orders = useSelector((state) => state.cart.orders);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 mt-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6"
        >
          <FaArrowLeft /> Back
        </button>

        <h1 className="text-3xl font-bold mb-8 flex items-center justify-center gap-3 text-purple-700">
          <FaShoppingBag /> Order History
        </h1>

        {orders.length === 0 ? (
          <p className="text-gray-600 text-lg text-center mt-20">
            You have no previous orders yet.
          </p>
        ) : (
          <div className="space-y-6">
            {orders
              .slice()
              .reverse()
              .map((order) => (
                <div
                  key={order.id}
                  className="bg-white shadow-md rounded-xl p-6"
                >
                  <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <div>
                      <p className="text-lg font-semibold">
                        Order #{order.id}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {new Date(order.date).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-purple-600">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>

                  <div className="space-y-2">
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
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
