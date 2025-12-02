import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/action/authAction';
import { type RootState } from '../redux/store';
import { FaLayerGroup, FaPlus, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const Layout = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans">
      {/* --- PERSISTENT NAVBAR --- */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-brand-dark/80 backdrop-blur-md px-4 md:px-8 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20 group-hover:shadow-brand-primary/40 transition-all">
            <FaLayerGroup className="text-white text-sm" />
          </div>
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            StackSift
          </span>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
            {/* Add Website Button */}
            <Link 
                to="/submit" 
                className="hidden md:flex items-center gap-2 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-lg transition-all text-sm font-medium"
            >
                <FaPlus /> Submit Tool
            </Link>

            <div className="h-6 w-px bg-white/10 mx-2"></div>

            {/* Profile */}
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 hidden sm:block">{user?.name}</span>
                <FaUserCircle className="text-2xl text-gray-500" />
            </div>

            {/* Logout */}
            <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 transition-colors p-2"
                title="Logout"
            >
                <FaSignOutAlt />
            </button>
        </div>
      </nav>

      {/* --- PAGE CONTENT GOES HERE --- */}
      <main className="p-6 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;