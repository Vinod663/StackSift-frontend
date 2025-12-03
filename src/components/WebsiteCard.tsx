import { FaExternalLinkAlt, FaHeart, FaCheckCircle, FaEye } from 'react-icons/fa';
import { type Website } from '../services/website';
import { useSelector } from 'react-redux';
import { type RootState } from '../redux/store';

interface CardProps {
  data: Website;
  onLike: (id: string) => void;
  onApprove: (id: string) => void;
  onView: (id: string) => void;
  isAi?: boolean;
}

const WebsiteCard = ({ data, onLike, onApprove, onView, isAi }: CardProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = Boolean(user?.role?.includes('ADMIN'));
  const likeCount = Array.isArray(data.upvotes) ? data.upvotes.length : data.upvotes;
  const uid = user?.id;
  const isLiked = Array.isArray(data.upvotes) && typeof uid === 'string' && data.upvotes.includes(uid);

  // 1. Generate Automated Screenshot URL
  // We use WordPress mShots API (Free & Fast)
  const screenshotUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(data.url)}?w=800&h=500`;

  return (
    <div className="group flex flex-col bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:border-brand-primary/30 hover:-translate-y-1">
      
      {/* --- IMAGE SECTION --- */}
      <div className="relative h-48 w-full overflow-hidden bg-brand-dark/50">
        {/* The Screenshot */}
        <img 
            src={screenshotUrl} 
            alt={`${data.title} preview`} 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            loading="lazy"
        />
        
        {/* Floating Category Badge */}
        <div className="absolute top-3 right-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-dark/80 text-brand-primary border border-brand-primary/20 backdrop-blur-md shadow-lg">
            {data.category}
            </span>
        </div>

        {/* Floating Domain Name (Optional cool touch) */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-dark to-transparent p-4 pt-10">
             {/* This gradient makes the text below readable */}
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
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
            {data.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs text-gray-500 bg-brand-dark px-2 py-1 rounded border border-white/5 group-hover:border-white/10 transition-colors">
                    #{tag}
                </span>
            ))}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
            
            {/* Left: Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
                <button 
                  onClick={() => !isAi && onLike(data._id)} // Disable click if AI
                  disabled={isAi}
                  className={`flex items-center gap-1 transition-colors group/like ${
                     isAi ? 'opacity-50 cursor-not-allowed' : (isLiked ? 'text-red-500' : 'hover:text-red-400')
                  }`}
              >
                  <FaHeart />
                  <span>{isAi ? '-' : likeCount}</span>
                </button>
                <div className="flex items-center gap-1">
                    <FaEye />
                    <span>{data.views}</span>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                
                {/* ADMIN: Approve */}
                {isAdmin && !data.approved && (
                    <button 
                        onClick={() => onApprove(data._id)}
                        className="p-2 text-green-500 hover:bg-green-500/20 rounded-lg transition-colors"
                        title="Approve Submission"
                    >
                        <FaCheckCircle />
                    </button>
                )}

                {/* Visit */}
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
  );
};

export default WebsiteCard;