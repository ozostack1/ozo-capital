import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  Lock, 
  Unlock, 
  Search, 
  Filter, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  ArrowUpRight, 
  BarChart2, 
  DollarSign, 
  Percent, 
  Users, 
  Zap,
  Bot,
  Layers,
  ChevronRight,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { Startup, StartupCategory, StartupStage } from '../types';

interface PublicDirectoryProps {
  onSelectStartup: (startup: Startup) => void;
  onOpenPitch: (startup: Startup) => void;
  onOpenAIAnalysis: (startup: Startup) => void;
  onSignalInterest?: (startup: Startup) => void;
}

export const PublicDirectory: React.FC<PublicDirectoryProps> = ({ 
  onSelectStartup, 
  onOpenPitch, 
  onOpenAIAnalysis,
  onSignalInterest 
}) => {
  const { 
    startups, 
    currentUser, 
    currentRole, 
    toggleSaveStartup, 
    savedStartupIds, 
    addDealToPipeline,
    setIsSubscriptionModalOpen,
    openSocialProfileModal,
    isInvestorInterestedInStartup,
    getInvestorInterestForStartup
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'mrr_desc' | 'growth_desc' | 'churn_asc' | 'saves_desc'>('mrr_desc');

  const categories: (StartupCategory | 'All')[] = [
    'All',
    'AI & Machine Learning',
    'B2B SaaS',
    'FinTech & Payments',
    'DevTools & Infra',
    'Security & Privacy',
    'E-Commerce & Retail'
  ];

  const stages: (StartupStage | 'All')[] = ['All', 'Bootstrapped', 'Pre-Seed', 'Seed', 'Series A'];

  // Filter and sort startups
  const filteredStartups = useMemo(() => {
    return startups
      .filter(s => {
        const matchesSearch = 
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
        const matchesStage = selectedStage === 'All' || s.stage === selectedStage;
        const matchesVerified = !verifiedOnly || s.isVerified;

        return matchesSearch && matchesCategory && matchesStage && matchesVerified;
      })
      .sort((a, b) => {
        if (sortBy === 'mrr_desc') return b.mrr - a.mrr;
        if (sortBy === 'growth_desc') return b.growthRateMoM - a.growthRateMoM;
        if (sortBy === 'churn_asc') return a.churnRateMonthly - b.churnRateMonthly;
        if (sortBy === 'saves_desc') return b.savesCount - a.savesCount;
        return 0;
      });
  }, [startups, searchQuery, selectedCategory, selectedStage, verifiedOnly, sortBy]);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Venture Leaderboard Header - Deep Navy with Gold & White (Vestbee / Investment Network Style) */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0A1128] border border-slate-800 p-6 sm:p-10 shadow-2xl text-white">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>TrustMRR Verified SaaS Marketplace</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-mono">
            Directly Invest in Verified MRR Startups
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Where high-growth SaaS founders connect with accredited investors. Real-time Stripe ledger verification, audit-ready cohort retention, and AI-powered deal scoring.
          </p>

          {/* Quick Metrics Bar with Golden Yellow Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Verified MRR</p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-0.5">
                ${(startups.reduce((sum, s) => sum + s.mrr, 0)).toLocaleString()}/mo
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Avg. MoM Growth</p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-white mt-0.5">
                +{(startups.reduce((sum, s) => sum + s.growthRateMoM, 0) / startups.length).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Average Churn Rate</p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-white mt-0.5">
                {(startups.reduce((sum, s) => sum + s.churnRateMonthly, 0) / startups.length).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Active Capital Pool</p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-0.5">$56.5M</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Toolbar */}
      <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="directory-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by startup name, keyword, or tag..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>

          {/* Controls: Verified toggle & Sort */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
            <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
              <input
                id="verified-only-checkbox"
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 accent-amber-500 w-4 h-4"
              />
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Stripe Verified Only</span>
              </span>
            </label>

            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-slate-500 font-medium hidden sm:inline">Sort:</span>
              <select
                id="sort-by-select"
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="mrr_desc">Highest MRR ($)</option>
                <option value="growth_desc">Fastest MoM Growth (%)</option>
                <option value="churn_asc">Lowest Monthly Churn</option>
                <option value="saves_desc">Most Saved / Trending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills with Deep Navy Active State */}
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer shadow-xs ${
                selectedCategory === cat
                  ? 'bg-[#0A1128] text-white border border-[#0A1128] font-bold shadow-md'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Directory Startups Grid - Crisp White Cards with Golden Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStartups.map((startup) => {
          const isSaved = savedStartupIds.includes(startup.id);
          
          return (
            <div
              key={startup.id}
              id={`startup-card-${startup.id}`}
              className="group relative bg-white hover:bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
            >
              {/* Top Meta & Badges */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={startup.logo}
                      alt={startup.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-slate-100 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 className="font-bold text-base text-[#0A1128] group-hover:text-amber-600 transition-colors">
                          {startup.name}
                        </h3>
                        {startup.isVerified && (
                          <div 
                            title="Verified Stripe Integration"
                            className="flex items-center text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[10px] font-bold"
                          >
                            <ShieldCheck className="w-3 h-3 mr-0.5 text-amber-600" />
                            <span>Stripe Verified</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-medium mt-0.5">
                        <span className="text-slate-700 font-semibold">{startup.category}</span>
                        <span>•</span>
                        <span className="px-2 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">{startup.stage}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveStartup(startup.id);
                    }}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      isSaved
                        ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                    title={isSaved ? "Saved in Watchlist" : "Save to Watchlist"}
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4 text-amber-600" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                {/* Founder Info Link */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    openSocialProfileModal(startup.founderId);
                  }}
                  className="mt-3 flex items-center space-x-2 cursor-pointer group/founder w-fit"
                  title={`View Founder ${startup.founderName}'s Social Profile`}
                >
                  <img
                    src={startup.founderAvatar}
                    alt={startup.founderName}
                    className="w-5 h-5 rounded-full object-cover border border-slate-300 group-hover/founder:ring-2 group-hover/founder:ring-amber-400 transition-all"
                  />
                  <span className="text-xs text-slate-600 group-hover/founder:text-amber-600 font-semibold transition-colors">
                    by <strong className="text-slate-800 underline decoration-slate-300 group-hover/founder:decoration-amber-500">{startup.founderName}</strong>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed font-normal">
                  {startup.tagline}
                </p>

                {/* Primary Financial Metric Box */}
                <div className="mt-4 bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Monthly Revenue (MRR)</span>
                      <div className="flex items-baseline space-x-1.5 mt-0.5">
                        <span className="text-lg font-bold font-mono text-[#0A1128]">
                          ${startup.mrr.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-amber-600 flex items-center">
                          +{startup.growthRateMoM}%
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Annual Run Rate (ARR)</span>
                      <p className="text-lg font-bold font-mono text-[#0A1128] mt-0.5">
                        ${startup.arr.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Secondary Metrics Bar */}
                  <div className="grid grid-cols-3 gap-1 mt-2.5 pt-2.5 border-t border-slate-200 text-[11px]">
                    <div>
                      <span className="text-slate-500">Churn:</span>{' '}
                      <span className="text-slate-800 font-mono font-bold">{startup.churnRateMonthly}%/mo</span>
                    </div>
                    <div className="text-center">
                      <span className="text-slate-500">Users:</span>{' '}
                      <span className="text-slate-800 font-mono font-bold">{startup.customersCount}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500">Ask:</span>{' '}
                      <span className="text-amber-600 font-mono font-bold">${(startup.askAmount / 1000).toFixed(0)}k</span>
                    </div>
                  </div>

                  {/* Mini Sparkline Chart */}
                  <div className="h-14 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={startup.mrrHistory}>
                        <defs>
                          <linearGradient id={`mrrGrad-${startup.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="mrr" 
                          stroke="#D97706" 
                          strokeWidth={2.5}
                          fillOpacity={1} 
                          fill={`url(#mrrGrad-${startup.id})`} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* AI Valuation Badge */}
                {startup.aiDealScore && (
                  <div className="mt-3 flex items-center justify-between text-xs bg-amber-50/70 border border-amber-200 px-3 py-1.5 rounded-xl text-amber-950 font-medium">
                    <div className="flex items-center space-x-1.5">
                      <Bot className="w-3.5 h-3.5 text-amber-600" />
                      <span className="font-bold">AI Deal Score:</span>
                    </div>
                    <div className="font-mono font-bold text-amber-900">
                      {startup.aiDealScore}/100 • {startup.aiValuationMultiple}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectStartup(startup)}
                    className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-[#0A1128] font-bold rounded-xl text-xs flex items-center justify-center space-x-1 transition-colors cursor-pointer border border-slate-200"
                  >
                    <span>Dossier</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenAIAnalysis(startup)}
                    className="flex-1 py-2 px-3 bg-[#0A1128] hover:bg-[#162038] text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1 shadow-sm transition-all cursor-pointer hover:border-amber-400 border border-transparent"
                  >
                    <Bot className="w-3.5 h-3.5 text-amber-400" />
                    <span>AI Memo</span>
                  </button>
                </div>

                {currentRole === 'investor' && (
                  <button
                    onClick={() => onSignalInterest && onSignalInterest(startup)}
                    className={`w-full py-1.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs ${
                      isInvestorInterestedInStartup(startup.id)
                        ? 'bg-amber-100 text-amber-950 border border-amber-300'
                        : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {isInvestorInterestedInStartup(startup.id)
                        ? `✓ Round Interest Signaled ($${((getInvestorInterestForStartup(startup.id)?.indicativeCheckSize || 250000)/1000).toFixed(0)}k)`
                        : '✨ Signal Round Interest'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
