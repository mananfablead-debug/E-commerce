import { useDispatch, useSelector } from "react-redux";
import { startPayment, paymentError} from "../features/Payment/PaymentSlice";
// import { completeOrder } from "../features/Cart/CartSlice"
// import { useNavigate } from "react-router-dom";

export const StripeCheckoutButton = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const paymentStatus = useSelector((state) => state.payment.status);

  const paymentLink = "https://buy.stripe.com/test_3cI8wO2VB42Le4feYU6sw00";

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    dispatch(startPayment());
    try {
      window.location.href = paymentLink;
    } catch (err) {
      dispatch(paymentError(err.message));
    }
  };

  // const navigate = useNavigate();
  // const handleSuccess = () => {
  //   dispatch(completeOrder());
  //   navigate("/orders")
  // }

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <button
      onClick={handleCheckout}
      disabled={cartItems.length === 0 || paymentStatus === "processing"}
      className={`bg-purple-600 text-white px-6 py-2 w-full rounded hover:bg-purple-700 transition ${
        cartItems.length === 0 || paymentStatus === "processing"
          ? "opacity-50 cursor-not-allowed"
          : ""
      }`}
    >
      {paymentStatus === "processing" ? "Redirecting..." : `Pay $${total.toFixed(2)}`}
    </button>
  );
};
