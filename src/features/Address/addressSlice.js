import { createSlice } from "@reduxjs/toolkit";

let parsedAddresses = [];
let parsedSelectedAddress = null;

try {
  const stored = localStorage.getItem("userAddresses");
  const data = stored ? JSON.parse(stored) : [];
  parsedAddresses = Array.isArray(data) ? data : [];

  const storedSelected = localStorage.getItem("selectedAddress");
  parsedSelectedAddress = storedSelected ? JSON.parse(storedSelected) : parsedAddresses[0] || null;
} catch (err) {
  console.error("Failed to parse userAddresses:", err);
  parsedAddresses = [];
  parsedSelectedAddress = null;
}

const initialState = {
  addresses: parsedAddresses,
  selectedAddress: parsedSelectedAddress,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    addAddress: (state, action) => {
      if (!Array.isArray(state.addresses)) {
        state.addresses = [];
      }
      state.addresses.push(action.payload);
      localStorage.setItem("userAddresses", JSON.stringify(state.addresses));
    },
    deleteAddress: (state, action) => {
      if (!Array.isArray(state.addresses)) {
        state.addresses = [];
      }
      state.addresses = state.addresses.filter(
        (addr) => addr.id !== action.payload
      );
      localStorage.setItem("userAddresses", JSON.stringify(state.addresses));
      //  if deleted address was selected, reset selection
      if (state.selectedAddress && state.selectedAddress.id === action.payload) {
        state.selectedAddress = state.addresses[0] || null;
        localStorage.setItem("selectedAddress", JSON.stringify(state.selectedAddress));
      }
    },
    selectAddress: (state, action) => {
      state.selectedAddress = action.payload;
      localStorage.setItem("selectedAddress", JSON.stringify(action.payload)); //  save selection persistently
    },
    setAddresses: (state, action) => {
      state.addresses = Array.isArray(action.payload)
        ? action.payload
        : [];
      localStorage.setItem("userAddresses", JSON.stringify(state.addresses));
    },
    clearAddresses: (state) => {
      state.addresses = [];
      state.selectedAddress = null;
      localStorage.removeItem("userAddresses");
      localStorage.removeItem("selectedAddress");
    },
  },
});

export const {
  addAddress,
  deleteAddress,
  selectAddress,
  setAddresses,
  clearAddresses,
} = addressSlice.actions;

export default addressSlice.reducer;
