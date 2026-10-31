import { Loader2, Star, SearchX, AlertTriangle } from 'lucide-react';

export const Spinner = ({ label = 'Loading' }) => (
  <div role="status" className="flex items-center justify-center gap-2 py-16 text-ink/60">
    <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> <span>{label}…</span>
  </div>
);

export const Empty = ({ title, text, action }) => (
  <div className="card mx-auto my-8 flex max-w-md flex-col items-center gap-2 p-8 text-center">
    <SearchX className="h-8 w-8 text-pine" aria-hidden />
    <h3 className="text-lg font-semibold">{title}</h3>
    {text && <p className="text-sm text-ink/70">{text}</p>}
    {action}
  </div>
);

export const ErrorState = ({ error, retry }) => (
  <div role="alert" className="card mx-auto my-8 flex max-w-md flex-col items-center gap-2 p-8 text-center">
    <AlertTriangle className="h-8 w-8 text-coral" aria-hidden />
    <p className="text-sm">{error?.message || 'Something went wrong.'}</p>
    {retry && <button className="btn-ghost" onClick={retry}>Try again</button>}
  </div>
);

export const Stars = ({ value, count }) => (
  <span className="inline-flex items-center gap-1 text-sm" aria-label={`Rated ${value} out of 5`}>
    <Star className="h-4 w-4 fill-sun text-sun" aria-hidden /> <b>{value}</b>
    {count != null && <span className="text-ink/60">({count})</span>}
  </span>
);

export const Field = ({ label, error, children, id }) => (
  <div>
    <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
    {children}
    {error && <p role="alert" className="mt-1 text-xs text-coral">{error}</p>}
  </div>
);

export const Avatar = ({ name, size = 'h-14 w-14' }) => (
  <div aria-hidden className={`${size} flex shrink-0 items-center justify-center rounded-full bg-pine font-display text-lg text-white`}>
    {name.replace('Dr. ', '').split(' ').map((w) => w[0]).join('')}
  </div>
);

export const PageHeader = ({ title, sub }) => (
  <div className="border-b border-ink/10 bg-mist">
    <div className="container-x py-8">
      <h1 className="text-3xl font-bold">{title}</h1>
      {sub && <p className="mt-1 max-w-prose text-ink/70">{sub}</p>}
    </div>
  </div>
);
