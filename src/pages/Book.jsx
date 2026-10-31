import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2 } from 'lucide-react';
import useAsync from '../hooks/useAsync';
import { api } from '../services/api';
import { specialties } from '../data/mock';
import { Avatar, ErrorState, Field, PageHeader, Spinner } from '../components/ui';
import { bookAppointment, rescheduleAppointment } from '../store/appointmentsSlice';
import { availableDates, slotsFor, fmtDate, fmtTime, money } from '../utils/slots';

export default function Book() {
  const [params] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const appts = useSelector((s) => s.appointments.items);
  const { data: doctors, loading, error, retry } = useAsync(api.getDoctors, []);

  const rescheduling = appts.find((a) => a.id === params.get('reschedule'));
  const initialDoc = rescheduling?.doctorId || params.get('doctor') || '';
  const [doctorId, setDoctorId] = useState(initialDoc);
  const [department, setDepartment] = useState('');
  const [date, setDate] = useState(params.get('date') || rescheduling?.date || '');
  const [time, setTime] = useState(params.get('time') || '');
  const [reason, setReason] = useState('');
  const [err, setErr] = useState('');
  const [booked, setBooked] = useState(null);

  const doctor = doctors?.find((d) => d.id === doctorId);
  const dept = department || doctor?.specialty || '';
  const deptDoctors = useMemo(() => (doctors || []).filter((d) => !dept || d.specialty === dept), [doctors, dept]);
  const dates = doctor ? availableDates(doctor, 8) : [];
  const slots = doctor && date ? slotsFor(doctor, date, appts, rescheduling?.id) : [];

  if (loading) return <Spinner />;
  if (error) return <ErrorState error={error} retry={retry} />;

  const submit = (e) => {
    e.preventDefault();
    if (!doctor || !date || !time) return setErr('Choose a doctor, a date and a time slot.');
    if (!rescheduling && reason.trim().length < 5) return setErr('Tell the doctor briefly why you are visiting (at least 5 characters).');
    if (rescheduling) {
      dispatch(rescheduleAppointment({ id: rescheduling.id, date, time }));
      setBooked({ ...rescheduling, date, time });
    } else {
      const action = bookAppointment({ userId: user.id, doctorId: doctor.id, doctorName: doctor.name, specialty: doctor.specialty, fee: doctor.fee, date, time, reason });
      dispatch(action);
      setBooked(action.payload);
    }
  };

  if (booked) return (
    <div className="container-x py-12">
      <div className="card mx-auto max-w-lg space-y-3 p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto h-10 w-10 text-pine" aria-hidden />
        <h1 className="text-2xl font-bold">{rescheduling ? 'Appointment rescheduled' : 'Appointment confirmed'}</h1>
        <p>{booked.doctorName} · {booked.specialty}</p>
        <p className="font-semibold">{fmtDate(booked.date)} at {fmtTime(booked.time)}</p>
        <p className="text-sm text-ink/60">Reference {booked.id}</p>
        <Link to="/appointments" className="btn-primary mt-2">View my appointments</Link>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title={rescheduling ? 'Reschedule appointment' : 'Book an appointment'} />
      <form onSubmit={submit} className="container-x grid gap-6 py-8 lg:grid-cols-[1fr_320px]" noValidate>
        <div className="space-y-6">
          {!rescheduling && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="dept" label="1. Department"><select id="dept" className="input" value={dept} onChange={(e) => { setDepartment(e.target.value); setDoctorId(''); setDate(''); setTime(''); }}><option value="">All departments</option>{specialties.map((s) => <option key={s}>{s}</option>)}</select></Field>
              <Field id="doc" label="2. Doctor"><select id="doc" className="input" value={doctorId} onChange={(e) => { setDoctorId(e.target.value); setDate(''); setTime(''); }}><option value="">Select a doctor</option>{deptDoctors.map((d) => <option key={d.id} value={d.id}>{d.name} – {d.specialty}</option>)}</select></Field>
            </div>
          )}
          {doctor && (
            <fieldset>
              <legend className="mb-2 text-sm font-medium">3. Date</legend>
              <div className="flex flex-wrap gap-2">{dates.map((x) => <button type="button" key={x} aria-pressed={x === date} onClick={() => { setDate(x); setTime(''); }} className={`btn border ${x === date ? 'border-pine bg-pine text-white' : 'border-ink/20 bg-white'}`}>{fmtDate(x)}</button>)}</div>
            </fieldset>
          )}
          {doctor && date && (
            <fieldset>
              <legend className="mb-2 text-sm font-medium">4. Time</legend>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{slots.map((s) => <button type="button" key={s.time} disabled={!s.available} aria-pressed={s.time === time} onClick={() => setTime(s.time)} className={`btn border ${s.time === time ? 'border-pine bg-pine text-white' : 'border-ink/20 bg-white'} disabled:line-through`}>{fmtTime(s.time)}</button>)}</div>
            </fieldset>
          )}
          {!rescheduling && doctor && <Field id="reason" label="5. Reason for visit"><textarea id="reason" className="input" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} /></Field>}
          {err && <p role="alert" className="text-sm text-coral">{err}</p>}
        </div>
        <aside className="card h-fit space-y-3 p-5" aria-live="polite">
          <h2 className="text-lg font-semibold">Summary</h2>
          {doctor ? (<><div className="flex items-center gap-3"><Avatar name={doctor.name} /><div><p className="font-medium">{doctor.name}</p><p className="text-sm text-ink/60">{doctor.specialty}</p></div></div>
            <p className="text-sm">{date ? fmtDate(date) : 'No date selected'}{time && `, ${fmtTime(time)}`}</p>
            <p className="font-semibold">Fee: {money(doctor.fee)}</p></>) : <p className="text-sm text-ink/60">Pick a doctor to see times.</p>}
          <button className="btn-primary w-full" disabled={!time}>{rescheduling ? 'Confirm new time' : 'Confirm booking'}</button>
          <button type="button" className="btn-ghost w-full" onClick={() => navigate(-1)}>Cancel</button>
        </aside>
      </form>
    </>
  );
}
