import { useEffect, useState } from 'react';
import { getCollections, deleteCollection, removeFromCollection, type Collection } from '../services/collection';
import WebsiteCard from '../components/WebsiteCard'; 
import { FaFolder, FaTrash, FaFolderOpen, FaArrowLeft } from 'react-icons/fa';

const Bookmarks = () => {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<Collection | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getCollections();
            setCollections(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFolder = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent opening the folder
        if(confirm("Delete this folder?")) {
            await deleteCollection(id);
            loadData();
            if(selectedFolder?._id === id) setSelectedFolder(null);
        }
    };

    const handleRemoveItem = async (websiteId: string) => {
        if (!selectedFolder) return;
        await removeFromCollection(selectedFolder._id, websiteId);
        // Refresh local state without API call for speed
        const updated = {
            ...selectedFolder,
            websites: selectedFolder.websites.filter(w => w._id !== websiteId)
        };
        setSelectedFolder(updated);
        // Update main list in background
        loadData();
    };

    if (loading) return <div className="text-center text-white p-10">Loading Collections...</div>;

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold text-white mb-8">My Collections</h1>

            {/* View 1: List of Folders */}
            {!selectedFolder && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map(col => (
                        <div 
                            key={col._id} 
                            onClick={() => setSelectedFolder(col)}
                            className="bg-white/5 border border-white/10 hover:border-brand-primary/50 p-6 rounded-2xl cursor-pointer transition-all hover:bg-white/10 group relative"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center">
                                    <FaFolder className="text-2xl text-brand-primary group-hover:scale-110 transition-transform" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">{col.name}</h3>
                                    <p className="text-gray-500 text-sm">{col.websites.length} items</p>
                                </div>
                            </div>

                            <button 
                                onClick={(e) => handleDeleteFolder(e, col._id)}
                                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                                title="Delete Folder"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}

                    {/* Empty State */}
                    {collections.length === 0 && (
                        <div className="col-span-full text-center py-10 border border-dashed border-white/10 rounded-2xl text-gray-500">
                            Go to Dashboard and click the Bookmark icon on any tool to create your first collection!
                        </div>
                    )}
                </div>
            )}

            {/* Inside a Folder */}
            {selectedFolder && (
                <div>
                    <button 
                        onClick={() => setSelectedFolder(null)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                    >
                        <FaArrowLeft /> Back to Folders
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                        <FaFolderOpen className="text-2xl text-brand-primary" />
                        <h2 className="text-2xl font-bold text-white">{selectedFolder.name}</h2>
                        <span className="text-gray-500 text-sm">({selectedFolder.websites.length})</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {selectedFolder.websites.map((website) => (
                            <div key={website._id} className="relative group">
                                {/* Reuse your existing Card, but disable Like/Bookmark inside here if needed */}
                                <WebsiteCard 
                                    data={website} 
                                    onLike={() => {}} // Optional: handle likes inside folders
                                    onView={() => {}} 
                                    onApprove={() => {}} 
                                />
                                {/* Remove Button Overlay */}
                                <button 
                                    onClick={() => handleRemoveItem(website._id)}
                                    className="absolute top-2 right-2 bg-red-500/90 text-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
                                    title="Remove from folder"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    {selectedFolder.websites.length === 0 && (
                        <p className="text-gray-500 italic">This folder is empty.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Bookmarks;