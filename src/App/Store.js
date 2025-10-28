import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/Product/productApiSlice";
import authReducer from "../features/Auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import wishlistReducer from "../features/Wishlist/wishlistSlice"
import paymentReducer from "../features/Payment/PaymentSlice";

export const store = configureStore({
    reducer: {
        products: productsReducer,
        auth: authReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        payment: paymentReducer,
    },
});