import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
export default function ProtectedRoute({ children }) {
  const user = useSelector((s) => s.auth.user);
  const loc = useLocation();
  return user ? children : <Navigate to="/login" replace state={{ from: loc.pathname + loc.search }} />;
}
