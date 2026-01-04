import { useEffect, useState } from 'react';
import { getWebsites, approveWebsite, deleteWebsite, updateWebsiteDetails,type Website } from '../services/website';
import WebsiteCard from '../components/WebsiteCard';
import EditModal from '../components/EditModel';
import { FaShieldAlt, FaSearch } from 'react-icons/fa'; 

const AdminDashboard = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'pending' | 'all'>('pending');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Edit State
  const [editingSite, setEditingSite] = useState<Website | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const approvedParam = filterMode === 'pending' ? 'false' : undefined;
      
      const data = await getWebsites(search, '', page, 9, approvedParam); 
      
      setWebsites(data.websites);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Admin Fetch Error", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when Page, Filter, OR Search changes
  useEffect(() => {
    const timer = setTimeout(() => {
        fetchAdminData();
    }, 500);
    return () => clearTimeout(timer);
  }, [page, filterMode, search]);

  // --- ACTIONS ---
  const handleApprove = async (id: string) => {
    if(!window.confirm("Approve this website?")) return;
    try {
        await approveWebsite(id);
        if (filterMode === 'pending') {
            setWebsites(prev => prev.filter(w => w._id !== id));
        } else {
            fetchAdminData();
        }
    } catch (error) {
        alert("Failed to approve");
    }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm("Are you sure you want to DELETE this?")) return;
    try {
        await deleteWebsite(id);
        setWebsites(prev => prev.filter(w => w._id !== id));
    } catch (error) {
        alert("Failed to delete");
    }
  };

  const handleUpdate = async (id: string, updatedData: Partial<Website>) => {
    try {
        await updateWebsiteDetails(id, updatedData);
        alert("Website updated!");
        setEditingSite(null);
        fetchAdminData();
    } catch (error) {
        alert("Update failed");
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6 border-b border-white/10 pb-6">
        
        {/* Title */}
        <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-primary/20 rounded-xl text-brand-primary">
                <FaShieldAlt className="text-2xl" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-white">Admin Console</h1>
                <p className="text-gray-400">Manage platform content.</p>
            </div>
        </div>

        {/* Controls: Search + Tabs */}
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            
            {/*Admin Search Bar */}
            <div className="relative flex-grow sm:w-64">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                    type="text" 
                    placeholder="Search submissions..." 
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="w-full bg-brand-dark border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:border-brand-primary outline-none transition-all"
                />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-white/5 p-1 rounded-lg">
                <button 
                    onClick={() => { setFilterMode('pending'); setPage(1); }}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-bold transition-all ${filterMode === 'pending' ? 'bg-brand-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    Pending
                </button>
                <button 
                    onClick={() => { setFilterMode('all'); setPage(1); }}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-bold transition-all ${filterMode === 'all' ? 'bg-brand-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    All
                </button>
            </div>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading...</div>
      ) : (
        <>
            {websites.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-gray-300 font-bold text-lg">No records found</p>
                    <p className="text-gray-500">
                        {search ? `No results for "${search}"` : (filterMode === 'pending' ? "No pending reviews." : "Database is empty.")}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {websites.map((site) => (
                        <WebsiteCard 
                            key={site._id} 
                            data={site} 
                            onLike={() => {}} 
                            onView={() => {}} 
                            onApprove={handleApprove}
                            onDelete={handleDelete}
                            onEdit={() => setEditingSite(site)} 
                        />
                    ))}
                </div>
            )}
        </>
      )}

      {/* Pagination */}
      {!loading && websites.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-lg disabled:opacity-50">Previous</button>
            <span className="text-gray-400 text-sm">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-lg disabled:opacity-50">Next</button>
          </div>
      )}

      {/* Edit Modal */}
      {editingSite && (
        <EditModal 
            site={editingSite} 
            onClose={() => setEditingSite(null)} 
            onSave={handleUpdate} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;