import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white/80">
      <div className="container-x grid gap-6 py-10 text-sm sm:grid-cols-3">
        <div><p className="font-display text-lg text-white">Medora</p><p className="mt-2 max-w-xs">Book verified doctors and order everyday health essentials in one place.</p></div>
        <div className="flex flex-col gap-1"><Link to="/doctors">Find doctors</Link><Link to="/products">Shop products</Link><Link to="/appointments">My appointments</Link></div>
        <p>Medora does not provide emergency care. In an emergency, call your local emergency number.</p>
      </div>
    </footer>
  );
}
