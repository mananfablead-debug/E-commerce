import { createSlice } from "@reduxjs/toolkit";
import { makeUserScopedKey } from "../utils/userStorage";
import { selectAddress } from "../Address/addressSlice";

const loadCartFromLocalStorage = () => {
  try {
    const serializedCart = localStorage.getItem(makeUserScopedKey("cart"));
    return serializedCart ? JSON.parse(serializedCart) : [];
  } catch {
    return [];
  }
};

const loadOrdersFromLocalStorage = () => {
  try {
    const serializedOrders = localStorage.getItem(makeUserScopedKey("orders"));
    return serializedOrders ? JSON.parse(serializedOrders) : [];
  } catch {
    return [];
  }
};

const saveCartToLocalStorage = (items) => {
  try {
    localStorage.setItem(makeUserScopedKey("cart"), JSON.stringify(items));
  } catch {}
};

const saveOrdersToLocalStorage = (orders) => {
  try {
    localStorage.setItem(makeUserScopedKey("orders"), JSON.stringify(orders));
  } catch {}
};

const initialState = {
  items: loadCartFromLocalStorage(),
  orders: loadOrdersFromLocalStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    reloadFromStorageForUser: (state) => {
      state.items = loadCartFromLocalStorage();
      state.orders = loadOrdersFromLocalStorage();
    },
    addToCart: (state, action) => {
      const { id, size } = action.payload;
      const existing = state.items.find(
        (item) => item.id === id && item.size === size
      );
      if (existing) existing.quantity += 1;
      else state.items.push({ ...action.payload, quantity: 1 });
      saveCartToLocalStorage(state.items);
    },
    removeFromCart: (state, action) => {
      const { id, size } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.id === id && item.size === size)
      );
      saveCartToLocalStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, size, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id && i.size === size);
      if (item) item.quantity = quantity;
      saveCartToLocalStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToLocalStorage(state.items);
    },

    deleteOrder:(state,action) => {
      const orderId = action.payload;
      state.orders= state.orders.filter((order) => order.id !== orderId);
      localStorage.setItem(makeUserScopedKey("orders"),JSON.stringify(state.orders));
    },

    clearOrders: (state,action) => {
      state.orders= [];
      localStorage.setItem(makeUserScopedKey("orders"),JSON.stringify(state.orders));
    },

  completeOrder: (state, action) => {
  if (state.items.length === 0) return;

  const selectedAddress = action.payload || null; //  get address

  const newOrder = {
    id: Date.now(),
    items: [...state.items],
    total: state.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    ),
    date: new Date().toISOString(),
    address: selectedAddress, //  store it here
  };

  state.orders.push(newOrder);

  // Save to localStorage
  localStorage.setItem(makeUserScopedKey("orders"), JSON.stringify(state.orders));

  // Clear cart
  state.items = [];
  localStorage.setItem(makeUserScopedKey("cart"), JSON.stringify([]));
},

  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  completeOrder,
  deleteOrder,
  clearOrders,
  reloadFromStorageForUser,
} = cartSlice.actions;

export default cartSlice.reducer;
