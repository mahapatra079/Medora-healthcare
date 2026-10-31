import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart } from 'lucide-react';
import useAsync from '../hooks/useAsync';
import { api } from '../services/api';
import { ProductIcon } from '../components/Cards';
import { ErrorState, Spinner, Stars } from '../components/ui';
import { addToCart, toggleWishlist } from '../store/shopSlice';
import { money } from '../utils/slots';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: p, loading, error } = useAsync(() => api.getProduct(id), [id]);
  const wished = useSelector((s) => s.shop.wishlist.includes(id));
  if (loading) return <Spinner />;
  if (error) return <ErrorState error={error} retry={null} />;
  return (
    <div className="container-x py-8">
      <Link to="/products" className="text-sm text-pine">Back to products</Link>
      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <div className="flex h-72 items-center justify-center rounded-xl bg-mist text-pine"><ProductIcon category={p.category} className="h-24 w-24" /></div>
        <div className="space-y-4">
          <p className="text-sm text-ink/60">{p.category}</p>
          <h1 className="text-3xl font-bold">{p.name}</h1>
          <Stars value={p.rating} count={p.reviews} />
          <p className="font-display text-3xl font-bold">{money(p.price)}</p>
          <p className="text-ink/80">{p.description}</p>
          <p className={`text-sm font-medium ${p.stock ? 'text-pine' : 'text-coral'}`}>{p.stock ? `In stock (${p.stock} left)` : 'Out of stock'}</p>
          <div className="flex gap-3">
            <button className="btn-primary" disabled={!p.stock} onClick={() => dispatch(addToCart(p))}><ShoppingCart className="h-4 w-4" />Add to cart</button>
            <button className="btn-ghost" aria-pressed={wished} onClick={() => dispatch(toggleWishlist(p.id))}><Heart className={`h-4 w-4 ${wished ? 'fill-coral text-coral' : ''}`} />{wished ? 'Saved' : 'Save'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
