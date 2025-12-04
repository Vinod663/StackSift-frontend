import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { getWebsites, likeWebsite, approveWebsite, viewWebsite, searchWebsitesAI, type Website } from '../services/website';
import WebsiteCard from '../components/WebsiteCard';

const Dashboard = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false); // Track AI loading separately

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [slotsLeft, setSlotsLeft] = useState(0);

  // 1. Fetch Data Function (The Brain)
  const fetchData = async () => {
    setLoading(true);
    setAiLoading(false);
    
    try {
      // A. Fetch DB Data (Limit 9 per page)
      const data = await getWebsites(search, '', page, 9);
      let mixedResults = data.websites;
      
      // Update pagination info from backend
      setTotalPages(data.totalPages || 1);

      // B. HYBRID SEARCH LOGIC:
      // Only ask AI if we are on Page 1, have a search term, and results are scarce (< 9)
      if (page === 1 && search.length > 2 && mixedResults.length < 9) {

        // Calculate how many AI cards we need to fill the row to 9
        const needed = 9 - mixedResults.length;
        setSlotsLeft(needed);
        
        // Show what we have immediately, but show AI loader
        setWebsites(mixedResults);
        setAiLoading(true); 
        console.log(`Found ${mixedResults.length} DB items. Asking AI for ${needed} more...`);

        // Fetch AI Data
        const aiData = await searchWebsitesAI(search);
        
        // Add fake IDs and flags for AI cards
        const aiWebsites = aiData.map((site: any, index: number) => ({
            ...site,
            _id: `ai-${index}`, // Fake ID
            approved: false,
            upvotes: [], // Empty array for likes
            views: 0,
            addedBy: 'AI_BOT'
        }));

        // Filter Duplicates (Don't show duplicates if DB already has them)
        const uniqueAiSites = aiWebsites.filter((aiSite: any) => 
            !mixedResults.some(dbSite => dbSite.url === aiSite.url)
        );

        //show always only 9 results
        const limitedAiSites = uniqueAiSites.slice(0, needed);

        // Merge! (Append AI results to DB results)
        mixedResults = [...mixedResults, ...limitedAiSites];
        setAiLoading(false);
      }

      setWebsites(mixedResults);

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
  }, [search, page]); 

  // Reset page to 1 if user types a new search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setPage(1); 
  };

  // 3. Handle Like Action (Optimistic Update)
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

  // 4. Handle View Action (Update locally)
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

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Render Cards */}
        {websites.map((site) => (
            <WebsiteCard 
                key={site._id} 
                data={site} 
                onLike={handleLike}
                onApprove={handleApprove}
                onView={handleView}
                isAi={site.addedBy === 'AI_BOT'} // Check if source is AI
            />
        ))}

        {/* AI Loading Skeleton (Shows while fetching extra AI cards) */}
        {aiLoading && (
            <>
                {/* A. The "Thinking" Card (Always takes 1st slot) */}
                <div className="h-[22rem] rounded-2xl bg-white/5 animate-pulse border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <span className="text-brand-primary font-bold">AI Agent Working...</span>
                    <span className="text-gray-500 text-sm mt-2">Finding relevant tools for "{search}"</span>
                </div>

                {/* B. The Empty Skeletons (Fills remaining slots) */}
                {/* If slotsLeft is 4, we need 3 more empty skeletons (4 - 1 = 3) */}
                {slotsLeft > 1 && Array.from({ length: slotsLeft - 1 }).map((_, index) => (
                    <div 
                        key={`ai-skeleton-${index}`} 
                        className="h-[22rem] rounded-2xl bg-white/5 animate-pulse border border-white/5"
                    />
                ))}
            </>
        )}
      </div>

      {/* Empty State (Only if BOTH DB and AI failed) */}
      {!loading && !aiLoading && websites.length === 0 && (
         <div className="text-center py-20">
            <p className="text-gray-400 mb-2">No tools found matching "{search}"</p>
         </div>
      )}

      {/* --- PAGINATION BUTTONS --- */}
      {/* Only show pagination if we have results and not loading */}
      {!loading && !aiLoading && websites.length > 0 && (
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