import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { 
  FaLink, FaHeading, FaMagic, FaTags, 
  FaLayerGroup, FaCheckCircle, FaExclamationCircle, 
  FaSpinner, FaRobot 
} from 'react-icons/fa';
import { addWebsite } from '../services/website';

const SubmitTool = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: '',
    tags: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
        
        const tagsArray = formData.tags 
            ? formData.tags.split(',').map(tag => tag.trim()) 
            : [];

        const payload = {
            ...formData,
            tags: tagsArray
        };

        // Adjust your API URL here
        const res = await addWebsite(payload);

        console.log('Tool submitted successfully:', res.data);  

        setStatus({ type: 'success', message: 'Tool submitted successfully! AI is polishing the details.' });
        
        // Optional: Redirect after delay
        setTimeout(() => navigate('/dashboard'), 2000);

    } catch (error: any) {
        setStatus({ 
            type: 'error', 
            message: error.response?.data?.message || 'Something went wrong. Please try again.' 
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      
      {/* 1. Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-3">
            Submit a New Tool
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
            Share a useful developer tool with the community. 
            <span className="text-brand-primary font-medium"> Don't worry about details—our AI will help fill in the blanks.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. LEFT SIDE: The Form */}
        <div className="lg:col-span-2">
            <div className="bg-brand-dark/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* REQUIRED SECTION */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-brand-primary/20 text-brand-primary text-xs font-bold px-2 py-1 rounded border border-brand-primary/20">REQUIRED</span>
                        </div>
                        
                        {/* Title Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaHeading className="text-gray-500 group-focus-within:text-brand-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Tool Name (e.g., React JS)"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                            />
                        </div>

                        {/* URL Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaLink className="text-gray-500 group-focus-within:text-brand-primary transition-colors" />
                            </div>
                            <input
                                type="url"
                                name="url"
                                required
                                value={formData.url}
                                onChange={handleChange}
                                placeholder="Website URL (e.g., https://react.dev)"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                            />
                        </div>
                    </div>

                    <div className="h-px bg-white/5 w-full my-6"></div>

                    {/* OPTIONAL / AI SECTION */}
                    <div className="space-y-4 relative">
                        {/* Visual Hint for AI */}
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400 text-sm font-medium">Optional Details</span>
                            <div className="flex items-center gap-1.5 text-xs text-purple-400 font-medium bg-purple-500/10 px-2 py-1 rounded-full border border-purple-500/20">
                                <FaMagic /> Auto-filled by AI if empty
                            </div>
                        </div>

                        {/* Category Select */}
                        <div className="relative group">
                             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaLayerGroup className="text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                            </div>
                            <select
                                title='category'
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-gray-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all appearance-none"
                            >
                                <option value="" className="bg-brand-dark text-gray-500">Select Category (Optional)</option>
                                <option value="Development" className="bg-brand-dark">Development</option>
                                <option value="Design" className="bg-brand-dark">Design</option>
                                <option value="Productivity" className="bg-brand-dark">Productivity</option>
                                <option value="AI" className="bg-brand-dark">AI</option>
                                <option value="DevOps" className="bg-brand-dark">DevOps</option>
                            </select>
                            
                        </div>

                        {/* Tags Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaTags className="text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="Tags (comma separated, e.g., ui, framework)"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                            />
                        </div>

                         {/* Description Textarea */}
                         <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Description (Leave empty to let AI summarize the website for you)"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                        ></textarea>
                    </div>

                    {/* Status Messages */}
                    {status.message && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
                            status.type === 'error' 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                            : 'bg-green-500/10 text-green-400 border border-green-500/20'
                        }`}>
                            {status.type === 'error' ? <FaExclamationCircle /> : <FaCheckCircle />}
                            {status.message}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 ${
                            loading 
                            ? 'bg-gray-600 cursor-not-allowed opacity-70'
                            : 'bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-lg hover:shadow-brand-primary/25 text-white'
                        }`}
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" /> Analyzing URL...
                            </>
                        ) : (
                            <>
                                <FaMagic /> Submit Tool
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>

        {/* 3. RIGHT SIDE: Info Card */}
        <div className="hidden lg:block space-y-6">
            <div className="bg-gradient-to-br from-purple-900/20 to-brand-dark border border-purple-500/20 rounded-2xl p-6 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FaRobot className="text-9xl text-purple-400" />
                </div>
                
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                    <FaMagic className="text-2xl text-purple-400" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">AI-Powered Submission</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Too lazy to write a description? We get it.
                </p>
                <div className="text-left text-sm space-y-3 bg-brand-dark/50 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 text-gray-300">
                        <FaCheckCircle className="text-green-400 text-xs" />
                        <span>Analyzes website content</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                        <FaCheckCircle className="text-green-400 text-xs" />
                        <span>Generates smart summaries</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                        <FaCheckCircle className="text-green-400 text-xs" />
                        <span>Auto-assigns relevant tags</span>
                    </div>
                </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                <h4 className="font-bold text-white mb-2">Submission Guidelines</h4>
                <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                    <li>Ensure the URL is accessible.</li>
                    <li>No duplicate tools, please.</li>
                    <li>Tools related to CS, SE, and Design are preferred.</li>
                </ul>
            </div>
        </div>

      </div>
    </div>
  );
};

export default SubmitTool;