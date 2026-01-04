import { FaGithub, FaTwitter, FaLinkedin, FaLayerGroup } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-brand-dark/50 backdrop-blur-lg mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20">
                <FaLayerGroup className="text-white text-sm" />
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                StackSift
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              The community-driven directory for the best developer tools and AI resources.
            </p>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-white font-bold mb-4">Discover</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/dashboard" className="hover:text-brand-primary transition-colors">Trending Tools</Link></li>
              <li><Link to="/submit" className="hover:text-brand-primary transition-colors">Submit a Tool</Link></li>
              <li><Link to="/bookmarks" className="hover:text-brand-primary transition-colors">Bookmarks</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="text-white font-bold mb-4">Other</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/help" className="hover:text-brand-primary transition-colors">Documentation</Link></li>
              <li><Link to="/profile" className="hover:text-brand-primary transition-colors">User Profile</Link></li>
              <li><Link to="/contact" className="hover:text-brand-primary transition-colors">Help</Link></li>
            </ul>
          </div>

          {/* Status Column */}
          <div>
            <h4 className="text-white font-bold mb-4">Status</h4>
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 p-3 rounded-lg border border-white/5">
                <div className="relative">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                </div>
                <span>All Systems Operational</span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
                v1.0.0 • React + TypeScript + Node
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} StackSift. Built for Developers & Designers.
            </p>
            
            <div className="flex items-center gap-6">
                <a href="#" className="text-gray-400 hover:text-white transition-transform hover:-translate-y-1" title='Github'><FaGithub size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-transform hover:-translate-y-1" title='Twitter'><FaTwitter size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-transform hover:-translate-y-1" title='LinkedIn'><FaLinkedin size={20} /></a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;