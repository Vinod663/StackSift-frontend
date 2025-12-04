import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { getWebsites, likeWebsite, approveWebsite, viewWebsite, searchWebsitesAI, type Website } from '../services/website';
import WebsiteCard from '../components/WebsiteCard';

const Dashboard = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAiResult, setIsAiResult] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 1. Fetch Data Function
  const fetchData = async () => {
    setLoading(true);
    setIsAiResult(false); // Reset AI flag
    
    try {
      // Pass page number to the API
      const data = await getWebsites(search, '', page, 9);
      
      if (data.websites.length > 0) {
        setWebsites(data.websites);
        setTotalPages(data.totalPages || 1);
      } else if (search.length > 3 && page === 1) {
        // Only ask AI if we are on Page 1 and database is empty
        console.log("Database empty, asking AI...");
        const aiData = await searchWebsitesAI(search);
        
        // Add fake IDs for React keys
        const aiWebsites = aiData.map((site: any, index: number) => ({
            ...site,
            _id: `ai-${index}`,
            approved: false,
            upvotes: [],
            views: 0,
            addedBy: 'AI_BOT'
        }));
        
        setWebsites(aiWebsites);
        setTotalPages(1); // AI results are always 1 page
        setIsAiResult(true); 
      } else {
        setWebsites([]);
        setTotalPages(1);
      }

    } catch (error) {
      console.error("Failed to fetch websites", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Trigger fetch when Search OR Page changes
  useEffect(() => {
    const timer = setTimeout(() => {
        fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, page]); // Dependency array includes 'page'

  // Reset page to 1 if user types a new search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setPage(1); 
  };

  // 3. Handle Like Action
  const handleLike = async (id: string) => {
    try {
        const response = await likeWebsite(id);
        setWebsites(prev => prev.map(site => 
            site._id === id ? response.data : site
        ));
    } catch (error) {
        console.error("Like failed", error);
    }
  };

  // 4. Handle View Action
  const handleView = async (id: string) => {
    try {
        const response = await viewWebsite(id);
        setWebsites(prev => prev.map(site => 
            site._id === id ? response.data : site
        ));
    } catch (error) {
        console.error("View count failed", error);
    }
  };

  // 5. Handle Approve Action (Admin)
  const handleApprove = async (id: string) => {
    try {
        await approveWebsite(id);
        alert("Website Approved!");
        fetchData(); 
    } catch (error) {
        alert("Approval failed");
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Discover Tools</h1>
            <p className="text-gray-400">Find the best AI & Dev tools curated by the community.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
                type="text" 
                placeholder="Search tools..." 
                value={search}
                onChange={handleSearchChange}
                className="w-full bg-brand-dark/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary transition-colors"
            />
        </div>
      </div>

      {/* AI Result Notice */}
      {isAiResult && (
        <div className="bg-brand-primary/10 border border-brand-primary/30 text-brand-primary px-4 py-2 rounded-lg flex items-center gap-2">
            <span>✨ No local results found. Here are some <b>AI Suggestions</b> for you:</span>
        </div>
      )}

      {/* Grid Content */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading tools...</div>
      ) : (
        <>
            {websites.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-400 mb-2">No tools found matching "{search}"</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {websites.map((site) => (
                        <WebsiteCard 
                            key={site._id} 
                            data={site} 
                            onLike={handleLike}
                            onApprove={handleApprove}
                            onView={handleView}
                            isAi={isAiResult}
                        />
                    ))}
                </div>
            )}
        </>
      )}

      {/* --- PAGINATION BUTTONS --- */}
      {/* Only show if NOT loading, NOT AI results, and we have websites */}
      {!loading && !isAiResult && websites.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-primary/20 transition-colors"
            >
                Previous
            </button>
            
            <span className="text-gray-400 text-sm">
                Page {page} of {totalPages}
            </span>

            <button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-primary/20 transition-colors"
            >
                Next
            </button>
          </div>
      )}
    </div>
  );
};

export default Dashboard;