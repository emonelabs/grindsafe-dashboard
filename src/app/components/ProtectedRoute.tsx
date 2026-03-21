import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'admin' | 'player';
  allowedEmails?: string[];
}

export function ProtectedRoute({ children, requireRole, allowedEmails }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && user.role !== requireRole) {
    const emailLower = user.email.toLowerCase();
    const isAllowedEmail = allowedEmails?.some(email => email.toLowerCase() === emailLower);
    if (!isAllowedEmail) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
