import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  Zap, 
  Users, 
  Briefcase, 
  Award, 
  ChevronRight, 
  DollarSign, 
  Bot, 
  PieChart, 
  LineChart, 
  Building2, 
  Crown, 
  Layers, 
  Flame, 
  Eye, 
  FileText, 
  HelpCircle,
  ChevronDown,
  Play,
  Share2,
  Check,
  PlusCircle,
  Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Startup, StartupCategory } from '../types';

interface LandingPageProps {
  onOpenNewStartupModal: () => void;
  onSelectStartup: (startup: Startup) => void;
  onOpenAIAnalysis: (startup: Startup) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenNewStartupModal,
  onSelectStartup,
  onOpenAIAnalysis
}) => {
  const { 
    startups, 
    investors, 
    subscriptionPlans,
    upgradeSubscription,
    setCurrentView, 
    switchRoleQuick, 
    setIsSubscriptionModalOpen,
    setTargetUpgradePlan
  } = useApp();

  // Subscription Pricing Section State
  const [pricingRole, setPricingRole] = useState<'founder' | 'investor'>('founder');
  const [pricingBillingCycle, setPricingBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // Interactive Valuation Simulator State
  const [calcMrr, setCalcMrr] = useState<number>(38500);
  const [calcGrowthMoM, setCalcGrowthMoM] = useState<number>(18);
  const [calcCategory, setCalcCategory] = useState<StartupCategory>('B2B SaaS');
  const [calcChurn, setCalcChurn] = useState<number>(1.8);

  // Solution Persona Tab
  const [personaTab, setPersonaTab] = useState<'founder' | 'investor'>('founder');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Compute Simulator Values
  const annualRunRate = calcMrr * 12;
  
  let baseMultiple = 6.5;
  if (calcCategory === 'AI & Machine Learning') baseMultiple += 3.5;
  if (calcCategory === 'FinTech & Payments') baseMultiple += 2.0;
  if (calcCategory === 'Security & Privacy') baseMultiple += 2.5;
  if (calcCategory === 'DevTools & Infra') baseMultiple += 2.0;

  const growthMultiplier = (calcGrowthMoM / 10) * 1.6;
  const churnPenalty = calcChurn > 3 ? (calcChurn - 3) * 0.8 : 0;
  
  const estimatedMultiple = Math.max(4.0, Math.min(22.0, Math.round((baseMultiple + growthMultiplier - churnPenalty) * 10) / 10));
  const estimatedValuation = Math.round((annualRunRate * estimatedMultiple) / 10000) * 10000;
  const suggestedAsk = Math.round((estimatedValuation * 0.15) / 10000) * 10000;
  const estimatedMatchingInvestors = Math.min(investors.length + 12, Math.max(4, Math.round((calcMrr / 5000) * 3)));

  // Aggregate stats
  const totalVerifiedMrr = startups
    .filter(s => s.isVerified)
    .reduce((acc, s) => acc + s.mrr, 0);

  const featuredStartups = startups.slice(0, 3);
  const spotlightStartup = startups[0] || featuredStartups[0];

  const faqs = [
    {
      q: 'How does TrustMRR verify monthly recurring revenue (MRR)?',
      a: 'We connect directly to your Stripe or merchant processor via read-only OAuth credentials. Our engine algorithmically audits your live ledger, verifying active subscription renewals, recurring customer invoices, refund rates, and cohort retention. Once validated, you receive the Verified Badge.'
    },
    {
      q: 'Can founders keep their company details or metrics anonymous?',
      a: 'Yes! Founders can toggle "Stealth Diligence Mode". In stealth mode, your verified metrics, growth rate, and category remain publicly auditable on the leaderboard, but your brand name, URL, and raw customer list are masked until an accredited investor requests access and signs an integrated NDA.'
    },
    {
      q: 'How do investors get accredited on TrustMRR Pulse?',
      a: 'Investors submit their firm credentials, accredited angel verification, or LinkedIn/AngelList track record. Our compliance audit team validates credentials within 24 hours, unlocking access to full venture data rooms, direct founder pitching, and cap table models.'
    },
    {
      q: 'What is the Gemini 3.7 AI Deal Intelligence engine?',
      a: 'Our server-side AI deal memo evaluates the startup’s verified revenue trajectories against historical seed and Series A benchmark datasets. It generates fair valuation multiples, investment theses, unit economic health checks (CAC/LTV/NRR), and risk factor matrices in seconds.'
    },
    {
      q: 'Does TrustMRR take a percentage or transaction fee on closed investments?',
      a: 'No! TrustMRR operates on a transparent SaaS subscription model for founders and investors. We do not charge broker-dealer percentages or take carry on rounds closed through the platform.'
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION - Clean White Canvas with Deep Navy & Golden Yellow Accents */}
      <section className="relative pt-6 sm:pt-12 pb-10 text-center">
        {/* Top Trust Protocol Badge - Golden Yellow Accent */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-6 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>TRUST PROTOCOL v2.4</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-700">Direct Stripe Ledger Live Sync</span>
          <span className="text-amber-500 font-bold">⚡ Active</span>
        </div>

        {/* Master Headline - Vestbee & Angel Investment Network Style */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0A1128] max-w-5xl mx-auto leading-[1.1]">
          Where Real <span className="underline decoration-amber-400 decoration-wavy underline-offset-8">MRR</span> Meets Serious Venture Capital.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
          The verified marketplace connecting high-growth SaaS founders with accredited angels & VCs. 
          Zero unverified pitch deck fluff, 100% verified Stripe revenue, gated diligence vaults, and AI-powered deal intelligence.
        </p>

        {/* Action Button Row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
          {/* High Conversion Golden Yellow CTA */}
          <button
            id="hero-explore-leaderboard-btn"
            onClick={() => setCurrentView('directory')}
            className="w-full sm:w-auto px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2.5 cursor-pointer text-sm transform hover:-translate-y-0.5"
          >
            <BarChart3 className="w-4 h-4 text-slate-950" />
            <span>Explore Verified Leaderboard</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          {/* Deep Navy Secondary CTA */}
          <button
            id="hero-list-startup-btn"
            onClick={onOpenNewStartupModal}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#0A1128] hover:bg-[#162038] text-white font-bold rounded-xl border border-slate-700 shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer text-sm transform hover:-translate-y-0.5"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>List & Verify Your SaaS</span>
          </button>
        </div>

        {/* Interactive Quick Links */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600">
          <button 
            onClick={() => {
              switchRoleQuick('founder');
              setCurrentView('founder_dashboard');
            }}
            className="hover:text-amber-600 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <span>🚀 Try Founder Hub Demo</span>
          </button>
          <span className="text-slate-300">•</span>
          <button 
            onClick={() => {
              switchRoleQuick('investor');
              setCurrentView('investor_dashboard');
            }}
            className="hover:text-amber-600 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <span>💼 Try Investor CRM Demo</span>
          </button>
          <span className="text-slate-300">•</span>
          <button 
            onClick={() => {
              const el = document.getElementById('valuation-simulator');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-amber-600 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <span>⚡ Interactive Valuation Calculator</span>
          </button>
        </div>

        {/* Live Verified MRR Terminal Card Preview - Deep Navy Background with Gold/White */}
        <div className="mt-12 max-w-4xl mx-auto bg-[#0A1128] rounded-3xl border border-slate-700 p-5 sm:p-7 shadow-2xl relative overflow-hidden text-left text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-700/80 pb-4 gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
              <div>
                <span className="text-xs font-mono text-amber-400 font-extrabold uppercase tracking-wider">Live Verified Ledger Feed</span>
                <p className="text-xs text-slate-400 font-medium">Cryptographically signed Stripe webhook proof active</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono">
              <span className="text-slate-400 font-medium">Total Tracked MRR:</span>
              <span className="text-amber-400 font-extrabold text-sm sm:text-base">${totalVerifiedMrr.toLocaleString()}/mo</span>
            </div>
          </div>

          {/* Cards inside Deep Navy Terminal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {featuredStartups.map((s) => (
              <div 
                key={s.id}
                onClick={() => onSelectStartup(s)}
                className="p-4 rounded-2xl bg-white text-[#0A1128] border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img src={s.logo} alt={s.name} className="w-9 h-9 rounded-xl object-cover border border-slate-200" />
                    <div>
                      <h4 className="text-xs font-bold text-[#0A1128] group-hover:text-amber-600 transition-colors flex items-center space-x-1">
                        <span>{s.name}</span>
                        {s.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-medium">{s.category}</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-mono font-bold">
                    +{s.growthRateMoM}% MoM
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-medium">Verified MRR</span>
                    <span className="font-mono font-bold text-[#0A1128]">${s.mrr.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block font-medium">Raising</span>
                    <span className="font-mono text-amber-600 font-bold">${(s.askAmount / 1000).toFixed(0)}k</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between text-[11px] text-slate-300">
            <span className="flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Gated Diligence Rooms & SOC2 Level Access Controls</span>
            </span>
            <button 
              onClick={() => setCurrentView('directory')}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1 cursor-pointer"
            >
              <span>View all {startups.length} verified companies</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. STATS & PROOF BAR - Deep Navy */}
      <section className="rounded-3xl bg-[#0A1128] border border-slate-800 py-8 px-6 shadow-xl text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tracking-tight">$4.8M+</div>
            <div className="text-xs text-slate-300 font-medium">Monthly Verified MRR</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">100%</div>
            <div className="text-xs text-slate-300 font-medium">Stripe Ledger Verification</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tracking-tight">480+</div>
            <div className="text-xs text-slate-300 font-medium">Accredited Angels & VCs</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">18 Days</div>
            <div className="text-xs text-slate-300 font-medium">Avg. Inbound Term Sheet Time</div>
          </div>
        </div>
      </section>

      {/* 3. HOW VERIFICATION WORKS - Crisp White Cards with Golden Step Numbers */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>The Trust Protocol</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1128]">How Stripe Revenue Verification Works</h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Eliminate tedious DD questionnaires. TrustMRR turns live payment events into investor-ready financial dossiers in three simple steps.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 relative group hover:border-amber-400 hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-center font-mono font-extrabold text-sm mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-[#0A1128] mb-2">1-Click Stripe OAuth Connect</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Authorize read-only transaction webhooks via Stripe Connect or Merchant API. We never touch customer PII or charge balances.
            </p>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-[11px] font-mono text-slate-700">
              <span className="text-amber-600 font-bold">✓</span> GET /v1/subscriptions/audit
              <br />
              <span className="text-amber-600 font-bold">✓</span> Webhook signature verified
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 relative group hover:border-amber-400 hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#0A1128] text-amber-400 border border-slate-700 flex items-center justify-center font-mono font-extrabold text-sm mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-[#0A1128] mb-2">Algorithmic Ledger Audit</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Our computation engine recalculates true Net MRR, discounts refunds, accounts for involuntary churn, and computes cohort retention curves.
            </p>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-[11px] font-mono text-slate-700">
              <span className="text-amber-600 font-bold">✓</span> Net Revenue Retention: 114%
              <br />
              <span className="text-amber-600 font-bold">✓</span> Churn Rate: 1.4% (Validated)
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 relative group hover:border-amber-400 hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-center font-mono font-extrabold text-sm mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-[#0A1128] mb-2">Verified Badge & Gated Room</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Your startup receives the certified badge on the leaderboard. Accredited investors request deal room access to initiate term sheet negotiations.
            </p>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-[11px] font-mono text-slate-700 flex items-center justify-between">
              <span className="text-[#0A1128] font-bold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Verified Badge Issued</span>
              </span>
              <span className="text-amber-600 font-bold">Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE VALUE SIMULATOR - Clean White Input + Deep Navy Dossier */}
      <section id="valuation-simulator" className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Interactive SaaS Valuation Engine</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A1128]">
                  Estimate Your SaaS Valuation & VC Match
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Adjust your current revenue metrics below to see estimated market multiples and institutional investor demand on TrustMRR.
                </p>
              </div>

              {/* Slider 1: Monthly Recurring Revenue */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-bold">Current Monthly Recurring Revenue (MRR)</span>
                  <span className="font-mono font-bold text-[#0A1128] text-sm">${calcMrr.toLocaleString()} / mo</span>
                </div>
                <input
                  type="range"
                  min="3000"
                  max="150000"
                  step="1000"
                  value={calcMrr}
                  onChange={(e) => setCalcMrr(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>$3k/mo</span>
                  <span>$50k/mo</span>
                  <span>$100k/mo</span>
                  <span>$150k+/mo</span>
                </div>
              </div>

              {/* Slider 2: MoM Growth */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-bold">Month-over-Month (MoM) Growth Rate</span>
                  <span className="font-mono font-bold text-amber-600 text-sm">+{calcGrowthMoM}% MoM</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  step="1"
                  value={calcGrowthMoM}
                  onChange={(e) => setCalcGrowthMoM(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>2% (Steady)</span>
                  <span>15% (Healthy)</span>
                  <span>30%+ (Hypergrowth)</span>
                </div>
              </div>

              {/* Sector & Churn Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">SaaS Sector Archetype</label>
                  <select
                    value={calcCategory}
                    onChange={(e) => setCalcCategory(e.target.value as StartupCategory)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="AI & Machine Learning">AI & Machine Learning (High Multiple)</option>
                    <option value="B2B SaaS">B2B SaaS (Standard Multiple)</option>
                    <option value="DevTools & Infra">DevTools & Infra (Tech Premium)</option>
                    <option value="FinTech & Payments">FinTech & Payments</option>
                    <option value="Security & Privacy">Security & Privacy</option>
                    <option value="Productivity & Work">Productivity & Work</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Monthly Logo Churn: {calcChurn}%</label>
                  <input
                    type="range"
                    min="0.5"
                    max="6.0"
                    step="0.1"
                    value={calcChurn}
                    onChange={(e) => setCalcChurn(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800 mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Right Output Card - Deep Navy with Golden Valuation */}
            <div className="lg:col-span-5 bg-[#0A1128] rounded-2xl border border-slate-700 p-6 space-y-5 shadow-2xl text-white">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span className="text-xs font-mono text-slate-300 font-bold">BENCHMARK VALUATION DOSSIER</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold">
                  {estimatedMultiple}x ARR Multiple
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Estimated Enterprise Value</span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono mt-0.5">
                    ${(estimatedValuation / 1000000).toFixed(2)}M
                  </div>
                  <span className="text-xs text-slate-400">Based on annualized run rate of ${(annualRunRate / 1000).toFixed(0)}k ARR</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700 text-xs">
                  <div className="bg-[#162038] p-3 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block font-medium">Suggested Round Ask</span>
                    <span className="font-mono font-bold text-white text-sm">${(suggestedAsk / 1000).toFixed(0)}k</span>
                    <span className="text-[10px] text-amber-400 block font-semibold">15% dilution target</span>
                  </div>

                  <div className="bg-[#162038] p-3 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block font-medium">Active VC Matches</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">{estimatedMatchingInvestors} Investors</span>
                    <span className="text-[10px] text-slate-400 block font-medium">Ready for outreach</span>
                  </div>
                </div>

                <button
                  onClick={onOpenNewStartupModal}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>Verify My MRR & Get Matched</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DUAL PERSONA VALUE PROPS - Clean White Cards */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1128]">Built for High-Growth SaaS Stakeholders</h2>
          <p className="text-slate-600 text-sm">
            Whether you are building the next breakout B2B tool or deploying venture capital, TrustMRR accelerates your workflow.
          </p>

          {/* Toggle Tab */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200 mt-4">
            <button
              onClick={() => setPersonaTab('founder')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                personaTab === 'founder'
                  ? 'bg-[#0A1128] text-white shadow-sm'
                  : 'text-slate-700 hover:text-[#0A1128]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>For SaaS Founders</span>
            </button>
            <button
              onClick={() => setPersonaTab('investor')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                personaTab === 'investor'
                  ? 'bg-[#0A1128] text-white shadow-sm'
                  : 'text-slate-700 hover:text-[#0A1128]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>For Venture Investors & Angels</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Founder Experience */}
        {personaTab === 'founder' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center border border-amber-200">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0A1128]">Skip Cold Pitch Emailing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accredited angels and VCs filter for specific MRR ranges, sector tags, and growth brackets. Receive qualified inbound term sheets based on verified traction.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center border border-amber-200">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0A1128]">Gated Diligence Vaults</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Protect sensitive cap tables, customer contract sizes, and churn cohorts. Approve investor access requests with one click or enforce NDAs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center border border-amber-200">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0A1128]">AI Deal Memo Benchmarks</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluate your startup against category top quartiles. Understand your fair market multiple, key catalysts, and risk factors before investor calls.
              </p>
            </div>
          </div>
        ) : (
          /* Tab 2: Investor Experience */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center border border-amber-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0A1128]">Zero Pitch Deck Fabrications</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every dollar of MRR is backed by Stripe ledger proofs and merchant checksums. Evaluate clean cohorts, Net Retention Rates (NRR), and verified LTV/CAC ratios.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center border border-amber-200">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0A1128]">Integrated Deal CRM Pipeline</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manage your venture deal flow across Lead, Diligence, Pitch Review, and Term Sheet stages. Keep private investment memos and syndicate notes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center border border-amber-200">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0A1128]">Direct Pitch Inbox & Term Sheets</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review pitches with full financial attachments. Message founders directly, request custom diligence schedules, and issue term sheets without middlemen.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 6. AI DEAL INTELLIGENCE ENGINE SPOTLIGHT - Deep Navy */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-[#0A1128] rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-2xl text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
                <Bot className="w-3.5 h-3.5 text-amber-400" />
                <span>Powered by Gemini 3.7 AI</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Automated Deal Memos & Valuation Scores
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Say goodbye to spending 15 hours drafting investment committee memos. Our server-side AI analyzes real Stripe ledger trends to synthesize deal grades, fair pricing multiples, and risk matrices.
              </p>

              <div className="space-y-2 pt-2 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Instant 0–100 Venture Deal Score based on growth, churn & NRR</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Historical seed & Series A valuation multiple comparisons</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Identifies key growth catalysts and potential retention risks</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => onOpenAIAnalysis(spotlightStartup)}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl text-xs flex items-center space-x-2 shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Bot className="w-4 h-4 text-slate-950" />
                  <span>Test AI Deal Memo on {spotlightStartup.name}</span>
                </button>
              </div>
            </div>

            {/* Visual AI Memo Card Mock */}
            <div className="lg:col-span-6 bg-[#162038] rounded-2xl border border-slate-700 p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-white">AI Deal Memo: {spotlightStartup.name}</span>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-mono font-extrabold">
                  Score: 92/100 (Strong Buy)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#0A1128] p-3 rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-[10px] block font-medium">Fair Valuation Multiple</span>
                  <span className="font-mono font-bold text-amber-400">8.5x - 10.2x ARR</span>
                </div>
                <div className="bg-[#0A1128] p-3 rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-[10px] block font-medium">Unit Economics Grade</span>
                  <span className="font-mono font-bold text-white">A+ (LTV/CAC 4.2x)</span>
                </div>
              </div>

              <div className="bg-[#0A1128]/80 p-3 rounded-xl border border-slate-700 text-xs space-y-1.5">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block font-bold">Key Investment Thesis</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  "Hyper-efficient B2B workflow automation engine showing top 5% Net Revenue Retention (118%) and exceptional customer expansion with near-zero organic churn."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1128]">Validated by Founders & Venture Partners</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-xs space-y-3 shadow-sm hover:border-amber-400 transition-all">
            <div className="flex items-center space-x-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-slate-700 italic leading-relaxed font-normal">
              "We connected our Stripe ledger on Monday, and by Thursday had three accredited angels reach out directly. The Verified Badge gave investors immediate confidence in our numbers."
            </p>
            <div className="flex items-center space-x-2.5 pt-3 border-t border-slate-100">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Alex" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
              <div>
                <span className="font-bold text-[#0A1128] block">Alex Vance</span>
                <span className="text-slate-500 text-[10px]">Founder, FlowOps AI ($54k MRR)</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-xs space-y-3 shadow-sm hover:border-amber-400 transition-all">
            <div className="flex items-center space-x-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-slate-700 italic leading-relaxed font-normal">
              "TrustMRR saves our venture team weeks of DD prep. Instead of unverified pitch decks, we inspect live cohort retention curves and unit economics before scheduling our first partner call."
            </p>
            <div className="flex items-center space-x-2.5 pt-3 border-t border-slate-100">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" alt="Sarah" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
              <div>
                <span className="font-bold text-[#0A1128] block">Sarah Chen</span>
                <span className="text-slate-500 text-[10px]">General Partner, Horizon VC</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-xs space-y-3 shadow-sm hover:border-amber-400 transition-all">
            <div className="flex items-center space-x-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-slate-700 italic leading-relaxed font-normal">
              "The AI Deal Memo feature alone is worth the subscription. It gives an immediate sanity check on pricing multiples and growth momentum against top quartile benchmarks."
            </p>
            <div className="flex items-center space-x-2.5 pt-3 border-t border-slate-100">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Elena" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
              <div>
                <span className="font-bold text-[#0A1128] block">Elena Rostova</span>
                <span className="text-slate-500 text-[10px]">Angel Syndicate Lead, Apex Angels</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. DYNAMIC SUBSCRIPTION PLANS & MEMBERSHIP (Synchronized with Admin) */}
      <section id="pricing-section" className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold font-mono">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>TRANSPARENT MEMBERSHIP MODEL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1128] tracking-tight">
            Plans Built for Serious Venture Scale
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto font-medium">
            Whether you're raising a seed round or allocating LP capital, select the subscription tier tailored to your workflow.
          </p>

          {/* Controls: Role Selector & Billing Toggle */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Persona Switcher */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 shadow-inner">
              <button
                onClick={() => setPricingRole('founder')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  pricingRole === 'founder'
                    ? 'bg-[#0A1128] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0A1128]'
                }`}
              >
                <span>🚀</span>
                <span>For Founders</span>
              </button>
              <button
                onClick={() => setPricingRole('investor')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  pricingRole === 'investor'
                    ? 'bg-[#0A1128] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0A1128]'
                }`}
              >
                <span>💼</span>
                <span>For Investors</span>
              </button>
            </div>

            {/* Billing Cycle Switcher */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 shadow-inner">
              <button
                onClick={() => setPricingBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  pricingBillingCycle === 'monthly'
                    ? 'bg-white text-[#0A1128] shadow-xs'
                    : 'text-slate-600 hover:text-[#0A1128]'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setPricingBillingCycle('annual')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  pricingBillingCycle === 'annual'
                    ? 'bg-amber-400 text-slate-950 shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-[#0A1128]'
                }`}
              >
                <span>Annual</span>
                <span className="text-[10px] bg-slate-950/10 px-1.5 py-0.5 rounded font-mono font-bold">SAVE 20%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {subscriptionPlans
            .filter(p => p.isActive !== false && (p.roleTarget === pricingRole || p.roleTarget === 'all'))
            .map((plan) => {
              const price = pricingBillingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;
              const isPopular = plan.popular;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 ${
                    isPopular
                      ? 'bg-[#0A1128] text-white border-2 border-amber-400 shadow-xl lg:-translate-y-2'
                      : 'bg-white text-[#0A1128] border border-slate-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Badge */}
                  {plan.badgeText && (
                    <div className="absolute -top-3.5 right-6 px-3.5 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-extrabold rounded-full font-mono shadow-xs uppercase tracking-wider">
                      {plan.badgeText}
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-xl font-extrabold font-mono ${isPopular ? 'text-white' : 'text-[#0A1128]'}`}>
                        {plan.name}
                      </h3>
                      {isPopular && (
                        <Crown className="w-5 h-5 text-amber-400" />
                      )}
                    </div>

                    <p className={`text-xs min-h-[32px] leading-relaxed mb-6 ${isPopular ? 'text-slate-300' : 'text-slate-500'}`}>
                      {plan.tagline}
                    </p>

                    {/* Price */}
                    <div className="mb-6 pb-6 border-b border-slate-100/20">
                      <div className="flex items-baseline space-x-1">
                        <span className={`text-4xl font-extrabold font-mono tracking-tight ${isPopular ? 'text-amber-400' : 'text-[#0A1128]'}`}>
                          ${price}
                        </span>
                        <span className={`text-xs ${isPopular ? 'text-slate-300' : 'text-slate-500'}`}>
                          / month
                        </span>
                      </div>
                      <p className={`text-[10px] font-mono mt-1 ${isPopular ? 'text-slate-400' : 'text-slate-400'}`}>
                        {pricingBillingCycle === 'annual' ? `Billed annually ($${price * 12}/yr)` : 'Billed monthly, cancel anytime'}
                      </p>
                    </div>

                    {/* Features Checklist */}
                    <div className="space-y-3 mb-8">
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${isPopular ? 'text-amber-400' : 'text-slate-400'}`}>
                        Included Features:
                      </span>
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start space-x-2.5 text-xs">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-amber-400' : 'text-amber-500'}`} />
                          <span className={isPopular ? 'text-slate-200' : 'text-slate-700'}>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action CTA */}
                  <button
                    onClick={() => {
                      if (pricingRole === 'founder') switchRoleQuick('founder');
                      else switchRoleQuick('investor');
                      upgradeSubscription(plan.id);
                    }}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      isPopular
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'bg-[#0A1128] hover:bg-[#162038] text-white'
                    }`}
                  >
                    <span>Choose {plan.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
        </div>
      </section>

      {/* 10. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1128]">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Everything you need to know about verification, data privacy, and fundraising.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between space-x-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-[#0A1128]">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION - Deep Navy with Golden Yellow CTA */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-[#0A1128] rounded-3xl border border-slate-800 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl text-white">
          <div className="max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Join 140+ Verified SaaS Founders</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to Turn Verified MRR into Growth Capital?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
              List your SaaS in 2 minutes, verify your revenue ledger, and connect with accredited venture investors actively looking for deals in your sector.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenNewStartupModal}
                className="w-full sm:w-auto px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-amber-500/25 text-sm flex items-center justify-center space-x-2 cursor-pointer transition-all transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4 text-slate-950" />
                <span>List & Verify Your SaaS</span>
              </button>

              <button
                onClick={() => setCurrentView('directory')}
                className="w-full sm:w-auto px-7 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 text-sm flex items-center justify-center space-x-2 cursor-pointer transition-all"
              >
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>Browse Verified Leaderboard</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
