import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { getWebsites, likeWebsite, approveWebsite, type Website, searchWebsitesAI } from '../services/website';
import WebsiteCard from '../components/WebsiteCard';

const Dashboard = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAiResult, setIsAiResult] = useState(false);


  // 1. Fetch Data Function
  const fetchData = async () => {
    setLoading(true);
    setIsAiResult(false); // Reset AI flag on new search
    
    try {
      // 1. Try Database Search first
      const data = await getWebsites(search);
      
      if (data.websites.length > 0) {
        setWebsites(data.websites);
      } else if (search.length > 3) {
        // 2. If DB empty & search is long enough -> Ask AI!
        console.log("Database empty, asking AI...");
        const aiData = await searchWebsitesAI(search);
        
        // Add a fake _id so React keys work
        const aiWebsites = aiData.map((site: any, index: number) => ({
            ...site,
            _id: `ai-${index}`,
            approved: false,
            upvotes: 0,
            views: 0,
            addedBy: 'AI_BOT'
        }));
        
        setWebsites(aiWebsites);
        setIsAiResult(true); // Flag this so we can show a special UI
      } else {
        setWebsites([]);
      }

    } catch (error) {
      console.error("Failed to fetch websites", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch on Mount & When Search Changes
  useEffect(() => {
    // Debounce search (wait 500ms after typing stops)
    const timer = setTimeout(() => {
        fetchData();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);


  // 3. Handle Like Action
  const handleLike = async (id: string) => {
    try {
        // Optimistic UI Update (Update screen before server replies)
        setWebsites(prev => prev.map(site => 
            site._id === id ? { ...site, upvotes: site.upvotes + 1 } : site
        ));
        await likeWebsite(id);
    } catch (error) {
        console.error("Like failed", error);
    }
  };

  // 4. Handle Approve Action (Admin)
  const handleApprove = async (id: string) => {
    try {
        await approveWebsite(id);
        alert("Website Approved!");
        fetchData(); // Refresh list
    } catch (error) {
        alert("Approval failed (Check console)");
        console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      
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
                placeholder="Search tools, tags, categories..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-brand-dark/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary transition-colors"
            />
        </div>
      </div>
      {/* AI Result Notice */}
      {isAiResult && (
      <div className="bg-brand-primary/10 border border-brand-primary/30 text-brand-primary px-4 py-2 rounded-lg mb-6 flex items-center gap-2">
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
                    {/* Placeholder for AI Search Fallback later */}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {websites.map((site) => (
                        <WebsiteCard 
                            key={site._id} 
                            data={site} 
                            onLike={handleLike}
                            onApprove={handleApprove}
                        />
                    ))}
                </div>
            )}
        </>
      )}
    </div>
  );
};

export default Dashboard;