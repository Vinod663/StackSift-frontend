import { FaExternalLinkAlt, FaHeart, FaCheckCircle, FaEye } from 'react-icons/fa';
import { type Website } from '../services/website';
import { useSelector } from 'react-redux';
import { type RootState } from '../redux/store';

interface CardProps {
  data: Website;
  onLike: (id: string) => void;
  onApprove: (id: string) => void;
}

const WebsiteCard = ({ data, onLike, onApprove }: CardProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role.includes('ADMIN');

  return (
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:border-brand-primary/30">
      
      {/* 1. Category Badge */}
      <div className="absolute top-4 right-4">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-primary/20 text-brand-primary border border-brand-primary/20">
          {data.category}
        </span>
      </div>

      {/* 2. Content */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">
            {data.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 h-10">
            {data.description}
        </p>
      </div>

      {/* 3. Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {data.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs text-gray-500 bg-brand-dark px-2 py-1 rounded border border-white/5">
                #{tag}
            </span>
        ))}
      </div>

      {/* 4. Action Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        
        {/* Left: Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
            <button 
                onClick={() => onLike(data._id)}
                className="flex items-center gap-1 hover:text-red-400 transition-colors group/like"
            >
                <FaHeart className="group-hover/like:scale-110 transition-transform" />
                <span>{data.upvotes}</span>
            </button>
            <div className="flex items-center gap-1">
                <FaEye />
                <span>{data.views}</span>
            </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
            
            {/* ADMIN ONLY: Approve Button */}
            {isAdmin && !data.approved && (
                <button 
                    onClick={() => onApprove(data._id)}
                    className="p-2 text-green-500 hover:bg-green-500/20 rounded-lg transition-colors"
                    title="Approve Submission"
                >
                    <FaCheckCircle />
                </button>
            )}

            {/* Visit Link */}
            <a 
                href={data.url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all"
            >
                Visit <FaExternalLinkAlt />
            </a>
        </div>
      </div>
    </div>
  );
};

export default WebsiteCard;