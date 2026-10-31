import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRight, CalendarCheck, Clock } from 'lucide-react';
import useAsync from '../hooks/useAsync';
import { api } from '../services/api';
import { categories, specialties } from '../data/mock';
import { DoctorCard, ProductCard, ProductIcon } from '../components/Cards';
import { Spinner } from '../components/ui';
import { nextSlot, fmtDate, fmtTime } from '../utils/slots';

export default function Home() {
  const appts = useSelector((s) => s.appointments.items);
  const docs = useAsync(api.getDoctors, []);
  const prods = useAsync(api.getProducts, []);
  const soonest = (docs.data || []).map((d) => ({ d, n: nextSlot(d, appts) })).filter((x) => x.n).sort((a, b) => (a.n.date + a.n.time).localeCompare(b.n.date + b.n.time)).slice(0, 4);

  return (
    <>
      <section className="bg-mist">
        <div className="container-x grid items-center gap-10 py-14 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">See a doctor this week, not next month.</h1>
            <p className="mt-4 max-w-prose text-lg text-ink/75">Pick a specialty, compare doctors and choose a time that is actually free. Order the devices and supplies they recommend in the same place.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/book" className="btn-primary"><CalendarCheck className="h-4 w-4" />Book appointment</Link>
              <Link to="/doctors" className="btn-ghost">Find doctors</Link>
              <Link to="/products" className="btn-ghost">Shop products</Link>
            </div>
          </div>
          <div className="card p-5" aria-live="polite">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Clock className="h-5 w-5 text-pine" aria-hidden />Earliest open slots</h2>
            {docs.loading ? <Spinner /> : (
              <ul className="divide-y divide-ink/10">
                {soonest.map(({ d, n }) => (
                  <li key={d.id}>
                    <Link to={`/book?doctor=${d.id}&date=${n.date}&time=${n.time}`} className="flex items-center justify-between gap-3 py-3 hover:text-pine">
                      <span><b>{d.name}</b><br /><span className="text-sm text-ink/60">{d.specialty}</span></span>
                      <span className="rounded-md bg-sun/30 px-2.5 py-1 text-sm font-semibold">{fmtDate(n.date)}, {fmtTime(n.time)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="container-x py-12">
        <h2 className="text-2xl font-bold">Browse by specialty</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {specialties.map((s) => <Link key={s} to={`/doctors?specialty=${encodeURIComponent(s)}`} className="btn-ghost">{s}</Link>)}
        </div>
      </section>

      <section className="container-x">
        <div className="mb-4 flex items-end justify-between"><h2 className="text-2xl font-bold">Top-rated doctors</h2><Link to="/doctors" className="text-sm font-semibold text-pine">See all</Link></div>
        {docs.loading ? <Spinner /> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[...docs.data].sort((a, b) => b.rating - a.rating).slice(0, 3).map((d) => <DoctorCard key={d.id} doctor={d} />)}</div>}
      </section>

      <section className="container-x py-12">
        <h2 className="text-2xl font-bold">Shop by category</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {categories.map((c) => (
            <Link key={c} to={`/products?category=${encodeURIComponent(c)}`} className="card flex flex-col items-center gap-2 p-4 text-sm font-medium text-pine hover:bg-mist"><ProductIcon category={c} className="h-7 w-7" /><span className="text-ink">{c}</span></Link>
          ))}
        </div>
      </section>

      <section className="container-x">
        <div className="mb-4 flex items-end justify-between"><h2 className="text-2xl font-bold">Popular products</h2><Link to="/products" className="text-sm font-semibold text-pine">See all</Link></div>
        {prods.loading ? <Spinner /> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[...prods.data].sort((a, b) => b.reviews - a.reviews).slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}</div>}
      </section>

      <section className="container-x mt-12">
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl bg-pine p-8 text-white sm:flex-row sm:items-center">
          <div><h2 className="text-2xl font-bold">Free delivery on orders above ₹999</h2><p className="text-white/80">Applied automatically at checkout.</p></div>
          <Link to="/products" className="btn bg-sun text-ink hover:bg-sun/90">Start shopping <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
