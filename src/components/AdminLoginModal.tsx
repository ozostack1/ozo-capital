import React, { useState } from 'react';
import { ShieldCheck, Lock, Key, X, Eye, EyeOff, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminLoginModal: React.FC = () => {
  const { isAdminLoginModalOpen, setIsAdminLoginModalOpen, adminLogin } = useApp();
  
  const [email, setEmail] = useState('admin@trustmrr.com');
  const [password, setPassword] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const success = adminLogin(password.trim(), email.trim());
      setIsSubmitting(false);
      if (!success) {
        setErrorMessage('Invalid administrator credentials or access key. (Default: admin123)');
      }
    }, 300);
  };

  const handleQuickDemoFill = () => {
    setEmail('admin@trustmrr.com');
    setPassword('admin123');
    setSecurityPin('8899');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-[#0A1128]">
        {/* Top Header - Deep Navy with Gold Accents */}
        <div className="bg-[#0A1128] p-6 text-white border-b border-slate-800 relative">
          <button
            onClick={() => {
              setIsAdminLoginModalOpen(false);
              setErrorMessage(null);
            }}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-xl hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#162038] border border-amber-400/40 text-amber-400 text-[11px] font-bold mb-2 font-mono">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Restricted Access Portal</span>
          </div>

          <h2 className="text-xl font-extrabold font-mono text-white tracking-tight">
            Venture Desk • Admin Gateway
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Authorized compliance officers, audit reviewers, and system operators only.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2 text-xs text-red-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Administrator Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@trustmrr.com"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-[#0A1128] font-bold focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">Security Password</label>
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="text-[10px] text-amber-600 hover:text-amber-700 font-bold font-mono underline cursor-pointer"
              >
                Auto-fill Demo Key (admin123)
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-[#0A1128] font-mono font-bold focus:outline-none focus:border-amber-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">2FA Security Token / PIN (Optional)</label>
            <input
              type="text"
              maxLength={6}
              value={securityPin}
              onChange={(e) => setSecurityPin(e.target.value)}
              placeholder="e.g. 8899"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-[#0A1128] font-mono tracking-widest focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 transform hover:-translate-y-0.5"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>{isSubmitting ? 'Authenticating...' : 'Authenticate Admin Session'}</span>
            </button>
          </div>

          {/* Helper info badge */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-500 flex items-center justify-between">
            <span className="font-mono">Default Demo Access:</span>
            <span className="font-bold text-[#0A1128] font-mono">admin123</span>
          </div>
        </form>
      </div>
    </div>
  );
};
