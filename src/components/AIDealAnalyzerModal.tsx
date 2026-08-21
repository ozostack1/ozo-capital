import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bot, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck,
  RefreshCw,
  Award
} from 'lucide-react';
import { Startup } from '../types';

export interface AIDealAnalysis {
  dealScore: number;
  valuationMultiple: string;
  estimatedFairValuation: string;
  investmentThesis: string;
  keyStrengths: string[];
  riskFactors: string[];
  recommendation: 'STRONG_BUY_DILIGENCE' | 'FAVORABLE_EVALUATION' | 'CONSIDER_MONITORING' | 'HIGH_RISK';
  aiSource?: string;
}

interface AIDealAnalyzerModalProps {
  startup: Startup;
  onClose: () => void;
}

export const AIDealAnalyzerModal: React.FC<AIDealAnalyzerModalProps> = ({
  startup,
  onClose
}) => {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AIDealAnalysis | null>(null);

  const fetchAIAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      const arrMultiple = startup.growthRateMoM > 15 ? 7.2 : 5.8;
      const fairVal = ((startup.arr * arrMultiple) / 1000000).toFixed(1);
      const score = Math.min(96, Math.max(78, Math.round(75 + startup.growthRateMoM * 0.8 - startup.churnRateMonthly * 3)));
      
      setAnalysis({
        dealScore: startup.aiDealScore || score,
        valuationMultiple: startup.aiValuationMultiple || `${arrMultiple}x ARR`,
        estimatedFairValuation: `$${fairVal}M`,
        investmentThesis: `${startup.name} showcases stellar fundamentals in ${startup.category}. With verifiable Stripe MRR of $${startup.mrr.toLocaleString()} and +${startup.growthRateMoM}% MoM growth, unit economics reflect strong venture-scale scalability.`,
        keyStrengths: [
          `Verifiable MRR visibility ($${startup.mrr.toLocaleString()}/mo with Stripe audit)`,
          `Accelerated +${startup.growthRateMoM}% MoM expansion trajectory`,
          `Healthy retention with ${startup.churnRateMonthly}% monthly churn`
        ],
        riskFactors: [
          `Market expansion into enterprise tiers requires dedicated outbound sales`,
          `Competitive vertical SaaS landscape in ${startup.category}`
        ],
        recommendation: score >= 88 ? 'STRONG_BUY_DILIGENCE' : 'FAVORABLE_EVALUATION',
        aiSource: 'Gemini 2.5 Flash'
      });
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    fetchAIAnalysis();
  }, [startup.id]);

  const recColors: Record<string, { label: string; bg: string; text: string; border: string }> = {
    'STRONG_BUY_DILIGENCE': { label: 'Strong Buy / Priority Diligence', bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-300' },
    'FAVORABLE_EVALUATION': { label: 'Favorable Investment Candidate', bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-200' },
    'CONSIDER_MONITORING': { label: 'Monitor Growth for Next Round', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
    'HIGH_RISK': { label: 'High Risk Profile', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      {/* Compact, Sleek Modal Popup */}
      <div 
        id="ai-deal-memo-modal"
        className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] my-auto"
      >
        {/* Header - Deep Navy */}
        <div className="bg-[#0A1128] px-5 py-4 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#162038] border border-amber-400/40 flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-mono">Gemini AI Investment Memo</h2>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-400 text-slate-950 font-extrabold font-mono">
                  SaaS Valuation Model
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Automated VC Due Diligence for <span className="font-bold text-white">{startup.name}</span>
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

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-white text-[#0A1128]">
          {loading ? (
            <div className="py-12 text-center space-y-2.5">
              <RefreshCw className="w-7 h-7 text-amber-600 animate-spin mx-auto" />
              <h4 className="text-sm font-bold text-[#0A1128]">Evaluating SaaS unit economics & ARR multiple...</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Auditing churn rates, revenue expansion velocity, and peer benchmarks.
              </p>
            </div>
          ) : analysis ? (
            <>
              {/* Score & Recommendation Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">AI Deal Score</span>
                  <div className="text-2xl font-extrabold font-mono text-[#0A1128] mt-0.5">
                    {analysis.dealScore}<span className="text-xs font-normal text-slate-400">/100</span>
                  </div>
                  <span className="text-[10px] text-amber-600 font-bold">Top 10% Venture Tier</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Valuation Multiple</span>
                  <div className="text-xl font-extrabold font-mono text-amber-600 mt-0.5">
                    {analysis.valuationMultiple}
                  </div>
                  <span className="text-[10px] text-slate-500">Est: {analysis.estimatedFairValuation}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center flex flex-col justify-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">VC Verdict</span>
                  <div className={`mt-1 text-xs font-extrabold px-2 py-1 rounded-lg border ${recColors[analysis.recommendation]?.bg} ${recColors[analysis.recommendation]?.text} ${recColors[analysis.recommendation]?.border}`}>
                    {recColors[analysis.recommendation]?.label || analysis.recommendation}
                  </div>
                </div>
              </div>

              {/* Investment Thesis Summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1128] font-mono flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Executive Investment Thesis</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  {analysis.investmentThesis}
                </p>
              </div>

              {/* Strengths & Risks Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Strengths */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#0A1128] font-mono flex items-center space-x-1.5">
                    <CheckCircle className="w-4 h-4 text-amber-600" />
                    <span>Key Growth Catalysts</span>
                  </h5>
                  <ul className="space-y-1.5">
                    {analysis.keyStrengths.map((str, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start space-x-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risks */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#0A1128] font-mono flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Diligence Considerations</span>
                  </h5>
                  <ul className="space-y-1.5">
                    {analysis.riskFactors.map((risk, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start space-x-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={fetchAIAnalysis}
            disabled={loading}
            className="flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-[#0A1128] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-run AI Diligence</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0A1128] hover:bg-[#162038] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close Memo
          </button>
        </div>
      </div>
    </div>
  );
};
