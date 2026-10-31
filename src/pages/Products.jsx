import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import useAsync from '../hooks/useAsync';
import { api } from '../services/api';
import { categories } from '../data/mock';
import { ProductCard } from '../components/Cards';
import { Empty, ErrorState, PageHeader, Spinner } from '../components/ui';

export default function Products() {
  const [params, setParams] = useSearchParams();
  const wishlist = useSelector((s) => s.shop.wishlist);
  const { data, loading, error, retry } = useAsync(api.getProducts, []);
  const q = params.get('q') || '', category = params.get('category') || '', max = Number(params.get('max')) || 0;
  const inStock = params.get('stock') === '1', onlyWish = params.get('wishlist') === '1', sort = params.get('sort') || '';

  const set = (k, v) => { const n = new URLSearchParams(params); v ? n.set(k, v) : n.delete(k); setParams(n, { replace: true }); };

  const list = useMemo(() => {
    let r = (data || []).filter((p) => (!q || p.name.toLowerCase().includes(q.toLowerCase())) && (!category || p.category === category) && (!max || p.price <= max) && (!inStock || p.stock > 0) && (!onlyWish || wishlist.includes(p.id)));
    if (sort === 'price') r = [...r].sort((a, b) => a.price - b.price);
    if (sort === 'rating') r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [data, q, category, max, inStock, onlyWish, wishlist, sort]);

  return (
    <>
      <PageHeader title={onlyWish ? 'Your wishlist' : 'Healthcare products'} sub="Devices, supplements and essentials from trusted brands." />
      <div className="container-x grid gap-6 py-8 lg:grid-cols-[250px_1fr]">
        <aside className="card h-fit space-y-4 p-4" aria-label="Filters">
          <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-ink/40" aria-hidden /><input className="input pl-9" placeholder="Search products" aria-label="Search products" value={q} onChange={(e) => set('q', e.target.value)} /></div>
          <label className="block text-sm font-medium">Category
            <select className="input mt-1" value={category} onChange={(e) => set('category', e.target.value)}><option value="">All</option>{categories.map((c) => <option key={c}>{c}</option>)}</select>
          </label>
          <label className="block text-sm font-medium">Max price
            <select className="input mt-1" value={max} onChange={(e) => set('max', e.target.value === '0' ? '' : e.target.value)}><option value="0">Any</option><option value="700">Up to ₹700</option><option value="1000">Up to ₹1,000</option><option value="2000">Up to ₹2,000</option></select>
          </label>
          <label className="block text-sm font-medium">Sort by
            <select className="input mt-1" value={sort} onChange={(e) => set('sort', e.target.value)}><option value="">Featured</option><option value="price">Price: low to high</option><option value="rating">Rating</option></select>
          </label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={inStock} onChange={(e) => set('stock', e.target.checked ? '1' : '')} /> In stock only</label>
          <button className="btn-ghost w-full" onClick={() => setParams({}, { replace: true })}>Clear filters</button>
        </aside>
        <section aria-live="polite">
          {loading ? <Spinner label="Loading products" /> : error ? <ErrorState error={error} retry={retry} /> : list.length === 0 ? (
            <Empty title="No products match" text="Try a different search or clear a filter." action={<Link to="/products" className="btn-primary mt-2">Reset</Link>} />
          ) : (
            <>
              <p className="mb-3 text-sm text-ink/60">{list.length} products</p>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div>
            </>
          )}
        </section>
      </div>
    </>
  );
}
