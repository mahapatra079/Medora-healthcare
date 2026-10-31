import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, resetPassword, clearAuthMessages } from '../store/authSlice';
import { Field } from '../components/ui';

const emailOk = (v) => /^\S+@\S+\.\S+$/.test(v);

function useAuthForm(validate, submitAction) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loc = useLocation();
  const { user, error, notice } = useSelector((s) => s.auth);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  useEffect(() => { dispatch(clearAuthMessages()); }, [dispatch]);
  useEffect(() => { if (user && submitAction !== resetPassword) navigate(loc.state?.from || '/', { replace: true }); }, [user]); // eslint-disable-line
  const bind = (k) => ({ id: k, value: values[k] || '', onChange: (e) => setValues({ ...values, [k]: e.target.value }), 'aria-invalid': !!errors[k] });
  const onSubmit = (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length === 0) dispatch(submitAction(values));
  };
  return { bind, onSubmit, errors, error, notice };
}

const Shell = ({ title, children, footer }) => (
  <div className="container-x py-12"><div className="card mx-auto max-w-md space-y-4 p-8"><h1 className="text-2xl font-bold">{title}</h1>{children}<div className="text-sm text-ink/70">{footer}</div></div></div>
);
const Err = ({ msg }) => msg ? <p role="alert" className="rounded-lg bg-coral/10 p-3 text-sm text-coral">{msg}</p> : null;

export function Login() {
  const f = useAuthForm((v) => ({ ...(!emailOk(v.email || '') && { email: 'Enter a valid email address.' }), ...(!v.password && { password: 'Enter your password.' }) }), login);
  return (
    <Shell title="Log in" footer={<><Link to="/forgot-password" className="text-pine">Forgot password?</Link> · <Link to="/register" className="text-pine">Create account</Link></>}>
      <form onSubmit={f.onSubmit} className="space-y-4" noValidate>
        <Err msg={f.error} />
        <Field id="email" label="Email" error={f.errors.email}><input type="email" autoComplete="email" className="input" {...f.bind('email')} /></Field>
        <Field id="password" label="Password" error={f.errors.password}><input type="password" autoComplete="current-password" className="input" {...f.bind('password')} /></Field>
        <button className="btn-primary w-full">Log in</button>
      </form>
    </Shell>
  );
}

export function Register() {
  const f = useAuthForm((v) => ({
    ...((v.name || '').trim().length < 2 && { name: 'Enter your full name.' }),
    ...(!emailOk(v.email || '') && { email: 'Enter a valid email address.' }),
    ...(!/^\d{10}$/.test(v.phone || '') && { phone: 'Enter a 10-digit mobile number.' }),
    ...((v.password || '').length < 8 && { password: 'Use at least 8 characters.' }),
    ...(v.password !== v.confirm && { confirm: 'Passwords do not match.' }),
  }), register);
  return (
    <Shell title="Create your account" footer={<>Already registered? <Link to="/login" className="text-pine">Log in</Link></>}>
      <form onSubmit={(e) => f.onSubmit(e)} className="space-y-4" noValidate>
        <Err msg={f.error} />
        <Field id="name" label="Full name" error={f.errors.name}><input className="input" autoComplete="name" {...f.bind('name')} /></Field>
        <Field id="email" label="Email" error={f.errors.email}><input type="email" className="input" autoComplete="email" {...f.bind('email')} /></Field>
        <Field id="phone" label="Mobile number" error={f.errors.phone}><input inputMode="numeric" className="input" autoComplete="tel" {...f.bind('phone')} /></Field>
        <Field id="password" label="Password" error={f.errors.password}><input type="password" className="input" autoComplete="new-password" {...f.bind('password')} /></Field>
        <Field id="confirm" label="Confirm password" error={f.errors.confirm}><input type="password" className="input" autoComplete="new-password" {...f.bind('confirm')} /></Field>
        <button className="btn-primary w-full">Create account</button>
      </form>
    </Shell>
  );
}

export function Forgot() {
  const f = useAuthForm((v) => ({ ...(!emailOk(v.email || '') && { email: 'Enter a valid email address.' }), ...((v.password || '').length < 8 && { password: 'Use at least 8 characters.' }) }), resetPassword);
  const user = useSelector((s) => s.auth.user);
  if (user) return <Navigate to="/" replace />;
  return (
    <Shell title="Reset password" footer={<Link to="/login" className="text-pine">Back to log in</Link>}>
      <p className="text-sm text-ink/70">Demo mode: set a new password directly. A real backend would email a reset link.</p>
      <form onSubmit={f.onSubmit} className="space-y-4" noValidate>
        {f.notice && <p role="status" className="rounded-lg bg-pine/10 p-3 text-sm text-pine">{f.notice}</p>}
        <Field id="email" label="Email" error={f.errors.email}><input type="email" className="input" {...f.bind('email')} /></Field>
        <Field id="password" label="New password" error={f.errors.password}><input type="password" className="input" autoComplete="new-password" {...f.bind('password')} /></Field>
        <button className="btn-primary w-full">Update password</button>
      </form>
    </Shell>
  );
}
