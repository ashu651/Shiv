import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedLink({ to, children, ...rest }) {
  const { user } = useAuth();
  if (!user) return null;
  return <Link to={to} {...rest}>{children}</Link>;
}