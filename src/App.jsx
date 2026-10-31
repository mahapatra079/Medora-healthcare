import { lazy, Suspense } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { Spinner, Empty } from './components/ui';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Doctors = lazy(() => import('./pages/Doctors'));
const DoctorProfile = lazy(() => import('./pages/DoctorProfile'));
const Book = lazy(() => import('./pages/Book'));
const Appointments = lazy(() => import('./pages/Appointments'));
const Profile = lazy(() => import('./pages/Profile'));
const { Login, Register, Forgot } = {
  Login: lazy(() => import('./pages/Auth').then((m) => ({ default: m.Login }))),
  Register: lazy(() => import('./pages/Auth').then((m) => ({ default: m.Register }))),
  Forgot: lazy(() => import('./pages/Auth').then((m) => ({ default: m.Forgot }))),
};

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:p-2">Skip to content</a>
      <Navbar />
      <main id="main" className="flex-1">
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorProfile />} />
            <Route path="/book" element={<ProtectedRoute><Book /></ProtectedRoute>} />
            <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<Forgot />} />
            <Route path="*" element={<Empty title="Page not found" text="That address doesn't exist." action={<Link to="/" className="btn-primary mt-2">Go home</Link>} />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
