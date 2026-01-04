import { type ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../redux/store';

interface PrivateRouteProps {
  children?: ReactNode;
  allowedRoles?: string[];
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  //  REDUX (Not Context)
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  //  Check Login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check Roles 
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

  // Return Children or Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;