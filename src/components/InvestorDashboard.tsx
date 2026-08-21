import React, { useState, useRef } from 'react';
import { 
  Briefcase, 
  Layers, 
  Plus, 
  ArrowRight, 
  ShieldCheck, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  Trash2, 
  ExternalLink, 
  ChevronRight, 
  UserCheck, 
  Send,
  Search,
  Filter,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Eye,
  Sliders,
  MessageSquare,
  Crown,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  Building,
  User,
  Percent,
  Check,
  Upload,
  FileCheck,
  FileBadge,
  Bell,
  Mail,
  Edit3,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DealStage, Startup, StartupCategory, StartupStage, PitchRequest, InvestorCredentialDocument, InvestorPitchPreferences } from '../types';

interface InvestorDashboardProps {
  onSelectStartup: (startup: Startup) => void;
  onOpenAIAnalysis: (startup: Startup) => void;
  onSignalInterest?: (startup: Startup) => void;
}

export const InvestorDashboard: React.FC<InvestorDashboardProps> = ({
  onSelectStartup,
  onOpenAIAnalysis,
  onSignalInterest
}) => {
  const { 
    dealPipeline, 
    startups, 
    investors,
    currentUser, 
    subscriptionPlans,
    updateDealStage, 
    removeDealFromPipeline, 
    addDealToPipeline,
    showToast,
    pitchRequests,
    sendPitchMessage,
    updatePitchStatus,
    updateInvestor,
    toggleInvestorAcceptingPitches,
    addInvestorCredentialDocument,
    deleteInvestorCredentialDocument,
    openInvestorProfileSettingsModal,
    savedStartupIds,
    toggleSaveStartup,
    setIsSubscriptionModalOpen,
    setTargetUpgradePlan,
    openSocialNetworkModal,
    openSocialProfileModal,
    getUserConnectionsCount,
    getUserFollowersCount,
    isInvestorInterestedInStartup,
    getInvestorInterestForStartup,
    setIsChatDrawerOpen
  } = useApp();

  const currentInvestor = investors.find(i => i.id === currentUser.id || i.name.toLowerCase() === currentUser.name.toLowerCase()) || investors[0];

  const [activeTab, setActiveTab] = useState<'fund_seekers' | 'pipeline' | 'inbox' | 'profile_settings'>('fund_seekers');
  const [selectedInboxPitch, setSelectedInboxPitch] = useState<PitchRequest | null>(pitchRequests[0] || null);
  const [replyText, setReplyText] = useState('');

  // Profile, Thesis & Intake Settings State
  const [investorName, setInvestorName] = useState(currentInvestor?.name || currentUser.name);
  const [investorTitle, setInvestorTitle] = useState(currentInvestor?.title || currentUser.title || 'General Partner');
  const [investorFirm, setInvestorFirm] = useState(currentInvestor?.firm || currentUser.companyOrFirm || 'Horizon VC');
  const [isAcceptingPitchesState, setIsAcceptingPitchesState] = useState<boolean>(currentInvestor?.acceptingPitches !== false);
  const [minMrrState, setMinMrrState] = useState<number>(currentInvestor?.minMrrToPitch || 20000);
  const [minGrowthMoMState, setMinGrowthMoMState] = useState<number>(currentInvestor?.minGrowthRateMoM || 15);
  const [maxChurnRateState, setMaxChurnRateState] = useState<number>(currentInvestor?.maxChurnRateMonthly || 3.5);
  const [checkMinState, setCheckMinState] = useState<number>(currentInvestor?.checkSizeMin || 250000);
  const [checkMaxState, setCheckMaxState] = useState<number>(currentInvestor?.checkSizeMax || 1500000);
  const [targetSectorsState, setTargetSectorsState] = useState<StartupCategory[]>(
    currentInvestor?.targetSectors || ['B2B SaaS', 'AI & Machine Learning', 'FinTech & Payments']
  );
  const [targetStagesState, setTargetStagesState] = useState<StartupStage[]>(
    currentInvestor?.targetStages || ['Seed', 'Pre-Seed']
  );
  const [responseSlaState, setResponseSlaState] = useState<InvestorPitchPreferences['responseSla']>(
    currentInvestor?.pitchPreferences?.responseSla || '48_hours'
  );
  const [intakeInstructionsState, setIntakeInstructionsState] = useState<string>(
    currentInvestor?.pitchIntakeInstructions || 'We write $250k-$1.5M lead/co-lead checks into SaaS founders with verified Stripe metrics.'
  );
  const [autoReplyMessageState, setAutoReplyMessageState] = useState<string>(
    currentInvestor?.pitchPreferences?.autoReplyMessage || 'Thank you for pitching our fund. We review verified Stripe metric decks weekly.'
  );

  // File upload state for inline panel
  const [uploadDocTitle, setUploadDocTitle] = useState('');
  const [uploadDocType, setUploadDocType] = useState<InvestorCredentialDocument['documentType']>('cpa_letter');
  const [uploadIssuer, setUploadIssuer] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fund Seekers Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const stages: DealStage[] = ['Lead', 'Diligence', 'Pitch Review', 'Term Sheet', 'Invested', 'Passed'];

  // Filter Fund-Seeking Startups
  const fundSeekingStartups = startups.filter((startup) => {
    const matchesSearch = 
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || startup.category === selectedCategory;
    const matchesStage = selectedStage === 'All' || startup.stage === selectedStage;
    const matchesVerified = !verifiedOnly || startup.isVerified;

    return matchesSearch && matchesCategory && matchesStage && matchesVerified;
  });

  const handleSendReply = () => {
    if (!selectedInboxPitch || !replyText.trim()) return;
    sendPitchMessage(selectedInboxPitch.id, replyText);
    setReplyText('');
    showToast('Reply message sent to founder.');
  };

  const handleStatusChange = (status: PitchRequest['status']) => {
    if (!selectedInboxPitch) return;
    updatePitchStatus(selectedInboxPitch.id, status);
    setSelectedInboxPitch({
      ...selectedInboxPitch,
      status
    });
    showToast(`Pitch status updated to ${status.replace('_', ' ')}.`);
  };

  const handleAddToPipelineFromPitch = (pitch: PitchRequest) => {
    const existing = dealPipeline.find(d => d.startupId === pitch.startupId);
    if (existing) {
      showToast('This startup is already in your Deal Pipeline.');
      return;
    }
    const startup = startups.find(s => s.id === pitch.startupId);
    if (!startup) return;

    addDealToPipeline(startup.id, 'Pitch Review', pitch.askAmount, `Pitch received from founder ${pitch.founderName}.`);
    showToast(`Added ${pitch.startupName} to Deal Pipeline (Pitch Review).`);
  };

  const handleToggleAcceptingPitches = () => {
    if (!currentInvestor) return;
    const nextVal = !isAcceptingPitchesState;
    setIsAcceptingPitchesState(nextVal);
    toggleInvestorAcceptingPitches(currentInvestor.id);
    showToast(nextVal ? 'Pitch intake opened. Founders can now discover your check size and pitch you!' : 'Pitch intake paused. Your profile is now hidden from the Founder pitch directory.');
  };

  const handleAddStartupToPipeline = (startup: Startup) => {
    const existing = dealPipeline.find(d => d.startupId === startup.id);
    if (existing) {
      showToast(`"${startup.name}" is already in your Deal Pipeline.`);
      return;
    }
    const defaultCheck = Math.min(250000, startup.askAmount);
    addDealToPipeline(startup.id, 'Lead', defaultCheck, `Discovered via Fund Seekers Directory. Asking $${(startup.askAmount / 1000).toFixed(0)}k.`);
  };

  const categories = ['All', 'AI & Machine Learning', 'B2B SaaS', 'FinTech & Payments', 'DevTools & Infra', 'Security & Privacy', 'HealthTech', 'Productivity & Work'];
  const roundStages = ['All', 'Pre-Seed', 'Seed', 'Series A', 'Bootstrapped'];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Investor Header - Clean Deep Navy with Balanced Symmetrical Layout */}
      <div className="bg-[#0A1128] border border-slate-800 rounded-3xl p-5 sm:p-7 flex flex-col xl:flex-row items-center xl:items-center justify-between gap-6 shadow-xl text-white">
        {/* Investor Identity & Credentials */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5 min-w-0 w-full xl:w-auto">
          <div className="relative shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-amber-400/50 shadow-md"
            />
            <span 
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0A1128] ${
                isAcceptingPitchesState ? 'bg-amber-400' : 'bg-slate-500'
              }`}
              title={isAcceptingPitchesState ? 'Pitch intake active' : 'Pitch intake paused'}
            ></span>
          </div>

          <div className="min-w-0 flex-1 flex flex-col items-center sm:items-start">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight">{currentUser.name}</h1>
              <span className="inline-flex items-center space-x-1 text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full text-xs font-extrabold font-mono shrink-0 shadow-xs">
                <UserCheck className="w-3.5 h-3.5 text-slate-950" />
                <span>Accredited VC</span>
              </span>
            </div>

            <div className="text-xs text-slate-300 mt-1">
              <span>{currentUser.companyOrFirm} • Check Size: <span className="font-extrabold text-amber-400 font-mono">${(checkMinState/1000).toFixed(0)}k - ${(checkMaxState/1000).toFixed(0)}k</span></span>
            </div>

            {/* Social Network Counters */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-300 mt-2.5">
              <button
                onClick={() => openSocialNetworkModal(currentUser.id, 'connections')}
                className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-[#162038] border border-amber-400/30 text-amber-400 hover:bg-amber-400 hover:text-slate-950 font-mono font-bold transition-all cursor-pointer text-xs"
                title="View Connected Network"
              >
                <Users className="w-3 h-3" />
                <span>{getUserConnectionsCount(currentUser.id)} Connections</span>
              </button>
              
              <button
                onClick={() => openSocialNetworkModal(currentUser.id, 'followers')}
                className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-[#162038] border border-slate-700 text-slate-200 hover:border-amber-400 hover:text-amber-400 font-mono font-bold transition-all cursor-pointer text-xs"
                title="View Followers"
              >
                <span>{getUserFollowersCount(currentUser.id)} Followers</span>
              </button>

              {/* Direct Messages Trigger */}
              <button
                onClick={() => setIsChatDrawerOpen(true)}
                className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-[#162038] border border-amber-400/40 text-amber-400 hover:bg-amber-400 hover:text-slate-950 font-mono font-bold transition-all cursor-pointer text-xs"
                title="Open 1-on-1 Messages"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Messages</span>
              </button>
            </div>
          </div>
        </div>

        {/* Aggregate Stats & Pitch Intake Status - Clean Responsive Grid on Mobile, Balanced Flex on Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-3 xl:flex xl:items-center gap-2.5 w-full xl:w-auto shrink-0">
          {/* Edit Profile & Credentials Trigger */}
          <button
            type="button"
            onClick={openInvestorProfileSettingsModal}
            className="px-3.5 py-2.5 bg-[#162038] hover:bg-[#1E293B] text-white border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Edit Profile</span>
          </button>

          {/* Intake Switch */}
          <div className="bg-[#162038] px-3.5 py-2 rounded-xl border border-slate-700 flex items-center justify-between sm:justify-center space-x-2.5 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Pitch Intake</span>
              <span className={`font-bold text-xs flex items-center space-x-1 ${isAcceptingPitchesState ? 'text-amber-400' : 'text-slate-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isAcceptingPitchesState ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`}></span>
                <span className="truncate">{isAcceptingPitchesState ? 'Open to Pitches' : 'Paused'}</span>
              </span>
            </div>
            <button
              onClick={handleToggleAcceptingPitches}
              className="p-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
              title="Toggle whether founders can see and pitch you on TrustMRR"
            >
              {isAcceptingPitchesState ? <ToggleRight className="w-5 h-5 text-amber-400" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
            </button>
          </div>

          {/* Inbound & Active Deals Counters */}
          <div className="flex items-center justify-around sm:justify-center space-x-4 bg-[#162038] px-3.5 py-2 rounded-xl border border-slate-700 text-xs">
            <div className="text-center sm:text-left">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Inbound</span>
              <p className="text-base font-extrabold font-mono text-amber-400 mt-0.5">{pitchRequests.length}</p>
            </div>
            <div className="border-l border-slate-700 pl-4 text-center sm:text-left">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Deals</span>
              <p className="text-base font-extrabold font-mono text-white mt-0.5">{dealPipeline.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('fund_seekers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === 'fund_seekers'
              ? 'bg-[#0A1128] text-white shadow-sm font-extrabold'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>Fund-Seeking Startups ({startups.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === 'pipeline'
              ? 'bg-[#0A1128] text-white shadow-sm font-extrabold'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Deal Flow CRM Pipeline ({dealPipeline.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inbox')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === 'inbox'
              ? 'bg-[#0A1128] text-white shadow-sm font-extrabold'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span>Inbound Pitches ({pitchRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile_settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === 'profile_settings'
              ? 'bg-[#0A1128] text-white shadow-sm font-extrabold'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>Profile, Focus & Credentials</span>
          {currentInvestor?.credentialsDocuments && currentInvestor.credentialsDocuments.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 font-extrabold font-mono">
              {currentInvestor.credentialsDocuments.length} Docs
            </span>
          )}
        </button>
      </div>

      {/* Active Subscription Membership Banner */}
      {(() => {
        const currentPlan = subscriptionPlans.find(p => p.id === currentUser.subscriptionTier) || subscriptionPlans.find(p => p.roleTarget === 'investor') || subscriptionPlans[0];
        return (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Venture Membership:</span>
                  <span className="text-sm font-extrabold text-[#0A1128] font-mono">{currentPlan?.name || 'Accredited VC Tier'}</span>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                    ${currentPlan?.priceMonthly || 0}/mo
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentPlan?.tagline || 'Institutional deal flow, verified revenue ledgers, and raw diligence vaults.'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
              <button
                onClick={() => setIsSubscriptionModalOpen(true)}
                className="px-4 py-2 bg-[#0A1128] hover:bg-[#162038] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs"
              >
                <span>Manage / Upgrade Subscription</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        );
      })()}

      {/* SUB-TAB 1: FUND-SEEKING STARTUPS (Primary View for Investors to see company profiles needing funds) */}
      {activeTab === 'fund_seekers' && (
        <div className="space-y-6">
          {/* Search and Filters Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fund-seeking startups, AI, MRR..."
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {roundStages.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <button
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer border ${
                  verifiedOnly
                    ? 'bg-amber-400 border-amber-400 text-slate-950 shadow-sm'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Stripe Verified</span>
              </button>
            </div>
          </div>

          {/* Startups Raising Capital Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fundSeekingStartups.map((startup) => {
              const isSaved = savedStartupIds.includes(startup.id);
              const isInPipeline = dealPipeline.some(d => d.startupId === startup.id);
              const dilutionPct = startup.valuation > 0 ? ((startup.askAmount / startup.valuation) * 100).toFixed(1) : '10.0';

              return (
                <div
                  key={startup.id}
                  className="bg-white border border-slate-200 hover:border-amber-400/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group space-y-4 text-[#0A1128]"
                >
                  <div className="space-y-3.5">
                    {/* Header with Logo & Badges */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 min-w-0">
                        <img
                          src={startup.logo}
                          alt={startup.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="font-extrabold text-base text-[#0A1128] group-hover:text-amber-600 transition-colors truncate">
                            {startup.name}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium truncate">{startup.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={() => toggleSaveStartup(startup.id)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            isSaved
                              ? 'bg-amber-50 border-amber-300 text-amber-900'
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                          }`}
                          title={isSaved ? "Saved in Watchlist" : "Save to Watchlist"}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Fundraising Target Banner - Clean & High Contrast */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-bold">Target Round:</span>
                        <span className="font-bold text-[#0A1128] font-mono">{startup.targetRound || startup.stage}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Ask Amount</span>
                          <span className="text-base font-extrabold font-mono text-[#0A1128]">
                            ${(startup.askAmount / 1000).toLocaleString()}k
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Valuation Cap</span>
                          <span className="text-xs font-bold font-mono text-slate-700">
                            ${(startup.valuation / 1000000).toFixed(1)}M ({dilutionPct}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tagline & Pitch Snippet */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]">
                      {startup.tagline}
                    </p>

                    {/* Verified Metrics Strip */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block">MRR</span>
                        <span className="text-xs font-extrabold font-mono text-[#0A1128]">${(startup.mrr / 1000).toFixed(1)}k</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block">MoM Growth</span>
                        <span className="text-xs font-extrabold font-mono text-amber-600">+{startup.growthRateMoM}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block">LTV / CAC</span>
                        <span className="text-xs font-extrabold font-mono text-[#0A1128]">{(startup.ltv / startup.cac).toFixed(1)}x</span>
                      </div>
                    </div>

                    {/* Founder Credentials */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                      <div className="flex items-center space-x-2">
                        <img
                          src={startup.founderAvatar}
                          alt={startup.founderName}
                          className="w-5 h-5 rounded-full object-cover border border-slate-200"
                        />
                        <span className="text-slate-700 font-bold">{startup.founderName}</span>
                      </div>

                      {startup.isVerified && (
                        <span className="flex items-center space-x-1 text-[10px] text-amber-900 font-mono font-bold bg-amber-50 px-2 py-0.2 rounded border border-amber-200">
                          <ShieldCheck className="w-3 h-3 text-amber-600" />
                          <span>Stripe Verified</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onSelectStartup(startup)}
                        className="py-2 px-3 bg-[#0A1128] hover:bg-[#162038] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>Dossier</span>
                      </button>

                      <button
                        onClick={() => onOpenAIAnalysis(startup)}
                        className="py-2 px-3 bg-white hover:bg-slate-50 text-[#0A1128] border border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>AI Memo</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onSignalInterest && onSignalInterest(startup)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs ${
                          isInvestorInterestedInStartup(startup.id)
                            ? 'bg-amber-100 text-amber-950 border border-amber-300'
                            : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950'
                        }`}
                        title="Signal round interest to founder"
                      >
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                          {isInvestorInterestedInStartup(startup.id) 
                            ? `✓ Signaled ($${((getInvestorInterestForStartup(startup.id)?.indicativeCheckSize || 250000)/1000).toFixed(0)}k)` 
                            : '✨ Signal Interest'}
                        </span>
                      </button>

                      <button
                        onClick={() => handleAddStartupToPipeline(startup)}
                        disabled={isInPipeline}
                        className={`py-2 px-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 cursor-pointer border ${
                          isInPipeline
                            ? 'bg-slate-100 border-slate-300 text-slate-600 cursor-default'
                            : 'bg-[#0A1128] hover:bg-[#162038] text-white border-slate-700'
                        }`}
                      >
                        {isInPipeline ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">In Pipeline</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">+ Pipeline</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {fundSeekingStartups.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
              <Search className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-base font-extrabold text-[#0A1128]">No matching fund-seeking startups found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try broadening your filter criteria or searching for different keywords.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedStage('All');
                  setVerifiedOnly(false);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: KANBAN DEAL PIPELINE CRM */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0A1128] font-mono flex items-center space-x-2">
                <span>Deal Flow CRM Pipeline</span>
                <span className="text-xs font-extrabold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {dealPipeline.length} Active Deals
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Track startups from initial diligence through term sheet execution and funding.</p>
            </div>
          </div>

          {/* Kanban Board Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto">
            {stages.map((stage) => {
              const dealsInStage = dealPipeline.filter((d) => d.stage === stage);
              return (
                <div
                  key={stage}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-3 min-w-[200px] flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-extrabold text-xs text-[#0A1128] flex items-center space-x-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          stage === 'Invested' ? 'bg-amber-500' :
                          stage === 'Term Sheet' ? 'bg-[#0A1128]' :
                          stage === 'Pitch Review' ? 'bg-amber-400' :
                          stage === 'Diligence' ? 'bg-blue-600' :
                          stage === 'Passed' ? 'bg-slate-400' : 'bg-slate-400'
                        }`}></span>
                        <span>{stage}</span>
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                        {dealsInStage.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {dealsInStage.map((deal) => {
                        const startup = startups.find((s) => s.id === deal.startupId);
                        return (
                          <div
                            key={deal.id}
                            className="bg-white border border-slate-200 hover:border-amber-400 rounded-xl p-3 space-y-2 text-xs shadow-sm transition-all group"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-2">
                                <img
                                  src={startup?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'}
                                  alt={startup?.name || 'Startup'}
                                  className="w-6 h-6 rounded-md object-cover border border-slate-200"
                                />
                                <span className="font-bold text-[#0A1128] text-xs truncate max-w-[90px]">
                                  {startup?.name || 'Startup'}
                                </span>
                              </div>

                              <button
                                onClick={() => removeDealFromPipeline(deal.id)}
                                className="text-slate-400 hover:text-red-600 p-0.5 rounded transition-colors cursor-pointer"
                                title="Remove Deal"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="flex justify-between text-[11px] font-mono text-slate-500">
                              <span>MRR: ${(startup ? startup.mrr / 1000 : 0).toFixed(1)}k</span>
                              <span className="text-amber-600 font-bold">${(deal.targetCheck / 1000).toFixed(0)}k Check</span>
                            </div>

                            {deal.notes && (
                              <p className="text-[10px] text-slate-500 italic line-clamp-1">
                                "{deal.notes}"
                              </p>
                            )}

                            {/* Stage Progression Buttons */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                              {startup && (
                                <button
                                  onClick={() => onSelectStartup(startup)}
                                  className="text-[#0A1128] hover:text-amber-600 font-bold flex items-center space-x-0.5 cursor-pointer"
                                >
                                  <span>Dossier</span>
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              )}

                              <select
                                value={deal.stage}
                                onChange={(e) => updateDealStage(deal.id, e.target.value as DealStage)}
                                className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-[10px] text-[#0A1128] font-semibold cursor-pointer focus:outline-none"
                              >
                                {stages.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })}

                      {dealsInStage.length === 0 && (
                        <div className="p-4 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white">
                          No deals in {stage}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: INBOUND PITCHES */}
      {activeTab === 'inbox' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-3 min-h-[540px]">
          {/* Pitch List Sidebar */}
          <div className="border-r border-slate-200 p-4 bg-slate-50 divide-y divide-slate-200 overflow-y-auto max-h-[680px]">
            <div className="flex items-center justify-between pb-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1128]">
                  Inbound Pitches ({pitchRequests.length})
                </h4>
                <p className="text-[11px] text-slate-500">Founders directly pitching your fund</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono font-bold">
                {pitchRequests.filter(p => p.status === 'pending').length} New
              </span>
            </div>

            {pitchRequests.map((pitch) => {
              const startup = startups.find(s => s.id === pitch.startupId);
              const isSelected = selectedInboxPitch?.id === pitch.id;

              return (
                <button
                  key={pitch.id}
                  onClick={() => setSelectedInboxPitch(pitch)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all cursor-pointer mt-1.5 ${
                    isSelected
                      ? 'bg-white border-2 border-amber-400 shadow-sm text-[#0A1128]'
                      : 'text-slate-700 hover:bg-white hover:border-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={startup?.logo} 
                        alt={startup?.name || 'Startup'} 
                        className="w-6 h-6 rounded-md object-cover border border-slate-200" 
                      />
                      <span className="font-bold text-xs text-[#0A1128] truncate max-w-[120px]">{startup?.name || 'Startup'}</span>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold capitalize bg-slate-100 text-slate-700 border border-slate-200">
                      {pitch.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-1">
                    <span>${(pitch.askAmount / 1000).toFixed(0)}k Ask ({pitch.proposedEquity}% eq)</span>
                    {startup && <span className="text-amber-600 font-bold">${(startup.mrr / 1000).toFixed(0)}k MRR</span>}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1">{pitch.pitchSubject}</p>
                </button>
              );
            })}

            {pitchRequests.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                No inbound pitches yet. As founders discover your profile, pitches with verified Stripe metrics will arrive here.
              </div>
            )}
          </div>

          {/* Active Pitch Details & Messaging Feed */}
          <div className="md:col-span-2 flex flex-col justify-between bg-white p-6 space-y-4 text-[#0A1128]">
            {selectedInboxPitch ? (() => {
              const matchedStartup = startups.find(s => s.id === selectedInboxPitch.startupId);

              return (
                <>
                  {/* Pitch Header Info */}
                  <div className="border-b border-slate-200 pb-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={matchedStartup?.logo}
                          alt={matchedStartup?.name || 'Startup'}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-extrabold text-base text-[#0A1128]">{matchedStartup?.name || 'Startup'}</h3>
                            {matchedStartup?.isVerified && (
                              <span className="flex items-center space-x-1 text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                                <ShieldCheck className="w-3 h-3 text-amber-600" />
                                <span>Stripe Verified</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            Category: <span className="text-[#0A1128] font-bold">{matchedStartup?.category}</span> • Stage: {matchedStartup?.stage}
                          </p>
                        </div>
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        {matchedStartup && (
                          <button
                            onClick={() => onSelectStartup(matchedStartup)}
                            className="px-3 py-1.5 bg-[#0A1128] hover:bg-[#162038] text-white rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-400" />
                            <span>Dossier</span>
                          </button>
                        )}

                        {matchedStartup && (
                          <button
                            onClick={() => onOpenAIAnalysis(matchedStartup)}
                            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-[#0A1128] border border-slate-300 rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer shadow-xs"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>AI Diligence</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleAddToPipelineFromPitch(selectedInboxPitch)}
                          className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold flex items-center space-x-1 shadow-sm transition-all cursor-pointer transform hover:-translate-y-0.5"
                        >
                          <Plus className="w-3.5 h-3.5 text-slate-950" />
                          <span>Add to Pipeline</span>
                        </button>
                      </div>
                    </div>

                    {/* Verified Metrics Strip */}
                    {matchedStartup && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-center">
                        <div>
                          <span className="text-slate-500 text-[10px] font-bold uppercase">Verified MRR</span>
                          <p className="text-[#0A1128] font-mono font-extrabold">${matchedStartup.mrr.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] font-bold uppercase">MoM Growth</span>
                          <p className="text-amber-600 font-mono font-extrabold">+{matchedStartup.growthRateMoM}%</p>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] font-bold uppercase">Monthly Churn</span>
                          <p className="text-[#0A1128] font-mono font-extrabold">{matchedStartup.churnRateMonthly}%</p>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] font-bold uppercase">Dilution Ask</span>
                          <p className="text-amber-600 font-mono font-extrabold">${(selectedInboxPitch.askAmount / 1000).toFixed(0)}k ({selectedInboxPitch.proposedEquity}%)</p>
                        </div>
                      </div>
                    )}

                    {/* Pitch Status Workflow Switcher */}
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                      <span className="text-slate-600 font-bold">Update Status:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(['pending', 'reviewed', 'meeting_scheduled', 'term_sheet_sent', 'declined'] as PitchRequest['status'][]).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleStatusChange(st)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer capitalize ${
                              selectedInboxPitch.status === st
                                ? 'bg-[#0A1128] text-white shadow-xs'
                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {st.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Messages Feed */}
                  <div className="py-2 space-y-3 overflow-y-auto max-h-[220px]">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-bold text-[#0A1128]">Original Pitch Memo</span>
                        <span className="font-mono">{new Date(selectedInboxPitch.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="font-bold text-[#0A1128] text-xs">{selectedInboxPitch.pitchSubject}</p>
                      <p className="text-slate-700 leading-relaxed font-sans whitespace-pre-line">{selectedInboxPitch.pitchMessage}</p>
                    </div>

                    {selectedInboxPitch.messages.map((msg) => {
                      const isMe = msg.senderRole === 'investor';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div className="flex items-center space-x-1 text-[11px] text-slate-400 mb-0.5">
                            <span>{msg.senderName}</span>
                            <span>•</span>
                            <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div
                            className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? 'bg-[#0A1128] text-white rounded-br-none shadow-xs'
                                : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Message Input Box */}
                  <div className="border-t border-slate-200 pt-3 flex items-center space-x-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                      placeholder="Send term sheet question, diligence request, or schedule meeting..."
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      onClick={handleSendReply}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold flex items-center space-x-1 shadow-sm transition-all cursor-pointer transform hover:-translate-y-0.5"
                    >
                      <Send className="w-3.5 h-3.5 text-slate-950" />
                      <span>Reply</span>
                    </button>
                  </div>
                </>
              );
            })() : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Select an inbound pitch to view correspondence.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: INVESTOR PROFILE, INVESTMENT FOCUS & CREDENTIALS SETTINGS */}
      {activeTab === 'profile_settings' && (
        <div className="space-y-6 max-w-4xl">
          {/* Header Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-[#0A1128] font-mono flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  <span>Investor Profile, Mandate & Credentials</span>
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 font-mono">
                  SEC Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Configure your check size parameters, upload accreditation documents, set sector focus, and customize pitch rules.
              </p>
            </div>

            <div className="flex items-center space-x-2.5 shrink-0">
              <button
                type="button"
                onClick={openInvestorProfileSettingsModal}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-600" />
                <span>Open Full Modal</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!currentInvestor) return;
                  updateInvestor(currentInvestor.id, {
                    name: investorName,
                    title: investorTitle,
                    firm: investorFirm,
                    acceptingPitches: isAcceptingPitchesState,
                    minMrrToPitch: minMrrState,
                    minGrowthRateMoM: minGrowthMoMState,
                    maxChurnRateMonthly: maxChurnRateState,
                    checkSizeMin: checkMinState,
                    checkSizeMax: checkMaxState,
                    targetSectors: targetSectorsState,
                    targetStages: targetStagesState,
                    pitchIntakeInstructions: intakeInstructionsState,
                    pitchPreferences: {
                      responseSla: responseSlaState,
                      emailNotifications: true,
                      inAppAlerts: true,
                      weeklyDigest: true,
                      smsGrowthAlerts: true,
                      requireVerifiedStripe: true,
                      requirePitchDeck: true,
                      requireCapTableAccess: true,
                      autoDeclineBelowMrr: false,
                      autoReplyMessage: autoReplyMessageState
                    }
                  });
                  showToast('Investor Profile, Mandate & Preferences Saved!');
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Check className="w-3.5 h-3.5 text-slate-950" />
                <span>Save All Settings</span>
              </button>
            </div>
          </div>

          {/* Section 1: Professional Identity & Accreditation Credentials */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#0A1128] font-mono flex items-center space-x-2">
                <FileBadge className="w-4 h-4 text-amber-600" />
                <span>Professional Credentials & Verification Documents</span>
              </h4>
              <span className="text-xs text-slate-500 font-mono font-bold">
                {(currentInvestor?.credentialsDocuments || []).length} Verified Files
              </span>
            </div>

            {/* Accreditation Badge Summary */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-400 rounded-xl text-slate-950 shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-[#0A1128] block">Accredited Investor Status: ACTIVE & AUDITED</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Verified under SEC Rule 501 / FINRA Series 65 accreditation standards.
                  </p>
                </div>
              </div>
              <div className="text-[11px] font-mono font-bold text-amber-900 bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-300">
                Classification: {currentInvestor?.accreditationType?.replace(/_/g, ' ').toUpperCase() || 'INSTITUTIONAL FUND'}
              </div>
            </div>

            {/* Identity Form Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Professional Name</label>
                <input
                  type="text"
                  value={investorName}
                  onChange={(e) => setInvestorName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-[#0A1128] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Role / Title</label>
                <input
                  type="text"
                  value={investorTitle}
                  onChange={(e) => setInvestorTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-[#0A1128] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Firm / Syndicate</label>
                <input
                  type="text"
                  value={investorFirm}
                  onChange={(e) => setInvestorFirm(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-[#0A1128] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Document Upload Area */}
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#0A1128] flex items-center space-x-1.5">
                  <Upload className="w-4 h-4 text-amber-600" />
                  <span>Upload Credential Proof (CPA Letter / Series 65 / Form D)</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">PDF, PNG, DOCX (SOC2 Encrypted)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <input
                  type="text"
                  value={uploadDocTitle}
                  onChange={(e) => setUploadDocTitle(e.target.value)}
                  placeholder="Document Title (e.g. 2026 CPA Attestation)"
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-[#0A1128] focus:outline-none focus:border-amber-500 text-xs"
                />
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value as any)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-[#0A1128] focus:outline-none focus:border-amber-500 text-xs cursor-pointer font-bold"
                >
                  <option value="cpa_letter">CPA / Attorney Letter</option>
                  <option value="fund_lp_agreement">SEC Form D / Fund LP Mandate</option>
                  <option value="finra_license">FINRA Series 7/65/82 License</option>
                  <option value="accreditation_cert">Third-Party Certificate</option>
                </select>
                <input
                  type="text"
                  value={uploadIssuer}
                  onChange={(e) => setUploadIssuer(e.target.value)}
                  placeholder="Issuing Firm (e.g. KPMG LLP)"
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-[#0A1128] focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file || !currentInvestor) return;
                  const docTitle = uploadDocTitle.trim() || file.name.replace(/\.[^/.]+$/, '');
                  addInvestorCredentialDocument(currentInvestor.id, {
                    title: docTitle,
                    documentType: uploadDocType,
                    fileName: file.name,
                    fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                    status: 'verified',
                    issuerOrAuthority: uploadIssuer.trim() || 'Accreditation Compliance Team',
                    verificationNotes: 'Verified audit record.'
                  });
                  setUploadDocTitle('');
                  setUploadIssuer('');
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              />

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-950" />
                  <span>Choose File to Upload</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!currentInvestor) return;
                    addInvestorCredentialDocument(currentInvestor.id, {
                      title: 'Deloitte CPA Verification of Accredited Investor 2026',
                      documentType: 'cpa_letter',
                      fileName: 'Deloitte_Accreditation_Certification_2026.pdf',
                      fileSize: '1.2 MB',
                      status: 'verified',
                      issuerOrAuthority: 'Deloitte & Touche LLP',
                      verificationNotes: 'Certified net worth and professional accreditation compliance under Rule 501.'
                    });
                  }}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  + Add Sample CPA Attestation
                </button>
              </div>
            </div>

            {/* Document Listing */}
            <div className="space-y-2">
              {(currentInvestor?.credentialsDocuments || []).map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs shadow-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-200">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[#0A1128]">{doc.title}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-mono font-bold">
                          {doc.status.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {doc.fileName} • {doc.fileSize} • Uploaded {doc.uploadedAt} {doc.issuerOrAuthority ? `• ${doc.issuerOrAuthority}` : ''}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => currentInvestor && deleteInvestorCredentialDocument(currentInvestor.id, doc.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Investment Focus Areas & Check Mandate */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#0A1128] font-mono flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-amber-600" />
                <span>Investment Focus Areas & Check Mandate</span>
              </h4>
            </div>

            {/* Check Size Configuration */}
            <div>
              <label className="block font-bold text-slate-700 text-xs mb-1.5">Check Size Range ($)</label>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">Minimum Ticket ($)</span>
                  <input
                    type="number"
                    value={checkMinState}
                    onChange={(e) => setCheckMinState(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-[#0A1128] font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">Maximum Ticket ($)</span>
                  <input
                    type="number"
                    value={checkMaxState}
                    onChange={(e) => setCheckMaxState(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-[#0A1128] font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Focus Sectors Multi-Select */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-700 text-xs">Target Investment Sectors</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {(['B2B SaaS', 'AI & Machine Learning', 'FinTech & Payments', 'DevTools & Infra', 'Security & Privacy', 'HealthTech', 'E-Commerce & Retail', 'Productivity & Work'] as StartupCategory[]).map((sec) => {
                  const isSelected = targetSectorsState.includes(sec);
                  return (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setTargetSectorsState(targetSectorsState.filter(s => s !== sec));
                        } else {
                          setTargetSectorsState([...targetSectorsState, sec]);
                        }
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between text-xs ${
                        isSelected 
                          ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold' 
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{sec}</span>
                      {isSelected ? <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" /> : <Plus className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Stages */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-700 text-xs">Target Stages</label>
              <div className="flex flex-wrap gap-2 text-xs">
                {(['Bootstrapped', 'Pre-Seed', 'Seed', 'Series A', 'Series B'] as StartupStage[]).map((stage) => {
                  const isSelected = targetStagesState.includes(stage);
                  return (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setTargetStagesState(targetStagesState.filter(s => s !== stage));
                        } else {
                          setTargetStagesState([...targetStagesState, stage]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 ${
                        isSelected
                          ? 'bg-amber-50 border-amber-300 text-amber-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{stage}</span>
                      {isSelected && <Check className="w-3 h-3 text-amber-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Financial Gating */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1 border-t border-slate-200">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Minimum Verified MRR ($/mo)</label>
                <input
                  type="number"
                  value={minMrrState}
                  onChange={(e) => setMinMrrState(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-[#0A1128] font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Minimum MoM Growth (%)</label>
                <input
                  type="number"
                  value={minGrowthMoMState}
                  onChange={(e) => setMinGrowthMoMState(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-amber-600 font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Max Monthly Churn (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={maxChurnRateState}
                  onChange={(e) => setMaxChurnRateState(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-[#0A1128] font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pitch Response Preferences */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#0A1128] font-mono flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-600" />
                <span>Pitch Intake & Response Preferences</span>
              </h4>
            </div>

            {/* Direct Pitch Intake Toggle Switch Card */}
            <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
              isAcceptingPitchesState 
                ? 'bg-amber-50/80 border-amber-200' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="space-y-1 max-w-lg">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-[#0A1128] text-sm">Accept Inbound Pitches on TrustMRR</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                    isAcceptingPitchesState ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isAcceptingPitchesState ? 'ACTIVE & VISIBLE' : 'PAUSED & HIDDEN'}
                  </span>
                </div>
                <p className="text-slate-600 text-xs">
                  {isAcceptingPitchesState
                    ? 'Founders can discover your partner profile in the Investor Directory and pitch you direct deals.'
                    : 'Your partner profile is hidden from the Founder pitch directory.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleAcceptingPitches}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isAcceptingPitchesState
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-300'
                }`}
              >
                {isAcceptingPitchesState ? <ToggleRight className="w-5 h-5 text-slate-950" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                <span>{isAcceptingPitchesState ? 'Open for Pitches' : 'Intake Paused'}</span>
              </button>
            </div>

            {/* Response SLA */}
            <div>
              <label className="block font-bold text-slate-700 text-xs mb-1.5">Response SLA Commitment</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {[
                  { id: '24_hours', label: '24–48 Hours', desc: 'Fast turnaround commitment' },
                  { id: '48_hours', label: 'Within 48 Hours', desc: 'Standard VC review' },
                  { id: '1_week', label: 'Weekly Review', desc: 'Batch review on Mondays' }
                ].map((sla) => (
                  <button
                    key={sla.id}
                    type="button"
                    onClick={() => setResponseSlaState(sla.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      responseSlaState === sla.id
                        ? 'bg-amber-50 border-2 border-amber-400 text-[#0A1128] font-bold shadow-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-extrabold text-[#0A1128] block">{sla.label}</span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">{sla.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pitch Intake Instructions for Founders */}
            <div>
              <label className="block font-bold text-slate-700 text-xs mb-1.5">Pitch Intake Instructions & Founder Memo Note</label>
              <textarea
                rows={3}
                value={intakeInstructionsState}
                onChange={(e) => setIntakeInstructionsState(e.target.value)}
                placeholder="Specify what metrics, stage, or traction you require from founders..."
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-[#0A1128] text-xs focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
              />
            </div>

            {/* Auto-reply Message */}
            <div>
              <label className="block font-bold text-slate-700 text-xs mb-1.5">Auto-Confirmation Receipt Template</label>
              <textarea
                rows={2}
                value={autoReplyMessageState}
                onChange={(e) => setAutoReplyMessageState(e.target.value)}
                placeholder="Sent to founders upon receiving their pitch memo..."
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-[#0A1128] text-xs focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
              />
            </div>

            {/* Bottom Save Action */}
            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!currentInvestor) return;
                  updateInvestor(currentInvestor.id, {
                    name: investorName,
                    title: investorTitle,
                    firm: investorFirm,
                    acceptingPitches: isAcceptingPitchesState,
                    minMrrToPitch: minMrrState,
                    minGrowthRateMoM: minGrowthMoMState,
                    maxChurnRateMonthly: maxChurnRateState,
                    checkSizeMin: checkMinState,
                    checkSizeMax: checkMaxState,
                    targetSectors: targetSectorsState,
                    targetStages: targetStagesState,
                    pitchIntakeInstructions: intakeInstructionsState,
                    pitchPreferences: {
                      responseSla: responseSlaState,
                      emailNotifications: true,
                      inAppAlerts: true,
                      weeklyDigest: true,
                      smsGrowthAlerts: true,
                      requireVerifiedStripe: true,
                      requirePitchDeck: true,
                      requireCapTableAccess: true,
                      autoDeclineBelowMrr: false,
                      autoReplyMessage: autoReplyMessageState
                    }
                  });
                  showToast('Investor Profile, Mandate & Pitch Preferences Saved Successfully!');
                }}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Check className="w-4 h-4 text-slate-950" />
                <span>Save All Profile & Mandate Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
