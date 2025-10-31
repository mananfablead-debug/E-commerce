// src/redux/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: localStorage.getItem("theme") || "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem("theme", action.payload);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(action.payload);
    },
    toggleMode: (state) => {
      const modes = ["light", "dark"];
      const nextMode = modes[(modes.indexOf(state.mode) + 1) % modes.length];
      state.mode = nextMode;
      localStorage.setItem("theme", nextMode);
      document.documentElement.classList.remove(...modes);
      document.documentElement.classList.add(nextMode);
    },
  },
});

export const { setMode, toggleMode } = themeSlice.actions;
export default themeSlice.reducer;
