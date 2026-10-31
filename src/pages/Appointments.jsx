import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CalendarX } from 'lucide-react';
import { cancelAppointment } from '../store/appointmentsSlice';
import { Empty, PageHeader } from '../components/ui';
import { fmtDate, fmtTime, isPast, money } from '../utils/slots';

const tone = { Upcoming: 'bg-pine/10 text-pine', Cancelled: 'bg-coral/10 text-coral', Completed: 'bg-ink/10 text-ink' };

export default function Appointments() {
  const user = useSelector((s) => s.auth.user);
  const all = useSelector((s) => s.appointments.items).filter((a) => a.userId === user.id);
  const dispatch = useDispatch();
  const [tab, setTab] = useState('upcoming');
  const status = (a) => (a.status === 'Upcoming' && isPast(a) ? 'Completed' : a.status);
  const list = all.filter((a) => (status(a) === 'Upcoming') === (tab === 'upcoming')).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <>
      <PageHeader title="My appointments" />
      <div className="container-x py-8">
        <div className="mb-4 flex gap-2" role="tablist">
          {['upcoming', 'past'].map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`btn border capitalize ${tab === t ? 'border-pine bg-pine text-white' : 'border-ink/20 bg-white'}`}>{t}</button>)}
        </div>
        {list.length === 0 ? (
          <Empty title={`No ${tab} appointments`} text="Book a visit with a doctor who has a slot that suits you." action={<Link to="/book" className="btn-primary mt-2">Book appointment</Link>} />
        ) : (
          <ul className="space-y-3">
            {list.map((a) => (
              <li key={a.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-semibold">{a.doctorName} <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${tone[status(a)]}`}>{status(a)}</span></p>
                  <p className="text-sm text-ink/70">{a.specialty} · {fmtDate(a.date)}, {fmtTime(a.time)} · {money(a.fee)}</p>
                  <p className="text-xs text-ink/50">Ref {a.id}</p>
                </div>
                {status(a) === 'Upcoming' && (
                  <div className="flex gap-2">
                    <Link to={`/book?reschedule=${a.id}`} className="btn-ghost">Reschedule</Link>
                    <button className="btn-danger" onClick={() => window.confirm('Cancel this appointment?') && dispatch(cancelAppointment(a.id))}><CalendarX className="h-4 w-4" />Cancel</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
