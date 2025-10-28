import { createSlice } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    status: "idle",
    error: null,
  },
  reducers: {
    startPayment: (state) => {
      state.status = "processing";
      state.error = null;
    },
    paymentSuccess: (state) => {
      state.status = "success";
      state.error = null;
    },
    paymentError: (state, action) => {
      state.status = "error";
      state.error = action.payload;
    },
    resetPayment: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
});

export const { startPayment, paymentSuccess, paymentError, resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
