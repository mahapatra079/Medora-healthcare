# Medora – Healthcare Platform

React 18 + Vite + Tailwind CSS + Redux Toolkit + React Router + Axios + Lucide.

Medora is a healthcare platform that helps patients find doctors, book appointments, and shop for health products in one place.

```bash
npm install
npm run dev
```

## Structure
- `src/store` – Redux Toolkit slices (auth, shop, appointments), persisted to localStorage
- `src/services/api.js` – Axios instance + mock API (swap for real endpoints)
- `src/data/mock.js` – sample doctors and products
- `src/utils/slots.js` – date/time-slot generation and formatting
- `src/hooks/useAsync.js` – loading/error/data hook
- `src/components` – shared UI, cards, navbar, protected route
- `src/pages` – route screens (lazy-loaded)

Auth is a demo only: passwords are stored in plain text in localStorage. Replace with a real backend before production.

## Features

- **Home:** Hero with a live “Earliest open slots” panel that links straight into booking, plus specialty and category shortcuts, top doctors, and popular products.
- **Products:** Search, category, price, stock, and sort filters, with product detail, cart, wishlist, and checkout. Filters live in the URL so they can be shared.
- **Doctors:** Search by name or specialty; filter by department, location, experience, rating, and “slot today.” Profiles show qualifications, fees, reviews, and bookable time slots.
- **Booking:** Select a department, doctor, date, time, and reason, then confirm. Taken and past slots are disabled, and booked slots are blocked for that doctor. The Appointments page has upcoming and past tabs, plus rescheduling and cancellation.
- **Auth and profile:** Register, log in, reset a forgotten password, and redirect through protected routes. The Profile page includes profile editing, appointment history, and order history.
- **Redux and API:** `authSlice`, `shopSlice` (cart, wishlist, orders), and `appointmentsSlice` are saved to localStorage. API calls use mock data for now and can be swapped for real Axios calls.
- **Quality:** Pages load lazily, forms are validated, and every screen has loading, empty, and error states. Layouts are mobile-first and accessible, with keyboard focus and a skip link.