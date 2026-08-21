import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  MapPin, 
  Calendar, 
  Users, 
  UserPlus, 
  UserCheck2, 
  UserMinus, 
  Star, 
  MessageSquare, 
  TrendingUp, 
  Briefcase, 
  Globe, 
  Linkedin, 
  ArrowRight, 
  Heart, 
  MessageCircle, 
  Sparkles,
  ExternalLink,
  Crown,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SocialProfileModal: React.FC = () => {
  const { 
    isSocialProfileModalOpen, 
    selectedProfileUserId, 
    closeSocialProfileModal, 
    getUserProfile,
    currentUser,
    startups,
    investors,
    communityPosts,
    userConnections,
    sendConnectionRequest,
    removeConnection,
    userFollows,
    toggleFollowUser,
    openChatWithUser,
    getUserConnectionsCount,
    getUserFollowersCount,
    getUserFollowingCount,
    openSocialNetworkModal,
    setSelectedStartup,
    setCurrentView,
    setPitchModalInvestor
  } = useApp();

  const [activeTab, setActiveTab] = useState<'posts' | 'venture' | 'network'>('posts');

  if (!isSocialProfileModalOpen || !selectedProfileUserId) return null;

  const profileUser = getUserProfile(selectedProfileUserId);
  if (!profileUser) return null;

  const isCurrentUser = profileUser.id === currentUser.id;
  const isConnected = userConnections.some(
    c => (c.targetUserId === profileUser.id || c.userId === profileUser.id) && c.status === 'connected'
  );
  const isPending = userConnections.some(
    c => (c.targetUserId === profileUser.id || c.userId === profileUser.id) && c.status === 'pending'
  );
  const isFollowing = userFollows.some(
    f => f.followerId === currentUser.id && f.followingId === profileUser.id
  );

  const connectionsCount = getUserConnectionsCount(profileUser.id);
  const followersCount = getUserFollowersCount(profileUser.id);
  const followingCount = getUserFollowingCount(profileUser.id);

  const userStartup = startups.find(s => s.founderId === profileUser.id || s.id === profileUser.associatedStartupId);
  const userInvestor = investors.find(i => i.id === profileUser.id || i.name.toLowerCase() === profileUser.name.toLowerCase()) || (profileUser.role === 'investor' ? {
    id: profileUser.id,
    name: profileUser.name,
    avatar: profileUser.avatar,
    firm: profileUser.companyOrFirm || 'Venture Capital Partner',
    title: profileUser.title || 'General Partner',
    email: profileUser.email,
    checkSizeMin: 50000,
    checkSizeMax: 500000,
    targetSectors: ['B2B SaaS', 'AI & Machine Learning', 'FinTech & Payments'],
    isAccredited: profileUser.isAccredited ?? true,
    portfolioCount: 12,
    location: profileUser.location || 'San Francisco, CA',
    bio: profileUser.bio || 'Active early-stage venture investor.',
    linkedin: profileUser.linkedin || 'https://linkedin.com',
    subscriptionTier: 'pro_investor',
    acceptingPitches: true
  } as any : undefined);
  const userPosts = communityPosts.filter(p => p.authorId === profileUser.id && p.moderationStatus !== 'deleted');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        id="social-profile-modal"
        className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto text-[#0A1128]"
      >
        {/* Profile Banner & Header */}
        <div className="relative bg-gradient-to-r from-[#0A1128] via-[#162038] to-[#1E293B] p-6 sm:p-8 text-white">
          <button
            onClick={closeSocialProfileModal}
            className="absolute top-4 right-4 text-slate-300 hover:text-white bg-[#0A1128]/70 hover:bg-slate-700 p-2 rounded-full transition-colors cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* User Avatar */}
            <div className="relative shrink-0">
              <img
                src={profileUser.avatar}
                alt={profileUser.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-xl"
              />
              {profileUser.role === 'founder' && profileUser.isStripeVerified && (
                <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1 rounded-full shadow-md" title="Stripe Revenue Verified">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
              {profileUser.role === 'investor' && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full shadow-md" title="Accredited Investor">
                  <UserCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Profile Bio Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-mono">{profileUser.name}</h2>
                <span className={`text-[10px] font-extrabold font-mono uppercase px-2.5 py-0.5 rounded-full ${
                  profileUser.role === 'founder' ? 'bg-amber-400 text-slate-950' :
                  profileUser.role === 'investor' ? 'bg-blue-400 text-slate-950' :
                  'bg-slate-700 text-slate-200'
                }`}>
                  {profileUser.role === 'founder' ? 'SaaS Founder' : profileUser.role === 'investor' ? 'Accredited VC' : 'Audit Officer'}
                </span>
                {profileUser.isStripeVerified && (
                  <span className="text-[10px] font-extrabold font-mono bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                    ✓ Stripe Verified
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-200 font-semibold flex items-center space-x-1.5 truncate">
                <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{profileUser.title} at <strong className="text-white">{profileUser.companyOrFirm}</strong></span>
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2">
                {profileUser.location && (
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profileUser.location}</span>
                  </span>
                )}
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Joined {profileUser.joinedAt}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bio text */}
          <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            {profileUser.bio || "Building and evaluating high-growth venture SaaS companies with verified revenue metrics."}
          </p>

          {/* Interactive Social Counters */}
          <div className="mt-5 pt-4 border-t border-slate-700/80 flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={() => {
                closeSocialProfileModal();
                openSocialNetworkModal(profileUser.id, 'connections');
              }}
              className="flex items-center space-x-1.5 text-slate-200 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-extrabold font-mono text-white">{connectionsCount}</span>
              <span className="text-slate-400">Connections</span>
            </button>

            <span className="text-slate-600">•</span>

            <button
              onClick={() => {
                closeSocialProfileModal();
                openSocialNetworkModal(profileUser.id, 'followers');
              }}
              className="flex items-center space-x-1.5 text-slate-200 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <span className="font-extrabold font-mono text-white">{followersCount}</span>
              <span className="text-slate-400">Followers</span>
            </button>

            <span className="text-slate-600">•</span>

            <button
              onClick={() => {
                closeSocialProfileModal();
                openSocialNetworkModal(profileUser.id, 'following');
              }}
              className="flex items-center space-x-1.5 text-slate-200 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <span className="font-extrabold font-mono text-white">{followingCount}</span>
              <span className="text-slate-400">Following</span>
            </button>

            {userStartup && (
              <>
                <span className="text-slate-600">•</span>
                <div className="flex items-center space-x-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-mono font-extrabold text-amber-400">${userStartup.mrr.toLocaleString()}</span>
                  <span className="text-slate-400">Verified MRR</span>
                </div>
              </>
            )}

            {userInvestor && (
              <>
                <span className="text-slate-600">•</span>
                <div className="flex items-center space-x-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-mono font-extrabold text-white">{userInvestor.portfolioCount}</span>
                  <span className="text-slate-400">Portfolio Deals</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 sm:px-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pb-0.5">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                activeTab === 'posts'
                  ? 'bg-[#0A1128] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Posts & Insights ({userPosts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('venture')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                activeTab === 'venture'
                  ? 'bg-[#0A1128] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {profileUser.role === 'founder' ? <TrendingUp className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
              <span>{profileUser.role === 'founder' ? 'Startup Details' : 'Investment Thesis'}</span>
            </button>
          </div>

          {/* Social CTAs */}
          {!isCurrentUser && (
            <div className="flex items-center justify-end space-x-2 pt-1 sm:pt-0">
              {/* Connect Button */}
              {isConnected ? (
                <button
                  onClick={() => removeConnection(profileUser.id)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
                  title="Click to disconnect"
                >
                  <UserCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Connected</span>
                </button>
              ) : isPending ? (
                <span className="px-3 py-1.5 bg-amber-100 text-amber-900 rounded-xl text-xs font-bold">
                  Pending Request
                </span>
              ) : (
                <button
                  onClick={() => sendConnectionRequest({
                    id: profileUser.id,
                    name: profileUser.name,
                    avatar: profileUser.avatar,
                    role: profileUser.role,
                    company: profileUser.companyOrFirm
                  })}
                  className="px-3.5 py-1.5 bg-[#0A1128] hover:bg-[#162038] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span>+ Connect</span>
                </button>
              )}

              {/* Follow Button */}
              <button
                onClick={() => toggleFollowUser(profileUser.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  isFollowing
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${isFollowing ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                <span>{isFollowing ? 'Following' : 'Follow'}</span>
              </button>

              {/* Message Button */}
              <button
                onClick={() => {
                  closeSocialProfileModal();
                  openChatWithUser({
                    id: profileUser.id,
                    name: profileUser.name,
                    avatar: profileUser.avatar,
                    role: profileUser.role,
                    company: profileUser.companyOrFirm
                  });
                }}
                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-slate-950" />
                <span>Message</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab Content Workspace */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: User Posts */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {userPosts.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200 p-6">
                  <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">No community posts yet.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">This user hasn't published any milestones or discussions.</p>
                </div>
              ) : (
                userPosts.map(post => (
                  <div key={post.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                        {post.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{post.createdAt.split('T')[0]}</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#0A1128]">{post.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{post.content}</p>
                    <div className="flex items-center space-x-4 pt-2 border-t border-slate-100 text-xs text-slate-500 font-semibold">
                      <span className="flex items-center space-x-1 text-red-500">
                        <Heart className="w-3.5 h-3.5 fill-red-400" />
                        <span>{post.likesCount} Likes</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span>{post.comments.length} Comments</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Venture / Startup Details */}
          {activeTab === 'venture' && (
            <div className="space-y-4">
              {profileUser.role === 'founder' && userStartup ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={userStartup.logo} alt={userStartup.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                      <div>
                        <h3 className="text-base font-extrabold text-[#0A1128] font-mono">{userStartup.name}</h3>
                        <p className="text-xs text-slate-500">{userStartup.category} • {userStartup.stage}</p>
                      </div>
                    </div>
                    {userStartup.isVerified && (
                      <span className="px-3 py-1 bg-amber-400 text-slate-950 font-mono font-extrabold text-xs rounded-full shadow-xs">
                        ✓ Stripe Verified
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{userStartup.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Monthly MRR</span>
                      <span className="text-lg font-extrabold font-mono text-[#0A1128]">${userStartup.mrr.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">MoM Growth</span>
                      <span className="text-lg font-extrabold font-mono text-emerald-600">+{userStartup.growthRateMoM}%</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Raising</span>
                      <span className="text-lg font-extrabold font-mono text-[#0A1128]">${(userStartup.askAmount / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Valuation</span>
                      <span className="text-lg font-extrabold font-mono text-[#0A1128]">${(userStartup.valuation / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-2">
                    <button
                      onClick={() => {
                        closeSocialProfileModal();
                        setSelectedStartup(userStartup);
                        setCurrentView('directory');
                      }}
                      className="px-4 py-2 bg-[#0A1128] hover:bg-[#162038] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>Inspect Full Diligence Vault</span>
                    </button>
                  </div>
                </div>
              ) : profileUser.role === 'investor' && userInvestor ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-[#0A1128] font-mono">{userInvestor.firm}</h3>
                      <p className="text-xs text-slate-500">Check Size: ${(userInvestor.checkSizeMin / 1000).toFixed(0)}k - ${(userInvestor.checkSizeMax / 1000).toFixed(0)}k</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200 font-mono font-extrabold text-xs rounded-full">
                      Accredited VC
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Target Sectors:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {userInvestor.targetSectors.map((sector, i) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-700">
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        closeSocialProfileModal();
                        setPitchModalInvestor(userInvestor);
                      }}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                      <span>Pitch Startup to {userInvestor.name}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-2xl text-center text-xs text-slate-500">
                  No venture details recorded.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
