import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Menu, ShoppingCart, X, Stethoscope } from 'lucide-react';
import { logout } from '../store/authSlice';
import { selectCartCount } from '../store/shopSlice';

const links = [['/doctors', 'Find doctors'], ['/products', 'Products'], ['/appointments', 'Appointments']];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const user = useSelector((s) => s.auth.user);
  const count = useSelector(selectCartCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cls = ({ isActive }) => `rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-mist text-pine' : 'hover:bg-mist'}`;

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/95 backdrop-blur">
      <nav className="container-x flex h-16 items-center justify-between" aria-label="Main">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-pine">
          <Stethoscope aria-hidden /> Medora
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {links.map(([to, label]) => <NavLink key={to} to={to} className={cls}>{label}</NavLink>)}
        </div>
        <div className="flex items-center gap-2">
          <Link to="/products?wishlist=1" className="btn-ghost !px-2.5" aria-label="Wishlist"><Heart className="h-4 w-4" /></Link>
          <Link to="/cart" className="btn-ghost relative !px-2.5" aria-label={`Cart, ${count} items`}>
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && <span className="absolute -right-1.5 -top-1.5 rounded-full bg-coral px-1.5 text-xs text-white">{count}</span>}
          </Link>
          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/profile" className="btn-ghost">{user.name.split(' ')[0]}</Link>
              <button className="btn-ghost" onClick={() => { dispatch(logout()); navigate('/'); }}>Log out</button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary hidden md:inline-flex">Log in</Link>
          )}
          <button className="btn-ghost !px-2.5 md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="container-x flex flex-col gap-1 pb-4 md:hidden" onClick={() => setOpen(false)}>
          {links.map(([to, label]) => <NavLink key={to} to={to} className={cls}>{label}</NavLink>)}
          {user ? (
            <>
              <NavLink to="/profile" className={cls}>Profile</NavLink>
              <button className="btn-ghost" onClick={() => dispatch(logout())}>Log out</button>
            </>
          ) : <Link to="/login" className="btn-primary">Log in</Link>}
        </div>
      )}
    </header>
  );
}
