// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

// ✅ Central Redux Store
const store = configureStore({
  reducer: {
    auth: authReducer, // logical, clean state name
  },
  devTools: import.meta.env.MODE !== "production", // Only enable Redux DevTools in dev mode
});

export default store;
