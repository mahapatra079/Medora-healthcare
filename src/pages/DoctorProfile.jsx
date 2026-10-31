import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Award, Briefcase, MapPin } from 'lucide-react';
import useAsync from '../hooks/useAsync';
import { api } from '../services/api';
import { Avatar, ErrorState, Spinner, Stars } from '../components/ui';
import { availableDates, slotsFor, fmtDate, fmtTime, money } from '../utils/slots';

const reviews = [
  ['Priya S.', 'Listened carefully and explained the plan clearly. Booking was easy.'],
  ['Arjun M.', 'On time, thorough and followed up the next day.'],
  ['Fatima K.', 'Calm with my child and answered every question.'],
];

export default function DoctorProfile() {
  const { id } = useParams();
  const appts = useSelector((s) => s.appointments.items);
  const { data: d, loading, error, retry } = useAsync(() => api.getDoctor(id), [id]);
  const [date, setDate] = useState(null);
  if (loading) return <Spinner />;
  if (error) return <ErrorState error={error} retry={retry} />;
  const dates = availableDates(d, 7);
  const active = date || dates[0];
  const slots = slotsFor(d, active, appts);

  return (
    <div className="container-x grid gap-8 py-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name={d.name} size="h-20 w-20" />
          <div>
            <h1 className="text-3xl font-bold">{d.name}</h1>
            <p className="text-ink/70">{d.specialty}</p>
            <Stars value={d.rating} count={d.reviews} />
          </div>
        </div>
        <dl className="grid gap-3 sm:grid-cols-3">
          <div className="card p-4"><dt className="flex items-center gap-1 text-xs text-ink/60"><Award className="h-3.5 w-3.5" />Qualifications</dt><dd className="mt-1 text-sm font-medium">{d.qualifications}</dd></div>
          <div className="card p-4"><dt className="flex items-center gap-1 text-xs text-ink/60"><Briefcase className="h-3.5 w-3.5" />Experience</dt><dd className="mt-1 text-sm font-medium">{d.experience} years</dd></div>
          <div className="card p-4"><dt className="flex items-center gap-1 text-xs text-ink/60"><MapPin className="h-3.5 w-3.5" />Location</dt><dd className="mt-1 text-sm font-medium">{d.location}</dd></div>
        </dl>
        <section><h2 className="text-xl font-semibold">About</h2><p className="mt-2 max-w-prose text-ink/80">{d.about}</p><p className="mt-2 font-medium">Consultation fee: {money(d.fee)}</p></section>
        <section>
          <h2 className="text-xl font-semibold">Patient reviews</h2>
          <ul className="mt-3 space-y-3">{reviews.map(([n, t]) => <li key={n} className="card p-4"><p className="font-medium">{n}</p><p className="text-sm text-ink/75">{t}</p></li>)}</ul>
        </section>
      </div>
      <aside className="card h-fit space-y-4 p-5" aria-label="Appointment times">
        <h2 className="text-lg font-semibold">Available times</h2>
        <div className="flex flex-wrap gap-2" role="tablist">{dates.map((x) => <button key={x} role="tab" aria-selected={x === active} onClick={() => setDate(x)} className={`btn !px-3 !py-1.5 border ${x === active ? 'border-pine bg-pine text-white' : 'border-ink/20 bg-white'}`}>{fmtDate(x)}</button>)}</div>
        <div className="grid grid-cols-3 gap-2">
          {slots.map((s) => s.available
            ? <Link key={s.time} to={`/book?doctor=${d.id}&date=${active}&time=${s.time}`} className="btn-ghost !px-1 !py-1.5">{fmtTime(s.time)}</Link>
            : <span key={s.time} className="rounded-lg border border-dashed border-ink/15 py-1.5 text-center text-sm text-ink/30 line-through" aria-label={`${fmtTime(s.time)} unavailable`}>{fmtTime(s.time)}</span>)}
        </div>
      </aside>
    </div>
  );
}
