import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Minus, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { setQty, removeFromCart, placeOrder, selectCartTotal } from '../store/shopSlice';
import { Empty, Field, PageHeader } from '../components/ui';
import { money } from '../utils/slots';

export default function Cart() {
  const { cart, orders } = useSelector((s) => s.shop);
  const user = useSelector((s) => s.auth.user);
  const subtotal = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || '');
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 60;

  const checkout = (e) => {
    e.preventDefault();
    if (!user) return navigate('/login', { state: { from: '/cart' } });
    if (address.trim().length < 10) return setError('Enter a full delivery address (at least 10 characters).');
    dispatch(placeOrder({ userId: user.id, address }));
    setDone(orders.length + 1);
  };

  if (done) return <Empty title="Order placed" text="We have saved it to your order history." action={<Link to="/profile" className="btn-primary mt-2"><CheckCircle2 className="h-4 w-4" />View orders</Link>} />;
  return (
    <>
      <PageHeader title="Your cart" />
      <div className="container-x py-8">
        {cart.length === 0 ? <Empty title="Your cart is empty" text="Add products to see them here." action={<Link to="/products" className="btn-primary mt-2">Browse products</Link>} /> : (
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <ul className="space-y-3">
              {cart.map((l) => (
                <li key={l.id} className="card flex items-center justify-between gap-3 p-4">
                  <div><Link to={`/products/${l.id}`} className="font-semibold">{l.name}</Link><p className="text-sm text-ink/60">{money(l.price)} each</p></div>
                  <div className="flex items-center gap-2">
                    <button className="btn-ghost !px-2" aria-label="Decrease quantity" onClick={() => dispatch(setQty({ id: l.id, qty: l.qty - 1 }))}><Minus className="h-4 w-4" /></button>
                    <span className="w-6 text-center" aria-live="polite">{l.qty}</span>
                    <button className="btn-ghost !px-2" aria-label="Increase quantity" disabled={l.qty >= l.stock} onClick={() => dispatch(setQty({ id: l.id, qty: l.qty + 1 }))}><Plus className="h-4 w-4" /></button>
                    <button className="btn-danger !px-2" aria-label={`Remove ${l.name}`} onClick={() => dispatch(removeFromCart(l.id))}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </li>
              ))}
            </ul>
            <form onSubmit={checkout} className="card h-fit space-y-4 p-5" noValidate>
              <h2 className="text-lg font-semibold">Checkout</h2>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
                <div className="flex justify-between"><dt>Delivery</dt><dd>{shipping ? money(shipping) : 'Free'}</dd></div>
                <div className="flex justify-between border-t border-ink/10 pt-2 font-semibold"><dt>Total</dt><dd>{money(subtotal + shipping)}</dd></div>
              </dl>
              <Field id="addr" label="Delivery address" error={error}><textarea id="addr" className="input" rows={3} value={address} onChange={(e) => { setAddress(e.target.value); setError(''); }} /></Field>
              <button className="btn-primary w-full">{user ? 'Place order' : 'Log in to check out'}</button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
