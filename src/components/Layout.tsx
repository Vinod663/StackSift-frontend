import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/action/authAction';
import { type RootState } from '../redux/store';
import { 
    FaLayerGroup, FaPlus, FaSignOutAlt, FaUserCircle, 
    FaCompass, FaBookmark, FaShieldAlt, 
    FaBook, FaHeadset 
} from 'react-icons/fa';
import Footer from './Footer';

const Layout = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role.includes('ADMIN');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Helper to style active links
  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
        isActive 
        ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25' 
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`;
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans flex flex-col">
      
      {/* --- PERSISTENT NAVBAR --- */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-brand-dark/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
            
            {/* 1. Logo (Navigates to Dashboard) */}
            <Link to="/dashboard" className="flex items-center gap-3 group">
                <div className="relative">
                    <div className="absolute inset-0 bg-brand-primary blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-inner border border-white/10">
                        <FaLayerGroup className="text-white text-lg" />
                    </div>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 tracking-tight">
                    StackSift
                </span>
            </Link>

            {/* 2. Center Navigation (The "Dock") */}
            <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/5 p-1.5 rounded-full backdrop-blur-md">
                
                <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                    <FaCompass /> Discover
                </Link>
                
                <Link to="/bookmarks" className={getLinkClass('/bookmarks')}>
                    <FaBookmark /> Collections
                </Link>

                {/* --- NEW LINKS --- */}
                <Link to="/help" className={getLinkClass('/help')}>
                    <FaBook /> Docs
                </Link>

                <Link to="/contact" className={getLinkClass('/contact')}>
                    <FaHeadset /> Support
                </Link>
                {/* ----------------- */}

                {isAdmin && (
                    <Link to="/admin" className={getLinkClass('/admin')}>
                        <FaShieldAlt /> Admin
                    </Link>
                )}
            </div>

            {/* 3. Right Side Actions */}
            <div className="flex items-center gap-4">
                
                {/* Submit Tool Button */}
                <Link 
                    to="/submit" 
                    className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 hover:from-brand-primary/20 hover:to-brand-secondary/20 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-lg transition-all text-sm font-bold shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                >
                    <FaPlus /> <span className="hidden lg:inline">Submit Tool</span>
                </Link>

                <div className="h-8 w-px bg-white/10 mx-1"></div>

                {/* Profile Section */}
                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden lg:block">
                        <p className="text-sm font-medium text-white leading-none">{user?.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-wider">{user?.role[0]}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-gray-400 overflow-hidden shadow-sm">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <FaUserCircle className="text-2xl" />
                        )}
                    </div>
                </div>

                {/* Logout */}
                <button 
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                    title="Logout"
                >
                    <FaSignOutAlt className="text-lg" />
                </button>
            </div>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto w-full flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;