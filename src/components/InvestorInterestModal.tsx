import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Send, 
  Building2, 
  Trash2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Startup } from '../types';

interface InvestorInterestModalProps {
  startup: Startup | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvestorInterestModal: React.FC<InvestorInterestModalProps> = ({
  startup,
  isOpen,
  onClose
}) => {
  const { 
    currentUser, 
    signalInvestorInterest, 
    removeInvestorInterest, 
    getInvestorInterestForStartup 
  } = useApp();

  if (!isOpen || !startup) return null;

  const existingInterest = getInvestorInterestForStartup(startup.id);
  const defaultCheck = existingInterest?.indicativeCheckSize || Math.min(250000, startup.askAmount);

  const [checkSize, setCheckSize] = useState<number>(defaultCheck);
  const [interestLevel, setInterestLevel] = useState<'exploring' | 'high_conviction' | 'term_sheet_ready'>(
    existingInterest?.interestLevel || 'high_conviction'
  );
  const [note, setNote] = useState<string>(
    existingInterest?.note || `Impressed by ${startup.name}'s verified $${(startup.mrr / 1000).toFixed(1)}k MRR and ${startup.growthRateMoM}% MoM growth. We are interested in participating in your $${(startup.askAmount / 1000).toFixed(0)}k round.`
  );

  const checkPresets = [50000, 100000, 250000, 500000, 1000000].filter(amount => amount <= startup.askAmount * 1.5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signalInvestorInterest(startup.id, checkSize, note.trim(), interestLevel);
    onClose();
  };

  const handleRemove = () => {
    removeInvestorInterest(startup.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        id="investor-interest-modal"
        className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col text-[#0A1128]"
      >
        {/* Modal Header - Deep Navy */}
        <div className="relative bg-gradient-to-r from-[#0A1128] via-[#162038] to-[#1E293B] p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white bg-[#0A1128]/70 hover:bg-slate-700 p-2 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3.5">
            <img
              src={startup.logo}
              alt={startup.name}
              className="w-13 h-13 rounded-2xl object-cover border-2 border-amber-400/40 shadow-md shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white font-mono truncate">{startup.name}</h2>
                {startup.isVerified && (
                  <span className="flex items-center space-x-1 text-slate-950 bg-amber-400 font-extrabold px-2 py-0.5 rounded-full text-[10px] font-mono shrink-0">
                    <ShieldCheck className="w-3 h-3 text-slate-950" />
                    <span>Stripe Verified</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5 truncate">
                Raising <strong className="text-amber-400 font-mono">${(startup.askAmount / 1000).toFixed(0)}k</strong> @ ${(startup.valuation / 1000000).toFixed(1)}M Valuation • {startup.stage}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Signal Intro Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start space-x-3 text-xs text-amber-950">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Direct Founder Signal</p>
              <p className="text-amber-800 text-[11px] mt-0.5">
                Signaling interest will immediately notify founder <strong className="text-slate-900">{startup.founderName}</strong> on their dashboard. They can reach out to you directly with their live diligence data room.
              </p>
            </div>
          </div>

          {/* Indicative Check Size */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Indicative Check Size (USD)
            </label>
            <div className="relative mb-2.5">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400">$</span>
              <input
                type="number"
                min={10000}
                step={5000}
                value={checkSize}
                onChange={(e) => setCheckSize(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-4 py-2.5 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
                required
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5">
              {checkPresets.map(preset => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setCheckSize(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    checkSize === preset
                      ? 'bg-[#0A1128] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  ${(preset / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          {/* Conviction Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Investment Conviction / Stage
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setInterestLevel('exploring')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  interestLevel === 'exploring'
                    ? 'border-blue-500 bg-blue-50 text-blue-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="block text-xs font-bold">🔍 Exploring</span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Initial evaluation</span>
              </button>

              <button
                type="button"
                onClick={() => setInterestLevel('high_conviction')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  interestLevel === 'high_conviction'
                    ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="block text-xs font-bold">🔥 High Conviction</span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Ready for intro</span>
              </button>

              <button
                type="button"
                onClick={() => setInterestLevel('term_sheet_ready')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  interestLevel === 'term_sheet_ready'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="block text-xs font-bold">📑 Term Sheet</span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Ready to issue terms</span>
              </button>
            </div>
          </div>

          {/* Customized Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Message / Investment Thesis Note for {startup.founderName}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
              placeholder="Highlight what resonated with you (e.g. customer retention, MoM growth, unit economics)..."
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
            {existingInterest ? (
              <button
                type="button"
                onClick={handleRemove}
                className="px-3.5 py-2.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Signal</span>
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>{existingInterest ? 'Update Signal' : 'Send Interest Signal'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
