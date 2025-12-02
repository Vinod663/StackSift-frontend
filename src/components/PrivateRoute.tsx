import { type ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../redux/store';

// We allow this component to either wrap children OR use Outlet
interface PrivateRouteProps {
  children?: ReactNode;
  allowedRoles?: string[];
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  // 1. USE REDUX (Not Context)
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // 2. Check Login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 3. Check Roles (Your Logic)
  if (allowedRoles && user?.role) {
    const hasPermission = allowedRoles.some(role => user.role.includes(role));
    
    if (!hasPermission) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center bg-brand-dark">
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-6 shadow-sm w-full max-w-md text-center">
                <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
                <p className="text-sm opacity-80">You do not have permission to view this page.</p>
            </div>
        </div>
      );
    }
  }

  // 4. Return Children or Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;