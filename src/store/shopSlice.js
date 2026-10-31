import { createSlice } from '@reduxjs/toolkit';

const shopSlice = createSlice({
  name: 'shop',
  initialState: { cart: [], wishlist: [], orders: [] },
  reducers: {
    addToCart(state, { payload: p }) {
      const line = state.cart.find((l) => l.id === p.id);
      if (line) line.qty = Math.min(line.qty + 1, p.stock);
      else state.cart.push({ id: p.id, name: p.name, price: p.price, stock: p.stock, category: p.category, qty: 1 });
    },
    setQty(state, { payload: { id, qty } }) {
      const line = state.cart.find((l) => l.id === id);
      if (!line) return;
      if (qty < 1) state.cart = state.cart.filter((l) => l.id !== id);
      else line.qty = Math.min(qty, line.stock);
    },
    removeFromCart(state, { payload: id }) { state.cart = state.cart.filter((l) => l.id !== id); },
    toggleWishlist(state, { payload: id }) {
      state.wishlist = state.wishlist.includes(id) ? state.wishlist.filter((x) => x !== id) : [...state.wishlist, id];
    },
    placeOrder(state, { payload }) {
      const total = state.cart.reduce((s, l) => s + l.price * l.qty, 0);
      state.orders.unshift({ id: `ORD${Date.now().toString().slice(-6)}`, userId: payload.userId, items: state.cart, total, address: payload.address, date: new Date().toISOString(), status: 'Processing' });
      state.cart = [];
    },
  },
});
export const { addToCart, setQty, removeFromCart, toggleWishlist, placeOrder } = shopSlice.actions;
export const selectCartCount = (s) => s.shop.cart.reduce((n, l) => n + l.qty, 0);
export const selectCartTotal = (s) => s.shop.cart.reduce((n, l) => n + l.qty * l.price, 0);
export default shopSlice.reducer;
