import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../authService';

interface Props {
  children: React.ReactNode;
  requiredRole: UserRole;
}

const loginPaths: Record<UserRole, string> = {
  donor: '/donor/login',
  volunteer: '/volunteer/login',
  requestor: '/requestor/login',
};

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--background)',
      }}>
        <div style={{
          width: 48, height: 48, border: '4px solid var(--primary-fixed)',
          borderTopColor: 'var(--primary)', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user || !user.emailVerified) {
    return <Navigate to={loginPaths[requiredRole]} replace />;
  }

  if (role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
