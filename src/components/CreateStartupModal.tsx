import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  Building2, 
  Lock, 
  Upload, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Startup, StartupCategory, StartupStage } from '../types';

interface CreateStartupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateStartupModal: React.FC<CreateStartupModalProps> = ({
  isOpen,
  onClose
}) => {
  const { addStartup, currentUser, showToast } = useApp();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<StartupCategory>('B2B SaaS');
  const [stage, setStage] = useState<StartupStage>('Seed');
  const [location, setLocation] = useState('San Francisco, CA');
  const [website, setWebsite] = useState('https://');
  const [logo, setLogo] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80');
  
  // Financials
  const [mrr, setMrr] = useState<number>(25000);
  const [growthRateMoM, setGrowthRateMoM] = useState<number>(18.5);
  const [churnRateMonthly, setChurnRateMonthly] = useState<number>(1.5);
  const [customersCount, setCustomersCount] = useState<number>(85);
  
  // Fundraise
  const [askAmount, setAskAmount] = useState<number>(500000);
  const [valuation, setValuation] = useState<number>(4000000);
  const [pitchSummary, setPitchSummary] = useState('');
  const [connectStripeNow, setConnectStripeNow] = useState(true);

  if (!isOpen) return null;

  const categories: StartupCategory[] = [
    'AI & Machine Learning',
    'B2B SaaS',
    'FinTech & Payments',
    'DevTools & Infra',
    'Security & Privacy',
    'E-Commerce & Retail',
    'HealthTech',
    'Productivity & Work'
  ];

  const stages: StartupStage[] = ['Bootstrapped', 'Pre-Seed', 'Seed', 'Series A'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !tagline.trim()) {
      showToast('Please fill out all required startup details.');
      return;
    }

    const arr = mrr * 12;

    // Generate realistic 6-month MRR history
    const mrrHistory = [
      { month: 'Oct', mrr: Math.round(mrr * 0.55), arr: Math.round(mrr * 0.55 * 12), newCustomers: 12, churnedCustomers: 1, netRetentionRate: 112 },
      { month: 'Nov', mrr: Math.round(mrr * 0.65), arr: Math.round(mrr * 0.65 * 12), newCustomers: 15, churnedCustomers: 2, netRetentionRate: 114 },
      { month: 'Dec', mrr: Math.round(mrr * 0.76), arr: Math.round(mrr * 0.76 * 12), newCustomers: 18, churnedCustomers: 1, netRetentionRate: 116 },
      { month: 'Jan', mrr: Math.round(mrr * 0.88), arr: Math.round(mrr * 0.88 * 12), newCustomers: 22, churnedCustomers: 2, netRetentionRate: 118 },
      { month: 'Feb', mrr: Math.round(mrr * 0.94), arr: Math.round(mrr * 0.94 * 12), newCustomers: 25, churnedCustomers: 1, netRetentionRate: 117 },
      { month: 'Mar', mrr, arr, newCustomers: 30, churnedCustomers: 2, netRetentionRate: 120 }
    ];

    const newStartup: Startup = {
      id: `startup-${Date.now()}`,
      name: name.trim(),
      tagline: tagline.trim(),
      description: tagline.trim(),
      category,
      stage,
      foundedYear: 2024,
      location,
      website,
      logo,
      founderId: currentUser.id,
      founderName: currentUser.name,
      founderBio: currentUser.bio || 'Founder & CEO',
      founderEmail: currentUser.email,
      founderAvatar: currentUser.avatar,
      isVerified: connectStripeNow,
      verificationStatus: connectStripeNow ? 'verified_stripe' : 'unverified',
      verificationProofDate: connectStripeNow ? new Date().toISOString().split('T')[0] : undefined,
      mrr,
      arr,
      growthRateMoM,
      churnRateMonthly,
      cac: 420,
      ltv: 3800,
      customersCount,
      valuation,
      askAmount,
      targetRound: stage,
      teamSize: 4,
      createdAt: new Date().toISOString(),
      pitchSummary: pitchSummary.trim() || tagline.trim(),
      pitchDeckTitle: `${name} Seed Overview Deck`,
      pitchDeckSlidesCount: 12,
      keyMetricsHighlights: [
        `Verifiable MRR: $${mrr.toLocaleString()}`,
        `MoM Growth: +${growthRateMoM}%`,
        `Low Churn: ${churnRateMonthly}%/mo`
      ],
      tags: [category, stage, 'Fast-Growth'],
      viewsCount: 1,
      savesCount: 0,
      diligenceRequestsCount: 0,
      aiDealScore: 89,
      aiValuationMultiple: '6.8x ARR',
      capTable: [
        { holder: currentUser.name, equityPercent: 75, role: 'Founder & CEO' },
        { holder: 'ESOP Pool', equityPercent: 15, role: 'Employee Incentive Pool' },
        { holder: 'Angel Syndicate', equityPercent: 10, role: 'Previous Angels' }
      ],
      mrrHistory
    };

    addStartup(newStartup);
    showToast(`🚀 Startup "${name}" successfully listed on TrustMRR!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      {/* Compact, Sleek Modal Popup */}
      <div 
        id="create-startup-modal"
        className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] my-auto"
      >
        {/* Header - Deep Navy */}
        <div className="bg-[#0A1128] px-5 py-4 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#162038] border border-amber-400/40 flex items-center justify-center shadow-sm">
              <PlusCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-mono">List Your SaaS on TrustMRR</h2>
              <p className="text-[11px] text-slate-300">
                Showcase verified subscription revenue directly to top-tier angel syndicates and VCs.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#162038] text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-white text-[#0A1128]">
          {/* General info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>1. Company Information</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Startup Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Acme AI"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">One-line Tagline *</label>
              <input
                type="text"
                placeholder="e.g. Next-gen automated revenue operations for high-growth B2B SaaS"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Stage</label>
                <select
                  value={stage}
                  onChange={(e: any) => setStage(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  {stages.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Website</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* MRR & Verified Metrics */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center space-x-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-600" />
              <span>2. Financial Ledger & Unit Economics</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Monthly MRR ($)</label>
                <input
                  type="number"
                  value={mrr}
                  onChange={(e) => setMrr(Number(e.target.value))}
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">MoM Growth (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={growthRateMoM}
                  onChange={(e) => setGrowthRateMoM(Number(e.target.value))}
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-amber-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Monthly Churn (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={churnRateMonthly}
                  onChange={(e) => setChurnRateMonthly(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Customers Count</label>
                <input
                  type="number"
                  value={customersCount}
                  onChange={(e) => setCustomersCount(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Fundraising Target */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              <span>3. Fundraising Terms</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Ask Amount ($)</label>
                <input
                  type="number"
                  step="50000"
                  value={askAmount}
                  onChange={(e) => setAskAmount(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Valuation ($)</label>
                <input
                  type="number"
                  step="100000"
                  value={valuation}
                  onChange={(e) => setValuation(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Pitch Deck Summary / Investment Thesis</label>
              <textarea
                rows={2}
                placeholder="Key problem solved, proprietary tech moat, or unit economics advantage..."
                value={pitchSummary}
                onChange={(e) => setPitchSummary(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* Stripe Verification Option */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-900">Auto-Verify via Stripe OAuth</p>
                <p className="text-[11px] text-slate-600">Instantly grant the Gold Stripe badge and rank higher on leaderboard.</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={connectStripeNow}
                onChange={(e) => setConnectStripeNow(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-950" />
              <span>Publish SaaS Listing</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
