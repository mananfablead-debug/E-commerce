import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/Product/productApiSlice";
import authReducer from "../features/Auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import wishlistReducer from "../features/Wishlist/wishlistSlice"
import paymentReducer from "../features/Payment/PaymentSlice";
import { setActiveUserKey } from "../features/utils/userStorage";

// Initialize the user-scoped storage key as early as possible to avoid
// accidentally loading another user's data before profile fetch completes.
try {
    const token = localStorage.getItem("token");
    const googleUserRaw = localStorage.getItem("google_user");
    if (!token) {
        setActiveUserKey("guest");
    } else if (googleUserRaw) {
        const g = JSON.parse(googleUserRaw);
        const key = g?.sub || g?.email;
        setActiveUserKey(key ? String(key) : "guest");
    } else {
        // Token present but no profile yet → default to guest until fetchProfile sets it
        setActiveUserKey("guest");
    }
} catch {}

export const store = configureStore({
    reducer: {
        products: productsReducer,
        auth: authReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        payment: paymentReducer,
    },
});