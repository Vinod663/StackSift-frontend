import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaPaperPlane, FaHeadset, FaQuestionCircle, FaLightbulb, FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import { sendSupportMessage } from '../services/contact';

const Support = () => {
  // --- STATE ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  
  // New States for API interaction
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' });

  // --- MOCK DATA: FAQs ---
  const faqs = [
    {
      question: "How does the AI Search work?",
      answer: "StackSift uses a hybrid search engine. We first check our curated database. If we can't find what you're looking for, we utilize Google's Gemini AI to analyze your query and suggest relevant tools in real-time."
    },
    {
      question: "Is StackSift free to use?",
      answer: "Yes! The core directory and search features are completely free. You can search, submit tools, and create collections without any cost."
    },
    {
      question: "How do I save tools to a collection?",
      answer: "On any tool card, click the 'Bookmark' icon. You can then select an existing folder or create a new one to organize your stack."
    },
    {
      question: "I found a broken link or duplicate tool.",
      answer: "Please use the contact form on this page to report it. Select 'Bug Report' as the subject, and we will fix it immediately."
    },
    {
      question: "Can I delete a tool I submitted?",
      answer: "Currently, only Admins can delete tools to prevent data loss. If you need a tool removed, please contact support."
    }
  ];

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, msg: '' });

    try {
        // Call the backend API
        await sendSupportMessage(formData);
        
        setStatus({ type: 'success', msg: 'Message sent! We will get back to you shortly.' });
        setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
        
    } catch (error) {
        console.error(error);
        setStatus({ type: 'error', msg: 'Failed to send message. Please try again later.' });
    } finally {
        setLoading(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="animate-fade-in-up pb-20">
      
      {/* 1. HERO HEADER */}
      <div className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-4">
          How can we help you?
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Find answers to common questions or reach out to our team directly.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* 2. LEFT COLUMN: FAQ SECTION */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-brand-primary/10 rounded-full text-brand-primary">
                <FaQuestionCircle className="text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`border rounded-xl transition-all duration-300 ${
                    openFaqIndex === index 
                    ? 'bg-white/10 border-brand-primary/50' 
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
                >
                  <span className={`font-medium ${openFaqIndex === index ? 'text-white' : 'text-gray-300'}`}>
                    {faq.question}
                  </span>
                  {openFaqIndex === index ? (
                    <FaChevronUp className="text-brand-primary" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </button>
                
                <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openFaqIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                  <div className="p-5 pt-0 text-gray-400 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Extra Help Card */}
          <div className="mt-8 p-6 bg-gradient-to-br from-purple-900/20 to-brand-dark border border-purple-500/20 rounded-2xl flex items-start gap-4">
             <div className="bg-purple-500/10 p-3 rounded-full text-purple-400 mt-1">
                <FaLightbulb />
             </div>
             <div>
                 <h3 className="text-white font-bold mb-1">Have a feature request?</h3>
                 <p className="text-sm text-gray-400">We love hearing new ideas. Select "Feature Request" in the form and tell us what you want to see next!</p>
             </div>
          </div>
        </div>

        {/* 3. RIGHT COLUMN: CONTACT FORM */}
        <div className="bg-brand-dark/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl h-fit sticky top-24">
          
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-500/10 rounded-full text-blue-400">
                <FaHeadset className="text-xl" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white">Contact Support</h2>
                <p className="text-xs text-gray-500">We usually respond within 24 hours.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Name</label>
                    <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email</label>
                    <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                    />
                </div>
            </div>

            {/* Subject Select */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Subject</label>
                <div className="relative">
                    <select
                        title="Select Subject"
                        required
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white appearance-none focus:outline-none focus:border-brand-primary transition-all cursor-pointer"
                    >
                        <option value="" className="bg-brand-dark text-gray-500">Select an issue...</option>
                        <option value="General Inquiry" className="bg-brand-dark">General Inquiry</option>
                        <option value="Bug Report" className="bg-brand-dark">Report a Bug 🐛</option>
                        <option value="Feature Request" className="bg-brand-dark">Feature Request 💡</option>
                        <option value="Account Issue" className="bg-brand-dark">Account Issue 🔒</option>
                    </select>
                    <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs" />
                </div>
            </div>

            {/* Message Textarea */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Message</label>
                <textarea
                    required
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your issue in detail..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all resize-none"
                ></textarea>
            </div>

            {/* Status Messages */}
            {status.msg && (
                <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
                    status.type === 'error' 
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                    : 'bg-green-500/10 text-green-400 border border-green-500/20'
                }`}>
                    {status.type === 'error' ? <FaExclamationCircle /> : <FaCheckCircle />}
                    {status.msg}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-lg hover:shadow-brand-primary/20 text-white font-bold py-4 rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
                {loading ? (
                    <>
                        <FaSpinner className="animate-spin" /> Sending...
                    </>
                ) : (
                    <>
                        <FaPaperPlane /> Send Message
                    </>
                )}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Support;