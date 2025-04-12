import { createSlice } from "@reduxjs/toolkit";
import { setCart, getCart } from "../data/localStorageItems";

type CartItem = { idProduct: number; quantity: number };
let cart: Array<CartItem> = getCart("cart");

if (!cart) {
  cart = [];
}
const initialCartState: Array<CartItem> = cart;

const cartSlice = createSlice({
  name: "cart",
  initialState: { cart: initialCartState, quantity: 1 },
  reducers: {
    holdQuantity(state, action) {
      state.quantity = action.payload;
    },
    updateQuantity(state, action) {
      const existingItemIndex = state.cart.findIndex(
        (item) => item.idProduct === action.payload.idProduct
      );

      if (existingItemIndex !== -1) {
        state.cart[existingItemIndex].quantity = action.payload.newQuantity;

        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },
    addItem(state, action) {
      const existingItem = state.cart.find(
        (item) => item.idProduct === action.payload.idProduct
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.cart.push(action.payload);
      }

      setCart(state.cart);
    },
    removeItem(state, action) {
      state.cart = state.cart.filter(
        (item) => item.idProduct !== action.payload
      );
      setCart(state.cart);
    },
    resetCart(state) {
      state.cart = [];
    },
  },
});

export const cartAction = cartSlice.actions;

export default cartSlice.reducer;
