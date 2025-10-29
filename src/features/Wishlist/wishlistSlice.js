import { createSlice } from "@reduxjs/toolkit";
import { makeUserScopedKey } from "../utils/userStorage";

const loadWishlistFromLocalStorage = () => {
  try {
    const serializedWishlist = localStorage.getItem(makeUserScopedKey("wishlist"));
    if (!serializedWishlist) return [];
    return JSON.parse(serializedWishlist);
  } catch (e) {
    console.error("Could not load wishlist from localStorage", e);
    return [];
  }
};

const saveWishlistToLocalStorage = (items) => {
  try {
    localStorage.setItem(makeUserScopedKey("wishlist"), JSON.stringify(items));
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
    reloadFromStorageForUser: (state) => {
      state.items = loadWishlistFromLocalStorage();
    },
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

export const { addToWishlist, removeFromWishlist, clearWishlist, reloadFromStorageForUser } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
