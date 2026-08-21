import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubscriptionTier } from '../types';

interface SubscriptionModalProps {
  isOpen?: boolean;
  onClose: () => void;
  initialPlan?: SubscriptionTier;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen = true,
  onClose,
  initialPlan
}) => {
  const { currentUser, subscriptionPlans, upgradeSubscription, showToast } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [targetAudience, setTargetAudience] = useState<'founder' | 'investor'>(
    currentUser.role === 'investor' ? 'investor' : 'founder'
  );

  if (!isOpen) return null;

  const handleSelectPlan = (tier: string, planName: string) => {
    upgradeSubscription(tier as SubscriptionTier);
    onClose();
  };

  const filteredPlans = subscriptionPlans.filter(
    p => p.isActive !== false && (p.roleTarget === targetAudience || p.roleTarget === 'all')
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      {/* Compact, Sleek Modal Popup */}
      <div 
        id="subscription-modal"
        className="bg-white border border-slate-200 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto"
      >
        {/* Header - Deep Navy */}
        <div className="bg-[#0A1128] px-5 sm:px-8 py-5 border-b border-slate-800 relative text-white">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 text-slate-300 hover:text-white bg-[#162038] hover:bg-slate-700 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center max-w-lg mx-auto space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Transparent Pricing & Plans</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-mono">
              Accelerate Your Venture Growth
            </h2>
            <p className="text-xs text-slate-300">
              Verified Stripe metrics, institutional deal flow, and direct founder-investor introductions.
            </p>
          </div>

          {/* Toggle Audience and Billing */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 mt-4">
            {/* Role Switcher */}
            <div className="bg-[#162038] p-1 rounded-xl border border-slate-700 flex items-center space-x-1 text-xs">
              <button
                onClick={() => setTargetAudience('founder')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  targetAudience === 'founder'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>For Founders</span>
              </button>

              <button
                onClick={() => setTargetAudience('investor')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  targetAudience === 'investor'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>For Investors</span>
              </button>
            </div>

            {/* Billing cycle Switcher */}
            <div className="bg-[#162038] p-1 rounded-xl border border-slate-700 flex items-center space-x-1 text-xs">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs font-bold ${
                  billingCycle === 'monthly' ? 'bg-white text-[#0A1128]' : 'text-slate-300'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center space-x-1 text-xs font-bold ${
                  billingCycle === 'annual' ? 'bg-white text-[#0A1128]' : 'text-slate-300'
                }`}
              >
                <span>Annual</span>
                <span className="text-[9px] bg-amber-400 text-slate-950 px-1 py-0.2 rounded font-mono font-extrabold">
                  -20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 bg-slate-50 text-[#0A1128]">
          {filteredPlans.map((plan) => {
            const isCurrent = currentUser.subscriptionTier === plan.id;
            const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl p-5 border flex flex-col justify-between shadow-sm hover:shadow-md transition-all ${
                  plan.popular
                    ? 'border-2 border-amber-400 ring-2 ring-amber-400/20'
                    : 'border-slate-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full tracking-wider shadow-sm">
                    {plan.badgeText || 'Most Popular'}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-[#0A1128] font-mono">{plan.name}</h3>
                    {isCurrent && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 font-bold font-mono">
                        Active
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{plan.tagline}</p>

                  <div className="mt-3 pb-3 border-b border-slate-200">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-extrabold text-[#0A1128] font-mono">${price}</span>
                      <span className="text-xs text-slate-500 font-medium">
                        {price === 0 ? 'forever' : '/month'}
                      </span>
                    </div>
                    {billingCycle === 'annual' && price > 0 && (
                      <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">
                        Billed annually (${price * 12}/yr)
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mt-3 text-xs">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start space-x-2 text-slate-700">
                        <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleSelectPlan(plan.id, plan.name)}
                    disabled={isCurrent}
                    className={`w-full py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                      isCurrent
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-500/20 transform hover:-translate-y-0.5'
                        : 'bg-[#0A1128] hover:bg-[#162038] text-white shadow-xs'
                    }`}
                  >
                    <span>{isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}</span>
                    {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="bg-[#0A1128] px-6 py-2.5 border-t border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Cancel anytime. 14-day money-back guarantee.</span>
          </span>
          <span className="text-slate-400 font-mono text-[10px]">Stripe Checkout Enabled</span>
        </div>
      </div>
    </div>
  );
};
