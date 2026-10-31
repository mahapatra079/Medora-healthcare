import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateProfile } from '../store/authSlice';
import { Empty, Field, PageHeader } from '../components/ui';
import { fmtDate, fmtTime, money } from '../utils/slots';

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const orders = useSelector((s) => s.shop.orders).filter((o) => o.userId === user.id);
  const appts = useSelector((s) => s.appointments.items).filter((a) => a.userId === user.id);
  const [form, setForm] = useState({ name: user.name, phone: user.phone, address: user.address || '' });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const bind = (k) => ({ id: k, className: 'input', value: form[k], onChange: (e) => { setForm({ ...form, [k]: e.target.value }); setSaved(false); } });

  const save = (e) => {
    e.preventDefault();
    const errs = {};
    if (form.name.trim().length < 2) errs.name = 'Enter your full name.';
    if (!/^\d{10}$/.test(form.phone)) errs.phone = 'Enter a 10-digit mobile number.';
    setErrors(errs);
    if (!Object.keys(errs).length) { dispatch(updateProfile(form)); setSaved(true); }
  };

  return (
    <>
      <PageHeader title="My account" sub={user.email} />
      <div className="container-x grid gap-8 py-8 lg:grid-cols-2">
        <form onSubmit={save} className="card h-fit space-y-4 p-5" noValidate>
          <h2 className="text-lg font-semibold">Personal details</h2>
          <Field id="name" label="Full name" error={errors.name}><input {...bind('name')} /></Field>
          <Field id="phone" label="Mobile number" error={errors.phone}><input {...bind('phone')} /></Field>
          <Field id="address" label="Address"><textarea rows={3} {...bind('address')} /></Field>
          <button className="btn-primary">Save changes</button>
          {saved && <p role="status" className="text-sm text-pine">Changes saved.</p>}
        </form>
        <div className="space-y-6">
          <section>
            <h2 className="mb-2 text-lg font-semibold">Appointment history</h2>
            {appts.length === 0 ? <Empty title="No appointments yet" action={<Link to="/book" className="btn-primary mt-2">Book now</Link>} /> : (
              <ul className="space-y-2">{appts.slice().reverse().map((a) => <li key={a.id} className="card p-3 text-sm"><b>{a.doctorName}</b> · {fmtDate(a.date)}, {fmtTime(a.time)} · {a.status}</li>)}</ul>
            )}
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold">Order history</h2>
            {orders.length === 0 ? <Empty title="No orders yet" action={<Link to="/products" className="btn-primary mt-2">Shop products</Link>} /> : (
              <ul className="space-y-2">{orders.map((o) => <li key={o.id} className="card p-3 text-sm"><b>{o.id}</b> · {new Date(o.date).toLocaleDateString('en-IN')} · {o.items.length} item(s) · {money(o.total)} · {o.status}</li>)}</ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
