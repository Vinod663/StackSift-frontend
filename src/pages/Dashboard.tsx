import { useEffect, useState } from 'react';
import { FaSearch, FaSpinner, FaTimes } from 'react-icons/fa'; 
import { getWebsites, likeWebsite, approveWebsite, viewWebsite, searchWebsitesAI, type Website } from '../services/website';
import WebsiteCard from '../components/WebsiteCard';
import { getCollections } from '../services/collection'; 

const normalizeUrl = (url: string) => {
    return url
        .toLowerCase()
        .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "") 
        .replace(/\/$/, "")                   
        .trim();
};

const Dashboard = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  
  // Track saved IDs
  const [savedWebsiteIds, setSavedWebsiteIds] = useState<Set<string>>(new Set());
  
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false); 

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [slotsLeft, setSlotsLeft] = useState(0);

  //  Fetch Data Function
  const fetchData = async () => {
    setLoading(true);
    setAiLoading(false);
    
    try {
      // --- A. Parallel Fetch: Get Websites AND User Collections ---
      const [websiteData, collectionData] = await Promise.all([
          getWebsites(search, '', page, 9, 'true'),
          getCollections()
      ]);

      // --- B. Process Collections (Extract IDs) ---
      
      const allSavedIds = new Set(
        collectionData.flatMap(col => 
            col.websites.map(w => typeof w === 'string' ? w : w._id)
        )
      );
      setSavedWebsiteIds(allSavedIds);

      // --- C. Process Websites (Existing Logic) ---
      let mixedResults = websiteData.websites;
      setTotalPages(websiteData.totalPages || 1);

      // --- D. HYBRID SEARCH (Existing AI Logic) ---
      if (page === 1 && search.length > 2 && mixedResults.length < 9) {
        const needed = 9 - mixedResults.length;
        setSlotsLeft(needed);
        
        setWebsites(mixedResults);
        setAiLoading(true); 
        console.log(`Found ${mixedResults.length} DB items. Asking AI for ${needed} more...`);

        const aiData = await searchWebsitesAI(search);
        
        const aiWebsites = aiData.map((site: any, index: number) => ({
            ...site,
            _id: `ai-${index}`, 
            approved: false,
            upvotes: [],
            views: 0,
            addedBy: 'AI_BOT'
        }));
        
        const uniqueAiSites = aiWebsites.filter((aiSite: any) => {
            const aiUrl = normalizeUrl(aiSite.url);
            const existsInDb = mixedResults.some(dbSite => {
                const dbUrl = normalizeUrl(dbSite.url);
                const titleMatch = dbSite.title.toLowerCase() === aiSite.title.toLowerCase();
                return dbUrl === aiUrl || titleMatch;
            });
            return !existsInDb; 
        });

        const limitedAiSites = uniqueAiSites.slice(0, needed);
        mixedResults = [...mixedResults, ...limitedAiSites];
        setAiLoading(false);
      }

      setWebsites(mixedResults);

    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  //  Refresh only bookmarks (Lightweight fetch)
  const refreshBookmarks = async () => {
      try {
          const cols = await getCollections();
          const allSavedIds = new Set(
            cols.flatMap(col => col.websites.map(w => typeof w === 'string' ? w : w._id))
          );
          setSavedWebsiteIds(allSavedIds);
      } catch (error) {
          console.error("Silent bookmark refresh failed", error);
      }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, page]); 

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setPage(1); 
  };

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

  const handleApprove = async (id: string) => {
    try {
        await approveWebsite(id);
        alert("Website Approved!");
        fetchData(); 
    } catch (error) {
        alert("Approval failed");
    }
  };

  const quickSearches = [
    "AI writer", "background remover", "video editor", 
    "code assistant", "chatbot", "image generator"
  ];

  const handleQuickSearch = (term: string) => {
    setSearch(term);
    setPage(1); 
  };


  const handleClearSearch = () => {
      setSearch(''); // Clear text
      setPage(1);    // Reset to page 1
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
                // Changed 'pr-4' to 'pr-10' so text doesn't overlap the X icon
                className="w-full bg-brand-dark/50 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary transition-colors"
            />

            {/* Conditionally render the Clear Icon if search has text */}
            {search && (
                <button 
                    title='clear'
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
                >
                    <FaTimes />
                </button>
            )}
        </div>
      </div>
        
      {/* Quick Suggestion Tags */}
      <div className="flex flex-wrap gap-2">
            {quickSearches.map((term) => (
                <button
                    key={term}
                    onClick={() => handleQuickSearch(term)}
                    className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md bg-white/5 text-gray-400 hover:bg-brand-primary/20 hover:text-brand-primary transition-all border border-white/5"
                >
                    {term}
                </button>
            ))}
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
                isAi={site.addedBy === 'AI_BOT'}

                // 5. PASS NEW PROPS
                isBookmarked={savedWebsiteIds.has(site._id)}
                onBookmarkChange={refreshBookmarks}
            />
        ))}

        {/* AI Loading Skeleton */}
        {aiLoading && (
            <>
                <div className="h-[22rem] rounded-2xl bg-white/5 animate-pulse border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <span className="text-brand-primary font-bold">AI Agent Working...</span>
                    <span className="text-gray-500 text-sm mt-2">Finding relevant tools for "{search}"</span>
                </div>

                {slotsLeft > 1 && Array.from({ length: slotsLeft - 1 }).map((_, index) => (
                    <div 
                        key={`ai-skeleton-${index}`} 
                        className="h-[22rem] rounded-2xl bg-white/5 animate-pulse border border-white/5"
                    />
                ))}
            </>
        )}
      </div>

      {/* Empty State */}
      {!loading && !aiLoading && websites.length === 0 && (
         <div className="text-center py-20">
            <p className="text-gray-400 mb-2">No tools found matching "{search}"</p>
         </div>
      )}

      {/* Loading State for Main Fetch */}
      {loading && !aiLoading && (
           <div className="flex justify-center py-20">
               <FaSpinner className="animate-spin text-3xl text-brand-primary" />
           </div>
      )}

      {/* PAGINATION BUTTONS */}
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