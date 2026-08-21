import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  PlusCircle, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  RefreshCw, 
  MessageSquare, 
  FileText, 
  Eye, 
  Lock, 
  ArrowUpRight, 
  Building, 
  Clock, 
  Search,
  Check,
  Crown,
  Edit3,
  PieChart,
  Save,
  Sliders,
  ExternalLink,
  ArrowRight,
  MessageCircle,
  UserCheck,
  Star,
  Mail
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { Startup, Investor, PitchRequest, CapTableItem, InvestorInterest } from '../types';

interface FounderDashboardProps {
  onOpenNewStartupModal: () => void;
  onOpenAIAnalysis: (startup: Startup) => void;
  onSelectInvestorToPitch: (investor: Investor) => void;
  onPreviewDossier?: (startup: Startup) => void;
}

export const FounderDashboard: React.FC<FounderDashboardProps> = ({
  onOpenNewStartupModal,
  onOpenAIAnalysis,
  onSelectInvestorToPitch,
  onPreviewDossier
}) => {
  const { 
    startups, 
    investors, 
    pitchRequests, 
    currentUser, 
    subscriptionPlans,
    updateStartup, 
    requestMRRVerification, 
    sendPitchMessage, 
    showToast,
    setIsSubscriptionModalOpen,
    setSelectedStartup,
    openOnboardingModal,
    getUserConnectionsCount,
    getUserFollowersCount,
    getUserFollowingCount,
    openSocialNetworkModal,
    openSocialProfileModal,
    investorInterests,
    getFounderReceivedInterests,
    reachOutToInterestedInvestor,
    updateInvestorInterestStatus,
    setIsChatDrawerOpen
  } = useApp();

  // Find founder's primary startup
  const myStartup = startups.find(s => s.founderId === currentUser.id || s.id === currentUser.associatedStartupId) || startups[0];

  const [activeSubTab, setActiveSubTab] = useState<'metrics' | 'interested_investors' | 'raise_round' | 'investors_directory' | 'pitch_inbox'>('metrics');
  const [selectedPitchId, setSelectedPitchId] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [isSimulatingStripeSync, setIsSimulatingStripeSync] = useState(false);
  const [investorSearch, setInvestorSearch] = useState('');
  const [investorSectorFilter, setInvestorSectorFilter] = useState('All');
  const [interestStatusFilter, setInterestStatusFilter] = useState<'all' | 'new' | 'founder_reached_out' | 'data_room_shared'>('all');

  // Filter pitches and interests for this founder
  const myPitches = pitchRequests.filter(p => p.founderId === currentUser.id || p.startupId === myStartup?.id);
  const activeSelectedPitch = myPitches.find(p => p.id === selectedPitchId) || myPitches[0] || null;
  const founderInterests = getFounderReceivedInterests(currentUser.id);
  const filteredInterests = founderInterests.filter(i => {
    if (interestStatusFilter === 'all') return true;
    return i.status === interestStatusFilter;
  });

  // Fundraising Profile State
  const [askAmount, setAskAmount] = useState(myStartup?.askAmount || 1000000);
  const [valuation, setValuation] = useState(myStartup?.valuation || 8000000);
  const [targetRound, setTargetRound] = useState(myStartup?.targetRound || 'Seed Round');
  const [pitchSummary, setPitchSummary] = useState(myStartup?.pitchSummary || '');
  const [pitchDeckTitle, setPitchDeckTitle] = useState(myStartup?.pitchDeckTitle || 'Series Seed Presentation');
  const [deckSlidesCount, setDeckSlidesCount] = useState(myStartup?.pitchDeckSlidesCount || 12);
  const [useOfFunds, setUseOfFunds] = useState(myStartup?.useOfFunds || '40% Engineering & AI Infrastructure, 35% GTM & Enterprise Sales, 25% Runway Buffer');

  const connectionsCount = getUserConnectionsCount(currentUser.id);
  const followersCount = getUserFollowersCount(currentUser.id);
  const followingCount = getUserFollowingCount(currentUser.id);

  // Fast Stripe Sync Simulation
  const handleSimulateStripeSync = () => {
    setIsSimulatingStripeSync(true);
    setTimeout(() => {
      if (myStartup) {
        const addedMrr = 2400;
        const newMrr = myStartup.mrr + addedMrr;
        const newArr = newMrr * 12;
        
        // Update history with latest
        const updatedHistory = [...myStartup.mrrHistory];
        if (updatedHistory.length > 0) {
          const lastIndex = updatedHistory.length - 1;
          updatedHistory[lastIndex] = {
            ...updatedHistory[lastIndex],
            mrr: newMrr,
            arr: newArr,
            newCustomers: updatedHistory[lastIndex].newCustomers + 2
          };
        }

        updateStartup(myStartup.id, {
          mrr: newMrr,
          arr: newArr,
          customersCount: myStartup.customersCount + 2,
          mrrHistory: updatedHistory,
          isVerified: true,
          verificationStatus: 'verified_stripe',
          verificationProofDate: new Date().toISOString().split('T')[0]
        });
      }
      setIsSimulatingStripeSync(false);
      showToast('⚡ Live Stripe Sync completed: +$2,400 MRR verified from ledger');
    }, 1200);
  };

  const handleSaveFundraisingRound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myStartup) return;

    updateStartup(myStartup.id, {
      askAmount: Number(askAmount),
      valuation: Number(valuation),
      targetRound,
      pitchSummary,
      pitchDeckTitle,
      pitchDeckSlidesCount: Number(deckSlidesCount),
      useOfFunds
    });

    showToast('🚀 Fundraising terms and investor profile updated successfully!');
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeSelectedPitch || !chatMessage.trim()) return;
    sendPitchMessage(activeSelectedPitch.id, chatMessage.trim());
    setChatMessage('');
    showToast('Message sent to investor');
  };

  const calculatedDilution = valuation > 0 ? ((askAmount / valuation) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-8 pb-16">
      {/* Dashboard Top Header - Clean Deep Navy with Balanced Symmetrical Layout */}
      <div className="bg-[#0A1128] border border-slate-800 rounded-3xl p-5 sm:p-7 flex flex-col xl:flex-row items-center xl:items-center justify-between gap-6 shadow-xl text-white">
        {/* Startup Identity & User Credentials */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5 min-w-0 w-full xl:w-auto">
          <img
            src={myStartup?.logo || currentUser.avatar}
            alt={myStartup?.name}
            className="w-16 h-16 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-slate-700 shadow-md shrink-0"
          />
          <div className="min-w-0 flex-1 flex flex-col items-center sm:items-start">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">{myStartup?.name || "My Startup"}</h1>
              {myStartup?.isVerified && (
                <span className="inline-flex items-center space-x-1 text-slate-950 bg-amber-400 font-extrabold px-2.5 py-0.5 rounded-full text-xs font-mono shrink-0 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
                  <span>Stripe Verified</span>
                </span>
              )}
              <span className="inline-flex text-xs px-2.5 py-0.5 rounded-full bg-[#162038] text-amber-400 font-mono font-bold border border-slate-700 shrink-0">
                Raising: ${(myStartup?.askAmount / 1000).toFixed(0)}k @ ${(myStartup?.valuation / 1000000).toFixed(1)}M Val
              </span>
            </div>

            {/* Profile Identity & Social Network Counters */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-300 mt-2.5">
              <button 
                onClick={() => openSocialProfileModal(currentUser.id)}
                className="hover:text-white transition-colors cursor-pointer text-center sm:text-left truncate max-w-[280px] sm:max-w-none"
              >
                Logged in as <span className="font-semibold text-white underline decoration-amber-400 underline-offset-2">{currentUser.name}</span> ({currentUser.title})
              </button>
              
              <div className="flex items-center space-x-2">
                {/* Clickable Connections Count */}
                <button
                  onClick={() => openSocialNetworkModal(currentUser.id, 'connections')}
                  className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-[#162038] border border-amber-400/30 text-amber-400 hover:bg-amber-400 hover:text-slate-950 font-mono font-bold transition-all cursor-pointer text-xs"
                  title="View Connected Founders & Investors"
                >
                  <Users className="w-3 h-3" />
                  <span>{connectionsCount} Connections</span>
                </button>

                {/* Clickable Followers Count */}
                <button
                  onClick={() => openSocialNetworkModal(currentUser.id, 'followers')}
                  className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-[#162038] border border-slate-700 text-slate-200 hover:border-amber-400 hover:text-amber-400 font-mono font-bold transition-all cursor-pointer text-xs"
                  title="View Who Follows You"
                >
                  <span>{followersCount} Followers</span>
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
        </div>

        {/* Dashboard Action Button Controls - Balanced 2x2 Grid on Mobile, Clean Row on XL */}
        <div className="grid grid-cols-2 xl:flex xl:items-center gap-2.5 w-full xl:w-auto shrink-0">
          <button
            onClick={openOnboardingModal}
            className="px-3.5 py-2.5 bg-[#162038] hover:bg-[#1E293B] text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Profile & Stripe</span>
          </button>

          <button
            onClick={handleSimulateStripeSync}
            disabled={isSimulatingStripeSync}
            className="px-3.5 py-2.5 bg-[#162038] hover:bg-[#1E293B] text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 shrink-0 ${isSimulatingStripeSync ? 'animate-spin' : ''}`} />
            <span className="truncate">{isSimulatingStripeSync ? 'Syncing...' : 'Sync Stripe'}</span>
          </button>

          {myStartup && (
            <button
              onClick={() => onOpenAIAnalysis(myStartup)}
              className="px-3.5 py-2.5 bg-[#162038] hover:bg-[#1E293B] text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">AI Valuation</span>
            </button>
          )}

          <button
            onClick={onOpenNewStartupModal}
            className={`px-3.5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5 ${
              !myStartup ? 'col-span-2 xl:col-span-1' : ''
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-950 shrink-0" />
            <span className="truncate">Create Listing</span>
          </button>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('metrics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeSubTab === 'metrics'
              ? 'bg-[#0A1128] text-white shadow-sm'
              : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>MRR & Growth Hub</span>
        </button>

        <button
          onClick={() => setActiveSubTab('interested_investors')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeSubTab === 'interested_investors'
              ? 'bg-[#0A1128] text-white shadow-sm font-extrabold'
              : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Interested Investors</span>
          <span className="flex items-center space-x-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse"></span>
            <span>{founderInterests.length}</span>
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('raise_round')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeSubTab === 'raise_round'
              ? 'bg-[#0A1128] text-white shadow-sm'
              : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>Raise Capital & Terms Editor</span>
        </button>

        <button
          onClick={() => setActiveSubTab('investors_directory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeSubTab === 'investors_directory'
              ? 'bg-[#0A1128] text-white shadow-sm'
              : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>Pitch Verified Investors ({investors.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pitch_inbox')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeSubTab === 'pitch_inbox'
              ? 'bg-[#0A1128] text-white shadow-sm'
              : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span>Active Deal Chats</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-50 text-amber-900 font-bold font-mono">
            {myPitches.length}
          </span>
        </button>
      </div>

      {/* SUB TAB 1: Live Metrics & MRR Growth */}
      {activeSubTab === 'metrics' && myStartup && (
        <div className="space-y-6">
          {/* Active Subscription Membership Banner */}
          {(() => {
            const currentPlan = subscriptionPlans.find(p => p.id === currentUser.subscriptionTier) || subscriptionPlans[0];
            return (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                    <Crown className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Active Plan:</span>
                      <span className="text-sm font-extrabold text-[#0A1128] font-mono">{currentPlan?.name || 'Explorer Tier'}</span>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                        ${currentPlan?.priceMonthly || 0}/mo
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {currentPlan?.tagline || 'Verified Stripe ledger proof, AI deal memos, and investor introductions.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                  <button
                    onClick={() => setIsSubscriptionModalOpen(true)}
                    className="px-4 py-2 bg-[#0A1128] hover:bg-[#162038] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs"
                  >
                    <span>Change / Upgrade Plan</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Inbound Investor Interest Alert Banner */}
          {founderInterests.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/40 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-950 font-mono">
                      {founderInterests.length} Accredited VCs Signaled Interest in Your Round
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-mono animate-pulse">
                      🔥 Active Inbound
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Total indicative capital pipeline: <strong className="text-slate-950 font-mono">${(founderInterests.reduce((acc, i) => acc + i.indicativeCheckSize, 0) / 1000).toFixed(0)}k</strong> from VCs who inspected your verified MRR.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveSubTab('interested_investors')}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#0A1128] hover:bg-[#162038] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-md shrink-0"
              >
                <span>View & Reach Out</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          )}

          {/* Key Metric Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-zinc-800 shadow">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Monthly MRR</span>
              <p className="text-2xl font-bold font-mono text-[#101249] mt-1">${myStartup.mrr.toLocaleString()}</p>
              <span className="text-xs text-[#101249] font-semibold">+{myStartup.growthRateMoM}% MoM Growth</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-zinc-800 shadow">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Annual ARR</span>
              <p className="text-2xl font-bold font-mono text-white mt-1">${myStartup.arr.toLocaleString()}</p>
              <span className="text-xs text-zinc-400">{myStartup.customersCount} Active Customers</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-zinc-800 shadow">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Customer LTV</span>
              <p className="text-2xl font-bold font-mono text-[#101249] mt-1">${myStartup.ltv.toLocaleString()}</p>
              <span className="text-xs text-zinc-400">CAC: ${myStartup.cac} ({(myStartup.ltv / myStartup.cac).toFixed(1)}x)</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-zinc-800 shadow">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Fundraising Ask</span>
              <p className="text-2xl font-bold font-mono text-[#101249] mt-1">${(myStartup.askAmount / 1000).toFixed(0)}k</p>
              <span className="text-xs text-zinc-400">Valuation: ${(myStartup.valuation / 1000000).toFixed(1)}M</span>
            </div>
          </div>

          {/* MRR Historical Revenue Chart */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-mono flex items-center space-x-2">
                  <span>Verified MRR Revenue Curve</span>
                  <span className="text-xs font-normal text-[#101249] bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                    Stripe Webhook Sync Active
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Automated daily ledger reconcile with zero manual entry tamper.</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-zinc-500">Last Synced:</span>
                <p className="text-xs font-mono text-zinc-300">{myStartup.verificationProofDate || 'Today'}</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={myStartup.mrrHistory}>
                  <defs>
                    <linearGradient id="founderMrrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
                  <YAxis stroke="#71717a" fontSize={11} tickFormatter={(val) => `$${val / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'MRR']}
                  />
                  <Area type="monotone" dataKey="mrr" stroke="#101249" strokeWidth={2.5} fillOpacity={1} fill="url(#founderMrrGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Verification Badge & Diligence Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#101249]" />
                  <span>Stripe Trust Proof Badge</span>
                </h4>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                  Gold Verified
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Your Stripe ledger is actively authenticated. Investors receive guaranteed, tamper-proof revenue transparency without NDA friction.
              </p>
              <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-xs font-mono text-zinc-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Stripe Account ID:</span>
                  <span className="text-[#101249]">acct_1N9xTrustMRR_live</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Webhook Status:</span>
                  <span className="text-[#101249]">200 OK (Continuous)</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-[#101249]" />
                  <span>Investor Diligence Activity</span>
                </h4>
                <span className="text-xs px-2 py-0.5 rounded bg-[#101249]/20 text-slate-700 font-mono">
                  {myStartup.diligenceRequestsCount} Inquiries
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {myStartup.viewsCount} institutional angels and venture GPs inspected your metrics ledger this month.
              </p>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">Profile Views</span>
                  <span className="text-base font-bold text-white font-mono">{myStartup.viewsCount}</span>
                </div>
                <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">Watchlist Saves</span>
                  <span className="text-base font-bold text-[#101249] font-mono">{myStartup.savesCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB: Interested Investors & Inbound Signals */}
      {activeSubTab === 'interested_investors' && (
        <div className="space-y-6">
          {/* Header Banner with Total Indicative Capital */}
          <div className="bg-gradient-to-r from-[#0A1128] via-[#162038] to-[#1E293B] border border-slate-800 rounded-3xl p-6 sm:p-7 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
                </span>
                <span className="text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">Inbound Investor Deal Flow</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white font-mono mt-1">Interested Venture Backers</h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Accredited VCs and syndicates who reviewed your Stripe-verified MRR and expressed soft commitment interest. Reach out directly to initiate diligence.
              </p>
            </div>

            <div className="flex items-center space-x-4 bg-[#162038] border border-slate-700 p-4 rounded-2xl shrink-0">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Indicative Pipeline</span>
                <span className="text-xl font-mono font-bold text-amber-400">
                  ${(founderInterests.reduce((acc, i) => acc + i.indicativeCheckSize, 0) / 1000).toFixed(0)}k
                </span>
              </div>
              <div className="border-l border-slate-700 pl-4">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Active Signals</span>
                <span className="text-xl font-mono font-bold text-white">
                  {founderInterests.length} VCs
                </span>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pb-0.5">
              <button
                onClick={() => setInterestStatusFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  interestStatusFilter === 'all'
                    ? 'bg-[#0A1128] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                All Signals ({founderInterests.length})
              </button>
              <button
                onClick={() => setInterestStatusFilter('new')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  interestStatusFilter === 'new'
                    ? 'bg-[#0A1128] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                🔥 New Inbound ({founderInterests.filter(i => i.status === 'new').length})
              </button>
              <button
                onClick={() => setInterestStatusFilter('founder_reached_out')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  interestStatusFilter === 'founder_reached_out'
                    ? 'bg-[#0A1128] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                💬 In Discussion ({founderInterests.filter(i => i.status === 'founder_reached_out').length})
              </button>
              <button
                onClick={() => setInterestStatusFilter('data_room_shared')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  interestStatusFilter === 'data_room_shared'
                    ? 'bg-[#0A1128] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                📂 Data Room Active ({founderInterests.filter(i => i.status === 'data_room_shared').length})
              </button>
            </div>
          </div>

          {/* Interested Investor Cards Grid */}
          {filteredInterests.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
              <Sparkles className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No Investor Signals in this Category</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Verified investors browsing the MRR Leaderboard will signal round interest as your verified growth milestones update.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredInterests.map(interest => (
                <div 
                  key={interest.id}
                  className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Identity Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => openSocialProfileModal(interest.investorId)}
                          className="relative shrink-0 group cursor-pointer"
                        >
                          <img
                            src={interest.investorAvatar}
                            alt={interest.investorName}
                            className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-200 group-hover:border-amber-400 transition-colors"
                          />
                          {interest.isAccredited && (
                            <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-0.5 rounded-full shadow-xs" title="Accredited VC">
                              <UserCheck className="w-3 h-3" />
                            </span>
                          )}
                        </button>
                        <div className="min-w-0">
                          <button
                            onClick={() => openSocialProfileModal(interest.investorId)}
                            className="font-bold text-slate-900 text-sm hover:text-amber-600 transition-colors text-left truncate block cursor-pointer"
                          >
                            {interest.investorName}
                          </button>
                          <p className="text-[11px] text-slate-500 font-semibold truncate">
                            {interest.investorTitle} • <strong className="text-slate-700">{interest.investorFirm}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Conviction Badge */}
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full font-mono shrink-0 ${
                        interest.interestLevel === 'term_sheet_ready' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                        interest.interestLevel === 'high_conviction' ? 'bg-amber-100 text-amber-950 border border-amber-300' :
                        'bg-blue-100 text-blue-900 border border-blue-200'
                      }`}>
                        {interest.interestLevel === 'term_sheet_ready' ? 'Term Sheet' :
                         interest.interestLevel === 'high_conviction' ? '🔥 High Conviction' : '🔍 Exploring'}
                      </span>
                    </div>

                    {/* Indicative Check Box */}
                    <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Indicative Check</span>
                        <span className="text-base font-mono font-extrabold text-[#0A1128]">
                          ${(interest.indicativeCheckSize / 1000).toFixed(0)},000
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Status</span>
                        <span className={`inline-flex items-center space-x-1 text-[11px] font-bold ${
                          interest.status === 'new' ? 'text-amber-600' :
                          interest.status === 'founder_reached_out' ? 'text-blue-600' :
                          interest.status === 'data_room_shared' ? 'text-emerald-600' : 'text-slate-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            interest.status === 'new' ? 'bg-amber-500 animate-pulse' :
                            interest.status === 'founder_reached_out' ? 'bg-blue-500' :
                            interest.status === 'data_room_shared' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}></span>
                          <span>
                            {interest.status === 'new' ? 'New Signal' :
                             interest.status === 'founder_reached_out' ? 'Reached Out' :
                             interest.status === 'data_room_shared' ? 'Data Room Shared' : 'Meeting Set'}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Investor Note Quote */}
                    <div className="mt-3 bg-amber-50/50 border border-amber-200/60 rounded-2xl p-3 text-xs text-slate-700 italic relative">
                      <p className="line-clamp-3">"{interest.note}"</p>
                      <span className="block not-italic text-[10px] text-slate-400 mt-1 font-mono">
                        Signaled {new Date(interest.signaledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* 1-Click Action Hub */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
                    <button
                      onClick={() => reachOutToInterestedInvestor(interest)}
                      className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-sm shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-slate-950" />
                      <span>Reach Out via Direct Chat</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          updateInvestorInterestStatus(interest.id, 'data_room_shared');
                          showToast(`📂 Diligence memo & data room shared with ${interest.investorName}!`);
                        }}
                        className="py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                        title="Grant access to Cap Table & Stripe Financial Ledger"
                      >
                        <Lock className="w-3 h-3 text-slate-500" />
                        <span>Share Data Room</span>
                      </button>

                      <button
                        onClick={() => openSocialProfileModal(interest.investorId)}
                        className="py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-slate-500" />
                        <span>View VC Profile</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 2: Raise Capital & Profile Editor */}
      {activeSubTab === 'raise_round' && myStartup && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Round Form Editor */}
          <form onSubmit={handleSaveFundraisingRound} className="lg:col-span-2 bg-white border border-zinc-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-mono flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-[#101249]" />
                  <span>Fundraising Round & Investor Profile</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Configure the terms and pitch deck that accredited investors see on your deal page.
                </p>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-[#101249] hover:bg-[#101249] text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Round Terms</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Target Round Stage</label>
                <select
                  value={targetRound}
                  onChange={(e) => setTargetRound(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-300"
                >
                  <option value="Pre-Seed Round">Pre-Seed Round</option>
                  <option value="Seed Round">Seed Round</option>
                  <option value="Series A Round">Series A Round</option>
                  <option value="Series B Round">Series B Round</option>
                  <option value="Bridge Note">Bridge Note (SAFE)</option>
                  <option value="Growth Equity">Growth Equity</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Calculated Equity Dilution</label>
                <div className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-[#101249] font-bold flex items-center justify-between">
                  <span>{calculatedDilution}% Equity</span>
                  <span className="text-[10px] text-zinc-500">Ask ÷ Valuation</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Ask Amount (USD $)</label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    value={askAmount}
                    onChange={(e) => setAskAmount(Number(e.target.value))}
                    step="50000"
                    min="10000"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Valuation Cap (USD $ Post-Money)</label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    value={valuation}
                    onChange={(e) => setValuation(Number(e.target.value))}
                    step="100000"
                    min="500000"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-slate-300"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Elevator Pitch & Highlights</label>
              <textarea
                value={pitchSummary}
                onChange={(e) => setPitchSummary(e.target.value)}
                rows={3}
                placeholder="Describe your revenue momentum, core problem, and why your team wins..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-slate-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Pitch Deck Title</label>
                <input
                  type="text"
                  value={pitchDeckTitle}
                  onChange={(e) => setPitchDeckTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Slides Count</label>
                <input
                  type="number"
                  value={deckSlidesCount}
                  onChange={(e) => setDeckSlidesCount(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Target Use of Funds</label>
              <input
                type="text"
                value={useOfFunds}
                onChange={(e) => setUseOfFunds(e.target.value)}
                placeholder="e.g. 50% Engineering, 30% Marketing, 20% Operations"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-slate-300"
              />
            </div>
          </form>

          {/* Live Preview as Investor Card */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-xs font-bold text-[#101249] uppercase tracking-wider flex items-center space-x-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Investor Live Preview</span>
                </span>
                <span className="text-[10px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  What VCs see
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <img
                  src={myStartup.logo}
                  alt={myStartup.name}
                  className="w-12 h-12 rounded-xl object-cover border border-zinc-700"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">{myStartup.name}</h4>
                  <p className="text-xs text-zinc-400">{myStartup.category}</p>
                </div>
              </div>

              <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Target Round:</span>
                  <span className="font-bold text-white font-mono">{targetRound}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Ask Amount:</span>
                  <span className="font-bold text-[#101249] font-mono">${Number(askAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Valuation Cap:</span>
                  <span className="font-bold text-zinc-200 font-mono">${Number(valuation).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Equity Offered:</span>
                  <span className="font-bold text-[#101249] font-mono">{calculatedDilution}%</span>
                </div>
              </div>

              <p className="text-xs text-zinc-300 italic leading-relaxed">
                "{pitchSummary || myStartup.tagline}"
              </p>

              <button
                type="button"
                onClick={() => setSelectedStartup(myStartup)}
                className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#101249]" />
                <span>Open Full Diligence Dossier Modal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 3: Pitch Verified Investors */}
      {activeSubTab === 'investors_directory' && (() => {
        // STRICT FILTERING: Only show investors who are actively open to receiving pitches
        const openInvestors = investors.filter((inv) => {
          if (inv.acceptingPitches === false) return false;
          
          const matchSearch = 
            inv.name.toLowerCase().includes(investorSearch.toLowerCase()) ||
            inv.firm.toLowerCase().includes(investorSearch.toLowerCase()) ||
            inv.bio.toLowerCase().includes(investorSearch.toLowerCase()) ||
            inv.location.toLowerCase().includes(investorSearch.toLowerCase());

          const matchSector = 
            investorSectorFilter === 'All' || 
            inv.targetSectors.some(s => s.toLowerCase().includes(investorSectorFilter.toLowerCase()));

          return matchSearch && matchSector;
        });

        const isFreeTier = currentUser.subscriptionTier === 'free';
        const sectorsList = ['All', 'B2B SaaS', 'AI & Machine Learning', 'FinTech & Payments', 'DevTools & Infra', 'Security & Privacy'];

        return (
          <div className="space-y-4">
            {/* Subscription banner for Founder */}
            {isFreeTier ? (
              <div className="bg-slate-100 border border-slate-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-300 shrink-0">
                    <Crown className="w-5 h-5 text-[#101249]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Founder Pro Subscription • Direct Pitching Engine
                    </h4>
                    <p className="text-xs text-zinc-300">
                      Free tier includes 1 starter pitch. Upgrade to Founder Pro ($49/mo) for unlimited direct VC pitches and verified Stripe priority inbox placement.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="px-4 py-2 bg-[#101249] hover:bg-[#1a1d6e] text-black font-bold rounded-lg text-xs transition-colors shrink-0 shadow cursor-pointer"
                >
                  Upgrade to Founder Pro
                </button>
              </div>
            ) : (
              <div className="bg-slate-100 border border-slate-300 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#101249] shrink-0" />
                  <span className="font-semibold">Founder Pro Active: Unlimited Direct VC Pitches & Verified Priority Delivery</span>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                  UNLIMITED PITCHING
                </span>
              </div>
            )}

            {/* Header & Notice */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-[#0A1128] font-mono">
                    Accredited Investors Open to Inbound Pitches ({openInvestors.length})
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-extrabold flex items-center space-x-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span>Accepting Inbound</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing verified Angels and VC partners actively accepting direct founder pitches for their check size.
                </p>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={investorSearch}
                    onChange={(e) => setInvestorSearch(e.target.value)}
                    placeholder="Search investor, firm..."
                    className="bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500 w-44 sm:w-56"
                  />
                </div>

                <select
                  value={investorSectorFilter}
                  onChange={(e) => setInvestorSectorFilter(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-[#0A1128] font-bold focus:outline-none focus:border-amber-500"
                >
                  {sectorsList.map((sec) => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Investor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {openInvestors.map((investor) => {
                const meetsMrr = investor.minMrrToPitch 
                  ? (myStartup?.mrr || 0) >= investor.minMrrToPitch 
                  : true;

                return (
                  <div
                    key={investor.id}
                    className="bg-white border border-slate-200 hover:border-amber-400/80 rounded-2xl p-5 space-y-4 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Top profile */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={investor.avatar}
                              alt={investor.name}
                              className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
                            />
                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-amber-400 border-2 border-white" title="Open to pitches"></span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <h4 className="font-extrabold text-sm text-[#0A1128]">{investor.name}</h4>
                              {investor.accreditationStatus === 'verified' && (
                                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" title="Verified Accredited Investor" />
                              )}
                            </div>
                            <p className="text-xs text-slate-500 font-medium">{investor.firm}</p>
                            <span className="text-[10px] text-slate-700 font-bold">{investor.title} • {investor.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Check size & track record */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-bold">Check Size Range:</span>
                          <span className="font-extrabold text-amber-600 font-mono">
                            ${(investor.checkSizeMin / 1000).toFixed(0)}k - ${(investor.checkSizeMax / 1000).toFixed(0)}k
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Portfolio & Deployed:</span>
                          <span className="text-[#0A1128] font-bold font-mono">{investor.portfolioCount} Deals ({investor.totalInvested})</span>
                        </div>
                      </div>

                      {/* MRR Requirement Match Badge */}
                      {investor.minMrrToPitch ? (
                        <div className={`p-2 rounded-xl text-xs flex items-center justify-between ${
                          meetsMrr 
                            ? 'bg-amber-50 border border-amber-200 text-amber-900' 
                            : 'bg-slate-50 border border-slate-200 text-slate-600'
                        }`}>
                          <span className="flex items-center space-x-1 text-[11px] font-bold">
                            {meetsMrr ? <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" /> : <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                            <span>Min MRR: ${(investor.minMrrToPitch / 1000).toFixed(0)}k/mo</span>
                          </span>
                          <span className="text-[10px] font-mono font-extrabold">
                            {meetsMrr ? '✓ MRR Match' : 'High Requirement'}
                          </span>
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-lg bg-slate-50 text-slate-600 text-[11px] flex items-center space-x-1 border border-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>No strict MRR minimum</span>
                        </div>
                      )}

                      {/* Intake instructions note */}
                      {investor.pitchIntakeInstructions && (
                        <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200 line-clamp-2 leading-relaxed">
                          "{investor.pitchIntakeInstructions}"
                        </p>
                      )}

                      {/* Bio snippet */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {investor.bio}
                      </p>

                      {/* Target stages and sectors */}
                      <div className="flex flex-wrap gap-1">
                        {investor.targetStages.map(st => (
                          <span key={st} className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                            {st}
                          </span>
                        ))}
                        {investor.targetSectors.slice(0, 2).map(sec => (
                          <span key={sec} className="text-[10px] px-2 py-0.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-bold">
                            {sec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectInvestorToPitch(investor)}
                      className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer mt-3 transform hover:-translate-y-0.5"
                    >
                      <Send className="w-3.5 h-3.5 text-slate-950" />
                      <span>Pitch My Startup to {investor.name.split(' ')[0]}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {openInvestors.length === 0 && (
              <div className="bg-white border border-zinc-800 rounded-xl p-8 text-center text-xs text-zinc-400 space-y-2">
                <Search className="w-8 h-8 text-zinc-600 mx-auto mb-1" />
                <p className="font-semibold text-white">No active investors match your filter criteria.</p>
                <p className="text-zinc-500">Try clearing the sector filter or searching by city or firm.</p>
              </div>
            )}
          </div>
        );
      })()}

      {/* SUB TAB 4: Pitch Inbox & Active Deal Chats */}
      {activeSubTab === 'pitch_inbox' && (
        <div className="bg-white border border-zinc-800 rounded-xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-3 min-h-[480px]">
          {/* Pitch List Sidebar */}
          <div className="border-r border-zinc-800 p-4 divide-y divide-zinc-800/60 overflow-y-auto">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Conversations ({myPitches.length})
            </h4>

            {myPitches.map((pitch) => (
              <button
                key={pitch.id}
                onClick={() => setSelectedPitchId(pitch.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors cursor-pointer ${
                  activeSelectedPitch?.id === pitch.id
                    ? 'bg-zinc-800 text-white border border-zinc-700'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-zinc-200">{pitch.investorName}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono capitalize">
                    {pitch.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5 line-clamp-1">{pitch.investorFirm}</p>
                <p className="text-xs text-zinc-300 mt-1 line-clamp-1">{pitch.pitchSubject}</p>
              </button>
            ))}

            {myPitches.length === 0 && (
              <div className="p-6 text-center text-xs text-zinc-500">
                No active pitches yet. Browse the Investor Directory to send your first pitch!
              </div>
            )}
          </div>

          {/* Active Chat Conversation Area */}
          <div className="md:col-span-2 flex flex-col justify-between bg-[#080B11] p-5">
            {activeSelectedPitch ? (
              <>
                {/* Conversation Header */}
                <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={activeSelectedPitch.investorAvatar}
                      alt={activeSelectedPitch.investorName}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-white">{activeSelectedPitch.investorName}</h4>
                      <p className="text-xs text-zinc-400">{activeSelectedPitch.investorFirm} • Ask: ${(activeSelectedPitch.askAmount / 1000).toFixed(0)}k</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700 border border-slate-300 font-mono">
                    Status: {activeSelectedPitch.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Messages Feed */}
                <div className="py-4 space-y-3 overflow-y-auto max-h-[300px]">
                  {activeSelectedPitch.messages.map((msg) => {
                    const isMe = msg.senderRole === 'founder';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center space-x-1 text-[11px] text-zinc-500 mb-0.5">
                          <span>{msg.senderName}</span>
                          <span>•</span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div
                          className={`max-w-md p-3 rounded-xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-[#101249] text-white rounded-br-none'
                              : 'bg-zinc-800 text-zinc-200 rounded-bl-none border border-zinc-700'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Chat Input */}
                <div className="border-t border-zinc-800 pt-3 flex items-center space-x-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type message or attach diligence update..."
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-slate-300"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-[#101249] hover:bg-[#101249] text-white rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-zinc-500">
                Select a pitch from the list to view the conversation.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
