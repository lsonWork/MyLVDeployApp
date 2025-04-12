import { configureStore } from "@reduxjs/toolkit";
import Cart from "./Cart";

const store = configureStore({
  reducer: {
    stateCart: Cart,
  },
});

export default store;
