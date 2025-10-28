import { createSlice } from "@reduxjs/toolkit";

const loadCartFromLocalStorage = () => {
  try {
    const serializedCart = localStorage.getItem("cart");
    return serializedCart ? JSON.parse(serializedCart) : [];
  } catch {
    return [];
  }
};

const loadOrdersFromLocalStorage = () => {
  try {
    const serializedOrders = localStorage.getItem("orders");
    return serializedOrders ? JSON.parse(serializedOrders) : [];
  } catch {
    return [];
  }
};

const saveCartToLocalStorage = (items) => {
  try {
    localStorage.setItem("cart", JSON.stringify(items));
  } catch {}
};

const saveOrdersToLocalStorage = (orders) => {
  try {
    localStorage.setItem("orders", JSON.stringify(orders));
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

    //  order to history
    completeOrder: (state) => {
      if (state.items.length === 0) return;

      const newOrder = {
        id: Date.now(),
        items: [...state.items],
        total: state.items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        ),
        date: new Date().toISOString(),
      };

      state.orders.push(newOrder);
      saveOrdersToLocalStorage(state.orders);

      // clear cart after saving order
      state.items = [];
      saveCartToLocalStorage(state.items);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  completeOrder,
} = cartSlice.actions;

export default cartSlice.reducer;
