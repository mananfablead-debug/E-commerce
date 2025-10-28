import { createSlice } from "@reduxjs/toolkit";

const loadWishlistFromLocalStorage = () => {
  try {
    const serializedWishlist = localStorage.getItem("wishlist");
    if (!serializedWishlist) return [];
    return JSON.parse(serializedWishlist);
  } catch (e) {
    console.error("Could not load wishlist from localStorage", e);
    return [];
  }
};

const saveWishlistToLocalStorage = (items) => {
  try {
    localStorage.setItem("wishlist", JSON.stringify(items));
  } catch (e) {
    console.error("Could not save wishlist to localStorage", e);
  }
};

const initialState = {
  items: loadWishlistFromLocalStorage(), 
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.items.find((i) => i.id === action.payload.id);
      
      if (!exists) state.items.push(action.payload);
      saveWishlistToLocalStorage(state.items);
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveWishlistToLocalStorage(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToLocalStorage(state.items);
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
