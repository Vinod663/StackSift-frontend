import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/action/authAction';
import { type RootState } from '../redux/store';
import { 
    FaLayerGroup, FaPlus, FaSignOutAlt, FaUserCircle, 
    FaCompass, FaBookmark, FaShieldAlt, 
    FaBook, FaHeadset, FaBars, FaTimes 
} from 'react-icons/fa';
import Footer from './Footer';

const Layout = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = user?.role.includes('ADMIN');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

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
      
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-brand-dark/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
            
            <div className="flex justify-between items-center">
                {/* 1. Logo */}
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

                {/* 2. DESKTOP CENTER DOCK */}
                {/* CHANGED: 'hidden md:flex' -> 'hidden lg:flex' 
                    This ensures these links hide on tablets (under 1024px) to save space */}
                <div className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/5 p-1.5 rounded-full backdrop-blur-md">
                    <Link to="/dashboard" className={getLinkClass('/dashboard')}> <FaCompass /> Discover </Link>
                    <Link to="/bookmarks" className={getLinkClass('/bookmarks')}> <FaBookmark /> Collections </Link>
                    <Link to="/help" className={getLinkClass('/help')}> <FaBook /> Docs </Link>
                    <Link to="/contact" className={getLinkClass('/contact')}> <FaHeadset /> Support </Link>
                    {isAdmin && (
                        <Link to="/admin" className={getLinkClass('/admin')}> <FaShieldAlt /> Admin </Link>
                    )}
                </div>

                {/* 3. Right Side Actions */}
                <div className="flex items-center gap-3">
                    {/* Submit Button (Desktop) */}
                    {/* CHANGED: 'hidden sm:flex' -> 'hidden lg:flex' so it moves to menu on tablets */}
                    <Link to="/submit" className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 hover:from-brand-primary/20 hover:to-brand-secondary/20 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-lg transition-all text-sm font-bold">
                        <FaPlus /> <span>Submit Tool</span>
                    </Link>

                    <div className="h-8 w-px bg-white/10 mx-1 hidden lg:block"></div>

                    {/* Profile Link (Desktop) */}
                    {/* CHANGED: 'hidden sm:flex' -> 'hidden lg:flex' */}
                    <Link to="/profile" className="hidden lg:flex items-center gap-3 pl-2 hover:bg-white/5 p-2 rounded-xl transition-all cursor-pointer group">
                        <div className="text-right"> 
                            <p className="text-sm font-medium text-white leading-none group-hover:text-brand-primary transition-colors">
                                {user?.name || "User"}
                            </p>
                            <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-wider text-right">
                                {user?.role ? user.role[0] : "GUEST"}
                            </p>
                        </div>
                        
                        <div className="w-10 h-10 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-gray-400 overflow-hidden shadow-sm group-hover:border-brand-primary/50 transition-colors">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <FaUserCircle className="text-2xl group-hover:text-white transition-colors" />
                            )}
                        </div>
                    </Link>

                    {/* --- NEW ADDITION: DESKTOP LOGOUT BUTTON --- */}
                    {/* Only visible on Large screens (Desktop/Laptop) */}
                    <button 
                        onClick={handleLogout}
                        title="Logout"
                        className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-all"
                    >
                        <FaSignOutAlt />
                    </button>

                    {/* Mobile Menu Button (Hamburger) */}
                    {/* CHANGED: 'md:hidden' -> 'lg:hidden' 
                        This means the hamburger appears on EVERYTHING smaller than 1024px */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-3 text-gray-400 hover:text-white bg-white/5 rounded-xl border border-white/5 transition-all"
                    >
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* --- MOBILE/TABLET MENU DROPDOWN --- */}
            {/* Only shows when isMobileMenuOpen is true AND screen is < 1024px */}
            {isMobileMenuOpen && (
                <div className="lg:hidden mt-4 pt-4 border-t border-white/5 flex flex-col gap-2 animate-fade-in-down">
                    
                    {/* Mobile User Profile Header */}
                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/profile" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 mb-2">
                        <div className="w-10 h-10 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-gray-400 overflow-hidden">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <FaUserCircle className="text-2xl" />
                            )}
                        </div>
                        <div>
                            <p className="text-white font-bold">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                    </Link>

                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/dashboard" className="p-3 rounded-lg bg-white/5 hover:bg-white/10 flex items-center gap-3 text-gray-300">
                        <FaCompass className="text-brand-primary" /> Discover
                    </Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/bookmarks" className="p-3 rounded-lg bg-white/5 hover:bg-white/10 flex items-center gap-3 text-gray-300">
                        <FaBookmark className="text-brand-secondary" /> Collections
                    </Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/submit" className="p-3 rounded-lg bg-white/5 hover:bg-white/10 flex items-center gap-3 text-gray-300">
                        <FaPlus className="text-green-400" /> Submit Tool
                    </Link>
                    
                    <div className="grid grid-cols-2 gap-2">
                        <Link onClick={() => setIsMobileMenuOpen(false)} to="/help" className="p-3 rounded-lg bg-white/5 hover:bg-white/10 flex items-center gap-3 text-gray-300 text-sm">
                            <FaBook /> Docs
                        </Link>
                        <Link onClick={() => setIsMobileMenuOpen(false)} to="/contact" className="p-3 rounded-lg bg-white/5 hover:bg-white/10 flex items-center gap-3 text-gray-300 text-sm">
                            <FaHeadset /> Support
                        </Link>
                    </div>

                    {isAdmin && (
                        <Link onClick={() => setIsMobileMenuOpen(false)} to="/admin" className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
                            <FaShieldAlt /> Admin Console
                        </Link>
                    )}
                    
                    <button onClick={handleLogout} className="mt-2 p-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center gap-2">
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            )}

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