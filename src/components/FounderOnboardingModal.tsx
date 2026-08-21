import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Lock, 
  Building2, 
  DollarSign, 
  Globe, 
  PieChart, 
  Check, 
  RefreshCw, 
  UploadCloud, 
  BadgeCheck, 
  Layers, 
  User, 
  Zap,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StartupCategory, StartupStage } from '../types';

interface FounderOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: StartupCategory[] = [
  'AI & Machine Learning',
  'B2B SaaS',
  'FinTech & Payments',
  'DevTools & Infra',
  'Security & Privacy',
  'E-Commerce & Retail',
  'HealthTech',
  'Productivity & Work'
];

const STAGES: StartupStage[] = ['Bootstrapped', 'Pre-Seed', 'Seed', 'Series A'];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
];

const HIGHLIGHT_OPTIONS = [
  '⚡ Top 5% MoM Growth in Sector',
  '🔒 SOC2 Type II Certified',
  '⭐ 118% Net Revenue Retention (NRR)',
  '📈 4.2x LTV/CAC Ratio',
  '🚀 90%+ Organic Word-of-Mouth Signups',
  '💼 Enterprise Multi-Seat Expansion Active',
  '💎 Profit Margin > 80%'
];

export const FounderOnboardingModal: React.FC<FounderOnboardingModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentUser, completeFounderOnboarding, showToast, setCurrentView } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Founder & Startup Info
  const [founderName, setFounderName] = useState(currentUser?.name || 'Elena Rostova');
  const [founderTitle, setFounderTitle] = useState(currentUser?.title || 'Founder & CEO');
  const [founderAvatar, setFounderAvatar] = useState(currentUser?.avatar || AVATAR_PRESETS[0]);
  const [founderBio, setFounderBio] = useState('Building next-generation B2B workflow automation with verifiable ledger metrics.');
  
  const [startupName, setStartupName] = useState('SyncPulse AI');
  const [tagline, setTagline] = useState('Autonomous SaaS Revenue Operations & Intelligent Churn Prevention');
  const [category, setCategory] = useState<StartupCategory>('B2B SaaS');
  const [stage, setStage] = useState<StartupStage>('Seed');
  const [website, setWebsite] = useState('https://syncpulse.ai');
  const [location, setLocation] = useState('San Francisco, CA');

  // Step 2: Financial Metrics & Fundraise Ask
  const [mrr, setMrr] = useState<number>(38500);
  const [growthRateMoM, setGrowthRateMoM] = useState<number>(19.5);
  const [churnRateMonthly, setChurnRateMonthly] = useState<number>(1.2);
  const [customersCount, setCustomersCount] = useState<number>(142);
  const [askAmount, setAskAmount] = useState<number>(600000);
  const [valuation, setValuation] = useState<number>(4500000);
  const [targetRound, setTargetRound] = useState('Seed Round');
  const [isActivelyRaising, setIsActivelyRaising] = useState(true);
  const [selectedHighlights, setSelectedHighlights] = useState<string[]>([
    '⚡ Top 5% MoM Growth in Sector',
    '⭐ 118% Net Revenue Retention (NRR)',
    '📈 4.2x LTV/CAC Ratio'
  ]);

  // Step 3: Stripe Simulation State
  const [isVerifyingStripe, setIsVerifyingStripe] = useState(false);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [verificationStage, setVerificationStage] = useState<number>(0);
  const [verifiedMrr, setVerifiedMrr] = useState<number>(0);
  const [verifiedCustomers, setVerifiedCustomers] = useState<number>(0);
  const [verificationHash, setVerificationHash] = useState<string>('');

  if (!isOpen) return null;

  const arr = mrr * 12;
  const equityDilution = valuation > 0 ? ((askAmount / valuation) * 100).toFixed(1) : '0.0';

  const toggleHighlight = (item: string) => {
    if (selectedHighlights.includes(item)) {
      setSelectedHighlights(selectedHighlights.filter(h => h !== item));
    } else {
      setSelectedHighlights([...selectedHighlights, item]);
    }
  };

  const handleStartStripeSync = () => {
    setIsVerifyingStripe(true);
    setVerificationStage(1);

    setTimeout(() => setVerificationStage(2), 700);
    setTimeout(() => setVerificationStage(3), 1400);
    setTimeout(() => {
      setVerificationStage(4);
      setIsVerifyingStripe(false);
      setStripeConnected(true);
      setVerifiedMrr(mrr);
      setVerifiedCustomers(customersCount);
      setVerificationHash(`0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`);
      showToast('⚡ Stripe Ledger successfully audited and cryptographically sealed!');
    }, 2200);
  };

  const handleFinishOnboarding = () => {
    const onboardingPayload = {
      founderName,
      founderTitle,
      founderAvatar,
      founderBio,
      startup: {
        name: startupName,
        tagline,
        category,
        stage,
        website,
        location,
        mrr,
        arr,
        growthRateMoM,
        churnRateMonthly,
        customersCount,
        askAmount,
        valuation,
        targetRound,
        isActivelyRaising,
        isVerified: stripeConnected,
        tags: selectedHighlights
      }
    };

    completeFounderOnboarding(onboardingPayload);
    onClose();
    setCurrentView('founder_dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      {/* Compact, Sleek Modal Box */}
      <div 
        id="founder-onboarding-modal"
        className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col relative my-auto max-h-[90vh]"
      >
        {/* Modal Header - Deep Navy with Golden Yellow Stepper */}
        <div className="bg-[#0A1128] px-5 pt-4 pb-3 border-b border-slate-800 relative text-white">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 text-slate-300 hover:text-white bg-[#162038] hover:bg-slate-700 p-1.5 rounded-full transition-colors cursor-pointer"
            title="Save and exit"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3 mb-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#162038] border border-amber-400/40 flex items-center justify-center shadow-sm shrink-0">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-950 bg-amber-400 px-2 py-0.2 rounded">
                  Founder Onboarding
                </span>
                <span className="text-slate-400 text-xs">• Step {currentStep} of 4</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white font-mono mt-0.5">
                {currentStep === 1 && '1. Founder & SaaS Identity'}
                {currentStep === 2 && '2. Financial Metrics & Round Parameters'}
                {currentStep === 3 && '3. Connect & Verify Stripe Metrics'}
                {currentStep === 4 && '4. Verification Seal & Marketplace Launch'}
              </h2>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {[
              { num: 1, label: 'Identity' },
              { num: 2, label: 'Financials' },
              { num: 3, label: 'Stripe Sync' },
              { num: 4, label: 'Launch' }
            ].map(step => (
              <button
                key={step.num}
                onClick={() => setCurrentStep(step.num as any)}
                className={`text-left group cursor-pointer transition-all ${
                  currentStep === step.num
                    ? 'opacity-100'
                    : currentStep > step.num
                    ? 'opacity-85'
                    : 'opacity-40'
                }`}
              >
                <div className="h-1.5 rounded-full overflow-hidden bg-slate-800 mb-1">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      currentStep >= step.num 
                        ? 'bg-amber-400' 
                        : 'bg-transparent'
                    }`} 
                  />
                </div>
                <p className="text-[10px] font-bold text-slate-300 flex items-center space-x-1">
                  {currentStep > step.num ? (
                    <Check className="w-3 h-3 text-amber-400 shrink-0 inline" />
                  ) : (
                    <span className="text-slate-400">{step.num}.</span>
                  )}
                  <span className="truncate">{step.label}</span>
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-white text-[#0A1128]">

          {/* ================= STEP 1: FOUNDER & STARTUP PROFILE ================= */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-amber-900">TrustMRR Profile Integrity</p>
                  <p className="text-slate-600 mt-0.5 leading-normal">
                    Accredited investors value transparent founder profiles. Complete your company details to unlock direct VC introductions and leaderboard visibility.
                  </p>
                </div>
              </div>

              {/* Founder Information Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1128] font-mono flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>Founder Profile</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      value={founderName}
                      onChange={(e) => setFounderName(e.target.value)}
                      placeholder="e.g., Alex Vance"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Founder Role / Title</label>
                    <input
                      type="text"
                      value={founderTitle}
                      onChange={(e) => setFounderTitle(e.target.value)}
                      placeholder="e.g., Founder & CEO"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Avatar Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Profile Avatar</label>
                  <div className="flex items-center space-x-2.5 overflow-x-auto pb-1">
                    {AVATAR_PRESETS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFounderAvatar(url)}
                        className={`relative rounded-xl p-0.5 transition-all cursor-pointer shrink-0 ${
                          founderAvatar === url 
                            ? 'ring-2 ring-amber-400 scale-105 shadow-sm' 
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img 
                          src={url} 
                          alt="Avatar preset" 
                          className="w-9 h-9 rounded-lg object-cover" 
                        />
                        {founderAvatar === url && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center text-slate-950">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Short Founder Bio</label>
                  <textarea
                    rows={2}
                    value={founderBio}
                    onChange={(e) => setFounderBio(e.target.value)}
                    placeholder="Brief summary of your background, previous ventures, or domain expertise..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
                  />
                </div>
              </div>

              {/* Startup Information Section */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1128] font-mono flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>SaaS Company Profile</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Startup / Company Name</label>
                    <input
                      type="text"
                      value={startupName}
                      onChange={(e) => setStartupName(e.target.value)}
                      placeholder="e.g., SyncPulse AI"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Primary Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as StartupCategory)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">One-Line Elevator Tagline</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g., Autonomous SaaS Revenue Operations & Intelligent Churn Prevention"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company Website</label>
                    <div className="relative">
                      <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://startup.com"
                        className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company Stage</label>
                    <select
                      value={stage}
                      onChange={(e) => setStage(e.target.value as StartupStage)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    >
                      {STAGES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Headquarters</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., San Francisco, CA"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: FINANCIAL METRICS & FUNDRAISE ================= */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Financial Metrics Inputs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1128] font-mono flex items-center space-x-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                    <span>Current Recurring Revenue</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">Step 3 will verify via Stripe</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* MRR Box */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Monthly Recurring Revenue (MRR)
                    </label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-2 text-slate-400 font-mono font-bold">$</span>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={mrr}
                        onChange={(e) => setMrr(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-lg pl-7 pr-3 py-1.5 text-base font-bold text-[#0A1128] font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
                      <span>Annualized Run Rate (ARR):</span>
                      <span className="text-[#0A1128] font-mono font-bold">${arr.toLocaleString()} /yr</span>
                    </p>
                  </div>

                  {/* Growth & Churn */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>MoM Growth Rate</span>
                        <span className="text-amber-600 font-mono font-bold">+{growthRateMoM}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="80"
                        step="0.5"
                        value={growthRateMoM}
                        onChange={(e) => setGrowthRateMoM(Number(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Monthly Churn %</label>
                        <input
                          type="number"
                          step="0.1"
                          value={churnRateMonthly}
                          onChange={(e) => setChurnRateMonthly(Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-[#0A1128] font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Paying Customers</label>
                        <input
                          type="number"
                          value={customersCount}
                          onChange={(e) => setCustomersCount(Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-[#0A1128] font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fundraise Ask & Valuation */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1128] font-mono flex items-center space-x-1.5">
                    <PieChart className="w-3.5 h-3.5 text-amber-600" />
                    <span>Fundraising Round Parameters</span>
                  </h3>
                  <label className="flex items-center space-x-2 text-xs text-slate-700 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActivelyRaising}
                      onChange={(e) => setIsActivelyRaising(e.target.checked)}
                      className="accent-amber-500 rounded"
                    />
                    <span>Actively Raising Round</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target Round</label>
                    <input
                      type="text"
                      value={targetRound}
                      onChange={(e) => setTargetRound(e.target.value)}
                      placeholder="e.g. Seed Round"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ask Amount ($)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400 text-xs font-mono font-bold">$</span>
                      <input
                        type="number"
                        step="50000"
                        value={askAmount}
                        onChange={(e) => setAskAmount(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-xl pl-7 pr-3 py-2 text-xs text-[#0A1128] font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target Valuation ($)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400 text-xs font-mono font-bold">$</span>
                      <input
                        type="number"
                        step="100000"
                        value={valuation}
                        onChange={(e) => setValuation(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-xl pl-7 pr-3 py-2 text-xs text-[#0A1128] font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Dilution Visualizer */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span className="text-slate-800 font-bold">Equity Dilution at Ask:</span>
                  </div>
                  <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    ~{equityDilution}% Equity Offered
                  </span>
                </div>

                {/* Key Highlights Chips */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Key Metric Badges (Highlights for VCs):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {HIGHLIGHT_OPTIONS.map(highlight => {
                      const active = selectedHighlights.includes(highlight);
                      return (
                        <button
                          key={highlight}
                          type="button"
                          onClick={() => toggleHighlight(highlight)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                            active
                              ? 'bg-amber-50 border border-amber-300 text-amber-900 shadow-xs'
                              : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {active && <Check className="w-3 h-3 text-amber-600 shrink-0" />}
                          <span>{highlight}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: CONNECT & VERIFY STRIPE METRICS ================= */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#635BFF] flex items-center justify-center text-white font-black text-base shrink-0 shadow-sm">
                  S
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-[#0A1128] text-sm flex items-center space-x-1.5">
                    <span>Stripe Automated Ledger Verification</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-300 font-mono">
                      TLS 1.3 OAuth 2.0
                    </span>
                  </h4>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    TrustMRR integrates directly with your Stripe billing account to verify recurring subscription invoices and cohort retention in real-time.
                  </p>
                </div>
              </div>

              {/* Live Verification Engine Panel */}
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                {!stripeConnected && !isVerifyingStripe && (
                  <div className="text-center py-4 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-[#635BFF] shadow-xs">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div className="max-w-md mx-auto">
                      <h4 className="text-sm font-bold text-[#0A1128]">
                        Connect Your Stripe Account
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Read-only webhook access. We never store customer personal information or modify your billing setup.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleStartStripeSync}
                      className="px-6 py-2.5 bg-[#635BFF] hover:bg-[#5851EA] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 mx-auto cursor-pointer"
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      <span>One-Click Verify Stripe Live Metrics</span>
                    </button>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Simulates Instant OAuth 2.0 Webhook Validation
                    </p>
                  </div>
                )}

                {/* Animated Verification In Progress */}
                {isVerifyingStripe && (
                  <div className="py-3 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0A1128] flex items-center space-x-2">
                        <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" />
                        <span>Auditing Stripe Merchant Ledger...</span>
                      </span>
                      <span className="font-mono text-amber-600 font-bold">
                        {verificationStage === 1 && '25%'}
                        {verificationStage === 2 && '55%'}
                        {verificationStage === 3 && '85%'}
                        {verificationStage === 4 && '100%'}
                      </span>
                    </div>

                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-400 transition-all duration-500"
                        style={{ 
                          width: `${verificationStage * 25}%` 
                        }}
                      />
                    </div>

                    <div className="space-y-1.5 pt-1 text-xs font-mono text-slate-600">
                      <div className={`flex items-center space-x-2 ${verificationStage >= 1 ? 'text-amber-700 font-bold' : 'text-slate-400'}`}>
                        {verificationStage >= 1 ? <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />}
                        <span>1. Handshake with api.stripe.com/v1/subscriptions</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${verificationStage >= 2 ? 'text-amber-700 font-bold' : 'text-slate-400'}`}>
                        {verificationStage >= 2 ? <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />}
                        <span>2. Audited {customersCount} active billing plans & card settlements</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${verificationStage >= 3 ? 'text-amber-700 font-bold' : 'text-slate-400'}`}>
                        {verificationStage >= 3 ? <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />}
                        <span>3. Reconciled MRR (${mrr.toLocaleString()}) against 30-day volume</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${verificationStage >= 4 ? 'text-amber-700 font-bold' : 'text-slate-400'}`}>
                        {verificationStage >= 4 ? <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />}
                        <span>4. Generated Cryptographic SHA-256 Ledger Seal</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Verification Completed State */}
                {stripeConnected && !isVerifyingStripe && (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 shrink-0">
                          <BadgeCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                            <span>Stripe Live Ledger Verified</span>
                            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                          </p>
                          <p className="text-[10px] text-amber-700 font-mono mt-0.5">
                            Seal: {verificationHash}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleStartStripeSync}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 border border-slate-200 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Re-Sync</span>
                      </button>
                    </div>

                    {/* Verified Metrics Breakdown */}
                    <div className="grid grid-cols-3 gap-2.5 text-center">
                      <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                        <span className="text-[10px] text-slate-500 block mb-0.5">Verified MRR</span>
                        <span className="text-xs sm:text-sm font-bold text-[#0A1128] font-mono">
                          ${verifiedMrr.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-amber-600 font-bold block mt-0.5">✓ 100% Match</span>
                      </div>

                      <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                        <span className="text-[10px] text-slate-500 block mb-0.5">Subscribers</span>
                        <span className="text-xs sm:text-sm font-bold text-[#0A1128] font-mono">
                          {verifiedCustomers}
                        </span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">Validated</span>
                      </div>

                      <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                        <span className="text-[10px] text-slate-500 block mb-0.5">Timestamp</span>
                        <span className="text-xs font-bold text-slate-700 font-mono">
                          {new Date().toISOString().split('T')[0]}
                        </span>
                        <span className="text-[9px] text-amber-600 font-bold block mt-0.5">Immutable</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 4: VERIFICATION SUMMARY & LAUNCH ================= */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-center space-y-1.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#0A1128] font-mono">
                  Your Founder Profile is Verified & Ready!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your startup has been listed on the TrustMRR leaderboard with the official Gold Stripe badge.
                </p>
              </div>

              {/* Startup Dossier Preview Card - Deep Navy */}
              <div className="p-4 sm:p-5 bg-[#0A1128] border border-slate-800 rounded-2xl shadow-xl space-y-3 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={founderAvatar} 
                      alt={founderName} 
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0" 
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-white font-mono">{startupName}</h4>
                        {stripeConnected && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.2 rounded-full text-[9px] font-bold bg-amber-400 text-slate-950 font-mono">
                            <ShieldCheck className="w-3 h-3 text-slate-950" />
                            <span>STRIPE VERIFIED</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {founderName} ({founderTitle}) • {category} • {stage}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-amber-400 bg-[#162038] px-2.5 py-1 rounded-lg border border-slate-700">
                    ${mrr.toLocaleString()} /mo MRR
                  </span>
                </div>

                <p className="text-xs text-slate-300 italic bg-[#162038] p-2 rounded-lg border border-slate-700">
                  "{tagline}"
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-800 text-center font-mono">
                  <div className="p-2 bg-[#162038] rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Annual ARR</span>
                    <span className="text-xs font-bold text-white">${arr.toLocaleString()}</span>
                  </div>
                  <div className="p-2 bg-[#162038] rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Growth Rate</span>
                    <span className="text-xs font-bold text-amber-400">+{growthRateMoM}%</span>
                  </div>
                  <div className="p-2 bg-[#162038] rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Round Target</span>
                    <span className="text-xs font-bold text-white">${(askAmount / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="p-2 bg-[#162038] rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Valuation</span>
                    <span className="text-xs font-bold text-amber-400">${(valuation / 1000000).toFixed(1)}M</span>
                  </div>
                </div>

                {/* Unlocked Benefits */}
                <div className="space-y-1 pt-1">
                  <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                    Unlocked Benefits:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-300">
                    <div className="flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                      <span>Official Verified Stripe Badge</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                      <span>Direct Pitch Inbound to 850+ VCs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => (prev - 1) as any)}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold transition-colors cursor-pointer"
              >
                Skip for now
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2.5">
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 1 && !startupName.trim()) {
                    showToast('Please enter your startup name');
                    return;
                  }
                  setCurrentStep(prev => (prev + 1) as any);
                }}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Continue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold shadow-md shadow-amber-500/20 transition-all flex items-center space-x-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Enter Founder Workspace</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
