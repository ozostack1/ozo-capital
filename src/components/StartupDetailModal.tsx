import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  Download, 
  ExternalLink, 
  Mail, 
  MapPin, 
  Calendar, 
  Globe, 
  FileText, 
  PieChart as PieIcon, 
  Sparkles, 
  Lock, 
  ArrowUpRight, 
  CheckCircle,
  Building2,
  Users,
  Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import { Startup } from '../types';
import { useApp } from '../context/AppContext';

interface StartupDetailModalProps {
  startup: Startup;
  onClose: () => void;
  onOpenPitch: (startup: Startup) => void;
  onOpenAIAnalysis: (startup: Startup) => void;
  onSignalInterest?: (startup: Startup) => void;
}

export const StartupDetailModal: React.FC<StartupDetailModalProps> = ({
  startup,
  onClose,
  onOpenPitch,
  onOpenAIAnalysis,
  onSignalInterest
}) => {
  const { 
    currentUser, 
    currentRole, 
    setIsSubscriptionModalOpen, 
    addDealToPipeline, 
    showToast,
    openSocialProfileModal,
    isInvestorInterestedInStartup,
    getInvestorInterestForStartup
  } = useApp();

  const isInterested = isInvestorInterestedInStartup(startup.id);
  const interestRecord = getInvestorInterestForStartup(startup.id);

  const [activeTab, setActiveTab] = useState<'financials' | 'cap_table' | 'pitch_deck' | 'unit_economics'>('financials');

  const canAccessFullData = currentUser.subscriptionTier !== 'free' || currentRole === 'admin' || currentRole === 'investor';

  const ltvCacRatio = (startup.ltv / startup.cac).toFixed(1);
  const arpu = Math.round(startup.mrr / startup.customersCount);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      {/* Compact, Sleek Modal Popup */}
      <div 
        id="startup-diligence-modal"
        className="bg-white border border-slate-200 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto"
      >
        {/* Modal Header - Deep Navy with Gold Highlights */}
        <div className="bg-[#0A1128] px-5 sm:px-6 py-4 border-b border-slate-800 flex items-start justify-between text-white">
          <div className="flex items-start space-x-3.5">
            <img
              src={startup.logo}
              alt={startup.name}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border border-slate-700 shadow-md shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-extrabold text-white font-mono">{startup.name}</h2>
                {startup.isVerified && (
                  <div className="flex items-center space-x-1 bg-amber-400 text-slate-950 px-2 py-0.2 rounded-full text-[10px] font-extrabold font-mono">
                    <ShieldCheck className="w-3 h-3 text-slate-950" />
                    <span>Stripe Verified</span>
                  </div>
                )}
                <span className="text-[10px] px-2 py-0.2 rounded bg-[#162038] text-slate-300 font-bold border border-slate-700">
                  {startup.stage}
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-1 max-w-xl line-clamp-1">
                {startup.tagline}
              </p>

              {/* Meta items */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                <button
                  onClick={() => {
                    openSocialProfileModal(startup.founderId);
                  }}
                  className="flex items-center space-x-1 text-slate-300 hover:text-amber-400 font-semibold cursor-pointer transition-colors"
                  title="View Founder's Social Profile"
                >
                  <img
                    src={startup.founderAvatar}
                    alt={startup.founderName}
                    className="w-3.5 h-3.5 rounded-full object-cover border border-slate-400"
                  />
                  <span>Founder: <strong className="text-white underline decoration-amber-400">{startup.founderName}</strong></span>
                </button>
                <span className="text-slate-600">•</span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{startup.location}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Founded {startup.foundedYear}</span>
                </span>
                <a 
                  href={startup.website} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center space-x-1 text-amber-400 hover:underline"
                >
                  <Globe className="w-3 h-3" />
                  <span>{startup.website.replace('https://', '')}</span>
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#162038] text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Highlight Score Bar */}
        <div className="bg-[#162038] px-5 sm:px-6 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Monthly MRR</span>
              <p className="text-base sm:text-lg font-extrabold font-mono text-amber-400">${startup.mrr.toLocaleString()}</p>
            </div>
            <div className="border-l border-slate-700 pl-4 sm:pl-6">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Annual ARR</span>
              <p className="text-base sm:text-lg font-extrabold font-mono text-white">${startup.arr.toLocaleString()}</p>
            </div>
            <div className="border-l border-slate-700 pl-4 sm:pl-6">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">MoM Growth</span>
              <p className="text-base sm:text-lg font-extrabold font-mono text-amber-400">+{startup.growthRateMoM}%</p>
            </div>
            <div className="border-l border-slate-700 pl-4 sm:pl-6 hidden sm:block">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Target Round</span>
              <p className="text-xs font-bold text-white font-mono mt-0.5">${(startup.askAmount / 1000).toFixed(0)}k Ask • ${(startup.valuation / 1000000).toFixed(1)}M Val</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenAIAnalysis(startup)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0A1128] hover:bg-slate-900 text-amber-400 border border-amber-400/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Memo</span>
            </button>

            {currentRole === 'investor' ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSignalInterest && onSignalInterest(startup)}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer ${
                    isInterested
                      ? 'bg-amber-100 text-amber-950 border border-amber-300'
                      : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transform hover:-translate-y-0.5'
                  }`}
                  title={isInterested ? "Click to update or manage your interest signal" : "Signal round interest to founder"}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isInterested ? `✓ Interest Signaled ($${((interestRecord?.indicativeCheckSize || 250000)/1000).toFixed(0)}k)` : '✨ Signal Round Interest'}</span>
                </button>

                <button
                  onClick={() => {
                    addDealToPipeline(startup.id, 'Lead', startup.askAmount, `Added via Startup Dossier.`);
                    showToast(`Added ${startup.name} to your Deal Pipeline CRM!`);
                  }}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#0A1128] hover:bg-slate-900 border border-slate-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>+ Pipeline</span>
                </button>
              </div>
            ) : startup.founderId === currentUser.id ? (
              <span className="px-3 py-1.5 bg-amber-100 text-amber-900 rounded-xl text-xs font-extrabold font-mono">
                Your Venture
              </span>
            ) : null}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 px-5 sm:px-6 pt-2 bg-white border-b border-slate-200 overflow-x-auto">
          {[
            { id: 'financials', label: 'MRR & Revenue' },
            { id: 'unit_economics', label: 'Unit Economics' },
            { id: 'cap_table', label: 'Cap Table' },
            { id: 'pitch_deck', label: 'Pitch Deck & Terms' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#0A1128] text-[#0A1128]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-white text-[#0A1128]">
          {/* TAB 1: Financials */}
          {activeTab === 'financials' && (
            <div className="space-y-4">
              {/* Stripe Audit Verification Banner */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center shrink-0 text-slate-950 shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-slate-950" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-amber-950 flex items-center space-x-2">
                      <span>Official TrustMRR Stripe Ledger Certificate</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-mono font-bold">
                        AUDITED
                      </span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Direct API synchronization with live Stripe webhook. Recurring subscriptions verified against merchant settlement data.
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">
                      Last Verified: {startup.verificationProofDate || '2026-08-15'} • Checksum: <span className="text-[#0A1128] font-bold">0x8f72a4...d9e1</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!canAccessFullData) {
                      setIsSubscriptionModalOpen(true);
                    } else {
                      showToast('Exporting verified raw Stripe CSV ledger...');
                    }
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 shrink-0 border border-slate-300 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-amber-600" />
                  <span>{canAccessFullData ? 'Export CSV' : 'Unlock Export'}</span>
                </button>
              </div>

              {/* MRR & ARR Growth Chart */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Verified MRR Growth Trajectory</h4>
                    <p className="text-[11px] text-slate-500">Monthly recurring subscription ledger data (Last 6 Months)</p>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="flex items-center space-x-1 text-amber-600 font-mono font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      <span>MRR ($)</span>
                    </span>
                  </div>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={startup.mrrHistory}>
                      <defs>
                        <linearGradient id="detailMrrGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="month" stroke="#64748B" textAnchor="end" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748B" tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val / 1000}k`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0A1128', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                        formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'MRR']}
                      />
                      <Area type="monotone" dataKey="mrr" stroke="#F59E0B" strokeWidth={2.5} fill="url(#detailMrrGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Key SaaS Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {startup.keyMetricsHighlights.map((hl, i) => (
                  <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-700 leading-snug font-medium">{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Unit Economics */}
          {activeTab === 'unit_economics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">CAC (Acquisition)</span>
                  <p className="text-lg font-extrabold font-mono text-[#0A1128] mt-0.5">${startup.cac}</p>
                  <span className="text-[10px] text-slate-500">Blended organic</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">LTV (Lifetime Value)</span>
                  <p className="text-lg font-extrabold font-mono text-amber-600 mt-0.5">${startup.ltv.toLocaleString()}</p>
                  <span className="text-[10px] text-amber-700 font-bold">{ltvCacRatio}x LTV/CAC Ratio</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Monthly Churn</span>
                  <p className="text-lg font-extrabold font-mono text-[#0A1128] mt-0.5">{startup.churnRateMonthly}%</p>
                  <span className="text-[10px] text-slate-500">Decile retention</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Average ARPU</span>
                  <p className="text-lg font-extrabold font-mono text-amber-600 mt-0.5">${arpu}/mo</p>
                  <span className="text-[10px] text-slate-500">{startup.customersCount} accounts</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Cap Table */}
          {activeTab === 'cap_table' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1128] flex items-center space-x-1.5">
                    <PieIcon className="w-4 h-4 text-amber-600" />
                    <span>Ownership & Equity Cap Table</span>
                  </h4>
                  <span className="text-xs text-slate-500 font-mono font-bold">100% Fully Diluted</span>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full h-3.5 rounded-full bg-slate-200 overflow-hidden flex">
                  {startup.capTable.map((item, idx) => {
                    const colors = ['bg-[#0A1128]', 'bg-amber-400', 'bg-slate-500', 'bg-amber-600'];
                    return (
                      <div
                        key={idx}
                        style={{ width: `${item.equityPercent}%` }}
                        className={`${colors[idx % colors.length]} h-full`}
                        title={`${item.holder}: ${item.equityPercent}%`}
                      ></div>
                    );
                  })}
                </div>

                {/* Table of Shareholders */}
                <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white">
                  {startup.capTable.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 text-xs">
                      <div>
                        <span className="font-bold text-[#0A1128]">{item.holder}</span>
                        <span className="text-slate-500 text-[11px] ml-2">({item.role})</span>
                      </div>
                      <span className="font-mono font-extrabold text-[#0A1128]">{item.equityPercent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Pitch Deck */}
          {activeTab === 'pitch_deck' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-amber-600" />
                    <div>
                      <h4 className="text-sm font-bold text-[#0A1128]">{startup.pitchDeckTitle}</h4>
                      <p className="text-xs text-slate-500">{startup.pitchDeckSlidesCount} Verified Slides • Seed Stage</p>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast('Opening Pitch Deck in secure viewer...')}
                    className="px-3.5 py-1.5 bg-[#0A1128] hover:bg-[#162038] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download (PDF)</span>
                  </button>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Executive Deal Summary</h5>
                  <p className="text-xs text-slate-700 leading-relaxed">{startup.pitchSummary}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Protected under TrustMRR Diligence NDA.</span>
            <span className="sm:hidden">Protected by NDA.</span>
          </div>

          <div className="flex items-center space-x-2">
            {currentRole === 'investor' ? (
              <>
                <button
                  onClick={() => {
                    addDealToPipeline(startup.id, 'Diligence', startup.askAmount, 'Moved into Diligence from dossier');
                    showToast('Added to active due diligence pipeline');
                  }}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Track Diligence
                </button>

                <button
                  onClick={() => {
                    addDealToPipeline(startup.id, 'Lead', startup.askAmount, `Added via Startup Dossier.`);
                    showToast(`Added ${startup.name} to your Deal Pipeline CRM!`);
                    onClose();
                  }}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 shadow-md shadow-amber-500/20 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-950" />
                  <span>Add to Deal Pipeline</span>
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#0A1128] hover:bg-[#162038] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close Dossier
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
