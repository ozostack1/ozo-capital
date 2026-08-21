import React, { useState } from 'react';
import { 
  X, 
  Send, 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  Building2, 
  User, 
  Sparkles, 
  Crown, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert,
  ArrowRight,
  PlusCircle,
  Briefcase
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Startup, Investor } from '../types';

interface PitchModalProps {
  startup?: Startup;
  investor?: Investor;
  onClose: () => void;
}

export const PitchModal: React.FC<PitchModalProps> = ({
  startup,
  investor,
  onClose
}) => {
  const { 
    startups, 
    investors, 
    currentUser, 
    currentRole, 
    switchRoleQuick,
    openOnboardingModal,
    createPitch, 
    showToast,
    setIsSubscriptionModalOpen,
    setTargetUpgradePlan
  } = useApp();

  // 1. Filter ONLY startups owned by the current founder
  const myStartups = startups.filter(s => 
    s.founderId === currentUser.id || 
    (currentUser.email && s.founderEmail && s.founderEmail.toLowerCase() === currentUser.email.toLowerCase()) || 
    s.id === currentUser.associatedStartupId ||
    (currentUser.name && s.founderName?.toLowerCase() === currentUser.name?.toLowerCase())
  );

  // If startup was passed as prop AND is actually owned by this founder, use it; otherwise default to first owned startup
  const initialStartup = (startup && myStartups.some(s => s.id === startup.id))
    ? startup
    : myStartups[0] || null;

  const [selectedStartupId, setSelectedStartupId] = useState<string>(initialStartup?.id || '');
  const activeStartup = myStartups.find(s => s.id === selectedStartupId) || initialStartup;

  // 2. Select target investor
  const openInvestors = investors.filter(i => i.acceptingPitches !== false);
  const initialInvestor = investor || openInvestors[0] || investors[0];
  const [selectedInvestorId, setSelectedInvestorId] = useState<string>(initialInvestor?.id || '');
  const targetInvestor = investors.find(i => i.id === selectedInvestorId) || initialInvestor;

  // Form states
  const [askAmount, setAskAmount] = useState<number>(activeStartup?.askAmount || 250000);
  const [proposedEquity, setProposedEquity] = useState<number>(10.0);
  const [pitchSubject, setPitchSubject] = useState<string>(
    activeStartup 
      ? `Investment Pitch: ${activeStartup.name} (${activeStartup.category}) - $${activeStartup.mrr.toLocaleString()} MRR`
      : 'Startup Investment Pitch & Financial Metrics'
  );
  const [pitchMessage, setPitchMessage] = useState<string>(
    activeStartup
      ? `Hi ${targetInvestor?.name},\n\nWe are building ${activeStartup.name} (${activeStartup.tagline}). Our Stripe-verified MRR has reached $${activeStartup.mrr.toLocaleString()} with +${activeStartup.growthRateMoM}% MoM growth and ${activeStartup.churnRateMonthly}% monthly churn.\n\nWe are raising $${(activeStartup.askAmount / 1000).toFixed(0)}k for ${proposedEquity}% equity. We'd love to share our live data room and schedule an introductory call.`
      : ''
  );

  const isFreeTier = currentUser.subscriptionTier === 'free';
  const pitchesUsed = currentUser.pitchesSentCount || 0;
  const maxFreePitches = 3;
  const isPitchLimitReached = isFreeTier && pitchesUsed >= maxFreePitches;

  // Handle submitting pitch
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentRole !== 'founder') {
      showToast('Only founders can pitch to investors.');
      return;
    }

    if (!activeStartup) {
      showToast('You must register your startup before pitching.');
      return;
    }

    if (isPitchLimitReached) {
      setTargetUpgradePlan('pro_founder');
      setIsSubscriptionModalOpen(true);
      return;
    }

    if (!targetInvestor) {
      showToast('Please select a target investor to pitch.');
      return;
    }

    createPitch(
      activeStartup.id,
      targetInvestor.id,
      askAmount,
      proposedEquity,
      pitchSubject,
      pitchMessage
    );

    showToast(`🚀 Pitch for "${activeStartup.name}" delivered directly to ${targetInvestor.name} (${targetInvestor.firm})!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      {/* Compact, Sleek Modal Container */}
      <div 
        id="direct-pitch-modal"
        className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto text-[#0A1128]"
      >
        {/* Header - Deep Navy with Gold Accents */}
        <div className="bg-[#0A1128] px-5 py-4 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#162038] border border-amber-400/40 flex items-center justify-center shadow-sm">
              <Send className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-mono">
                  Pitch to Accredited Investor
                </h2>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-400 text-slate-950 font-extrabold font-mono">
                  Founder Direct
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Direct VC intake with Stripe verified revenue & cap table terms.
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

        {/* STATE 1: CURRENT USER IS NOT A FOUNDER */}
        {currentRole !== 'founder' ? (
          <div className="p-6 text-center space-y-4 bg-white">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#0A1128]">Founder Role Required</h3>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                You are currently signed in as an <strong>Investor</strong> ({currentUser.name}). On TrustMRR, only startup founders can pitch their own ventures to investors.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-left text-slate-600 space-y-1.5">
              <div className="font-bold text-[#0A1128] flex items-center space-x-1.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                <span>Investor Privileges:</span>
              </div>
              <p className="text-[11px] text-slate-500">
                As an investor, you can evaluate companies, review financial dossiers, and add fund-seeking startups directly to your <strong>Deal Flow CRM</strong>.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                type="button"
                onClick={() => {
                  switchRoleQuick('founder');
                  showToast('Switched to Founder account.');
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Switch to Founder Mode</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : myStartups.length === 0 ? (
          /* STATE 2: FOUNDER HAS NO REGISTERED STARTUP */
          <div className="p-6 text-center space-y-4 bg-white">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#0A1128]">No Startup Listed Yet</h3>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                You cannot pitch investors yet because there is no startup registered under your account (<strong>{currentUser.name}</strong>).
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-left text-slate-600 space-y-1">
              <p className="text-[11px] text-slate-600">
                Accredited investors require verified company metrics (MRR, MoM growth, and fundraising terms) before accepting direct pitch decks.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openOnboardingModal();
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1.5 shadow-sm transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>List & Verify Your Startup</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* STATE 3: FOUNDER PITCHING THEIR OWN STARTUP */
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1 bg-white text-[#0A1128]">
            {/* Subscription Banner */}
            {isFreeTier ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Crown className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold text-amber-900">Founder Allocation</span>
                    <p className="text-slate-600 text-[11px]">Free tier includes starter pitch delivery.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTargetUpgradePlan('pro_founder');
                    setIsSubscriptionModalOpen(true);
                  }}
                  className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-lg text-xs transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  Upgrade ($79)
                </button>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-[#0A1128] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Founder Pro Active • Direct Inbound Delivery</span>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">
                  PRIORITY INBOX
                </span>
              </div>
            )}

            {/* 1. Startup Selection (Only from Founder's Own Startups) */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Your Startup to Pitch {myStartups.length > 1 && `(${myStartups.length} ventures listed)`}
              </label>

              {myStartups.length > 1 ? (
                <select
                  value={selectedStartupId}
                  onChange={(e) => {
                    setSelectedStartupId(e.target.value);
                    const chosen = myStartups.find(s => s.id === e.target.value);
                    if (chosen) {
                      setAskAmount(chosen.askAmount || 250000);
                      setPitchSubject(`Investment Pitch: ${chosen.name} (${chosen.category}) - $${chosen.mrr.toLocaleString()} MRR`);
                    }
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] font-bold focus:outline-none focus:border-amber-500 mb-2"
                >
                  {myStartups.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} — ${(s.mrr / 1000).toFixed(1)}k MRR ({s.category})
                    </option>
                  ))}
                </select>
              ) : null}

              {/* Startup Details Card */}
              {activeStartup && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <img
                      src={activeStartup.logo}
                      alt={activeStartup.name}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-extrabold text-[#0A1128] truncate">{activeStartup.name}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-extrabold font-mono shrink-0">
                          Your Startup
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate">{activeStartup.category} • {activeStartup.stage}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs text-amber-600 font-mono font-bold">${activeStartup.mrr.toLocaleString()} MRR</p>
                    <span className="text-[10px] text-slate-500 font-mono">+{activeStartup.growthRateMoM}% MoM</span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Target Investor Selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Target Investor / Partner</label>
              <select
                value={selectedInvestorId}
                onChange={(e) => setSelectedInvestorId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500"
              >
                {investors.map(inv => (
                  <option key={inv.id} value={inv.id}>
                    {inv.name} — {inv.firm} (Check Size: ${(inv.checkSizeMin/1000).toFixed(0)}k - ${(inv.checkSizeMax/1000).toFixed(0)}k)
                  </option>
                ))}
              </select>
            </div>

            {/* Target Investor Info Card */}
            {targetInvestor && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <img
                    src={targetInvestor.avatar}
                    alt={targetInvestor.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#0A1128] truncate">{targetInvestor.name}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{targetInvestor.firm} • {targetInvestor.title}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block">Typical Ticket</span>
                  <p className="text-xs font-mono font-bold text-amber-600">
                    ${(targetInvestor.checkSizeMin / 1000).toFixed(0)}k - ${(targetInvestor.checkSizeMax / 1000).toFixed(0)}k
                  </p>
                </div>
              </div>
            )}

            {/* Deal Terms inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Check / Ask ($)</label>
                <input
                  type="number"
                  value={askAmount}
                  onChange={(e) => setAskAmount(Number(e.target.value))}
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Proposed Equity (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={proposedEquity}
                  onChange={(e) => setProposedEquity(Number(e.target.value))}
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500 font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Subject Line</label>
              <input
                type="text"
                value={pitchSubject}
                onChange={(e) => setPitchSubject(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Pitch Memo & Traction Summary</label>
              <textarea
                rows={3}
                value={pitchMessage}
                onChange={(e) => setPitchMessage(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500 leading-relaxed resize-none font-sans"
              />
            </div>

            {/* Footer actions */}
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
                <Send className="w-3.5 h-3.5 text-slate-950" />
                <span>Send Investment Pitch</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
