import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Search, 
  ExternalLink,
  Lock,
  Download,
  Filter,
  Check,
  X,
  Star,
  Trash2,
  Edit3,
  Pin,
  MessageSquare,
  Building2,
  Rocket,
  Sliders,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  UserX,
  Eye,
  Plus,
  ChevronRight,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  ArrowUpRight,
  FileSpreadsheet,
  Layers,
  Zap,
  Award,
  Heart,
  Share2,
  CreditCard,
  LifeBuoy,
  History,
  Bookmark,
  RotateCcw,
  Crown,
  Gift,
  RefreshCw,
  SlidersHorizontal,
  CheckSquare,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  VerificationRequest, 
  PlatformUser, 
  Startup, 
  CommunityPost, 
  UserRole, 
  SubscriptionTier,
  SupportTicket,
  AuditLogEntry,
  SubscriptionPlan,
  SubscriberRecord
} from '../types';

export const AdminPanel: React.FC = () => {
  const { 
    verificationQueue, 
    approveVerification, 
    rejectVerification, 
    startups, 
    investors, 
    pitchRequests,
    communityPosts,
    platformUsers,
    updatePlatformUser,
    toggleUserStatus,
    toggleUserAccredited,
    toggleUserStripeVerified,
    changeUserRole,
    deletePlatformUser,
    deleteStartup,
    toggleFeatureStartup,
    toggleVerifyStartup,
    updateStartup,
    deleteCommunityPost,
    togglePinCommunityPost,
    deleteCommunityComment,
    updatePostModerationStatus,
    supportTickets,
    updateTicketStatus,
    auditLogs,
    subscriptionPlans,
    subscribers,
    createSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan,
    togglePlanActive,
    updateSubscriberStatus,
    updateSubscriberPlan,
    grantComplimentaryVIP,
    extendSubscriptionRenewal,
    cancelUserSubscription,
    setSelectedStartup,
    showToast,
    investorInterests,
    updateInvestorInterestStatus,
    removeInvestorInterest,
    openSocialProfileModal,
    sendAdminDirectMessage,
    replyToSupportTicket,
    setIsSupportModalOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'verifications' | 'users' | 'startups' | 'posts' | 'subscriptions' | 'pitches' | 'support' | 'audit_logs' | 'settings' | 'investor_interests'
  >('dashboard');

  const [interestSearchQuery, setInterestSearchQuery] = useState('');
  const [interestFilterStatus, setInterestFilterStatus] = useState<'all' | 'new' | 'founder_reached_out' | 'data_room_shared'>('all');

  const [analyticsTimeRange, setAnalyticsTimeRange] = useState<'7d' | '30d' | 'qtd' | '1y'>('30d');

  // Verification filters
  const [filterVerificationStatus, setFilterVerificationStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [rejectReasonModal, setRejectReasonModal] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');

  // User management filters & messaging modal
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | UserRole>('all');
  const [editingUser, setEditingUser] = useState<PlatformUser | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);
  const [messageTargetUserIds, setMessageTargetUserIds] = useState<string[]>([]);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');

  // Support Desk Workspace states
  const [replyModalTicket, setReplyModalTicket] = useState<SupportTicket | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [replyNewStatus, setReplyNewStatus] = useState<'in_progress' | 'resolved'>('resolved');
  const [supportSearchQuery, setSupportSearchQuery] = useState('');
  const [supportFilterStatus, setSupportFilterStatus] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');

  // Startup moderation filters & modal
  const [startupSearchQuery, setStartupSearchQuery] = useState('');
  const [editingStartup, setEditingStartup] = useState<Startup | null>(null);

  // Post moderation filters & states
  const [postSearchQuery, setPostSearchQuery] = useState('');
  const [postStatusFilter, setPostStatusFilter] = useState<'all' | 'published' | 'held' | 'deleted'>('all');
  const [deleteModalPostId, setDeleteModalPostId] = useState<string | null>(null);
  const [deleteReasonInput, setDeleteReasonInput] = useState('Spam / Unverified promotion');
  const [expandedPostCommentsId, setExpandedPostCommentsId] = useState<string | null>(null);

  // Subscriptions Model States
  const [subscriptionSubTab, setSubscriptionSubTab] = useState<'plans' | 'subscribers' | 'analytics'>('plans');
  const [subscriberSearchQuery, setSubscriberSearchQuery] = useState('');
  const [subscriberStatusFilter, setSubscriberStatusFilter] = useState<'all' | 'active' | 'past_due' | 'trialing' | 'canceled'>('all');
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [vipGrantUserId, setVipGrantUserId] = useState<string | null>(null);
  const [vipGrantPlanId, setVipGrantPlanId] = useState<string>('pro_founder');

  // System feature flags
  const [systemConfig, setSystemConfig] = useState({
    liveStripeOAuth: true,
    aiDealMemoEngine: true,
    directChatMessenger: true,
    requireAccreditationForPitches: false,
    autoVerifyUnder10k: false
  });

  // Calculate platform metrics
  const foundersCount = platformUsers.filter(u => u.role === 'founder').length;
  const investorsCount = platformUsers.filter(u => u.role === 'investor').length;
  const activeUsersCount = platformUsers.filter(u => u.status === 'active').length;

  const totalVerifiedRevenue = startups
    .filter(s => s.isVerified)
    .reduce((acc, s) => acc + s.mrr, 0);

  const totalPlatformArr = startups.reduce((acc, s) => acc + s.arr, 0);
  const totalAskVolume = startups.reduce((acc, s) => acc + s.askAmount, 0);
  const totalValuationVolume = startups.reduce((acc, s) => acc + s.valuation, 0);
  const pendingCount = verificationQueue.filter(v => v.status === 'pending').length;

  // Subscription MRR calculation
  const subscriptionMRR = subscribers
    .filter(s => s.status === 'active')
    .reduce((acc, s) => {
      const plan = subscriptionPlans.find(p => p.id === s.planId);
      if (s.billingCycle === 'annual') {
        return acc + (plan?.priceAnnual || 0);
      }
      return acc + (plan?.priceMonthly || s.amount || 0);
    }, 0);

  const subscriptionARR = subscriptionMRR * 12;

  // Post moderation counts
  const publishedPostsCount = communityPosts.filter(p => p.moderationStatus !== 'held' && p.moderationStatus !== 'deleted').length;
  const heldPostsCount = communityPosts.filter(p => p.moderationStatus === 'held').length;
  const deletedPostsCount = communityPosts.filter(p => p.moderationStatus === 'deleted').length;
  const totalPostsCount = communityPosts.length;

  const totalLikes = communityPosts.reduce((acc, p) => acc + p.likesCount, 0);
  const totalComments = communityPosts.reduce((acc, p) => acc + p.comments.length, 0);
  const totalShares = communityPosts.reduce((acc, p) => acc + (p.sharesCount || 0), 0);

  const postsTodayCount = communityPosts.filter(p => {
    const d = new Date(p.createdAt);
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear() || p.createdAt.includes('2026-08-20') || p.createdAt.includes('2026-08-21');
  }).length;

  const averageGrowthRate = (startups.reduce((acc, s) => acc + s.growthRateMoM, 0) / (startups.length || 1)).toFixed(1);

  // Growth Chart Mock Data Points (Jan - Aug 2026)
  const monthlyRevenueData = [
    { month: 'Jan', verifiedMrr: 28.5, totalMrr: 45.0, deals: 3 },
    { month: 'Feb', verifiedMrr: 42.0, totalMrr: 68.4, deals: 5 },
    { month: 'Mar', verifiedMrr: 61.5, totalMrr: 89.2, deals: 7 },
    { month: 'Apr', verifiedMrr: 84.0, totalMrr: 115.0, deals: 11 },
    { month: 'May', verifiedMrr: 108.5, totalMrr: 142.8, deals: 14 },
    { month: 'Jun', verifiedMrr: 129.0, totalMrr: 165.4, deals: 18 },
    { month: 'Jul', verifiedMrr: 154.2, totalMrr: 198.0, deals: 23 },
    { month: 'Aug', verifiedMrr: 182.7, totalMrr: 234.5, deals: 29 }
  ];

  // Category Distribution
  const categoryStats = [
    { name: 'AI & Machine Learning', count: startups.filter(s => s.category.includes('AI')).length || 2, percent: 38, volume: '$1.8M' },
    { name: 'B2B SaaS', count: startups.filter(s => s.category === 'B2B SaaS').length || 2, percent: 32, volume: '$1.4M' },
    { name: 'DevTools & Infra', count: startups.filter(s => s.category.includes('DevTools')).length || 1, percent: 18, volume: '$650k' },
    { name: 'FinTech & Payments', count: startups.filter(s => s.category.includes('FinTech')).length || 1, percent: 12, volume: '$350k' }
  ];

  const handleConfirmReject = (reqId: string) => {
    rejectVerification(reqId, rejectNotes.trim() || 'Documentation did not match claimed recurring revenue.');
    setRejectReasonModal(null);
    setRejectNotes('');
  };

  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updatePlatformUser(editingUser.id, editingUser);
    setEditingUser(null);
  };

  const handleSaveStartupEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStartup) return;
    updateStartup(editingStartup.id, editingStartup);
    setEditingStartup(null);
  };

  const handleConfirmDeletePost = () => {
    if (!deleteModalPostId) return;
    updatePostModerationStatus(deleteModalPostId, 'deleted', deleteReasonInput);
    setDeleteModalPostId(null);
  };

  // Plan Builder Handlers
  const handleOpenCreatePlan = () => {
    setEditingPlan({
      id: `plan_${Date.now()}`,
      name: '',
      roleTarget: 'founder',
      priceMonthly: 99,
      priceAnnual: 79,
      tagline: '',
      popular: false,
      badgeText: '',
      isActive: true,
      features: [
        'Verified Stripe MRR Badge',
        'Direct VC pitch delivery',
        'AI Deal Memo & Diligence Access'
      ],
      limits: {
        canPitchAllInvestors: true,
        canViewRawFinancials: true,
        canAccessDiligenceRoom: true,
        hasVerifiedStripeBadge: true,
        aiDealMemoAudit: true,
        directFounderMessaging: true,
        exportDiligenceData: true,
        customDomainPitchDeck: false,
        syndicateCoInvestAccess: false
      }
    });
    setNewFeatureInput('');
    setIsPlanModalOpen(true);
  };

  const handleOpenEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan({ ...plan, features: [...plan.features] });
    setNewFeatureInput('');
    setIsPlanModalOpen(true);
  };

  const handleAddFeatureBullet = () => {
    if (!newFeatureInput.trim() || !editingPlan) return;
    setEditingPlan({
      ...editingPlan,
      features: [...editingPlan.features, newFeatureInput.trim()]
    });
    setNewFeatureInput('');
  };

  const handleRemoveFeatureBullet = (index: number) => {
    if (!editingPlan) return;
    setEditingPlan({
      ...editingPlan,
      features: editingPlan.features.filter((_, i) => i !== index)
    });
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    if (!editingPlan.name.trim()) {
      showToast('⚠️ Please provide a plan title.');
      return;
    }

    const exists = subscriptionPlans.some(p => p.id === editingPlan.id);
    if (exists) {
      updateSubscriptionPlan(editingPlan.id, editingPlan);
    } else {
      createSubscriptionPlan(editingPlan);
    }
    setIsPlanModalOpen(false);
    setEditingPlan(null);
  };

  const handleExportAuditCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Platform Members,${platformUsers.length}\n`
      + `Founders,${foundersCount}\n`
      + `Accredited Investors,${investorsCount}\n`
      + `Total Verified MRR,$${totalVerifiedRevenue}\n`
      + `Subscription MRR,$${subscriptionMRR}\n`
      + `Total Listed Startups,${startups.length}\n`
      + `Total Community Posts,${communityPosts.length}\n`
      + `Total Capital Ask Volume,$${totalAskVolume}\n`
      + `Audit Date,${new Date().toISOString()}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TrustMRR_Executive_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('📊 Platform financial & compliance audit exported to CSV.');
  };

  const handleOpenSendMessageModal = (targetIds: string[]) => {
    if (!targetIds.length) {
      showToast('⚠️ Please select at least one user to send a message.');
      return;
    }
    setMessageTargetUserIds(targetIds);
    setMessageSubject('');
    setMessageBody('');
    setIsSendMessageModalOpen(true);
  };

  const handleSendAdminMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageBody.trim() || !messageTargetUserIds.length) {
      showToast('⚠️ Please provide a message body.');
      return;
    }

    sendAdminDirectMessage(messageTargetUserIds, messageBody, messageSubject);
    setIsSendMessageModalOpen(false);
    setMessageTargetUserIds([]);
    setMessageSubject('');
    setMessageBody('');
    setSelectedUserIds([]);
  };

  const handleOpenReplySupportModal = (ticket: SupportTicket) => {
    setReplyModalTicket(ticket);
    setAdminReplyText(ticket.adminReply || ticket.resolutionNotes || '');
    setReplyNewStatus(ticket.status === 'open' ? 'in_progress' : ticket.status);
  };

  const handleSendSupportReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModalTicket || !adminReplyText.trim()) {
      showToast('⚠️ Please provide an official response message.');
      return;
    }

    replyToSupportTicket(replyModalTicket.id, adminReplyText.trim(), replyNewStatus);
    setReplyModalTicket(null);
    setAdminReplyText('');
  };

  // Filtered lists
  const filteredVerifications = verificationQueue.filter(v => filterVerificationStatus === 'all' || v.status === filterVerificationStatus);

  const filteredUsers = platformUsers.filter(u => {
    const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const matchSearch = !userSearchQuery.trim() || 
      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.companyOrFirm.toLowerCase().includes(userSearchQuery.toLowerCase());
    return matchRole && matchSearch;
  });

  const filteredStartups = startups.filter(s => {
    return !startupSearchQuery.trim() ||
      s.name.toLowerCase().includes(startupSearchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(startupSearchQuery.toLowerCase()) ||
      s.founderName.toLowerCase().includes(startupSearchQuery.toLowerCase());
  });

  const filteredPosts = communityPosts.filter(p => {
    const postStatus = p.moderationStatus || 'published';
    const matchStatus = postStatusFilter === 'all' || postStatus === postStatusFilter;
    const matchSearch = !postSearchQuery.trim() ||
      p.title.toLowerCase().includes(postSearchQuery.toLowerCase()) ||
      p.authorName.toLowerCase().includes(postSearchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(postSearchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const filteredSubscribers = subscribers.filter(s => {
    const matchStatus = subscriberStatusFilter === 'all' || s.status === subscriberStatusFilter;
    const matchSearch = !subscriberSearchQuery.trim() ||
      s.userName.toLowerCase().includes(subscriberSearchQuery.toLowerCase()) ||
      s.userEmail.toLowerCase().includes(subscriberSearchQuery.toLowerCase()) ||
      s.companyName.toLowerCase().includes(subscriberSearchQuery.toLowerCase()) ||
      s.planName.toLowerCase().includes(subscriberSearchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto text-[#0A1128]">
      {/* Admin Executive Header - Deep Navy with Gold Accents */}
      <div className="bg-[#0A1128] border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl text-white">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#162038] border border-amber-400/40 text-amber-400 text-xs font-bold mb-3 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Executive Admin & Operations Headquarters</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            Platform Management & Operations Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            Configure dynamic subscription tiers, audit Stripe MRR proofs, moderate venture discussions, manage subscriber lifecycles, and resolve support requests.
          </p>
        </div>

        {/* Global Action Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleExportAuditCSV}
            className="px-4 py-2.5 bg-[#162038] hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export Audit CSV</span>
          </button>

          <button
            onClick={() => showToast('🔄 Live Stripe Reconciliation triggered. All webhooks synchronized.')}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Zap className="w-4 h-4 text-slate-950" />
            <span>Sync Stripe Webhooks</span>
          </button>
        </div>
      </div>

      {/* 2-Column Responsive Layout: Left Navigation Sidebar + Right Content Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-3.5 sm:p-4 shadow-sm space-y-4 lg:sticky lg:top-20">
          {/* Sidebar Section 1: Overview & Analytics */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono px-3 block">
              Overview & Analytics
            </span>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#0A1128] text-white shadow-md shadow-slate-900/10'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-[#0A1128]'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <BarChart3 className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>Growth Dashboard</span>
              </div>
              <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
                activeTab === 'dashboard' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
              }`}>
                Live
              </span>
            </button>
          </div>

          {/* Sidebar Section 2: Monetization & Compliance */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono px-3 block">
              Monetization & Audits
            </span>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'subscriptions'
                  ? 'bg-[#0A1128] text-white shadow-md shadow-slate-900/10'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-[#0A1128]'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <CreditCard className={`w-4 h-4 ${activeTab === 'subscriptions' ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>Subscriptions Model</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                activeTab === 'subscriptions' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
              }`}>
                {subscriptionPlans.length} Plans
              </span>
            </button>

            <button
              onClick={() => setActiveTab('verifications')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'verifications'
                  ? 'bg-[#0A1128] text-white shadow-md shadow-slate-900/10'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-[#0A1128]'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className={`w-4 h-4 ${activeTab === 'verifications' ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>MRR Audits & KYC</span>
              </div>
              {pendingCount > 0 && (
                <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>

          {/* Sidebar Section 3: Directory Management */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono px-3 block">
              Directory & Deals
            </span>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-[#0A1128] text-white shadow-md shadow-slate-900/10'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-[#0A1128]'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Users className={`w-4 h-4 ${activeTab === 'users' ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>User Profiles</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                activeTab === 'users' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
              }`}>
                {platformUsers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('startups')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'startups'
                  ? 'bg-[#0A1128] text-white shadow-md shadow-slate-900/10'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-[#0A1128]'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Rocket className={`w-4 h-4 ${activeTab === 'startups' ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>Startup Listings</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                activeTab === 'startups' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
              }`}>
                {startups.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('posts')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'posts'
                  ? 'bg-[#0A1128] text-white shadow-md shadow-slate-900/10'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-[#0A1128]'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <MessageSquare className={`w-4 h-4 ${activeTab === 'posts' ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>Feed Moderation</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                activeTab === 'posts' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
              }`}>
                {totalPostsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('pitches')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pitches'
                  ? 'bg-[#0A1128] text-white shadow-md shadow-slate-900/10'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-[#0A1128]'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <FileText className={`w-4 h-4 ${activeTab === 'pitches' ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>Pitch Oversight</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                activeTab === 'pitches' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
              }`}>
                {pitchRequests.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('investor_interests')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'investor_interests'
                  ? 'bg-[#0A1128] text-white shadow-md shadow-slate-900/10'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-[#0A1128]'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Sparkles className={`w-4 h-4 ${activeTab === 'investor_interests' ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>Investor Deal Signals</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                activeTab === 'investor_interests' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
              }`}>
                {investorInterests.length}
              </span>
            </button>
          </div>

          {/* Sidebar Section 4: Support & System */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono px-3 block">
              Support & System
            </span>
            <button
              onClick={() => setActiveTab('support')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'support'
                  ? 'bg-[#0A1128] text-white shadow-md shadow-slate-900/10'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-[#0A1128]'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <LifeBuoy className={`w-4 h-4 ${activeTab === 'support' ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>Support Desk</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                activeTab === 'support' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
              }`}>
                {supportTickets.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('audit_logs')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'audit_logs'
                  ? 'bg-[#0A1128] text-white shadow-md shadow-slate-900/10'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-[#0A1128]'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <History className={`w-4 h-4 ${activeTab === 'audit_logs' ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>Audit Logs</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                activeTab === 'audit_logs' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
              }`}>
                {auditLogs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#0A1128] text-white shadow-md shadow-slate-900/10'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-[#0A1128]'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Sliders className={`w-4 h-4 ${activeTab === 'settings' ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>System Config</span>
              </div>
            </button>
          </div>
        </aside>

        {/* Right Main Content Workspace */}
        <main className="lg:col-span-9 min-w-0 space-y-6">
          {/* ========================================================================= */}
          {/* TAB: EXECUTIVE GROWTH DASHBOARD */}
          {/* ========================================================================= */}
          {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Time Range Filter Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold text-[#0A1128] font-mono uppercase tracking-wider">Analytics Window:</span>
              {(['7d', '30d', 'qtd', '1y'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setAnalyticsTimeRange(t)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                    analyticsTimeRange === t
                      ? 'bg-[#0A1128] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Telemetry Synchronized with Stripe OAuth & Venture Ledger</span>
            </div>
          </div>

          {/* Core Analytics KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1: Total Founders */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold font-mono border border-emerald-200 flex items-center space-x-1">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>+28% MoM</span>
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Registered Founders</span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <h3 className="text-2xl font-extrabold text-[#0A1128] font-mono">{foundersCount} Founders</h3>
                  <span className="text-xs text-slate-500 font-medium">({startups.length} Startups)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {startups.filter(s => s.isVerified).length} verified via live Stripe OAuth APIs
                </p>
              </div>
            </div>

            {/* Card 2: Total Investors */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#0A1128] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 font-extrabold font-mono border border-amber-300">
                  Accredited
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Accredited Investors & VCs</span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <h3 className="text-2xl font-extrabold text-[#0A1128] font-mono">{investorsCount} Active VCs</h3>
                  <span className="text-xs text-slate-500 font-medium">(Syndicates)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Lead check sizes ranging $50k to $1.5M per deal
                </p>
              </div>
            </div>

            {/* Card 3: Subscription Platform MRR */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-900 font-bold font-mono border border-indigo-200">
                  SaaS MRR
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Platform Subscription MRR</span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <h3 className="text-2xl font-extrabold text-[#0A1128] font-mono">${subscriptionMRR}/mo</h3>
                  <span className="text-xs text-slate-500 font-medium">(${(subscriptionARR / 1000).toFixed(1)}k ARR)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {subscribers.filter(s => s.status === 'active').length} active paid subscribers
                </p>
              </div>
            </div>

            {/* Card 4: Verified MRR Under Audit */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold font-mono border border-emerald-200">
                  +{averageGrowthRate}% MoM Avg
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Verified Platform MRR</span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <h3 className="text-2xl font-extrabold text-[#0A1128] font-mono">${(totalVerifiedRevenue / 1000).toFixed(1)}k/mo</h3>
                  <span className="text-xs text-slate-500 font-medium">(${(totalPlatformArr / 1000000).toFixed(2)}M ARR)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  100% verified via automated Stripe & ChartMogul tokens
                </p>
              </div>
            </div>

            {/* Card 5: Total Capital Raising Volume */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-[#0A1128]" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold font-mono">
                  Active Ask
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Active Capital Ask Volume</span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <h3 className="text-2xl font-extrabold text-[#0A1128] font-mono">${(totalAskVolume / 1000000).toFixed(2)}M</h3>
                  <span className="text-xs text-slate-500 font-medium">(${(totalValuationVolume / 1000000).toFixed(1)}M Val)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Pre-Seed and Seed rounds on standard Post-Money SAFEs
                </p>
              </div>
            </div>

            {/* Card 6: Deal Inbounds & Pitch Pipeline */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-700" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold font-mono">
                  CRM Active
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Inbound Pitch Deals</span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <h3 className="text-2xl font-extrabold text-[#0A1128] font-mono">{pitchRequests.length} Pitches</h3>
                  <span className="text-xs text-slate-500 font-medium">({pendingCount} KYC Pending)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Average response turnaround time: 36 hours
                </p>
              </div>
            </div>

            {/* Card 7: Support Desk Telemetry */}
            <div
              onClick={() => setActiveTab('support')}
              className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden cursor-pointer hover:border-amber-400 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <LifeBuoy className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold font-mono border border-blue-200">
                  SLA &lt;4h Avg
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Support Desk Operations</span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <h3 className="text-2xl font-extrabold text-[#0A1128] font-mono">{supportTickets.length} Tickets</h3>
                  <span className="text-xs text-amber-700 font-extrabold font-mono">
                    ({supportTickets.filter(t => t.status === 'open').length} Open)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {supportTickets.filter(t => t.status === 'resolved').length} resolved with official compliance reply
                </p>
              </div>
            </div>
          </div>

          {/* Growth Charts & Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-base text-[#0A1128] font-mono">Platform Revenue & MRR Growth Curve</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Aggregated Stripe-verified recurring revenue vs total volume ($k/mo)</p>
                </div>
                <div className="flex items-center space-x-3 text-xs font-bold">
                  <span className="flex items-center space-x-1 text-[#0A1128]">
                    <span className="w-3 h-3 rounded bg-[#0A1128]"></span>
                    <span>Verified Stripe MRR</span>
                  </span>
                  <span className="flex items-center space-x-1 text-amber-500">
                    <span className="w-3 h-3 rounded bg-amber-400"></span>
                    <span>Total Listings MRR</span>
                  </span>
                </div>
              </div>

              {/* Bar Visualizer */}
              <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
                {monthlyRevenueData.map((item) => (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] font-mono font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      ${item.verifiedMrr}k
                    </div>

                    <div className="w-full flex items-end justify-center gap-1.5 h-48 bg-slate-50 rounded-2xl p-1.5 border border-slate-100 relative">
                      <div 
                        style={{ height: `${(item.totalMrr / 250) * 100}%` }}
                        className="w-1/2 bg-amber-300 rounded-xl transition-all group-hover:bg-amber-400"
                        title={`Total MRR: $${item.totalMrr}k`}
                      ></div>
                      <div 
                        style={{ height: `${(item.verifiedMrr / 250) * 100}%` }}
                        className="w-1/2 bg-[#0A1128] rounded-xl transition-all group-hover:bg-[#162038]"
                        title={`Verified MRR: $${item.verifiedMrr}k`}
                      ></div>
                    </div>

                    <span className="text-xs font-bold text-slate-600 font-mono">{item.month}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                <span>Verified growth trajectory: <strong>+312% YTD</strong></span>
                <span className="font-mono text-emerald-600 font-bold">Stripe Webhook Health: 99.98% uptime</span>
              </div>
            </div>

            {/* Category Allocation */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-base text-[#0A1128] font-mono">Category Allocation</h3>
                <p className="text-xs text-slate-500 mt-0.5">Distribution of platform deal volume</p>
              </div>

              <div className="space-y-4">
                {categoryStats.map(cat => (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0A1128] truncate">{cat.name}</span>
                      <span className="font-mono font-bold text-slate-700">{cat.volume} ({cat.percent}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${cat.percent}%` }}
                        className="h-full bg-gradient-to-r from-amber-400 to-[#0A1128] rounded-full"
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Market Insight</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  AI & Developer Infra startups hold the highest median valuation multiple on TrustMRR at <strong>12.4x ARR</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: SUBSCRIPTIONS MODEL & PLAN BUILDER (Full Admin Control) */}
      {/* ========================================================================= */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Subscriptions Top Header & Sub-Nav */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-bold mb-2">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>Subscription Management Engine</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#0A1128] font-mono">
                Subscription Plans, Pricing & Subscribers Suite
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Build custom tiers, set feature entitlement permissions, grant VIP sponsorships, and manage subscriber billing.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={handleOpenCreatePlan}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span>Build New Subscription Plan</span>
              </button>
            </div>
          </div>

          {/* Subscriptions KPI Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">SUBSCRIPTION MRR</span>
              <p className="text-2xl font-extrabold font-mono text-[#0A1128]">${subscriptionMRR}/mo</p>
              <span className="text-xs text-emerald-600 font-bold">+18.4% MoM</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">ANNUAL RUN RATE (ARR)</span>
              <p className="text-2xl font-extrabold font-mono text-[#0A1128]">${(subscriptionARR / 1000).toFixed(1)}k/yr</p>
              <span className="text-xs text-slate-500">Contracted Revenue</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">ACTIVE SUBSCRIBERS</span>
              <p className="text-2xl font-extrabold font-mono text-[#0A1128]">
                {subscribers.filter(s => s.status === 'active').length}
              </p>
              <span className="text-xs text-slate-500">{subscribers.length} Lifetime Accounts</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">LIVE PUBLISHED PLANS</span>
              <p className="text-2xl font-extrabold font-mono text-[#0A1128]">
                {subscriptionPlans.filter(p => p.isActive !== false).length}
              </p>
              <span className="text-xs text-amber-600 font-bold">Dynamic Tier Matrix</span>
            </div>
          </div>

          {/* Sub Navigation Bar */}
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setSubscriptionSubTab('plans')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-2 ${
                subscriptionSubTab === 'plans'
                  ? 'bg-[#0A1128] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Plans & Tier Builder ({subscriptionPlans.length})</span>
            </button>

            <button
              onClick={() => setSubscriptionSubTab('subscribers')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-2 ${
                subscriptionSubTab === 'subscribers'
                  ? 'bg-[#0A1128] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Active Subscribers CRM ({subscribers.length})</span>
            </button>

            <button
              onClick={() => setSubscriptionSubTab('analytics')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-2 ${
                subscriptionSubTab === 'analytics'
                  ? 'bg-[#0A1128] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Revenue & Tier Analytics</span>
            </button>
          </div>

          {/* SUB-TAB 1: PLANS & TIER BUILDER */}
          {subscriptionSubTab === 'plans' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {subscriptionPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-3xl p-6 border shadow-sm flex flex-col justify-between space-y-4 relative ${
                      plan.popular ? 'border-2 border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-6 bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full tracking-wider shadow-sm">
                        {plan.badgeText || 'Most Popular'}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-extrabold text-base text-[#0A1128] font-mono">{plan.name}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold uppercase font-mono">
                              {plan.roleTarget}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 min-h-[32px] leading-relaxed">{plan.tagline}</p>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          plan.isActive !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {plan.isActive !== false ? 'Live' : 'Draft'}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 font-mono">
                        <div className="flex items-baseline space-x-1">
                          <span className="text-2xl font-extrabold text-[#0A1128]">${plan.priceMonthly}</span>
                          <span className="text-xs text-slate-500 font-medium">/month</span>
                        </div>
                        <div className="text-[11px] text-amber-700 font-bold mt-0.5">
                          ${plan.priceAnnual}/mo (Billed annually: ${plan.priceAnnual * 12}/yr)
                        </div>
                      </div>

                      {/* Feature bullets */}
                      <div className="space-y-1.5 text-xs text-slate-700 pt-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Features Included:</span>
                        {plan.features.map((f, i) => (
                          <div key={i} className="flex items-start space-x-2 text-[11px]">
                            <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span className="leading-tight text-slate-600">{f}</span>
                          </div>
                        ))}
                      </div>

                      {/* Entitlements checklist */}
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1 text-[11px] font-mono">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block font-sans">Permissions Matrix:</span>
                        <div className="grid grid-cols-2 gap-1 text-[10px]">
                          <span className={plan.limits.canPitchAllInvestors ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                            {plan.limits.canPitchAllInvestors ? '✓ Unlimited Pitches' : '✗ 3 Pitches/mo'}
                          </span>
                          <span className={plan.limits.hasVerifiedStripeBadge ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                            {plan.limits.hasVerifiedStripeBadge ? '✓ Stripe Badge' : '✗ No Badge'}
                          </span>
                          <span className={plan.limits.canAccessDiligenceRoom ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                            {plan.limits.canAccessDiligenceRoom ? '✓ Diligence Room' : '✗ No Room'}
                          </span>
                          <span className={plan.limits.aiDealMemoAudit ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                            {plan.limits.aiDealMemoAudit ? '✓ AI Deal Memo' : '✗ No AI Memo'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                      <button
                        onClick={() => togglePlanActive(plan.id)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        {plan.isActive !== false ? 'Deactivate' : 'Activate Live'}
                      </button>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleOpenEditPlan(plan)}
                          className="px-3 py-1.5 bg-[#0A1128] hover:bg-[#162038] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => deleteSubscriptionPlan(plan.id)}
                          className="p-1.5 bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-300 rounded-xl transition-colors cursor-pointer"
                          title="Archive Plan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB 2: ACTIVE SUBSCRIBERS CRM */}
          {subscriptionSubTab === 'subscribers' && (
            <div className="space-y-6">
              {/* Filter and Search */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto">
                  {(['all', 'active', 'trialing', 'past_due', 'canceled'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => setSubscriberStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize cursor-pointer ${
                        subscriberStatusFilter === st
                          ? 'bg-[#0A1128] text-white shadow-xs'
                          : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-72 shrink-0">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={subscriberSearchQuery}
                    onChange={(e) => setSubscriberSearchQuery(e.target.value)}
                    placeholder="Search subscriber, email, plan..."
                    className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Subscribers Table */}
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3.5 px-5">Subscriber</th>
                        <th className="py-3.5 px-4">Plan & Tier</th>
                        <th className="py-3.5 px-4">Billing & Amount</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Renews At</th>
                        <th className="py-3.5 px-5 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredSubscribers.map(sub => (
                        <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-5">
                            <div className="flex items-center space-x-3">
                              {sub.userAvatar ? (
                                <img src={sub.userAvatar} alt={sub.userName} className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-[#0A1128] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                  {sub.userName.substring(0, 2)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <span className="font-extrabold text-[#0A1128] block truncate">{sub.userName}</span>
                                <span className="text-[10px] text-slate-500 truncate block">{sub.userEmail}</span>
                                <span className="text-[10px] text-slate-400 truncate block">{sub.companyName} • {sub.userRole}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <select
                              value={sub.planId}
                              onChange={(e) => updateSubscriberPlan(sub.id, e.target.value)}
                              className="bg-slate-100 border border-slate-300 text-[#0A1128] font-bold text-[11px] rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                            >
                              {subscriptionPlans.map(p => (
                                <option key={p.id} value={p.id}>
                                  {p.name} (${p.priceMonthly}/mo)
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className="py-3.5 px-4 font-mono">
                            <span className="font-extrabold text-[#0A1128] block">${sub.amount}</span>
                            <span className="text-[10px] text-slate-500 uppercase font-bold">{sub.billingCycle}</span>
                            <span className="text-[9px] text-slate-400 block truncate">{sub.paymentMethod}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                              sub.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : sub.status === 'past_due'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              {sub.status.replace('_', ' ')}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                            {sub.renewsAt}
                          </td>

                          <td className="py-3.5 px-5 text-right space-x-1.5">
                            <button
                              onClick={() => grantComplimentaryVIP(sub.userId, sub.planId)}
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                              title="Grant 100% Free VIP Complimentary Access"
                            >
                              Grant VIP Free
                            </button>

                            <button
                              onClick={() => extendSubscriptionRenewal(sub.id, 30)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                              title="Extend Renewal Date by 30 days"
                            >
                              +30 Days
                            </button>

                            {sub.status !== 'canceled' && (
                              <button
                                onClick={() => cancelUserSubscription(sub.id)}
                                className="p-1 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                title="Cancel Subscription"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 3: REVENUE & TIER ANALYTICS */}
          {subscriptionSubTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="font-extrabold text-base text-[#0A1128] font-mono">Subscriber Tier Distribution</h4>
                <div className="space-y-3 pt-2">
                  {subscriptionPlans.map(plan => {
                    const count = subscribers.filter(s => s.planId === plan.id).length;
                    const percent = Math.round((count / (subscribers.length || 1)) * 100);
                    return (
                      <div key={plan.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#0A1128]">{plan.name}</span>
                          <span className="font-mono text-slate-600">{count} members ({percent}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${percent}%` }}
                            className="h-full bg-gradient-to-r from-amber-400 to-[#0A1128] rounded-full"
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="font-extrabold text-base text-[#0A1128] font-mono">Pricing Economics & LTV</h4>
                <div className="grid grid-cols-2 gap-4 font-mono pt-2">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Average ARPU</span>
                    <span className="text-xl font-extrabold text-[#0A1128]">${Math.round(subscriptionMRR / (subscribers.length || 1))}/mo</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Estimated LTV</span>
                    <span className="text-xl font-extrabold text-amber-700">${Math.round((subscriptionMRR / (subscribers.length || 1)) * 14)}</span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Stripe Billing Engine Status</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Automated credit card charge retries and dunning management active with 99.4% payment collection efficiency.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: FEED MODERATION */}
      {/* ========================================================================= */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          {/* 4 Stat Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">PUBLISHED</span>
                <Bookmark className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-extrabold font-mono text-[#0A1128]">{publishedPostsCount}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">HELD FOR REVIEW</span>
                <ShieldCheck className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-extrabold font-mono text-[#0A1128]">{heldPostsCount}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">DELETED</span>
                <Trash2 className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-2xl font-extrabold font-mono text-[#0A1128]">{deletedPostsCount}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">TOTAL POSTS</span>
                <BarChart3 className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-extrabold font-mono text-[#0A1128]">{totalPostsCount}</p>
            </div>
          </div>

          {/* Search & Status Filter */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={postSearchQuery}
                onChange={(e) => setPostSearchQuery(e.target.value)}
                placeholder="Search post or author"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="w-full sm:w-48 shrink-0">
              <select
                value={postStatusFilter}
                onChange={(e) => setPostStatusFilter(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 text-[#0A1128] font-bold text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="held">Held for Review</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>
          </div>

          {/* Moderation Post Cards */}
          <div className="space-y-4">
            {filteredPosts.map(post => {
              const status = post.moderationStatus || 'published';
              const wordCount = post.content.split(/\s+/).length;

              return (
                <div
                  key={post.id}
                  className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-xs text-[#0A1128]">{post.authorName}</span>
                          <span className="text-[10px] px-2 py-0.2 rounded bg-amber-100 text-amber-900 font-mono font-bold">
                            {post.authorRole}
                          </span>
                          <span className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold uppercase border ${
                            status === 'published'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : status === 'held'
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : 'bg-red-50 text-red-800 border-red-200'
                          }`}>
                            {status.toUpperCase()}
                          </span>
                          {post.isPinned && (
                            <span className="text-[10px] px-2 py-0.2 rounded bg-[#0A1128] text-amber-400 font-mono font-bold flex items-center space-x-1">
                              <Pin className="w-2.5 h-2.5" />
                              <span>PINNED</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {post.authorCompany} • {post.category} • {new Date(post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => togglePinCommunityPost(post.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer ${
                          post.isPinned
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <Pin className="w-3 h-3" />
                        <span>{post.isPinned ? 'Unpin' : 'Pin'}</span>
                      </button>

                      {status !== 'deleted' ? (
                        <>
                          <button
                            onClick={() => updatePostModerationStatus(post.id, status === 'held' ? 'published' : 'held')}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            {status === 'held' ? 'Release' : 'Hold'}
                          </button>
                          <button
                            onClick={() => setDeleteModalPostId(post.id)}
                            className="px-3 py-1 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 text-red-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => updatePostModerationStatus(post.id, 'published')}
                          className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-[#0A1128]">{post.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 italic">"{post.content}"</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 font-mono">
                    <div className="flex items-center space-x-4">
                      <span>❤️ {post.likesCount} Likes</span>
                      <span>🔄 {post.sharesCount || 0} Shares</span>
                      <span>📝 {wordCount} Words</span>
                      {post.deletionReason && (
                        <span className="text-red-600 font-bold uppercase font-sans">
                          Reason: {post.deletionReason}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setExpandedPostCommentsId(expandedPostCommentsId === post.id ? null : post.id)}
                      className="text-amber-700 hover:underline font-bold cursor-pointer font-sans"
                    >
                      💬 {post.comments.length} Comments (Moderate)
                    </button>
                  </div>

                  {/* Inline Comments */}
                  {expandedPostCommentsId === post.id && (
                    <div className="mt-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                      <h5 className="font-extrabold text-xs text-[#0A1128]">Moderate Comments</h5>
                      {post.comments.map(comm => (
                        <div key={comm.id} className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <strong className="text-[#0A1128]">{comm.authorName}:</strong>{' '}
                            <span className="text-slate-600">{comm.content}</span>
                          </div>
                          <button
                            onClick={() => deleteCommunityComment(post.id, comm.id)}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: USERS MANAGEMENT & MESSAGING */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Action Header: Search, Filter, and Broadcast Controls */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-extrabold text-[#0A1128] font-mono">Member Account Directory & Personal Messaging</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">Audit member permissions, edit subscriptions, or send direct administrative messages to selected users.</p>
              </div>

              <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                <button
                  onClick={() => handleOpenSendMessageModal(selectedUserIds)}
                  disabled={selectedUserIds.length === 0}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    selectedUserIds.length > 0
                      ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md shadow-amber-500/20'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Message Selected ({selectedUserIds.length})</span>
                </button>

                <button
                  onClick={() => handleOpenSendMessageModal(filteredUsers.map(u => u.id))}
                  className="px-3.5 py-2 bg-[#0A1128] hover:bg-[#162038] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>Message Filtered ({filteredUsers.length})</span>
                </button>

                <button
                  onClick={() => handleOpenSendMessageModal(platformUsers.map(u => u.id))}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-slate-600" />
                  <span>Broadcast All ({platformUsers.length})</span>
                </button>
              </div>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto">
                {(['all', 'founder', 'investor', 'admin'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => setUserRoleFilter(role)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all capitalize cursor-pointer ${
                      userRoleFilter === role
                        ? 'bg-[#0A1128] text-white shadow-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {role === 'all' ? 'All Roles' : `${role}s`}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-80 shrink-0">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Search user name, email, firm..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* User Table with Multi-Select */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-600 font-mono uppercase text-[10px]">
                    <th className="py-3.5 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={filteredUsers.length > 0 && filteredUsers.every(u => selectedUserIds.includes(u.id))}
                        onChange={() => {
                          const allSelected = filteredUsers.every(u => selectedUserIds.includes(u.id));
                          if (allSelected) {
                            setSelectedUserIds([]);
                          } else {
                            setSelectedUserIds(filteredUsers.map(u => u.id));
                          }
                        }}
                        className="rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-4 font-bold min-w-[220px]">Member</th>
                    <th className="py-3.5 px-4 font-bold min-w-[140px]">Role & Plan</th>
                    <th className="py-3.5 px-4 font-bold min-w-[100px]">Status</th>
                    <th className="py-3.5 px-4 font-bold min-w-[150px]">Badges & KYC</th>
                    <th className="py-3.5 px-4 font-bold min-w-[100px]">Joined</th>
                    <th className="py-3.5 px-5 font-bold text-right min-w-[130px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredUsers.map(u => {
                    const isSelected = selectedUserIds.includes(u.id);
                    return (
                      <tr key={u.id} className={`hover:bg-slate-50/80 transition-colors align-middle ${isSelected ? 'bg-amber-50/40' : ''}`}>
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedUserIds(prev => 
                                prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id]
                              );
                            }}
                            className="rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                          />
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="font-extrabold text-[#0A1128] block truncate">{u.name}</span>
                              <span className="text-[11px] text-slate-500 truncate block">{u.email}</span>
                              <span className="text-[10px] text-slate-400 truncate block">{u.title} • {u.companyOrFirm}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <select
                              value={u.role}
                              onChange={(e) => changeUserRole(u.id, e.target.value as UserRole)}
                              className="bg-slate-100 border border-slate-300 text-[#0A1128] font-bold text-[11px] rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
                            >
                              <option value="founder">Founder</option>
                              <option value="investor">Investor</option>
                              <option value="admin">Admin</option>
                            </select>
                            <span className="block text-[10px] text-slate-500 font-mono uppercase font-bold">
                              Tier: {u.subscriptionTier}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleUserStatus(u.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase font-mono border cursor-pointer ${
                              u.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200'
                                : 'bg-red-50 text-red-700 border-red-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                            }`}
                          >
                            {u.status}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 space-y-1 whitespace-nowrap">
                          <button
                            onClick={() => toggleUserAccredited(u.id)}
                            className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border block cursor-pointer ${
                              u.isAccredited
                                ? 'bg-amber-50 text-amber-900 border-amber-300'
                                : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700'
                            }`}
                          >
                            {u.isAccredited ? '✓ Accredited VC' : '+ Grant Accredited'}
                          </button>
                          <button
                            onClick={() => toggleUserStripeVerified(u.id)}
                            className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border block cursor-pointer ${
                              u.isStripeVerified
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700'
                            }`}
                          >
                            {u.isStripeVerified ? '🛡️ Stripe Verified' : '+ Grant Stripe Badge'}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-[11px] text-slate-500 font-mono whitespace-nowrap">
                          {u.joinedAt}
                        </td>

                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleOpenSendMessageModal([u.id])}
                              className="p-1.5 bg-[#0A1128] hover:bg-[#162038] text-white rounded-lg transition-colors cursor-pointer shadow-xs"
                              title="Send direct personal message"
                            >
                              <Send className="w-3.5 h-3.5 text-amber-400" />
                            </button>
                            <button
                              onClick={() => setEditingUser(u)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                              title="Edit user profile"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deletePlatformUser(u.id)}
                              className="p-1.5 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 text-red-600 rounded-lg transition-colors cursor-pointer"
                              title="Delete user"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: STARTUPS DIRECTORY MODERATION */}
      {/* ========================================================================= */}
      {activeTab === 'startups' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
            <h3 className="font-extrabold text-sm text-[#0A1128]">
              Manage Listed Startups ({startups.length})
            </h3>

            <div className="relative w-72 shrink-0">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={startupSearchQuery}
                onChange={(e) => setStartupSearchQuery(e.target.value)}
                placeholder="Search startups, categories..."
                className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-5">Startup & Founder</th>
                    <th className="py-3.5 px-4">Financials & MRR</th>
                    <th className="py-3.5 px-4">Round Target</th>
                    <th className="py-3.5 px-4">Badges & Flags</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredStartups.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center space-x-3">
                          <img
                            src={s.logo}
                            alt={s.name}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-extrabold text-[#0A1128] block truncate">{s.name}</span>
                            <span className="text-[10px] text-slate-500 truncate block">{s.category} • {s.stage}</span>
                            <span className="text-[10px] text-slate-400 truncate block">Founder: {s.founderName}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-extrabold text-[#0A1128] block">${(s.mrr / 1000).toFixed(1)}k MRR</span>
                        <span className="text-[10px] text-amber-600 block">+{s.growthRateMoM}% MoM</span>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-[#0A1128] block">{s.targetRound}</span>
                        <span className="text-[11px] text-slate-500 block">Ask: ${(s.askAmount / 1000).toFixed(0)}k</span>
                      </td>

                      <td className="py-3.5 px-4 space-y-1">
                        <button
                          onClick={() => toggleVerifyStartup(s.id)}
                          className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border block cursor-pointer ${
                            s.isVerified
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700'
                          }`}
                        >
                          {s.isVerified ? '🛡️ Stripe Verified' : '+ Verify Stripe'}
                        </button>
                        <button
                          onClick={() => toggleFeatureStartup(s.id)}
                          className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border block cursor-pointer ${
                            s.featured
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700'
                          }`}
                        >
                          {s.featured ? '⭐ Featured' : '+ Feature'}
                        </button>
                      </td>

                      <td className="py-3.5 px-5 text-right space-x-1.5">
                        <button
                          onClick={() => setSelectedStartup(s)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingStartup(s)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteStartup(s.id)}
                          className="p-1.5 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 text-red-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: MRR AUDITS & VERIFICATIONS */}
      {/* ========================================================================= */}
      {activeTab === 'verifications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterVerificationStatus(status)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all capitalize cursor-pointer ${
                    filterVerificationStatus === status
                      ? 'bg-[#0A1128] text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {status} Requests
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredVerifications.length} verification requests
            </span>
          </div>

          <div className="space-y-4">
            {filteredVerifications.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-extrabold text-[#0A1128] font-mono">{req.startupName}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase font-mono border ${
                        req.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : req.status === 'rejected'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-amber-50 text-amber-900 border-amber-300'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Submitted by <strong>{req.founderName}</strong> ({req.founderEmail}) • {new Date(req.submittedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200 shrink-0 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Claimed MRR</span>
                      <span className="font-extrabold text-[#0A1128]">${(req.claimedMrr / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="border-l border-slate-200 pl-4">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">MoM Growth</span>
                      <span className="font-extrabold text-amber-600">+{req.growthRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center space-x-2 font-bold text-slate-700">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span>Audit Mechanism: {req.proofType}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed pl-6">{req.proofDetails}</p>
                </div>

                {req.status === 'pending' && (
                  <div className="flex items-center justify-end space-x-3 pt-2">
                    <button
                      onClick={() => setRejectReasonModal(req.id)}
                      className="px-4 py-2 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 text-red-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Reject Proof
                    </button>
                    <button
                      onClick={() => approveVerification(req.id)}
                      className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer transform hover:-translate-y-0.5"
                    >
                      ✓ Approve & Issue Verified Stripe Badge
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: PITCHES OVERSIGHT */}
      {/* ========================================================================= */}
      {activeTab === 'pitches' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#0A1128]">
              Investor Pitch Deal Flow Oversight ({pitchRequests.length} Total Inbounds)
            </h3>
            <span className="text-xs text-slate-500 font-mono">Live Transaction Pipeline</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-5">Startup & Founder</th>
                    <th className="py-3.5 px-4">Target Investor</th>
                    <th className="py-3.5 px-4">Terms & Ask</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Submitted</th>
                    <th className="py-3.5 px-5 text-right">Pitch Deck</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {pitchRequests.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-[#0A1128]">{p.startupName}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-[#0A1128] block">{p.investorName}</span>
                        <span className="text-[10px] text-slate-500 block">{p.investorFirm}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-[#0A1128] block">${(p.checkAmount / 1000).toFixed(0)}k Check</span>
                        <span className="text-[10px] text-slate-500 block">Val: ${(p.valuation / 1000000).toFixed(1)}M</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold font-mono uppercase bg-amber-50 text-amber-900 border border-amber-200">
                          {p.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <a
                          href={p.deckUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] inline-flex items-center space-x-1"
                        >
                          <span>Deck</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: SUPPORT DESK WORKSPACE */}
      {/* ========================================================================= */}
      {activeTab === 'support' && (
        <div className="space-y-6 text-[#0A1128]">
          {/* Header Banner */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-bold mb-2">
                <LifeBuoy className="w-3.5 h-3.5 text-amber-600" />
                <span>Executive Operations Support Suite</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#0A1128] font-mono">
                Support Desk & Member Inquiries
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Audit inbound help requests, reply to support inquiries, change ticket statuses, or dispatch direct chat messages.
              </p>
            </div>

            <button
              onClick={() => setIsSupportModalOpen(true)}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Test Submit Support Ticket</span>
            </button>
          </div>

          {/* 4 Stat Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">TOTAL TICKETS</span>
              <p className="text-2xl font-extrabold font-mono text-[#0A1128]">{supportTickets.length}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-600">OPEN TICKETS</span>
              <p className="text-2xl font-extrabold font-mono text-amber-600">
                {supportTickets.filter(t => t.status === 'open').length}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-blue-600">IN PROGRESS</span>
              <p className="text-2xl font-extrabold font-mono text-blue-600">
                {supportTickets.filter(t => t.status === 'in_progress').length}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-600">RESOLVED</span>
              <p className="text-2xl font-extrabold font-mono text-emerald-600">
                {supportTickets.filter(t => t.status === 'resolved').length}
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={supportSearchQuery}
                onChange={(e) => setSupportSearchQuery(e.target.value)}
                placeholder="Search ticket subject, user email, name..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="w-full sm:w-56 shrink-0">
              <select
                value={supportFilterStatus}
                onChange={(e) => setSupportFilterStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 text-[#0A1128] font-bold text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="all">All Ticket Statuses ({supportTickets.length})</option>
                <option value="open">🔥 Open ({supportTickets.filter(t => t.status === 'open').length})</option>
                <option value="in_progress">💬 In Progress ({supportTickets.filter(t => t.status === 'in_progress').length})</option>
                <option value="resolved">✓ Resolved ({supportTickets.filter(t => t.status === 'resolved').length})</option>
              </select>
            </div>
          </div>

          {/* Support Ticket Cards */}
          <div className="space-y-4">
            {supportTickets
              .filter(t => {
                const matchSearch = !supportSearchQuery ||
                  t.subject.toLowerCase().includes(supportSearchQuery.toLowerCase()) ||
                  t.message.toLowerCase().includes(supportSearchQuery.toLowerCase()) ||
                  t.userName.toLowerCase().includes(supportSearchQuery.toLowerCase()) ||
                  t.userEmail.toLowerCase().includes(supportSearchQuery.toLowerCase());
                const matchStatus = supportFilterStatus === 'all' || t.status === supportFilterStatus;
                return matchSearch && matchStatus;
              })
              .map(t => (
                <div
                  key={t.id}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        #{t.id}
                      </span>
                      <h4 className="font-extrabold text-base text-[#0A1128]">{t.subject}</h4>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {/* Priority Pill */}
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full font-mono border ${
                        t.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                        t.priority === 'medium' ? 'bg-amber-50 text-amber-900 border-amber-300' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {t.priority === 'high' ? '🔴 High Priority' : t.priority === 'medium' ? '🟡 Medium' : '🟢 Low'}
                      </span>

                      {/* Status Dropdown */}
                      <select
                        value={t.status}
                        onChange={(e) => updateTicketStatus(t.id, e.target.value as any)}
                        className={`text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-full border cursor-pointer ${
                          t.status === 'open' ? 'bg-amber-100 text-amber-950 border-amber-300' :
                          t.status === 'in_progress' ? 'bg-blue-100 text-blue-950 border-blue-300' :
                          'bg-emerald-100 text-emerald-950 border-emerald-300'
                        }`}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  {/* Author Info & Message */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[#0A1128]">{t.userName}</span>
                        <span>({t.userEmail})</span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-bold">
                          {t.userRole}
                        </span>
                      </div>
                      <span className="font-mono">{t.createdAt}</span>
                    </div>

                    <p className="text-slate-700 leading-relaxed pt-1">
                      {t.message}
                    </p>
                  </div>

                  {/* Official Admin Reply Box if present */}
                  {(t.adminReply || t.resolutionNotes) && (
                    <div className="bg-[#0A1128] text-white p-4 rounded-2xl border border-amber-400/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-xs font-extrabold font-mono text-amber-400">Official Admin Resolution</span>
                        </div>
                        {t.repliedAt && <span className="text-[10px] text-slate-400 font-mono">{t.repliedAt}</span>}
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-normal">
                        {t.adminReply || t.resolutionNotes}
                      </p>
                    </div>
                  )}

                  {/* Action Toolbar */}
                  <div className="flex items-center justify-end space-x-3 pt-1">
                    <button
                      onClick={() => {
                        const targetUser = platformUsers.find(u => u.email.toLowerCase() === t.userEmail.toLowerCase());
                        if (targetUser) {
                          handleOpenSendMessageModal([targetUser.id]);
                        } else {
                          showToast(`✉️ Sending direct message to ${t.userName}`);
                        }
                      }}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <Send className="w-3.5 h-3.5 text-slate-600" />
                      <span>Direct Chat Member</span>
                    </button>

                    <button
                      onClick={() => handleOpenReplySupportModal(t)}
                      className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-950" />
                      <span>{t.adminReply ? 'Update Official Response' : 'Reply & Resolve Ticket'}</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: SYSTEM AUDIT LOGS */}
      {/* ========================================================================= */}
      {activeTab === 'audit_logs' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#0A1128]">System Audit Trail ({auditLogs.length})</h3>
            <span className="text-xs text-slate-500 font-mono">Immutable Compliance Ledger</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-3">Admin</th>
                  <th className="py-3.5 px-3">Action</th>
                  <th className="py-3.5 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-500">{log.timestamp}</td>
                    <td className="py-3 px-3 text-amber-700 font-bold">{log.adminEmail}</td>
                    <td className="py-3 px-3 font-bold text-[#0A1128]">{log.action}</td>
                    <td className="py-3 px-4 text-slate-600">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: SYSTEM CONFIG */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-extrabold text-[#0A1128]">Global Platform Parameters & Feature Toggles</h3>
            <p className="text-xs text-slate-500 mt-1">Configure compliance rules, live sync connectors, and AI deal memo generators.</p>
          </div>

          <div className="space-y-4 divide-y divide-slate-100">
            <div className="flex items-center justify-between pt-3">
              <div>
                <strong className="text-sm text-[#0A1128] block">Live Stripe API Webhook Sync</strong>
                <p className="text-xs text-slate-500">Allow founders to connect live Stripe merchant tokens for real-time MRR validation.</p>
              </div>
              <button
                onClick={() => {
                  setSystemConfig(prev => ({ ...prev, liveStripeOAuth: !prev.liveStripeOAuth }));
                  showToast('Updated Live Stripe Sync configuration.');
                }}
                className="text-amber-600 cursor-pointer"
              >
                {systemConfig.liveStripeOAuth ? <ToggleRight className="w-8 h-8 text-amber-500" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
              </button>
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <strong className="text-sm text-[#0A1128] block">Autonomous AI Deal Memo Engine</strong>
                <p className="text-xs text-slate-500">Enable algorithmic investment committee memos with automated unit economics scoring.</p>
              </div>
              <button
                onClick={() => {
                  setSystemConfig(prev => ({ ...prev, aiDealMemoEngine: !prev.aiDealMemoEngine }));
                  showToast('Updated AI Deal Memo configuration.');
                }}
                className="text-amber-600 cursor-pointer"
              >
                {systemConfig.aiDealMemoEngine ? <ToggleRight className="w-8 h-8 text-amber-500" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
              </button>
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <strong className="text-sm text-[#0A1128] block">Encrypted 1-on-1 Direct Chat Messenger</strong>
                <p className="text-xs text-slate-500">Enable real-time direct chat between matched founders and accredited investors.</p>
              </div>
              <button
                onClick={() => {
                  setSystemConfig(prev => ({ ...prev, directChatMessenger: !prev.directChatMessenger }));
                  showToast('Updated Direct Chat Messenger configuration.');
                }}
                className="text-amber-600 cursor-pointer"
              >
                {systemConfig.directChatMessenger ? <ToggleRight className="w-8 h-8 text-amber-500" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: INVESTOR DEAL SIGNALS & INTEREST AUDIT */}
      {/* ========================================================================= */}
      {activeTab === 'investor_interests' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-[#0A1128]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-extrabold text-[#0A1128] font-mono">Investor Deal Signals & Round Interest Audit</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">Audit soft commitment signals sent by accredited VCs to verified MRR ventures across the platform.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl flex items-center space-x-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block font-mono">Total Indicative Capital</span>
                <span className="text-base font-extrabold text-amber-600 font-mono">
                  ${(investorInterests.reduce((acc, i) => acc + i.indicativeCheckSize, 0) / 1000).toFixed(0)}k
                </span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase block font-mono">Active Signals</span>
                <span className="text-base font-extrabold text-[#0A1128] font-mono">{investorInterests.length}</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={interestSearchQuery}
                onChange={(e) => setInterestSearchQuery(e.target.value)}
                placeholder="Search VC name, firm, or startup..."
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-xs font-bold text-slate-500 font-mono uppercase">Status:</span>
              <select
                value={interestFilterStatus}
                onChange={(e) => setInterestFilterStatus(e.target.value as any)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-[#0A1128] focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="all">All Signals ({investorInterests.length})</option>
                <option value="new">🔥 New Signals ({investorInterests.filter(i => i.status === 'new').length})</option>
                <option value="founder_reached_out">💬 In Discussion ({investorInterests.filter(i => i.status === 'founder_reached_out').length})</option>
                <option value="data_room_shared">📂 Data Room Active ({investorInterests.filter(i => i.status === 'data_room_shared').length})</option>
              </select>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-600 font-mono uppercase text-[10px]">
                  <th className="px-4 py-3 font-bold min-w-[240px]">Investor / Firm</th>
                  <th className="px-4 py-3 font-bold min-w-[160px]">Target Venture</th>
                  <th className="px-4 py-3 font-bold min-w-[130px]">Indicative Check</th>
                  <th className="px-4 py-3 font-bold min-w-[150px]">Conviction Level</th>
                  <th className="px-4 py-3 font-bold min-w-[260px]">Thesis Note</th>
                  <th className="px-4 py-3 font-bold min-w-[110px]">Status</th>
                  <th className="px-4 py-3 font-bold text-right min-w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {investorInterests
                  .filter(i => {
                    const matchSearch = !interestSearchQuery || 
                      i.investorName.toLowerCase().includes(interestSearchQuery.toLowerCase()) ||
                      i.investorFirm.toLowerCase().includes(interestSearchQuery.toLowerCase()) ||
                      i.startupName.toLowerCase().includes(interestSearchQuery.toLowerCase());
                    const matchStatus = interestFilterStatus === 'all' || i.status === interestFilterStatus;
                    return matchSearch && matchStatus;
                  })
                  .map(interest => (
                    <tr key={interest.id} className="hover:bg-slate-50/80 transition-colors align-middle">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => openSocialProfileModal(interest.investorId)}
                            className="shrink-0 cursor-pointer"
                          >
                            <img
                              src={interest.investorAvatar}
                              alt={interest.investorName}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
                            />
                          </button>
                          <div className="min-w-0">
                            <button
                              onClick={() => openSocialProfileModal(interest.investorId)}
                              className="font-extrabold text-[#0A1128] hover:text-amber-600 transition-colors text-left block cursor-pointer text-xs truncate"
                            >
                              {interest.investorName}
                            </button>
                            <p className="text-[11px] text-slate-500 font-medium truncate">{interest.investorTitle}</p>
                            <p className="text-[10px] text-amber-700 font-extrabold font-mono truncate">{interest.investorFirm}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center space-x-2.5">
                          <img src={interest.startupLogo} alt={interest.startupName} className="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0 shadow-xs" />
                          <span className="font-extrabold text-[#0A1128] text-xs">{interest.startupName}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap font-mono font-extrabold text-[#0A1128] text-xs">
                        ${(interest.indicativeCheckSize / 1000).toFixed(0)},000
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase font-mono tracking-tight ${
                          interest.interestLevel === 'term_sheet_ready' ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' :
                          interest.interestLevel === 'high_conviction' ? 'bg-amber-100 text-amber-950 border border-amber-300' :
                          'bg-blue-100 text-blue-950 border border-blue-200'
                        }`}>
                          <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                          <span>
                            {interest.interestLevel === 'term_sheet_ready' ? 'TERM SHEET' :
                             interest.interestLevel === 'high_conviction' ? 'HIGH CONVICTION' : 'EXPLORING'}
                          </span>
                        </span>
                      </td>

                      <td className="px-4 py-3.5 max-w-xs text-slate-600 text-xs italic">
                        <p className="truncate" title={interest.note}>"{interest.note}"</p>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full font-mono uppercase tracking-tight ${
                          interest.status === 'new' ? 'bg-amber-100 text-amber-950 border border-amber-300' :
                          interest.status === 'founder_reached_out' ? 'bg-blue-100 text-blue-950 border border-blue-300' :
                          'bg-emerald-100 text-emerald-950 border border-emerald-300'
                        }`}>
                          <span>{interest.status === 'new' ? 'New' : interest.status === 'founder_reached_out' ? 'In Chat' : 'Data Room'}</span>
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              updateInvestorInterestStatus(interest.id, 'data_room_shared');
                              showToast(`Updated signal status for ${interest.investorName}`);
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-amber-400 text-slate-700 hover:text-slate-950 rounded-xl transition-all cursor-pointer shadow-xs"
                            title="Set status to Data Room Active"
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              removeInvestorInterest(interest.startupId);
                              showToast('Signal archived.');
                            }}
                            className="p-1.5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-xl transition-all cursor-pointer shadow-xs"
                            title="Archive / Remove signal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  </div>

      {/* ========================================================================= */}
      {/* MODAL: PLAN BUILDER & EDITOR */}
      {/* ========================================================================= */}
      {isPlanModalOpen && editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <form 
            onSubmit={handleSavePlan} 
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 text-[#0A1128] my-auto max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-amber-600" />
                <h4 className="font-extrabold text-base text-[#0A1128] font-mono">
                  {subscriptionPlans.some(p => p.id === editingPlan.id) ? `Edit Plan (${editingPlan.name})` : 'Build New Subscription Plan'}
                </h4>
              </div>
              <button 
                type="button" 
                onClick={() => setIsPlanModalOpen(false)} 
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Plan Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Founder HyperScale"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Persona</label>
                <select
                  value={editingPlan.roleTarget}
                  onChange={(e) => setEditingPlan({ ...editingPlan, roleTarget: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="founder">For Founders</option>
                  <option value="investor">For Investors & VCs</option>
                  <option value="all">Universal (All Members)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Monthly Price ($/mo)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={editingPlan.priceMonthly}
                  onChange={(e) => setEditingPlan({ ...editingPlan, priceMonthly: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Annual Price ($/mo billed annually)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={editingPlan.priceAnnual}
                  onChange={(e) => setEditingPlan({ ...editingPlan, priceAnnual: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Tagline / Value Proposition</label>
                <input
                  type="text"
                  placeholder="e.g. Verified Stripe proof + Unlimited introductions to Tier-1 Angels"
                  value={editingPlan.tagline}
                  onChange={(e) => setEditingPlan({ ...editingPlan, tagline: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Badge Tag Text (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Most Popular / Best Value"
                  value={editingPlan.badgeText || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, badgeText: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center space-x-6 pt-5">
                <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.popular || false}
                    onChange={(e) => setEditingPlan({ ...editingPlan, popular: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span>Mark as "Most Popular"</span>
                </label>

                <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.isActive !== false}
                    onChange={(e) => setEditingPlan({ ...editingPlan, isActive: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span>Publish Live for Checkout</span>
                </label>
              </div>
            </div>

            {/* Feature Bullets Editor */}
            <div className="space-y-2 border-t border-slate-200 pt-3">
              <label className="block font-bold text-xs text-slate-700">Plan Feature Highlights</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="e.g. Priority KYC verification & Cap Table hosting"
                  value={newFeatureInput}
                  onChange={(e) => setNewFeatureInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeatureBullet(); } }}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddFeatureBullet}
                  className="px-3 py-1.5 bg-[#0A1128] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#162038]"
                >
                  Add Bullet
                </button>
              </div>

              <div className="space-y-1.5 max-h-32 overflow-y-auto pt-1">
                {editingPlan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-700">{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeatureBullet(idx)}
                      className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Entitlements & Permissions Checklist */}
            <div className="space-y-2 border-t border-slate-200 pt-3">
              <label className="block font-bold text-xs text-slate-700 font-mono uppercase">
                Tier Entitlements & Security Permissions
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { key: 'canPitchAllInvestors', label: 'Unlimited Direct VC Pitches' },
                  { key: 'hasVerifiedStripeBadge', label: 'Stripe Verified Revenue Badge' },
                  { key: 'canAccessDiligenceRoom', label: 'Gated Diligence Room & Cap Table' },
                  { key: 'canViewRawFinancials', label: 'Raw Stripe Ledger & P&L Stream' },
                  { key: 'aiDealMemoAudit', label: 'Autonomous Gemini 3.7 AI Deal Memo' },
                  { key: 'directFounderMessaging', label: '1-on-1 Direct Chat Messenger' },
                  { key: 'exportDiligenceData', label: 'Export Audit CSV & Due Diligence Packets' },
                  { key: 'syndicateCoInvestAccess', label: 'Syndicate Co-Investment Priority' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(editingPlan.limits as any)[key] || false}
                      onChange={(e) => setEditingPlan({
                        ...editingPlan,
                        limits: {
                          ...editingPlan.limits,
                          [key]: e.target.checked
                        }
                      })}
                      className="rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span className="text-[11px] font-medium text-slate-800">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => { setIsPlanModalOpen(false); setEditingPlan(null); }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer"
              >
                Save & Publish Plan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE POST WITH REASON */}
      {/* ========================================================================= */}
      {deleteModalPostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-[#0A1128]">
            <h4 className="font-extrabold text-base text-[#0A1128]">Confirm Soft-Delete Post</h4>
            <p className="text-xs text-slate-600">Select a reason for flagging and removing this post from the community feed.</p>

            <select
              value={deleteReasonInput}
              onChange={(e) => setDeleteReasonInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500 cursor-pointer font-bold"
            >
              <option value="Spam / Unverified promotion">Spam / Unverified promotion</option>
              <option value="Violates community guidelines">Violates community guidelines</option>
              <option value="Misleading financial metrics">Misleading financial metrics</option>
              <option value="Duplicate post">Duplicate post</option>
            </select>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeleteModalPostId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeletePost}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold shadow-sm cursor-pointer"
              >
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REJECT VERIFICATION WITH NOTES */}
      {/* ========================================================================= */}
      {rejectReasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-[#0A1128]">
            <h4 className="font-extrabold text-base text-[#0A1128]">Reject Verification Request</h4>
            <p className="text-xs text-slate-600">Provide an audit reason or note explaining why the merchant proof was insufficient.</p>

            <textarea
              rows={3}
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder="e.g. Monthly statement does not reflect claimed $48k MRR recurring subscription volume."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500"
            />

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setRejectReasonModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmReject(rejectReasonModal)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold shadow-sm cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT USER PROFILE */}
      {/* ========================================================================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form onSubmit={handleSaveUserEdit} className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-[#0A1128]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-base text-[#0A1128]">Edit Member Account ({editingUser.name})</h4>
              <button type="button" onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingUser.title}
                  onChange={(e) => setEditingUser({ ...editingUser, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company / Firm</label>
                <input
                  type="text"
                  value={editingUser.companyOrFirm}
                  onChange={(e) => setEditingUser({ ...editingUser, companyOrFirm: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="founder">Founder</option>
                  <option value="investor">Investor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subscription Tier</label>
                <select
                  value={editingUser.subscriptionTier}
                  onChange={(e) => setEditingUser({ ...editingUser, subscriptionTier: e.target.value as SubscriptionTier })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {subscriptionPlans.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.priceMonthly}/mo)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold shadow-sm cursor-pointer"
              >
                Save Profile Updates
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT STARTUP METRICS */}
      {/* ========================================================================= */}
      {editingStartup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form onSubmit={handleSaveStartupEdit} className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-[#0A1128]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-base text-[#0A1128]">Edit Startup Metrics ({editingStartup.name})</h4>
              <button type="button" onClick={() => setEditingStartup(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">MRR ($/mo)</label>
                <input
                  type="number"
                  required
                  value={editingStartup.mrr}
                  onChange={(e) => setEditingStartup({ ...editingStartup, mrr: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">MoM Growth Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={editingStartup.growthRateMoM}
                  onChange={(e) => setEditingStartup({ ...editingStartup, growthRateMoM: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ask Amount ($)</label>
                <input
                  type="number"
                  value={editingStartup.askAmount}
                  onChange={(e) => setEditingStartup({ ...editingStartup, askAmount: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Valuation ($)</label>
                <input
                  type="number"
                  value={editingStartup.valuation}
                  onChange={(e) => setEditingStartup({ ...editingStartup, valuation: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingStartup(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold shadow-sm cursor-pointer"
              >
                Save Metrics
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADMIN SEND PERSONAL DIRECT / BROADCAST MESSAGE */}
      {/* ========================================================================= */}
      {isSendMessageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <form
            onSubmit={handleSendAdminMessageSubmit}
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 text-[#0A1128] animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0A1128] border border-amber-400 flex items-center justify-center shadow-xs">
                  <Send className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-[#0A1128] font-mono">Send Administrative Message</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Dispatches direct chat notification to recipient's messenger inbox</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSendMessageModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient Summary Card */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 font-mono block tracking-wider">
                Message Recipient(s):
              </span>
              {messageTargetUserIds.length === 1 ? (
                (() => {
                  const targetUser = platformUsers.find(u => u.id === messageTargetUserIds[0]);
                  return targetUser ? (
                    <div className="flex items-center space-x-3">
                      <img src={targetUser.avatar} alt={targetUser.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                      <div>
                        <span className="font-extrabold text-xs text-[#0A1128] block">{targetUser.name}</span>
                        <span className="text-[10px] text-slate-500 block">{targetUser.email} • {targetUser.companyOrFirm}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-[#0A1128]">1 Selected Platform Member</span>
                  );
                })()
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-[#0A1128] font-mono">
                      📢 Broadcast to {messageTargetUserIds.length} Platform Members
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 font-bold font-mono border border-amber-300">
                    Batch Message
                  </span>
                </div>
              )}
            </div>

            {/* Subject Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Notice Title / Subject (Optional)
              </label>
              <input
                type="text"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                placeholder="e.g. Account Verification Completed / Compliance Update"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] font-medium focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Personal Message Body <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                required
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="Type your official administrative message or compliance update here..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-[#0A1128] font-normal focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            {/* Delivery Badge */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 flex items-center space-x-2 font-medium">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Delivered instantly into the recipient's 1-on-1 encrypted chat thread.</span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsSendMessageModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold shadow-md shadow-amber-500/20 cursor-pointer flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5 text-slate-950" />
                <span>Send Message Now</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADMIN REPLY & RESOLVE SUPPORT TICKET */}
      {/* ========================================================================= */}
      {replyModalTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <form
            onSubmit={handleSendSupportReplySubmit}
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 text-[#0A1128] animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0A1128] border border-amber-400 flex items-center justify-center shadow-xs">
                  <LifeBuoy className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-[#0A1128] font-mono">Official Support Desk Reply</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Resolves ticket #{replyModalTicket.id} & sends response to member</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReplyModalTicket(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Original Inbound Ticket Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#0A1128] text-sm">{replyModalTicket.subject}</span>
                <span className="font-mono text-[10px] text-slate-400">{replyModalTicket.createdAt}</span>
              </div>
              <p className="text-slate-600 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                "{replyModalTicket.message}"
              </p>
              <div className="text-[11px] text-slate-500 font-medium">
                Submitted by: <strong>{replyModalTicket.userName}</strong> ({replyModalTicket.userEmail})
              </div>
            </div>

            {/* New Ticket Status Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Updated Ticket Status</label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`p-3 rounded-xl border flex items-center space-x-2 cursor-pointer transition-all ${
                  replyNewStatus === 'in_progress' ? 'bg-blue-50 border-blue-400 text-blue-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="replyNewStatus"
                    value="in_progress"
                    checked={replyNewStatus === 'in_progress'}
                    onChange={() => setReplyNewStatus('in_progress')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs">Mark In Progress</span>
                </label>

                <label className={`p-3 rounded-xl border flex items-center space-x-2 cursor-pointer transition-all ${
                  replyNewStatus === 'resolved' ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="replyNewStatus"
                    value="resolved"
                    checked={replyNewStatus === 'resolved'}
                    onChange={() => setReplyNewStatus('resolved')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs">✓ Mark Resolved</span>
                </label>
              </div>
            </div>

            {/* Official Response Body */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Resolution / Reply <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={adminReplyText}
                onChange={(e) => setAdminReplyText(e.target.value)}
                placeholder="Type official TrustMRR resolution details or answer here..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-[#0A1128] font-normal focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReplyModalTicket(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold shadow-md shadow-amber-500/20 cursor-pointer flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>Save Reply & Update Ticket</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
