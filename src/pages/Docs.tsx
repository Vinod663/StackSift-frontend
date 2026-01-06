import { useState } from 'react';
import { FaSearch, FaBook, FaBars, FaTimes, FaChevronRight, FaLightbulb, FaShieldAlt, FaDatabase, FaServer, FaReact, FaFolderOpen, FaGoogle, FaUserCircle, FaEnvelope } from 'react-icons/fa';

const Docs = () => {
  const [activeSection, setActiveSection] = useState('intro');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const docSections = [
    {
      title: 'Getting Started',
      items: [
        { id: 'intro', label: 'Introduction' },
        { id: 'tech-stack', label: 'Tech Stack' },
        { id: 'installation', label: 'Installation' },
        { id: 'configuration', label: 'Configuration' },
      ]
    },
    {
      title: 'Core Features',
      items: [
        { id: 'auth-system', label: 'Authentication' },
        { id: 'user-system', label: 'User & Profile' },
        { id: 'ai-engine', label: 'AI Engine (Gemini)' },
        { id: 'collections-feature', label: 'Collections System' },
      ]
    },
    {
      title: 'API Reference',
      items: [
        { id: 'api-overview', label: 'Overview' },
        { id: 'api-auth', label: 'Auth Endpoints' },
        { id: 'api-user', label: 'User Endpoints' },
        { id: 'api-tools', label: 'Tools Endpoints' },
        { id: 'api-collections', label: 'Collections Endpoints' },
        { id: 'api-other', label: 'Support & Utils' },
      ]
    }
  ];

  const filteredSections = docSections.map((section) => {
    const titleMatch = section.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchingItems = section.items.filter((item) => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return {
        ...section,
        items: titleMatch ? section.items : matchingItems
    };
  }).filter(section => section.items.length > 0);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setIsSidebarOpen(false); 
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Reusable API Endpoint Component
  const ApiEndpoint = ({ method, path, desc, params }: { method: string, path: string, desc: string, params?: string }) => {
      const colors: any = { GET: 'text-blue-400 bg-blue-500/10 border-blue-500/20', POST: 'text-green-400 bg-green-500/10 border-green-500/20', PUT: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', DELETE: 'text-red-400 bg-red-500/10 border-red-500/20' };
      return (
        <div className="border border-white/10 rounded-xl overflow-hidden mb-4">
            <div className="bg-white/5 p-3 border-b border-white/10 flex items-center gap-3 font-mono text-sm">
                <span className={`px-2 py-1 rounded border font-bold text-xs ${colors[method]}`}>{method}</span>
                <span className="text-gray-300">{path}</span>
            </div>
            <div className="p-4 bg-brand-dark/50">
                <p className="text-sm text-gray-400 mb-2">{desc}</p>
                {params && <div className="text-xs text-gray-500 font-mono mt-2 pt-2 border-t border-white/5">{params}</div>}
            </div>
        </div>
      );
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden animate-fade-in-up bg-brand-dark">
      
      {/* MOBILE HEADER */}
      <div className="lg:hidden p-4 border-b border-white/5 flex items-center justify-between bg-brand-dark/95 backdrop-blur-md z-40">
        <span className="font-bold text-gray-200 flex items-center gap-2">
            <FaBook className="text-brand-primary" /> Docs
        </span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400">
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-brand-dark border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block
        ${isSidebarOpen ? 'translate-x-0 pt-20 lg:pt-0' : '-translate-x-full'}
      `}>
        <div className="h-full overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
            <div className="relative mb-8 group">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search docs..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/20 transition-all"
                />
            </div>

            <div className="space-y-8">
                {filteredSections.length === 0 ? (
                    <div className="text-gray-500 text-sm text-center italic">No results found.</div>
                ) : (
                    filteredSections.map((section) => (
                        <div key={section.title}>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pl-3">
                                {section.title}
                            </h4>
                            <ul className="space-y-1">
                                {section.items.map((item) => (
                                    <li key={item.id}>
                                        <button
                                            onClick={() => scrollToSection(item.id)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between group ${
                                                activeSection === item.id 
                                                ? 'bg-brand-primary/10 text-brand-primary border-l-2 border-brand-primary' 
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            {item.label}
                                            {activeSection === item.id && <FaChevronRight className="text-[10px]" />}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-12 scrollbar-hide relative selection:bg-brand-primary/30">
        <div className="max-w-4xl mx-auto space-y-20 pb-32">

            {/* INTRO */}
            <section id="intro" className="scroll-mt-32 space-y-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
                        StackSift Documentation
                    </h1>
                    <p className="text-xl text-brand-primary font-medium">The Intelligent Developer Directory</p>
                </div>
                <p className="text-lg text-gray-400 leading-relaxed border-l-4 border-brand-primary/30 pl-6">
                    StackSift is more than just a list of links. It is an AI-powered platform that analyzes, categorizes, and curates developer tools automatically. Built for engineers who are tired of bookmark chaos.
                </p>
            </section>

            {/* TECH STACK */}
            <section id="tech-stack" className="scroll-mt-32 space-y-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="text-brand-primary">01.</span> Tech Stack
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { icon: FaReact, color: "text-blue-400", title: "Frontend", desc: "React + Vite + Tailwind" },
                        { icon: FaServer, color: "text-green-400", title: "Backend", desc: "Node.js + Express" },
                        { icon: FaDatabase, color: "text-green-500", title: "Database", desc: "MongoDB Atlas" },
                        { icon: FaLightbulb, color: "text-yellow-400", title: "AI Model", desc: "Gemini-2.5-Flash" },
                    ].map((tech, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 p-5 rounded-2xl hover:border-brand-primary/20 transition-colors group">
                            <tech.icon className={`text-3xl mb-3 ${tech.color} group-hover:scale-110 transition-transform`} />
                            <h3 className="font-bold text-white">{tech.title}</h3>
                            <p className="text-xs text-gray-500">{tech.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* INSTALLATION */}
            <section id="installation" className="scroll-mt-32 space-y-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="text-brand-primary">02.</span> Installation
                </h2>
                
                <div className="space-y-4">
                    <h3 className="text-white font-bold">1. Clone & Install</h3>
                    <div className="bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden font-mono text-sm shadow-2xl">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/5">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                            </div>
                            <span className="ml-2 text-xs text-gray-500">bash</span>
                        </div>
                        <div className="p-5 text-gray-300 space-y-2">
                            <p className="flex gap-2"><span className="text-brand-primary">$</span> <span>git clone https://github.com/vinod/stacksift.git</span></p>
                            <p className="flex gap-2"><span className="text-brand-primary">$</span> <span>cd stacksift</span></p>
                            <p className="text-gray-500 text-xs py-1"># Install Backend Dependencies</p>
                            <p className="flex gap-2"><span className="text-brand-primary">$</span> <span>cd server && npm install</span></p>
                            <p className="text-gray-500 text-xs py-1"># Install Frontend Dependencies</p>
                            <p className="flex gap-2"><span className="text-brand-primary">$</span> <span>cd ../client && npm install</span></p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONFIGURATION */}
            <section id="configuration" className="scroll-mt-32 space-y-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="text-brand-primary">03.</span> Configuration
                </h2>
                <p className="text-gray-400">Create a <code className="text-brand-primary bg-brand-primary/10 px-1 rounded">.env</code> file in your backend and frontend roots.</p>
                
                {/* BACKEND CONFIG */}
                <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-300 mb-2">Backend (.env)</h4>
                    <div className="bg-[#0d1117] border border-white/10 rounded-xl p-5 font-mono text-sm text-gray-300">
                        <p className="text-gray-500 text-xs py-1"># Core Config</p>
                        <p><span className="text-purple-400">PORT</span>=4000</p>
                        <p><span className="text-purple-400">MONGO_URI</span>=mongodb+srv://...</p>
                        <br/>
                        <p className="text-gray-500 text-xs py-1"># Auth & Security</p>
                        <p><span className="text-purple-400">JWT_SECRET</span>=your_jwt_secret</p>
                        <p><span className="text-purple-400">REFRESH_TOKEN_SECRET</span>=your_refresh_secret</p>
                        <p><span className="text-purple-400">GOOGLE_CLIENT_ID</span>=your_google_id</p>
                        <br/>
                        <p className="text-gray-500 text-xs py-1"># AI & Cloud Services</p>
                        <p><span className="text-purple-400">GEMINI_API_KEY</span>=AIzaSy_YOUR_API_KEY</p>
                        <p><span className="text-purple-400">CLOUDINARY_CLOUD_NAME</span>=your_cloud_name</p>
                        <br/>
                        <p className="text-gray-500 text-xs py-1"># Email Service (Resend)</p>
                        <p><span className="text-purple-400">RESEND_API_KEY</span>=re_123456789...</p>
                    </div>
                </div>

                {/* FRONTEND CONFIG */}
                <div>
                    <h4 className="text-sm font-bold text-gray-300 mb-2">Frontend (.env)</h4>
                    <div className="bg-[#0d1117] border border-white/10 rounded-xl p-5 font-mono text-sm text-gray-300">
                        <p className="text-gray-500 text-xs py-1"># API Connection (Local or Render URL)</p>
                        <p><span className="text-purple-400">VITE_API_BASE_URL</span>=https://stacksift-api.onrender.com/api/v1</p>
                        <br/>
                        <p className="text-gray-500 text-xs py-1"># Google Auth</p>
                        <p><span className="text-purple-400">VITE_GOOGLE_CLIENT_ID</span>=your_google_id</p>
                    </div>
                </div>
            </section>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* AUTHENTICATION */}
            <section id="auth-system" className="scroll-mt-32 space-y-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="text-brand-primary">04.</span> Security & Auth
                </h2>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <ul className="space-y-6">
                        <li className="flex gap-4">
                            <div className="bg-green-500/10 p-2 h-fit rounded-lg"><FaShieldAlt className="text-green-400" /></div>
                            <div>
                                <h4 className="font-bold text-white">JWT Access Tokens</h4>
                                <p className="text-sm text-gray-400 mt-1">Short-lived (15m) tokens used for API authorization. Stored in memory for security.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="bg-blue-500/10 p-2 h-fit rounded-lg"><FaShieldAlt className="text-blue-400" /></div>
                            <div>
                                <h4 className="font-bold text-white">Refresh Rotation</h4>
                                <p className="text-sm text-gray-400 mt-1">Long-lived (7d) tokens stored in HTTP-Only cookies. Automatically rotates access tokens via Axios Interceptors.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="bg-red-500/10 p-2 h-fit rounded-lg"><FaGoogle className="text-red-400" /></div>
                            <div>
                                <h4 className="font-bold text-white">Google OAuth</h4>
                                <p className="text-sm text-gray-400 mt-1">Seamless one-click authentication via Google Identity Services. Supports automatic account linking for existing users.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>

            {/* USER SYSTEM */}
            <section id="user-system" className="scroll-mt-32 space-y-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="text-brand-primary">05.</span> User & Profile
                </h2>
                <p className="text-gray-400">
                    A comprehensive profile system allowing users to manage their identity and preferences.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <FaUserCircle className="text-3xl text-purple-400 mb-3" />
                        <h4 className="font-bold text-white mb-2">Cloudinary Integration</h4>
                        <p className="text-sm text-gray-400">Profile pictures are optimized and hosted via Cloudinary. Supports uploading local files which are automatically processed and stored as secure URLs.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <FaLightbulb className="text-3xl text-yellow-400 mb-3" />
                        <h4 className="font-bold text-white mb-2">Creative Customization</h4>
                        <p className="text-sm text-gray-400">Users can personalize their profile with custom cover banners (using CSS gradients/patterns) and view real-time stats of their contributions.</p>
                    </div>
                </div>
            </section>

            {/* AI ENGINE */}
            <section id="ai-engine" className="scroll-mt-32 space-y-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="text-brand-primary">06.</span> AI Engine
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-white/10 rounded-xl p-5 bg-gradient-to-b from-white/5 to-transparent">
                        <h3 className="font-bold text-white mb-2">1. Auto-Submission Analysis</h3>
                        <p className="text-sm text-gray-400 mb-4">When a user submits a URL, Gemini visits the site (virtually), reads meta tags, and generates summaries and tags automatically.</p>
                    </div>
                    <div className="border border-white/10 rounded-xl p-5 bg-gradient-to-b from-white/5 to-transparent">
                        <h3 className="font-bold text-white mb-2">2. Hybrid Search</h3>
                        <p className="text-sm text-gray-400 mb-4">If DB results are low, the system asks AI to "hallucinate" relevant tools, checks if they exist, and merges them into results.</p>
                    </div>
                </div>
            </section>

            {/* COLLECTIONS SYSTEM */}
            <section id="collections-feature" className="scroll-mt-32 space-y-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="text-brand-primary">07.</span> Collections System
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4">
                    <div className="min-w-[250px] bg-white/5 border border-white/10 rounded-xl p-4">
                        <FaFolderOpen className="text-3xl text-yellow-500 mb-3" />
                        <h4 className="font-bold text-white">Custom Folders</h4>
                        <p className="text-xs text-gray-400 mt-1">Users can create unlimited folders to organize their stack.</p>
                    </div>
                    <div className="min-w-[250px] bg-white/5 border border-white/10 rounded-xl p-4">
                        <FaDatabase className="text-3xl text-blue-500 mb-3" />
                        <h4 className="font-bold text-white">Relational Data</h4>
                        <p className="text-xs text-gray-400 mt-1">Collections are stored as references to Tool IDs for consistency.</p>
                    </div>
                </div>
            </section>

            {/* API REFERENCE */}
            <section id="api-ref" className="scroll-mt-32 space-y-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="text-brand-primary">08.</span> API Reference
                </h2>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <p className="text-gray-400 text-sm mb-6">Base URL: <code className="bg-black/30 px-2 py-1 rounded text-white">https://stacksift-api.onrender.com/api/v1</code></p>
                    
                    {/* OVERVIEW */}
                    <div id="api-overview" className="mb-8">
                        <h3 className="text-lg font-bold text-white mb-4 border-l-4 border-brand-primary pl-3">Overview</h3>
                        <p className="text-sm text-gray-400">Authentication is handled via Bearer tokens. All endpoints expect JSON bodies unless specified (e.g., Multipart for images).</p>
                    </div>

                    {/* AUTH ENDPOINTS */}
                    <div id="api-auth" className="mb-8">
                        <h3 className="text-lg font-bold text-white mb-4 border-l-4 border-green-500 pl-3">Authentication</h3>
                        <ApiEndpoint method="POST" path="/auth/register" desc="Create a new user account." params="Body: { name, email, password }" />
                        <ApiEndpoint method="POST" path="/auth/login" desc="Login and receive Access/Refresh tokens." params="Body: { email, password }" />
                        <ApiEndpoint method="POST" path="/auth/google" desc="Authenticate using Google ID Token." params="Body: { token: 'ey...' }" />
                        <ApiEndpoint method="POST" path="/auth/refresh-token" desc="Rotate expired access token using HttpOnly cookie." />
                        <ApiEndpoint method="POST" path="/auth/verify-password" desc="Security check (Sudo mode) for editing sensitive profile data." params="Body: { password }" />
                    </div>

                    {/* USER ENDPOINTS */}
                    <div id="api-user" className="mb-8">
                        <h3 className="text-lg font-bold text-white mb-4 border-l-4 border-purple-500 pl-3">User & Profile</h3>
                        <ApiEndpoint method="GET" path="/user/profile" desc="Get current user details." />
                        <ApiEndpoint method="PUT" path="/user/profile" desc="Update profile info (Name, Bio, Password, Cover)." params="Body: { name, bio, password?, coverGradient? }" />
                        <ApiEndpoint method="POST" path="/user/avatar" desc="Upload profile picture to Cloudinary." params="Body: FormData (key: 'avatar')" />
                        <ApiEndpoint method="GET" path="/user/stats" desc="Get user contribution counts." />
                    </div>

                    {/* TOOLS ENDPOINTS */}
                    <div id="api-tools" className="mb-8">
                        <h3 className="text-lg font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">Tools (Posts)</h3>
                        <ApiEndpoint method="GET" path="/post" desc="Fetch all tools with pagination and filtering." params="Query: ?page=1 &limit=10 &search=react" />
                        <ApiEndpoint method="POST" path="/post/addWebsite" desc="Submit a new tool. Triggers AI analysis." params="Body: { title, url, description?, category? }" />
                        <ApiEndpoint method="POST" path="/post/search-ai" desc="Trigger AI hybrid search agent." params="Body: { query: 'crop image' }" />
                        <ApiEndpoint method="PUT" path="/post/:id/like" desc="Toggle like status for a tool." />
                    </div>

                    {/* COLLECTIONS ENDPOINTS */}
                    <div id="api-collections" className="mb-8">
                        <h3 className="text-lg font-bold text-white mb-4 border-l-4 border-yellow-500 pl-3">Collections</h3>
                        <ApiEndpoint method="GET" path="/collections" desc="Get all user folders." />
                        <ApiEndpoint method="POST" path="/collections" desc="Create a new folder." params="Body: { name: 'My Stack' }" />
                        <ApiEndpoint method="PUT" path="/collections/:id/add" desc="Add a tool to a folder." params="Body: { websiteId: '123...' }" />
                        <ApiEndpoint method="DELETE" path="/collections/:id" desc="Delete a folder." />
                    </div>

                    {/* OTHER ENDPOINTS */}
                    <div id="api-other" className="mb-8">
                        <h3 className="text-lg font-bold text-white mb-4 border-l-4 border-gray-500 pl-3">Support</h3>
                        <ApiEndpoint method="POST" path="/contact" desc="Send a support email via Resend API (System)." params="Body: { name, email, subject, message }" />
                    </div>
                </div>
            </section>

        </div>
      </main>
    </div>
  );
};

export default Docs;