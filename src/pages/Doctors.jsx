import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import useAsync from '../hooks/useAsync';
import { api } from '../services/api';
import { specialties } from '../data/mock';
import { DoctorCard } from '../components/Cards';
import { Empty, ErrorState, PageHeader, Spinner } from '../components/ui';
import { nextSlot } from '../utils/slots';

export default function Doctors() {
  const [params, setParams] = useSearchParams();
  const appts = useSelector((s) => s.appointments.items);
  const { data, loading, error, retry } = useAsync(api.getDoctors, []);
  const q = params.get('q') || '', specialty = params.get('specialty') || '', loc = params.get('location') || '';
  const minExp = Number(params.get('exp')) || 0, minRating = Number(params.get('rating')) || 0, today = params.get('today') === '1';
  const set = (k, v) => { const n = new URLSearchParams(params); v ? n.set(k, v) : n.delete(k); setParams(n, { replace: true }); };
  const todayIso = new Date().toISOString().slice(0, 10);

  const list = useMemo(() => (data || []).filter((d) => {
    const text = `${d.name} ${d.specialty}`.toLowerCase();
    if (q && !text.includes(q.toLowerCase())) return false;
    if (specialty && d.specialty !== specialty) return false;
    if (loc && d.location !== loc) return false;
    if (d.experience < minExp || d.rating < minRating) return false;
    if (today) { const n = nextSlot(d, appts); if (!n || n.date !== new Date().toLocaleDateString('en-CA')) return false; }
    return true;
  }), [data, q, specialty, loc, minExp, minRating, today, appts, todayIso]);

  return (
    <>
      <PageHeader title="Find a doctor" sub="Search by name or specialty, then filter by location, experience, rating and availability." />
      <div className="container-x grid gap-6 py-8 lg:grid-cols-[250px_1fr]">
        <aside className="card h-fit space-y-4 p-4" aria-label="Filters">
          <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-ink/40" aria-hidden /><input className="input pl-9" placeholder="Name or specialty" aria-label="Search doctors" value={q} onChange={(e) => set('q', e.target.value)} /></div>
          <label className="block text-sm font-medium">Department<select className="input mt-1" value={specialty} onChange={(e) => set('specialty', e.target.value)}><option value="">All</option>{specialties.map((s) => <option key={s}>{s}</option>)}</select></label>
          <label className="block text-sm font-medium">Location<select className="input mt-1" value={loc} onChange={(e) => set('location', e.target.value)}><option value="">All</option>{['Hyderabad', 'Bengaluru', 'Chennai'].map((s) => <option key={s}>{s}</option>)}</select></label>
          <label className="block text-sm font-medium">Experience<select className="input mt-1" value={minExp} onChange={(e) => set('exp', e.target.value === '0' ? '' : e.target.value)}><option value="0">Any</option><option value="5">5+ years</option><option value="10">10+ years</option><option value="15">15+ years</option></select></label>
          <label className="block text-sm font-medium">Rating<select className="input mt-1" value={minRating} onChange={(e) => set('rating', e.target.value === '0' ? '' : e.target.value)}><option value="0">Any</option><option value="4.5">4.5 & up</option><option value="4.8">4.8 & up</option></select></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={today} onChange={(e) => set('today', e.target.checked ? '1' : '')} /> Has a slot today</label>
          <button className="btn-ghost w-full" onClick={() => setParams({}, { replace: true })}>Clear filters</button>
        </aside>
        <section aria-live="polite">
          {loading ? <Spinner label="Loading doctors" /> : error ? <ErrorState error={error} retry={retry} /> : list.length === 0 ? (
            <Empty title="No doctors found" text="Widen your filters to see more doctors." action={<Link to="/doctors" className="btn-primary mt-2">Reset</Link>} />
          ) : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{list.map((d) => <DoctorCard key={d.id} doctor={d} />)}</div>}
        </section>
      </div>
    </>
  );
}
