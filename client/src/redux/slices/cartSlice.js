import { createSlice } from "@reduxjs/toolkit";

const saved = localStorage.getItem("cart");
const initialState = {
  items: saved ? JSON.parse(saved) : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, { payload }) {
      const existing = state.items.find((i) => i.product === payload.product);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + payload.quantity, payload.stock);
      } else {
        state.items.push(payload);
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart(state, { payload }) {
      state.items = state.items.filter((i) => i.product !== payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateQuantity(state, { payload: { productId, quantity } }) {
      const item = state.items.find((i) => i.product === productId);
      if (item) item.quantity = quantity;
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart(state) {
      state.items = [];
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems  = (s) => s.cart.items;
export const selectCartTotal  = (s) => s.cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
export const selectCartCount  = (s) => s.cart.items.reduce((acc, i) => acc + i.quantity, 0);

export default cartSlice.reducer;
