import { createSlice } from '@reduxjs/toolkit';

// Demo auth: users live in the store (persisted to localStorage). Replace with real API calls + tokens.
const authSlice = createSlice({
  name: 'auth',
  initialState: { users: [], user: null, error: null, notice: null },
  reducers: {
    register(state, { payload }) {
      if (state.users.some((u) => u.email === payload.email)) { state.error = 'An account with this email already exists. Log in instead.'; return; }
      const user = { id: `u${Date.now()}`, ...payload };
      state.users.push(user);
      state.user = user;
      state.error = null;
    },
    login(state, { payload }) {
      const u = state.users.find((x) => x.email === payload.email && x.password === payload.password);
      if (!u) { state.error = 'Email or password is incorrect.'; return; }
      state.user = u;
      state.error = null;
    },
    logout(state) { state.user = null; },
    updateProfile(state, { payload }) {
      state.user = { ...state.user, ...payload };
      state.users = state.users.map((u) => (u.id === state.user.id ? state.user : u));
    },
    resetPassword(state, { payload }) {
      const u = state.users.find((x) => x.email === payload.email);
      if (u) u.password = payload.password;
      state.notice = 'If that email has an account, the password is now updated.';
    },
    clearAuthMessages(state) { state.error = null; state.notice = null; },
  },
});
export const { register, login, logout, updateProfile, resetPassword, clearAuthMessages } = authSlice.actions;
export default authSlice.reducer;
