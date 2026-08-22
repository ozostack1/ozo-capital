import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { PublicDirectory } from './components/PublicDirectory';
import { FounderDashboard } from './components/FounderDashboard';
import { InvestorDashboard } from './components/InvestorDashboard';
import { CommunityHub } from './components/CommunityHub';
import { AdminPanel } from './components/AdminPanel';
import { StartupDetailModal } from './components/StartupDetailModal';
import { AIDealAnalyzerModal } from './components/AIDealAnalyzerModal';
import { PitchModal } from './components/PitchModal';
import { CreateStartupModal } from './components/CreateStartupModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AuthModal } from './components/AuthModal';
import { FounderOnboardingModal } from './components/FounderOnboardingModal';
import { InvestorProfileSettingsModal } from './components/InvestorProfileSettingsModal';
import { DirectChatDrawer } from './components/DirectChatDrawer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SocialProfileModal } from './components/SocialProfileModal';
import { SocialNetworkModal } from './components/SocialNetworkModal';
import { InvestorInterestModal } from './components/InvestorInterestModal';
import { SupportDeskModal } from './components/SupportDeskModal';
import { Startup, Investor } from './types';
import { 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  ExternalLink, 
  Bot,
  LifeBuoy
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    currentView, 
    setCurrentView,
    currentRole, 
    toastMessage, 
    isSubscriptionModalOpen, 
    setIsSubscriptionModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalOptions,
    isAuthenticated,
    isAdminAuthenticated,
    openAdminLoginModal,
    openAuthModal,
    isOnboardingModalOpen,
    setIsOnboardingModalOpen,
    isInvestorProfileSettingsModalOpen,
    setIsInvestorProfileSettingsModalOpen,
    setIsSupportModalOpen,
    theme
  } = useApp();

  // Modals state
  const [selectedStartupForDetail, setSelectedStartupForDetail] = useState<Startup | null>(null);
  const [selectedStartupForAI, setSelectedStartupForAI] = useState<Startup | null>(null);
  const [selectedStartupForPitch, setSelectedStartupForPitch] = useState<Startup | null>(null);
  const [selectedInvestorForPitch, setSelectedInvestorForPitch] = useState<Investor | null>(null);
  const [selectedStartupForInterest, setSelectedStartupForInterest] = useState<Startup | null>(null);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [isCreateStartupModalOpen, setIsCreateStartupModalOpen] = useState(false);

  const handleSignalInterest = (startup: Startup) => {
    if (!isAuthenticated) {
      openAuthModal({ mode: 'login', role: 'investor' });
      return;
    }
    setSelectedStartupForInterest(startup);
  };

  const handleOpenPitch = (startup: Startup) => {
    if (!isAuthenticated) {
      openAuthModal({ mode: 'login', role: 'founder' });
      return;
    }
    setSelectedStartupForPitch(startup);
    setSelectedInvestorForPitch(null);
    setIsPitchModalOpen(true);
  };

  const handleSelectInvestorToPitch = (investor: Investor) => {
    if (!isAuthenticated) {
      openAuthModal({ mode: 'login', role: 'founder' });
      return;
    }
    setSelectedInvestorForPitch(investor);
    setSelectedStartupForPitch(null);
    setIsPitchModalOpen(true);
  };

  const handleOpenCreateStartup = () => {
    if (!isAuthenticated) {
      openAuthModal({ mode: 'signup', role: 'founder' });
      return;
    }
    setIsCreateStartupModalOpen(true);
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'light bg-[#F8FAFC] text-slate-900' : 'bg-[#0A1128] text-slate-100'} flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900 transition-colors duration-200`}>
      {/* Top Navbar */}
      <Navbar onOpenNewStartupModal={handleOpenCreateStartup} />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0A1128] text-white border border-amber-500/40 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2.5 animate-in slide-in-from-bottom duration-200 text-xs font-semibold backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* View Router - Robust & Responsive Multi-Role Renderer */}
        {(() => {
          switch (currentView) {
            case 'directory':
              return (
                <PublicDirectory
                  onSelectStartup={(s) => setSelectedStartupForDetail(s)}
                  onOpenPitch={handleOpenPitch}
                  onOpenAIAnalysis={(s) => setSelectedStartupForAI(s)}
                  onSignalInterest={handleSignalInterest}
                />
              );
            case 'community':
              return <CommunityHub />;
            case 'founder_dashboard':
              if (!isAuthenticated || currentRole === 'guest') {
                return (
                  <LandingPage
                    onOpenNewStartupModal={handleOpenCreateStartup}
                    onSelectStartup={(s) => setSelectedStartupForDetail(s)}
                    onOpenAIAnalysis={(s) => setSelectedStartupForAI(s)}
                  />
                );
              }
              return (
                <FounderDashboard
                  onOpenNewStartupModal={handleOpenCreateStartup}
                  onOpenAIAnalysis={(s) => setSelectedStartupForAI(s)}
                  onSelectInvestorToPitch={handleSelectInvestorToPitch}
                />
              );
            case 'investor_dashboard':
              if (!isAuthenticated || currentRole === 'guest') {
                return (
                  <LandingPage
                    onOpenNewStartupModal={handleOpenCreateStartup}
                    onSelectStartup={(s) => setSelectedStartupForDetail(s)}
                    onOpenAIAnalysis={(s) => setSelectedStartupForAI(s)}
                  />
                );
              }
              return (
                <InvestorDashboard
                  onSelectStartup={(s) => setSelectedStartupForDetail(s)}
                  onOpenAIAnalysis={(s) => setSelectedStartupForAI(s)}
                  onSignalInterest={handleSignalInterest}
                />
              );
            case 'admin_panel':
              if (isAdminAuthenticated && currentRole === 'admin') {
                return <AdminPanel />;
              }
              return (
                <div className="text-center py-16 bg-white dark:bg-[#0A1128] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 max-w-lg mx-auto my-12">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-500">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Admin Gateway Clearance</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                    Compliance auditing, Stripe ledger verification, and KYC controls require administrative clearance.
                  </p>
                  <button
                    onClick={openAdminLoginModal}
                    className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Authenticate Admin Session
                  </button>
                </div>
              );
            case 'landing':
            default:
              return (
                <LandingPage
                  onOpenNewStartupModal={handleOpenCreateStartup}
                  onSelectStartup={(s) => setSelectedStartupForDetail(s)}
                  onOpenAIAnalysis={(s) => setSelectedStartupForAI(s)}
                />
              );
          }
        })()}
      </main>

      {/* Modals */}
      {selectedStartupForDetail && (
        <StartupDetailModal
          startup={selectedStartupForDetail}
          onClose={() => setSelectedStartupForDetail(null)}
          onOpenPitch={handleOpenPitch}
          onOpenAIAnalysis={(s) => {
            setSelectedStartupForDetail(null);
            setSelectedStartupForAI(s);
          }}
          onSignalInterest={handleSignalInterest}
        />
      )}

      {selectedStartupForAI && (
        <AIDealAnalyzerModal
          startup={selectedStartupForAI}
          onClose={() => setSelectedStartupForAI(null)}
          onSelectInvestorToPitch={() => {
            const st = selectedStartupForAI;
            setSelectedStartupForAI(null);
            handleOpenPitch(st);
          }}
        />
      )}

      {isPitchModalOpen && (
        <PitchModal
          startup={selectedStartupForPitch || undefined}
          investor={selectedInvestorForPitch || undefined}
          onClose={() => {
            setIsPitchModalOpen(false);
            setSelectedStartupForPitch(null);
            setSelectedInvestorForPitch(null);
          }}
        />
      )}

      {isCreateStartupModalOpen && (
        <CreateStartupModal
          onClose={() => setIsCreateStartupModalOpen(false)}
        />
      )}

      {isSubscriptionModalOpen && (
        <SubscriptionModal
          isOpen={isSubscriptionModalOpen}
          onClose={() => setIsSubscriptionModalOpen(false)}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalOptions.mode}
          initialRole={authModalOptions.role}
        />
      )}

      {isOnboardingModalOpen && (
        <FounderOnboardingModal
          isOpen={isOnboardingModalOpen}
          onClose={() => setIsOnboardingModalOpen(false)}
        />
      )}

      {isInvestorProfileSettingsModalOpen && (
        <InvestorProfileSettingsModal
          isOpen={isInvestorProfileSettingsModalOpen}
          onClose={() => setIsInvestorProfileSettingsModalOpen(false)}
        />
      )}

      {/* Investor Interest Signal Modal */}
      {selectedStartupForInterest && (
        <InvestorInterestModal
          startup={selectedStartupForInterest}
          isOpen={!!selectedStartupForInterest}
          onClose={() => setSelectedStartupForInterest(null)}
        />
      )}

      {/* 1-on-1 Direct Chat Messenger Drawer */}
      <DirectChatDrawer />

      {/* Social Network & Followers Modal */}
      <SocialNetworkModal />

      {/* Social Profile Media Modal */}
      <SocialProfileModal />

      {/* Help & Support Desk Modal */}
      <SupportDeskModal />

      {/* Admin Gateway Authentication Modal */}
      <AdminLoginModal />

      {/* Global TrustMRR Footer - Vestbee & Investment Network Navy/Gold */}
      <footer className="border-t border-[#1E293B] bg-[#0A1128] py-8 text-xs text-slate-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#162038] flex items-center justify-center border border-amber-400/40">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <span className="font-bold text-white font-mono text-sm">TrustMRR Pulse</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-medium">Accredited Venture & Stripe Verified MRR Platform</span>
          </div>

          <div className="flex items-center space-x-6 text-[11px] text-slate-300">
            <button
              onClick={() => setIsSupportModalOpen(true)}
              className="text-slate-300 font-bold hover:text-amber-400 transition-colors cursor-pointer flex items-center space-x-1"
            >
              <LifeBuoy className="w-3.5 h-3.5 text-amber-400" />
              <span>Help & Support Desk</span>
            </button>
            <span className="flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>AES-256 Encrypted Ledger</span>
            </span>
            <button 
              onClick={() => setIsSubscriptionModalOpen(true)}
              className="text-amber-400 font-bold hover:text-amber-300 hover:underline cursor-pointer"
            >
              Subscription Pricing
            </button>
            <button
              onClick={openAdminLoginModal}
              className="text-slate-400 hover:text-amber-400 flex items-center space-x-1 transition-colors cursor-pointer"
              title="Restricted Staff & Compliance Access"
            >
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Staff Portal</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
