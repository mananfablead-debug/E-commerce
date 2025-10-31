// src/components/ModeToggle.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleMode } from "../features/Theme/themeSlice";

const ModeToggle = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  return (
    <button
      onClick={() => dispatch(toggleMode())}
      className="px-4 py-2 rounded-md bg-cta text-cta-text hover:bg-cta-active transition-colors"
    >
      Toggle Mode ({mode})
    </button>
  );
};

export default ModeToggle;
