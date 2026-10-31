import axios from 'axios';
import { doctors, products } from '../data/mock';

// Replace the mock functions below with `http.get(...)` calls once a backend exists.
export const http = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 10000 });

const wait = (value, ms = 450) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
const find = (list, id) => {
  const item = list.find((x) => x.id === id);
  return item ? wait(item) : Promise.reject(new Error('We could not find that item.'));
};

export const api = {
  getDoctors: () => wait(doctors),
  getDoctor: (id) => find(doctors, id),
  getProducts: () => wait(products),
  getProduct: (id) => find(products, id),
};
