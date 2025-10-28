import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Lottie from "lottie-react";
import successAnimation from "../assets/Add To Cart Success.json";
import { clearCart, completeOrder } from "../features/cart/cartSlice";
import { resetPayment } from "../features/Payment/PaymentSlice";
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    //  Add the completed order to history before clearing cart
    dispatch(completeOrder());
    dispatch(resetPayment());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6">
      <div className="w-72 h-72 mb-6">
        <Lottie animationData={successAnimation} loop={false} />
      </div>

      <h1 className="text-4xl font-bold text-green-700 mb-4">
        Payment Successful! 🎉
      </h1>

      <p className="text-gray-700 mb-6 text-center">
        Thank you for your purchase. Your order has been confirmed and added to your order history.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/orders")}
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
        >
          View Orders
        </button>
        <button
          onClick={() => navigate("/products")}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
