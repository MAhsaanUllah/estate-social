import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AgentRoute({ children }) {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'agent' && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AgentRoute;