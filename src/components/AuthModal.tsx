import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  TrendingUp, 
  Briefcase, 
  UserCheck, 
  Lock, 
  Mail, 
  Key, 
  Building2, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  initialRole = 'founder'
}) => {
  const { login, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<'founder' | 'investor'>(initialRole === 'investor' ? 'investor' : 'founder');
  
  // Custom Form Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyOrFirm, setCompanyOrFirm] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your work email address.');
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const name = fullName.trim() || email.split('@')[0];
    const company = companyOrFirm.trim() || (selectedRole === 'founder' ? `${name}'s SaaS` : 'Venture Capital');
    const title = jobTitle.trim() || (selectedRole === 'founder' ? 'Founder & CEO' : selectedRole === 'investor' ? 'Venture Partner' : 'Auditor');

    login(selectedRole, {
      name,
      email,
      companyOrFirm: company,
      title,
      hasCompletedOnboarding: mode === 'signup' && selectedRole === 'founder' ? false : true
    });

    onClose();
  };

  const handleFastDemoLogin = (role: UserRole, demoProfile?: { name: string; email: string; company: string; title: string; avatar: string; associatedStartupId?: string; hasCompletedOnboarding?: boolean }) => {
    if (demoProfile) {
      login(role, {
        name: demoProfile.name,
        email: demoProfile.email,
        companyOrFirm: demoProfile.company,
        title: demoProfile.title,
        avatar: demoProfile.avatar,
        associatedStartupId: demoProfile.associatedStartupId,
        hasCompletedOnboarding: demoProfile.hasCompletedOnboarding ?? true
      });
    } else {
      login(role);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      {/* Compact, Sleek Modal Popup */}
      <div 
        id="auth-modal"
        className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col relative my-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-slate-300 hover:text-white bg-[#162038] hover:bg-slate-700 p-1.5 rounded-full transition-colors z-10 cursor-pointer shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header - Deep Navy with Golden Shield */}
        <div className="bg-[#0A1128] px-5 pt-5 pb-4 text-center border-b border-slate-800 text-white">
          <div className="w-10 h-10 rounded-xl bg-[#162038] border border-amber-400/40 flex items-center justify-center mx-auto shadow-md mb-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white font-mono tracking-tight">
            {mode === 'login' ? 'Sign In to TrustMRR Pulse' : 'Create Verified Account'}
          </h2>
          <p className="text-[11px] text-slate-300 mt-1 max-w-xs mx-auto leading-normal">
            {mode === 'login' 
              ? 'Access verified SaaS deals, live Stripe metrics, and venture syndicates.'
              : 'Join founders raising capital with verified metrics or accredited angels & VCs.'}
          </p>

          {/* Mode Switcher */}
          <div className="flex bg-[#162038] p-1 rounded-xl border border-slate-700 mt-3 max-w-xs mx-auto">
            <button
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setErrorMsg(''); }}
              className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[72vh] overflow-y-auto">
          {/* Role Selection Tabs - Strictly Founder & Investor */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Your Role:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Founder Role */}
              <button
                type="button"
                onClick={() => setSelectedRole('founder')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedRole === 'founder'
                    ? 'bg-amber-50/80 border-2 border-amber-400 text-[#0A1128] shadow-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <TrendingUp className={`w-4 h-4 ${selectedRole === 'founder' ? 'text-amber-600' : 'text-slate-400'}`} />
                  {selectedRole === 'founder' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                </div>
                <span className="text-xs font-extrabold text-[#0A1128] block">Founder</span>
                <span className="text-[10px] text-slate-500 leading-tight block">Raise capital & verify metrics</span>
              </button>

              {/* Investor Role */}
              <button
                type="button"
                onClick={() => setSelectedRole('investor')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedRole === 'investor'
                    ? 'bg-amber-50/80 border-2 border-amber-400 text-[#0A1128] shadow-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Briefcase className={`w-4 h-4 ${selectedRole === 'investor' ? 'text-amber-600' : 'text-slate-400'}`} />
                  {selectedRole === 'investor' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                </div>
                <span className="text-xs font-extrabold text-[#0A1128] block">Investor</span>
                <span className="text-[10px] text-slate-500 leading-tight block">Deploy capital & view deal flow</span>
              </button>
            </div>
          </div>

          {/* Quick 1-Click Demo Profiles */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Instant 1-Click Demo Accounts</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Click to switch</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
              {selectedRole === 'founder' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleFastDemoLogin('founder', {
                      name: 'Elena Rostova',
                      email: 'elena@novasync.dev',
                      company: 'NovaSync',
                      title: 'Founder & CTO',
                      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                      hasCompletedOnboarding: false
                    })}
                    className="p-2 bg-white hover:bg-amber-50/50 hover:border-amber-400 border border-slate-200 rounded-lg text-left transition-all cursor-pointer flex items-center space-x-2.5 sm:col-span-2 shadow-xs"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-800 font-bold text-xs">
                      ✨
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5">
                        <p className="text-xs font-bold text-[#0A1128] truncate">Elena Rostova</p>
                        <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 text-[9px] rounded font-mono font-bold">New (Wizard)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono truncate">Start profile setup & Stripe metric verification</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFastDemoLogin('founder', {
                      name: 'Alex Vance',
                      email: 'alex@flowops.ai',
                      company: 'FlowOps AI',
                      title: 'Founder & CEO',
                      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                      associatedStartupId: 'startup-1',
                      hasCompletedOnboarding: true
                    })}
                    className="p-2 bg-white hover:bg-slate-50 hover:border-amber-400 border border-slate-200 rounded-lg text-left transition-all cursor-pointer flex items-center space-x-2 shadow-xs"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                      alt="Alex"
                      className="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0" 
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#0A1128] truncate">Alex Vance</p>
                      <p className="text-[10px] text-amber-600 font-mono truncate font-bold">FlowOps • $48.5k MRR</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFastDemoLogin('founder', {
                      name: 'Rohan Sharma',
                      email: 'rohan@metricscale.io',
                      company: 'MetricScale',
                      title: 'Solo Founder',
                      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                      associatedStartupId: 'startup-2',
                      hasCompletedOnboarding: true
                    })}
                    className="p-2 bg-white hover:bg-slate-50 hover:border-amber-400 border border-slate-200 rounded-lg text-left transition-all cursor-pointer flex items-center space-x-2 shadow-xs"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" 
                      alt="Rohan"
                      className="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0" 
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#0A1128] truncate">Rohan Sharma</p>
                      <p className="text-[10px] text-amber-600 font-mono truncate font-bold">MetricScale • $34.2k MRR</p>
                    </div>
                  </button>
                </>
              )}

              {selectedRole === 'investor' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleFastDemoLogin('investor', {
                      name: 'Sarah Chen',
                      email: 'sarah@horizonvc.io',
                      company: 'Horizon Venture Capital',
                      title: 'General Partner',
                      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
                    })}
                    className="p-2 bg-white hover:bg-slate-50 hover:border-amber-400 border border-slate-200 rounded-lg text-left transition-all cursor-pointer flex items-center space-x-2 shadow-xs"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" 
                      alt="Sarah"
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0" 
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#0A1128] truncate">Sarah Chen</p>
                      <p className="text-[10px] text-amber-600 font-mono truncate font-bold">GP Horizon VC</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFastDemoLogin('investor', {
                      name: 'Marcus Sterling',
                      email: 'marcus@sterlingangels.com',
                      company: 'Sterling Angel Syndicate',
                      title: 'Lead Angel & Ex-Founder',
                      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
                    })}
                    className="p-2 bg-white hover:bg-slate-50 hover:border-amber-400 border border-slate-200 rounded-lg text-left transition-all cursor-pointer flex items-center space-x-2 shadow-xs"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" 
                      alt="Marcus"
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0" 
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#0A1128] truncate">Marcus Sterling</p>
                      <p className="text-[10px] text-amber-600 font-mono truncate font-bold">Lead Angel</p>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Custom Login / Signup Form */}
          <form onSubmit={handleCustomSubmit} className="space-y-3 pt-1">
            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={selectedRole === 'founder' ? 'e.g., Alex Vance' : 'e.g., Sarah Chen'}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Work Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={selectedRole === 'founder' ? 'founder@startup.com' : 'partner@fund.vc'}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {selectedRole === 'founder' ? 'Startup Name' : 'Firm / Syndicate'}
                  </label>
                  <input
                    type="text"
                    value={companyOrFirm}
                    onChange={(e) => setCompanyOrFirm(e.target.value)}
                    placeholder={selectedRole === 'founder' ? 'e.g., FlowOps' : 'e.g., Horizon VC'}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder={selectedRole === 'founder' ? 'Founder & CEO' : 'General Partner'}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 mt-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>{mode === 'login' ? `Sign In as ${selectedRole.toUpperCase()}` : `Create ${selectedRole.toUpperCase()} Account`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="bg-[#0A1128] px-5 py-2.5 border-t border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
          <span className="flex items-center space-x-1">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>256-Bit SSL Encrypted</span>
          </span>
          <span className="text-slate-400">Zero Brokerage Fees</span>
        </div>
      </div>
    </div>
  );
};
