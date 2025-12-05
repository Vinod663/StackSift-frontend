import { useState } from 'react';
import { type Website } from '../services/website';
import { FaTimes, FaSave } from 'react-icons/fa';

interface EditModalProps {
  site: Website;
  onClose: () => void;
  onSave: (id: string, updatedData: Partial<Website>) => void;
}

const EditModal = ({ site, onClose, onSave }: EditModalProps) => {
  const [formData, setFormData] = useState({
    title: site.title,
    description: site.description,
    category: site.category,
    url: site.url,
    tags: site.tags.join(', ')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(site._id, {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-brand-dark border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="bg-white/5 p-4 flex justify-between items-center border-b border-white/10">
            <h3 className="text-white font-bold">Edit Tool</h3>
            <button onClick={onClose} title="Close" aria-label="Close" className="text-gray-400 hover:text-white"><FaTimes /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
                <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Title</label>
                <input 
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-brand-primary outline-none"
                    title='Title'
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Category</label>
                <select 
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-brand-primary outline-none"
                    title='Category'
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                >
                    <option>Development</option>
                    <option>Design</option>
                    <option>Productivity</option>
                    <option>AI</option>
                    <option>Learning</option>
                    <option>DevOps</option>
                </select>
            </div>
            <div>
                <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Description</label>
                <textarea 
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-brand-primary outline-none h-24 resize-none"
                    title='Description'
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Tags</label>
                <input 
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-brand-primary outline-none"
                    title='Tags'
                    value={formData.tags}
                    onChange={e => setFormData({...formData, tags: e.target.value})}
                />
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                    <FaSave /> Save Changes
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;