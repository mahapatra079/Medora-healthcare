import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, MapPin, ShoppingCart, Pill, Activity, Cross, Droplets, Dumbbell } from 'lucide-react';
import { Avatar, Stars } from './ui';
import { addToCart, toggleWishlist } from '../store/shopSlice';
import { money } from '../utils/slots';

const icons = { Devices: Activity, Supplements: Pill, 'First aid': Cross, 'Personal care': Droplets, Fitness: Dumbbell };
export const ProductIcon = ({ category, className = 'h-10 w-10' }) => { const I = icons[category] || Pill; return <I className={className} aria-hidden />; };

export const ProductCard = memo(function ProductCard({ product: p }) {
  const dispatch = useDispatch();
  const wished = useSelector((s) => s.shop.wishlist.includes(p.id));
  return (
    <article className="card flex flex-col overflow-hidden">
      <Link to={`/products/${p.id}`} className="flex h-32 items-center justify-center bg-mist text-pine" aria-label={p.name}><ProductIcon category={p.category} /></Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs text-ink/60">{p.category}</p>
        <Link to={`/products/${p.id}`} className="font-semibold hover:text-pine">{p.name}</Link>
        <Stars value={p.rating} count={p.reviews} />
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-lg font-bold">{money(p.price)}</span>
          <div className="flex gap-2">
            <button className="btn-ghost !px-2.5" aria-pressed={wished} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'} onClick={() => dispatch(toggleWishlist(p.id))}>
              <Heart className={`h-4 w-4 ${wished ? 'fill-coral text-coral' : ''}`} />
            </button>
            <button className="btn-primary !px-2.5" disabled={p.stock === 0} aria-label={p.stock ? 'Add to cart' : 'Out of stock'} onClick={() => dispatch(addToCart(p))}>
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
        {p.stock === 0 && <p className="text-xs text-coral">Out of stock</p>}
      </div>
    </article>
  );
});

export const DoctorCard = memo(function DoctorCard({ doctor: d, next }) {
  return (
    <article className="card flex flex-col gap-3 p-5">
      <div className="flex gap-3">
        <Avatar name={d.name} />
        <div>
          <Link to={`/doctors/${d.id}`} className="font-semibold hover:text-pine">{d.name}</Link>
          <p className="text-sm text-ink/70">{d.specialty} · {d.experience} yrs</p>
          <p className="flex items-center gap-1 text-sm text-ink/70"><MapPin className="h-3.5 w-3.5" aria-hidden />{d.location}</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm"><Stars value={d.rating} count={d.reviews} /><span>{money(d.fee)} consult</span></div>
      <div className="mt-auto flex gap-2">
        <Link to={`/doctors/${d.id}`} className="btn-ghost flex-1">View profile</Link>
        <Link to={`/book?doctor=${d.id}`} className="btn-primary flex-1">{next ? 'Book slot' : 'Book'}</Link>
      </div>
    </article>
  );
});
