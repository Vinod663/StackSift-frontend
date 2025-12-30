import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../redux/store';
import { loginSuccess } from '../redux/action/authAction';
import { updateUserProfile, uploadUserAvatar, fetchUserStats, checkPassword } from '../services/auth'; 
import { FaCamera, FaUser, FaEnvelope, FaSave, FaPen, FaLayerGroup, FaLock, FaTimes } from 'react-icons/fa';

const Profile = () => {
  const { user, token, refreshToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Data State
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [stats, setStats] = useState({ tools: 0, collections: 0 });
  const [password, setPassword] = useState(''); 

  // UI State
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Verification Modal State
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyPass, setVerifyPass] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [imgError, setImgError] = useState(false);

  // --- INITIAL LOAD ---
  useEffect(() => {
    const loadStats = async () => {
        try {
            const data = await fetchUserStats();
            setStats(data);
        } catch (error) {
            console.error("Failed to load stats", error);
        }
    };
    loadStats();
  }, []);

  // --- HANDLERS ---

  const handleEditClick = () => {
      setShowVerifyModal(true);
      setVerifyPass('');
      setVerifyError('');
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setVerifyError('');

      try {
          await checkPassword(verifyPass);
          setShowVerifyModal(false);
          setIsEditing(true);
      } catch (error: any) {
          if (error.response?.data?.message?.includes("Google")) {
              setShowVerifyModal(false);
              setIsEditing(true);
          } else {
              setVerifyError("Incorrect password");
          }
      } finally {
          setIsLoading(false);
      }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const data = await updateUserProfile(name, bio, password);
      
      if (token && refreshToken) {
         dispatch(loginSuccess({ user: data.user, token, refreshToken }));
      }
      setIsEditing(false);
      setPassword('');
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsLoading(true);
      try {
        const data = await uploadUserAvatar(file);
        if (token && refreshToken) {
            dispatch(loginSuccess({ user: data.user, token, refreshToken }));
        }
      } catch (error) {
        console.error("Upload failed", error);
        alert("Failed to upload image.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="animate-fade-in-up pb-20 max-w-5xl mx-auto relative px-4 md:px-0">
      
      {/* --- VERIFICATION MODAL --- */}
      {showVerifyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-[#0f1115] border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-scale-up">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <FaLock className="text-brand-primary" /> Security Check
                      </h3>
                      <button 
                        onClick={() => setShowVerifyModal(false)} 
                        className="text-gray-400 hover:text-white"
                        title="Close Modal"
                        aria-label="Close Modal"
                      >
                          <FaTimes />
                      </button>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-4">
                      Please enter your current password to edit your profile details.
                      <br/>
                      <span className="text-xs text-gray-500 italic">(Google users can click 'Verify' to proceed directly)</span>
                  </p>

                  <form onSubmit={handleVerifySubmit}>
                      <input 
                          type="password" 
                          value={verifyPass}
                          onChange={(e) => setVerifyPass(e.target.value)}
                          placeholder="Current Password"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-primary mb-3"
                          autoFocus
                      />
                      
                      {verifyError && (
                          <p className="text-red-400 text-xs mb-3 flex items-center gap-1">
                              <FaTimes /> {verifyError}
                          </p>
                      )}

                      <button 
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 rounded-xl transition-all"
                      >
                          {isLoading ? 'Verifying...' : 'Verify & Edit'}
                      </button>
                  </form>
              </div>
          </div>
      )}


      {/* HEADER SECTION */}
      <div className="relative mb-24">
        {/* Cover Banner */}
        <div className="h-32 md:h-48 w-full rounded-3xl bg-gradient-to-r from-brand-primary/20 via-purple-500/20 to-brand-secondary/20 border border-white/5 backdrop-blur-3xl overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>

        {/* Avatar & Info (RESPONSIVE FIXES) */}
        <div className="absolute -bottom-16 left-4 md:left-8 flex items-end gap-4 md:gap-6 w-[calc(100%-2rem)] md:w-auto">
            
            {/* Avatar Container */}
            <div className="relative group shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-brand-dark bg-brand-dark overflow-hidden shadow-2xl">
                    {user?.avatarUrl && !imgError ? (
                        <img 
                            src={user.avatarUrl} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/10 text-gray-400">
                            <FaUser className="text-3xl md:text-4xl" />
                        </div>
                    )}
                </div>
                <button 
                    title='Upload Profile Image'
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 md:bottom-2 md:right-2 p-1.5 md:p-2 bg-brand-primary text-white rounded-full shadow-lg hover:bg-brand-secondary transition-all cursor-pointer border border-brand-dark"
                >
                    <FaCamera className="text-xs md:text-sm" />
                </button>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
            </div>
            
            {/* Text Info Container */}
            <div className="mb-2 md:mb-4 overflow-hidden w-full">
                <h1 className="text-2xl md:text-3xl font-bold text-white truncate">{user?.name}</h1>
                <div className="text-gray-400 flex flex-wrap items-center gap-2 text-sm md:text-base mt-1">
                    <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] md:text-xs uppercase font-bold tracking-wider shrink-0">
                        {user?.role[0]}
                    </span>
                    {/* Added 'break-all' to ensure long emails wrap/break on mobile */}
                    <span className="break-all">{user?.email}</span>
                </div>
            </div>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-24 md:mt-20">
        
        {/* Left Column */}
        <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FaLayerGroup className="text-brand-primary" /> Account Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/20 p-4 rounded-xl text-center">
                        <span className="block text-2xl font-bold text-white">{stats.tools}</span>
                        <span className="text-xs text-gray-500 uppercase">Tools Added</span>
                    </div>
                    <div className="bg-black/20 p-4 rounded-xl text-center">
                        <span className="block text-2xl font-bold text-white">{stats.collections}</span>
                        <span className="text-xs text-gray-500 uppercase">Collections</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Profile Details</h2>
                    {!isEditing && (
                        <button 
                            onClick={handleEditClick}
                            className="flex items-center gap-2 text-sm text-brand-primary hover:text-white transition-colors"
                        >
                            <FaPen /> Edit Profile
                        </button>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Display Name</label>
                        <div className="relative">
                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                title='name' 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={!isEditing}
                                className={`w-full bg-black/20 border rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none transition-all ${
                                    isEditing 
                                    ? 'border-brand-primary/50 focus:ring-1 focus:ring-brand-primary' 
                                    : 'border-transparent cursor-not-allowed text-gray-400'
                                }`}
                            />
                        </div>
                    </div>

                    {/* Email Field (Read Only) */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                        <div className="relative opacity-60">
                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input 
                                title='email'
                                type="email" 
                                value={user?.email}
                                disabled
                                className="w-full bg-black/20 border border-transparent rounded-xl py-3 pl-10 pr-4 text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* NEW: Password Field (Only when Editing) */}
                    {isEditing && (
                        <div className="animate-fade-in-down">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Change Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Leave empty to keep current password"
                                    className="w-full bg-black/20 border border-brand-primary/50 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all placeholder-gray-600"
                                />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1 ml-1">Enter a new password only if you want to change it.</p>
                        </div>
                    )}

                    {/* Bio Field */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bio / About</label>
                        <textarea 
                            title='bio'
                            rows={4}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            disabled={!isEditing}
                            className={`w-full bg-black/20 border rounded-xl py-3 px-4 text-white focus:outline-none transition-all resize-none ${
                                isEditing 
                                ? 'border-brand-primary/50 focus:ring-1 focus:ring-brand-primary' 
                                : 'border-transparent cursor-not-allowed text-gray-400'
                            }`}
                        />
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="flex gap-4 pt-4 border-t border-white/5">
                            <button 
                                onClick={handleSaveProfile}
                                disabled={isLoading}
                                className="px-6 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-lg transition-all flex items-center gap-2"
                            >
                                <FaSave /> {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button 
                                onClick={() => {
                                    setIsEditing(false);
                                    setName(user?.name || '');
                                    setBio(user?.bio || '');
                                    setPassword('');
                                }}
                                disabled={isLoading}
                                className="px-6 py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-lg transition-all border border-white/5"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;