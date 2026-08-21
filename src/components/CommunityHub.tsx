import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  PlusCircle, 
  Tag, 
  Award, 
  Filter, 
  Share2, 
  CheckCircle2, 
  Rocket, 
  DollarSign, 
  Building2, 
  UserPlus, 
  UserMinus,
  UserX,
  Check, 
  ExternalLink, 
  MessageCircle, 
  Star, 
  Hash, 
  Search,
  Briefcase,
  Flame,
  Bookmark,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CommunityPost, FeedCategory, UserRole } from '../types';

export const CommunityHub: React.FC = () => {
  const { 
    communityPosts, 
    currentUser, 
    createCommunityPost, 
    likeCommunityPost, 
    addCommunityComment,
    shareCommunityPost,
    startups,
    investors,
    userConnections,
    sendConnectionRequest,
    acceptConnectionRequest,
    removeConnection,
    followedUserIds,
    toggleFollowUser,
    openChatWithUser,
    setIsChatDrawerOpen,
    setSelectedStartup,
    openSocialProfileModal,
    openSocialNetworkModal
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);

  // Post Creator States
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<FeedCategory>('MRR Milestones');
  const [postTaggedStartupId, setPostTaggedStartupId] = useState('');
  const [postMrrMilestone, setPostMrrMilestone] = useState('');
  const [postFundingAmount, setPostFundingAmount] = useState('');
  const [postCustomTags, setPostCustomTags] = useState('');

  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});

  const categories: { id: FeedCategory | 'All'; label: string; icon: string }[] = [
    { id: 'All', label: 'All Discussions', icon: '🌐' },
    { id: 'Funding & Deals', label: 'Funding & Deals', icon: '🚀' },
    { id: 'MRR Milestones', label: 'MRR Milestones', icon: '📈' },
    { id: 'New Tech & AI', label: 'New Tech & AI', icon: '⚡' },
    { id: 'Startup Discussions', label: 'Startup Discussions', icon: '💡' },
    { id: 'Investor Insights', label: 'Investor Insights', icon: '💼' },
    { id: 'GTM & Growth', label: 'GTM & Growth', icon: '🎯' }
  ];

  const trendingTags = [
    '#StripeVerified',
    '#FundingClosed',
    '#AIInfrastructure',
    '#B2BSaaS',
    '#PreSeed',
    '#InvestorThesis',
    '#Bootstrapping'
  ];

  // Filter feed posts
  const filteredPosts = communityPosts.filter(p => {
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchTag = !selectedTag || (p.tags && p.tags.includes(selectedTag));
    const matchSearch = !searchQuery.trim() || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.authorCompany && p.authorCompany.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCategory && matchTag && matchSearch;
  });

  // Handle post creation
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    const tagsArray = postCustomTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => t.startsWith('#') ? t : `#${t}`);

    createCommunityPost(
      postTitle.trim(),
      postContent.trim(),
      postCategory,
      postMrrMilestone ? Number(postMrrMilestone) : undefined,
      postTaggedStartupId || undefined,
      tagsArray.length > 0 ? tagsArray : undefined,
      postFundingAmount ? Number(postFundingAmount) : undefined
    );

    setPostTitle('');
    setPostContent('');
    setPostMrrMilestone('');
    setPostFundingAmount('');
    setPostTaggedStartupId('');
    setPostCustomTags('');
    setIsCreatingPost(false);
  };

  const handleSendComment = (postId: string) => {
    const text = replyInput[postId];
    if (!text || !text.trim()) return;
    addCommunityComment(postId, text.trim());
    setReplyInput(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Top Header Banner - Deep Navy with Gold Accents */}
      <div className="bg-[#0A1128] border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl text-white">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#162038] border border-amber-400/40 text-amber-400 text-xs font-extrabold font-mono">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Venture Feed & Match Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            Deal Talk, Funding & Tech Milestones
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Share verified MRR growth milestones, funding announcements, and new tech launches. Follow industry leaders, build mutual connections, and direct chat with founders and VCs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setIsChatDrawerOpen(true)}
            className="px-4 py-2.5 bg-[#162038] hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-xs"
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>Open Messenger</span>
          </button>

          <button
            onClick={() => setIsCreatingPost(!isCreatingPost)}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>{isCreatingPost ? 'Close Composer' : 'Create Feed Post'}</span>
          </button>
        </div>
      </div>

      {/* Post Composer Card */}
      {isCreatingPost && (
        <form 
          onSubmit={handleCreatePost}
          className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 text-[#0A1128] animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
              />
              <div>
                <span className="font-extrabold text-sm text-[#0A1128] block">{currentUser.name}</span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Posting as <strong className="text-amber-600 font-bold capitalize">{currentUser.role}</strong> • {currentUser.companyOrFirm}
                </span>
              </div>
            </div>

            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 font-mono font-extrabold border border-amber-200">
              Community Publisher
            </span>
          </div>

          {/* Post Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Post Title</label>
            <input
              type="text"
              required
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="e.g. Hit $50k MRR Milestone • Closed $750k Seed Round • Open Sourcing our AI Agent"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-[#0A1128] font-bold placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category & Tagged Startup Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category / Topic</label>
              <select
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value as FeedCategory)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {categories.filter(c => c.id !== 'All').map(c => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tag Listed Startup (Optional)</label>
              <select
                value={postTaggedStartupId}
                onChange={(e) => setPostTaggedStartupId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="">-- No Startup Tagged --</option>
                {startups.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} (${(s.mrr / 1000).toFixed(1)}k MRR)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Conditional Milestone / Funding Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {postCategory === 'MRR Milestones' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Milestone MRR ($/mo)</label>
                <input
                  type="number"
                  value={postMrrMilestone}
                  onChange={(e) => setPostMrrMilestone(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {postCategory === 'Funding & Deals' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Funding Amount ($)</label>
                <input
                  type="number"
                  value={postFundingAmount}
                  onChange={(e) => setPostFundingAmount(e.target.value)}
                  placeholder="e.g. 600000"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <div className={postCategory === 'MRR Milestones' || postCategory === 'Funding & Deals' ? '' : 'sm:col-span-2'}>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tags (Comma Separated)</label>
              <input
                type="text"
                value={postCustomTags}
                onChange={(e) => setPostCustomTags(e.target.value)}
                placeholder="e.g. #StripeVerified, #SeedRound, #AIInfrastructure"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Post Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Content & Narrative</label>
            <textarea
              required
              rows={4}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Share the journey, lessons learned, metric milestones, or thesis breakdown..."
              className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreatingPost(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              Publish to Venture Feed
            </button>
          </div>
        </form>
      )}

      {/* Category Pills Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none w-full md:w-auto pb-1 md:pb-0">
          {categories.map(c => {
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCategory(c.id);
                  setSelectedTag(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-[#0A1128] text-white shadow-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Feed */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search feed, founders, tech..."
            className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Selected Tag Active Filter Banner */}
      {selectedTag && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 flex items-center justify-between text-xs text-amber-900 font-bold">
          <span>Filtering by topic tag: <span className="underline">{selectedTag}</span></span>
          <button 
            onClick={() => setSelectedTag(null)}
            className="text-slate-500 hover:text-slate-800 text-[11px] font-mono cursor-pointer"
          >
            Clear Tag Filter ✕
          </button>
        </div>
      )}

      {/* Main Grid: Feed Stream (Left 8 Cols) + Network Connections Sidebar (Right 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center Stream */}
        <div className="lg:col-span-8 space-y-5">
          {filteredPosts.map((post) => {
            const isLiked = post.likedBy.includes(currentUser.id);
            const isAuthorMe = post.authorId === currentUser.id;
            const isConnected = userConnections.some(c => c.targetUserId === post.authorId && c.status === 'connected');
            const isFollowing = followedUserIds.includes(post.authorId);
            const isCommentThreadOpen = activeCommentPostId === post.id;
            const taggedStartup = startups.find(s => s.id === post.taggedStartupId);

            return (
              <div 
                key={post.id}
                id={`feed-${post.id}`}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-3xl p-5 sm:p-6 shadow-sm transition-all space-y-4 text-[#0A1128]"
              >
                {/* Author Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div 
                    onClick={() => openSocialProfileModal(post.authorId)}
                    className="flex items-center space-x-3 min-w-0 cursor-pointer group"
                    title={`View ${post.authorName}'s Social Profile`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-xs group-hover:ring-2 group-hover:ring-amber-400 transition-all"
                      />
                      {post.isVerified && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border border-white flex items-center justify-center text-[10px] text-slate-950 font-bold">
                          ✓
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-extrabold text-sm text-[#0A1128] group-hover:text-amber-600 transition-colors truncate">
                          {post.authorName}
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full font-extrabold font-mono bg-amber-100 text-amber-900 border border-amber-300">
                          {post.authorRole === 'investor' ? 'Accredited VC' : 'Verified Founder'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate">
                        {post.authorCompany} • {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Connect / Follow / Chat Actions */}
                  {!isAuthorMe && (
                    <div className="flex items-center space-x-1.5 shrink-0">
                      {isConnected ? (
                        <>
                          <button
                            onClick={() => openChatWithUser({
                              id: post.authorId,
                              name: post.authorName,
                              avatar: post.authorAvatar,
                              role: post.authorRole,
                              company: post.authorCompany || 'TrustMRR Venture'
                            })}
                            className="px-3 py-1.5 bg-[#0A1128] hover:bg-[#162038] text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-xs transition-all cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                            <span>Chat</span>
                          </button>

                          {/* Disconnect Action */}
                          <button
                            onClick={() => removeConnection(post.authorId)}
                            className="px-2.5 py-1.5 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 text-slate-500 hover:text-red-600 rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer shadow-2xs"
                            title={`Disconnect from ${post.authorName}`}
                          >
                            <UserMinus className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
                            <span className="hidden sm:inline">Disconnect</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => sendConnectionRequest({
                            id: post.authorId,
                            name: post.authorName,
                            avatar: post.authorAvatar,
                            role: post.authorRole,
                            company: post.authorCompany || 'TrustMRR Network'
                          })}
                          className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold flex items-center space-x-1 shadow-xs transition-all cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5 text-slate-950" />
                          <span>+ Connect</span>
                        </button>
                      )}

                      {/* Follow / Unfollow Toggle */}
                      <button
                        onClick={() => toggleFollowUser(post.authorId)}
                        className={`p-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer ${
                          isFollowing 
                            ? 'bg-amber-50 border-amber-300 text-amber-700' 
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                        }`}
                        title={isFollowing ? `Following ${post.authorName} (Click to Unfollow)` : `Follow ${post.authorName}`}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFollowing ? 'fill-amber-500 text-amber-500' : ''}`} />
                        <span className="hidden md:inline text-[10px]">
                          {isFollowing ? 'Following' : 'Follow'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Milestone / Funding Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold border border-slate-200">
                    {post.category}
                  </span>

                  {post.mrrMilestone && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-extrabold font-mono border border-amber-300 flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-amber-700" />
                      <span>${(post.mrrMilestone / 1000).toFixed(1)}k MRR Milestone (Stripe Verified)</span>
                    </span>
                  )}

                  {post.fundingAmount && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-900 font-extrabold font-mono border border-emerald-300 flex items-center space-x-1">
                      <Rocket className="w-3 h-3 text-emerald-600" />
                      <span>${(post.fundingAmount / 1000).toLocaleString()}k Round Closed</span>
                    </span>
                  )}
                </div>

                {/* Post Title */}
                <h3 className="font-extrabold text-base sm:text-lg text-[#0A1128] tracking-tight leading-snug">
                  {post.title}
                </h3>

                {/* Post Content */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-sans">
                  {post.content}
                </p>

                {/* Tagged Startup Card Preview */}
                {taggedStartup && (
                  <div 
                    onClick={() => setSelectedStartup(taggedStartup)}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={taggedStartup.logo}
                        alt={taggedStartup.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-extrabold text-xs text-[#0A1128] group-hover:text-amber-600 truncate">{taggedStartup.name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-mono font-bold">
                            {taggedStartup.stage}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 truncate block">{taggedStartup.tagline}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-right shrink-0">
                      <div>
                        <span className="text-xs font-bold font-mono text-[#0A1128]">${(taggedStartup.mrr / 1000).toFixed(1)}k MRR</span>
                        <span className="text-[10px] text-amber-600 block font-mono">+{taggedStartup.growthRateMoM}% MoM</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0A1128]" />
                    </div>
                  </div>
                )}

                {/* Hashtags Strip */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map(t => (
                      <button
                        key={t}
                        onClick={() => setSelectedTag(t)}
                        className="text-[11px] text-slate-500 hover:text-amber-600 font-mono font-medium transition-colors cursor-pointer"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}

                {/* Interactive Engagement Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    {/* Like Button */}
                    <button
                      onClick={() => likeCommunityPost(post.id)}
                      className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 transition-all cursor-pointer ${
                        isLiked
                          ? 'bg-amber-50 border-amber-300 text-amber-700 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-amber-500 text-amber-500' : ''}`} />
                      <span>{post.likesCount}</span>
                    </button>

                    {/* Comment Toggle Button */}
                    <button
                      onClick={() => setActiveCommentPostId(isCommentThreadOpen ? null : post.id)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer text-slate-600 font-medium"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>{post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}</span>
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={() => shareCommunityPost(post.id)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer text-slate-600 font-medium"
                      title="Share post"
                    >
                      <Share2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Share</span>
                    </button>
                  </div>

                  {!isAuthorMe && (
                    <button
                      onClick={() => openChatWithUser({
                        id: post.authorId,
                        name: post.authorName,
                        avatar: post.authorAvatar,
                        role: post.authorRole,
                        company: post.authorCompany || 'TrustMRR'
                      })}
                      className="text-xs font-bold text-[#0A1128] hover:text-amber-600 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Direct Message</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Inline Comment Thread */}
                {isCommentThreadOpen && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-3 bg-slate-50/60 p-4 rounded-2xl animate-in fade-in duration-150">
                    <h4 className="font-extrabold text-xs text-[#0A1128]">
                      Discussion & Replies ({post.comments.length})
                    </h4>

                    {/* Comment List */}
                    <div className="space-y-2.5">
                      {post.comments.map(comm => (
                        <div key={comm.id} className="bg-white border border-slate-200 rounded-xl p-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <div 
                              onClick={() => openSocialProfileModal(comm.authorId)}
                              className="flex items-center space-x-2 cursor-pointer group"
                              title={`View ${comm.authorName}'s Profile`}
                            >
                              <img
                                src={comm.authorAvatar}
                                alt={comm.authorName}
                                className="w-6 h-6 rounded-full object-cover border border-slate-200 group-hover:ring-1 group-hover:ring-amber-400"
                              />
                              <span className="font-extrabold text-xs text-[#0A1128] group-hover:text-amber-600 transition-colors">{comm.authorName}</span>
                              {comm.authorBadge && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold font-mono">
                                  {comm.authorBadge}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(comm.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 pl-8 leading-relaxed font-sans">
                            {comm.content}
                          </p>
                        </div>
                      ))}

                      {post.comments.length === 0 && (
                        <p className="text-xs text-slate-400 italic">No replies yet. Be the first to join the discussion!</p>
                      )}
                    </div>

                    {/* Comment Form Input */}
                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="text"
                        value={replyInput[post.id] || ''}
                        onChange={(e) => setReplyInput({ ...replyInput, [post.id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                        placeholder="Add a reply, advice, or feedback..."
                        className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={() => handleSendComment(post.id)}
                        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold flex items-center space-x-1 transition-colors cursor-pointer shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5 text-slate-950" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredPosts.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3 shadow-sm">
              <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-base font-extrabold text-[#0A1128]">No discussions found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No feed posts match your active category or search criteria. Be the first to start a conversation!
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedTag(null);
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Network Connections & Trending Topics Sidebar */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: My Active Connections */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3.5 text-[#0A1128]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div 
                onClick={() => openSocialNetworkModal(currentUser.id, 'connections')}
                className="flex items-center space-x-2 cursor-pointer group"
                title="Open Network Management Modal"
              >
                <Users className="w-4 h-4 text-amber-600" />
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#0A1128] group-hover:text-amber-600 transition-colors">
                  My Matched Network ({userConnections.length})
                </h3>
              </div>
              <button
                onClick={() => setIsChatDrawerOpen(true)}
                className="text-xs text-amber-600 hover:underline font-bold font-mono cursor-pointer"
              >
                Open Chat
              </button>
            </div>

            <div className="space-y-2.5">
              {userConnections.map(conn => (
                <div 
                  key={conn.id}
                  className="p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between transition-colors"
                >
                  <div 
                    onClick={() => openSocialProfileModal(conn.targetUserId)}
                    className="flex items-center space-x-2.5 min-w-0 cursor-pointer group flex-1"
                    title={`View ${conn.targetUserName}'s Profile`}
                  >
                    <img
                      src={conn.targetUserAvatar}
                      alt={conn.targetUserName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 group-hover:ring-2 group-hover:ring-amber-400 transition-all"
                    />
                    <div className="min-w-0">
                      <span className="font-extrabold text-xs text-[#0A1128] group-hover:text-amber-600 transition-colors truncate block">{conn.targetUserName}</span>
                      <span className="text-[10px] text-slate-500 truncate block">{conn.targetUserCompany}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => openChatWithUser({
                        id: conn.targetUserId,
                        name: conn.targetUserName,
                        avatar: conn.targetUserAvatar,
                        role: conn.targetUserRole,
                        company: conn.targetUserCompany
                      })}
                      className="px-2.5 py-1 bg-[#0A1128] hover:bg-[#162038] text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 cursor-pointer shadow-xs"
                    >
                      <MessageSquare className="w-3 h-3 text-amber-400" />
                      <span>Chat</span>
                    </button>

                    <button
                      onClick={() => removeConnection(conn.targetUserId)}
                      className="p-1.5 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer shadow-2xs"
                      title={`Disconnect from ${conn.targetUserName}`}
                    >
                      <UserMinus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              {userConnections.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">
                  No connections yet. Click "+ Connect" on founders or VCs in the feed to build your network!
                </p>
              )}
            </div>
          </div>

          {/* Card 2: Suggested Venture Leaders & VCs */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3.5 text-[#0A1128]">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#0A1128]">
                Suggested Venture Connections
              </h3>
            </div>

            <div className="space-y-3">
              {investors.slice(0, 3).map(inv => {
                const isConnected = userConnections.some(c => c.targetUserId === inv.id);
                const isFollowing = followedUserIds.includes(inv.id);
                return (
                  <div key={inv.id} className="flex items-center justify-between text-xs">
                    <div 
                      onClick={() => openSocialProfileModal(inv.id)}
                      className="flex items-center space-x-2.5 min-w-0 cursor-pointer group flex-1"
                      title={`View ${inv.name}'s Profile`}
                    >
                      <img
                        src={inv.avatar}
                        alt={inv.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 group-hover:ring-2 group-hover:ring-amber-400 transition-all"
                      />
                      <div className="min-w-0">
                        <span className="font-extrabold text-[#0A1128] group-hover:text-amber-600 transition-colors truncate block">{inv.name}</span>
                        <span className="text-[10px] text-slate-500 truncate block">{inv.firm} • ${(inv.checkSizeMin/1000).toFixed(0)}k check</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      {isConnected ? (
                        <>
                          <button
                            onClick={() => openChatWithUser({
                              id: inv.id,
                              name: inv.name,
                              avatar: inv.avatar,
                              role: 'investor',
                              company: inv.firm
                            })}
                            className="px-2.5 py-1 bg-[#0A1128] text-white rounded-lg text-[11px] font-extrabold transition-all cursor-pointer shadow-xs"
                          >
                            Chat
                          </button>

                          <button
                            onClick={() => removeConnection(inv.id)}
                            className="p-1 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer shadow-2xs"
                            title={`Disconnect from ${inv.name}`}
                          >
                            <UserMinus className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => sendConnectionRequest({
                            id: inv.id,
                            name: inv.name,
                            avatar: inv.avatar,
                            role: 'investor',
                            company: inv.firm
                          })}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xs"
                        >
                          + Connect
                        </button>
                      )}

                      <button
                        onClick={() => toggleFollowUser(inv.id)}
                        className={`p-1 rounded-lg border transition-colors cursor-pointer ${
                          isFollowing
                            ? 'bg-amber-50 border-amber-300 text-amber-600'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                        }`}
                        title={isFollowing ? `Following (Click to Unfollow)` : `Follow`}
                      >
                        <Star className={`w-3 h-3 ${isFollowing ? 'fill-amber-500 text-amber-500' : ''}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Trending Topics & Hashtags */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 text-[#0A1128]">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
              <Flame className="w-4 h-4 text-amber-600" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#0A1128]">
                Trending Topics
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {trendingTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
