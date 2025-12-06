import { useState, useEffect } from 'react';
import { FaFolderPlus, FaCheck, FaTimes, FaFolder } from 'react-icons/fa';
import { getCollections, createCollection, addToCollection, type Collection } from '../services/collection';

interface Props {
    websiteId: string;
    isOpen: boolean;
    onClose: () => void;
}

const AddToCollectionModal = ({ websiteId, isOpen, onClose }: Props) => {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [newFolderName, setNewFolderName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isOpen) fetchCollections();
    }, [isOpen]);

    const fetchCollections = async () => {
        try {
            const data = await getCollections();
            setCollections(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;
        setLoading(true);
        try {
            await createCollection(newFolderName);
            setNewFolderName('');
            fetchCollections(); // Refresh list
        } catch (error) {
            console.error("Failed to create folder");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToFolder = async (collectionId: string) => {
        setLoading(true);
        try {
            await addToCollection(collectionId, websiteId);
            setMessage("Saved!");
            setTimeout(() => {
                setMessage('');
                onClose();
            }, 1000);
        } catch (error) {
            console.error("Failed to save");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-brand-dark border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-fade-in-up">
                
                <button title='Close' onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <FaTimes />
                </button>

                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <FaFolderPlus className="text-brand-primary" /> Save to Collection
                </h2>

                {/* Create New Folder Input */}
                <div className="flex gap-2 mb-6">
                    <input 
                        type="text" 
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="New folder name..."
                        className="flex-grow bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-primary outline-none"
                    />
                    <button 
                        onClick={handleCreateFolder}
                        disabled={loading || !newFolderName}
                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                        Create
                    </button>
                </div>

                <div className="border-t border-white/10 pt-4 max-h-60 overflow-y-auto space-y-2">
                    {collections.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No folders yet.</p>
                    ) : (
                        collections.map((col) => (
                            <button
                                key={col._id}
                                onClick={() => handleAddToFolder(col._id)}
                                disabled={loading}
                                className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-brand-primary/20 hover:border-brand-primary/30 border border-transparent transition-all group text-left"
                            >
                                <span className="flex items-center gap-3 text-gray-300 group-hover:text-white">
                                    <FaFolder className="text-yellow-500/80" />
                                    {col.name}
                                </span>
                                <span className="text-xs text-gray-500">{col.websites.length} items</span>
                            </button>
                        ))
                    )}
                </div>

                {message && (
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                        <FaCheck /> {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddToCollectionModal;