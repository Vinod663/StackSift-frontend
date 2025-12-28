import { FaExternalLinkAlt, FaHeart, FaCheckCircle, FaEye, FaTrash, FaEdit, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { type Website } from '../services/website';
import { useSelector } from 'react-redux';
import { type RootState } from '../redux/store';
import { useState } from 'react';
import AddToCollectionModal from './AddToCollectionModal';

interface CardProps {
  data: Website;
  onLike: (id: string) => void;
  onApprove: (id: string) => void;
  onView: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  
  isBookmarked?: boolean; // Checks if saved in ANY folder
  onBookmarkChange?: () => void; // To refresh the dashboard after saving
  isAi?: boolean;
}

const WebsiteCard = ({ data, onLike, onApprove, onView, onDelete, onEdit, isBookmarked, onBookmarkChange, isAi }: CardProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = Boolean(user?.role?.includes('ADMIN'));
  
  // Safe check for upvotes
  const likeCount = Array.isArray(data.upvotes) ? data.upvotes.length : (data.upvotes || 0);
  const uid = user?.id;
  const isLiked = Array.isArray(data.upvotes) && typeof uid === 'string' && data.upvotes.includes(uid);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper to close modal and tell parent to refresh icons
  const handleModalClose = () => {
    setIsModalOpen(false);
    if (onBookmarkChange) onBookmarkChange(); // Trigger refresh
  };

  const screenshotUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(data.url)}?w=800&h=500`;

  return (
    <> 
      <div className="group flex flex-col bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:border-brand-primary/30 hover:-translate-y-1">
        
        {/* IMAGE SECTION */}
        <div className="relative h-48 w-full overflow-hidden bg-brand-dark/50">
          <img 
              src={screenshotUrl} 
              alt={`${data.title} preview`} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              loading="lazy"
          />
          <div className="absolute top-3 right-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-dark/80 text-brand-primary border border-brand-primary/20 backdrop-blur-md shadow-lg">
              {isAi ? data.category + ' (✨AI Suggestion)' : data.category}
              </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-dark to-transparent p-4 pt-10"></div>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="mb-4 flex-grow">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors line-clamp-1">
                  {data.title}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2 h-10">
                  {data.description}
              </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
              {(data.tags || []).slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs text-gray-500 bg-brand-dark px-2 py-1 rounded border border-white/5 group-hover:border-white/10 transition-colors">
                      #{tag}
                  </span>
              ))}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                  {/* Like Button */}
                  <button 
                    onClick={() => !isAi && onLike(data._id)} 
                    disabled={isAi}
                    className={`flex items-center gap-1 transition-colors group/like ${
                        isAi ? 'opacity-50 cursor-not-allowed' : (isLiked ? 'text-red-500' : 'hover:text-red-400')
                    }`}
                >
                    <FaHeart />
                    <span>{isAi ? '-' : likeCount}</span>
                  </button>

                  {/* --- CHANGED: Bookmark Button --- */}
                  {/* //check if the card is Ai generated, if so, disable the bookmark button and color transition to cyan */}
                  <button 
                     disabled={isAi}
                     onClick={() => setIsModalOpen(true)}
                     className={`flex items-center gap-1 transition-colors group/bookmark ${
                        /* Disable color change if AI generated */
                        isAi ? 'opacity-50 cursor-not-allowed' : ''
                     } ${
                        isBookmarked 
                        ? 'text-brand-secondary' // Highlight color (e.g., Cyan/Blue)
                        : 'hover:text-brand-secondary text-gray-500'
                     }`}
                     title={isBookmarked ? "Saved (Click to add to another folder)" : "Save to Collection"}
                  >
                     {/* Switch Icon based on state */}
                     {isBookmarked ? <FaBookmark /> : <FaRegBookmark />} 
                     <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                      <FaEye />
                      <span>{data.views}</span>
                  </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                  {isAdmin && !data.approved && (
                      <button title='approve' onClick={() => onApprove(data._id)} className="p-2 text-green-500 hover:bg-green-500/20 rounded-lg transition-colors">
                          <FaCheckCircle />
                      </button>
                  )}
                  {isAdmin && onEdit && (
                      <button title='edit' onClick={() => onEdit(data._id)} className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors">
                          <FaEdit />
                      </button>
                  )}
                  {isAdmin && onDelete && (
                      <button title='delete' onClick={() => onDelete(data._id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors">
                          <FaTrash />
                      </button>
                  )}
                  <a 
                      href={data.url} 
                      target="_blank" 
                      rel="noreferrer"
                      onClick={() => !isAi && onView(data._id)}
                      className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-lg shadow-brand-primary/20"
                  >
                      Visit <FaExternalLinkAlt />
                  </a>
              </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AddToCollectionModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} // Use the new handler
        websiteId={data._id} 
      />
    </>
  );
};

export default WebsiteCard;