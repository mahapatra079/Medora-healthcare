import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice';
import shop from './shopSlice';
import appointments from './appointmentsSlice';

const KEY = 'medora_state_v1';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || undefined; } catch { return undefined; } };

export const store = configureStore({ reducer: { auth, shop, appointments }, preloadedState: load() });

let last = 0;
store.subscribe(() => {
  const now = Date.now();
  if (now - last < 300) return; // light throttle
  last = now;
  try { localStorage.setItem(KEY, JSON.stringify(store.getState())); } catch { /* storage unavailable */ }
});
window.addEventListener('beforeunload', () => { try { localStorage.setItem(KEY, JSON.stringify(store.getState())); } catch { /* noop */ } });
