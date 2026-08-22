import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  UserCheck, 
  Briefcase, 
  Users, 
  Lock, 
  ChevronDown, 
  Crown,
  Activity,
  Search,
  PlusCircle,
  BarChart3,
  Layers,
  Home,
  LogIn,
  LogOut,
  User,
  ArrowRight,
  RefreshCw,
  Sun,
  Moon,
  LifeBuoy,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface NavbarProps {
  onOpenNewStartupModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewStartupModal }) => {
  const { 
    currentRole, 
    currentUser, 
    startups, 
    dealPipeline, 
    subscriptionPlans,
    setIsSubscriptionModalOpen,
    setIsSupportModalOpen,
    chatConversations,
    isChatDrawerOpen,
    setIsChatDrawerOpen,
    verificationQueue,
    currentView,
    setCurrentView,
    isAuthenticated,
    isAdminAuthenticated,
    openAdminLoginModal,
    adminLogout,
    login,
    logout,
    openAuthModal,
    switchRoleQuick,
    theme,
    toggleTheme,
    openSocialProfileModal,
    openSocialNetworkModal,
    getUserConnectionsCount
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live aggregate stats
  const totalVerifiedMrr = startups
    .filter(s => s.isVerified)
    .reduce((acc, s) => acc + s.mrr, 0);

  const pendingVerificationCount = verificationQueue.filter(v => v.status === 'pending').length;

  // Compute live single-user isolated unread messages
  const userConversations = chatConversations.filter(c => {
    if (!currentUser || currentUser.role === 'guest') return false;
    return (
      Array.isArray(c.participantIds) &&
      c.participantIds.length === 2 &&
      c.participantIds.includes(currentUser.id)
    );
  });
  const totalUserUnreadMessages = userConversations.reduce((acc, c) => {
    const unread = c.messages.filter(m => m.recipientId === currentUser?.id && !m.isRead).length;
    return acc + unread;
  }, 0);

  const roleStyles: Record<UserRole, { badge: string; border: string; bg: string; text: string }> = {
    guest: { badge: 'Guest Visitor', border: 'border-slate-200', bg: 'bg-slate-50', text: 'text-slate-700' },
    founder: { badge: 'Founder', border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-900' },
    investor: { badge: 'Accredited VC', border: 'border-blue-200', bg: 'bg-blue-50', text: 'text-blue-900' },
    admin: { badge: 'Audit Officer', border: 'border-slate-300', bg: 'bg-slate-100', text: 'text-slate-900' }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Real-time Trust Bar - Deep Navy with Gold Accents (Vestbee Style) */}
      <div className="bg-[#0A1128] px-4 py-1.5 border-b border-[#1E293B] text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4 overflow-x-auto scrollbar-none py-0.5">
            <div className="flex items-center space-x-1.5 shrink-0">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </span>
              <span className="text-slate-300 font-medium">Verified MRR Tracked:</span>
              <span className="text-amber-400 font-mono font-bold">${totalVerifiedMrr.toLocaleString()}/mo</span>
            </div>

            <div className="hidden sm:flex items-center space-x-1.5 shrink-0 text-slate-400">
              <span className="text-slate-600">•</span>
              <span>Active Startups:</span>
              <span className="text-white font-mono font-semibold">{startups.length} Companies</span>
            </div>

            <div className="hidden md:flex items-center space-x-1.5 shrink-0 text-slate-300">
              <span className="text-slate-600">•</span>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Stripe OAuth 2.0 Direct Ledger Sync Active</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="hidden lg:flex items-center space-x-1 text-[11px] text-amber-200 bg-[#162038] px-2.5 py-0.5 rounded-lg border border-amber-500/30">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>AES-256 Diligence Encryption</span>
            </div>

            <button 
              id="topbar-theme-toggle-btn"
              onClick={toggleTheme}
              className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-lg border border-slate-700 hover:border-amber-400 bg-[#162038] text-slate-200 transition-all cursor-pointer shadow-sm"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'White'} Mode`}
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-300" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span>White Mode</span>
                </>
              )}
            </button>

            {/* Messages Quick Button - ONLY SHOWN AFTER LOGIN */}
            {isAuthenticated && currentRole !== 'guest' && (
              <button
                onClick={() => setIsChatDrawerOpen(true)}
                className="flex items-center space-x-1 text-xs font-bold text-slate-200 bg-[#162038] hover:bg-[#202c4c] border border-slate-700 hover:border-amber-400 px-2.5 py-0.5 rounded-lg transition-all cursor-pointer shadow-sm shrink-0"
                title="Open 1-on-1 Messages"
              >
                <MessageSquare className="w-3 h-3 text-amber-400" />
                <span className="hidden xs:inline sm:inline">Messages</span>
                {totalUserUnreadMessages > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold flex items-center justify-center font-mono">
                    {totalUserUnreadMessages}
                  </span>
                )}
              </button>
            )}

            <button 
              onClick={() => setIsSupportModalOpen(true)}
              className="flex items-center space-x-1 text-xs font-bold text-slate-200 bg-[#162038] hover:bg-[#202c4c] border border-slate-700 hover:border-amber-400 px-2.5 py-0.5 rounded-lg transition-all cursor-pointer shadow-sm shrink-0"
              title="Open Support Desk & Help Tickets"
            >
              <LifeBuoy className="w-3 h-3 text-amber-400" />
              <span className="hidden xs:inline sm:inline">Help Desk</span>
            </button>

            <button 
              id="upgrade-tier-btn"
              onClick={() => setIsSubscriptionModalOpen(true)}
              className="flex items-center space-x-1 text-xs font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 border border-amber-500 px-2.5 sm:px-3 py-0.5 rounded-lg transition-all cursor-pointer shadow-sm shrink-0"
            >
              <Crown className="w-3 h-3 text-slate-950" />
              <span className="hidden xs:inline sm:inline">Plans & Pricing</span>
              <span className="inline xs:hidden sm:hidden">Plans</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Crisp White with Deep Navy */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setCurrentView('landing')}
              className="flex items-center space-x-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0A1128] flex items-center justify-center shadow-md border border-slate-700 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-[#0A1128] font-mono">TrustMRR</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 shadow-xs">
                    PULSE
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold -mt-0.5">Verified SaaS Venture Exchange</p>
              </div>
            </button>
          </div>

          {/* Navigation Links - Role Sensitive - ONLY VISIBLE WHEN AUTHENTICATED */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-1.5">
              {currentRole === 'founder' && (
                <>
                  <button
                    id="nav-tab-founder"
                    onClick={() => setCurrentView('founder_dashboard')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      currentView === 'founder_dashboard'
                        ? 'bg-[#101249] text-white shadow-sm'
                        : 'text-slate-700 hover:text-[#101249] hover:bg-slate-100'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <span>My Startup & Raise</span>
                  </button>

                  <button
                    id="nav-tab-directory"
                    onClick={() => setCurrentView('directory')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      currentView === 'directory'
                        ? 'bg-[#101249] text-white shadow-sm'
                        : 'text-slate-700 hover:text-[#101249] hover:bg-slate-100'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 text-slate-600" />
                    <span>MRR Directory</span>
                  </button>

                  <button
                    id="nav-tab-community"
                    onClick={() => setCurrentView('community')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      currentView === 'community'
                        ? 'bg-[#101249] text-white shadow-sm'
                        : 'text-slate-700 hover:text-[#101249] hover:bg-slate-100'
                    }`}
                  >
                    <Users className="w-4 h-4 text-slate-600" />
                    <span>Community</span>
                  </button>

                  <button
                    onClick={() => setIsChatDrawerOpen(true)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer text-slate-700 hover:text-[#101249] hover:bg-slate-100"
                  >
                    <MessageSquare className="w-4 h-4 text-amber-500" />
                    <span>Messages</span>
                    {totalUserUnreadMessages > 0 && (
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-400 text-slate-950 font-extrabold font-mono">
                        {totalUserUnreadMessages}
                      </span>
                    )}
                  </button>

                  <button
                    id="nav-tab-pricing"
                    onClick={() => setIsSubscriptionModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer text-slate-700 hover:text-[#101249] hover:bg-slate-100"
                  >
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span>Plans & Pricing</span>
                  </button>
                </>
              )}

              {currentRole === 'investor' && (
                <>
                  <button
                    id="nav-tab-investor"
                    onClick={() => setCurrentView('investor_dashboard')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      currentView === 'investor_dashboard'
                        ? 'bg-[#101249] text-white shadow-sm'
                        : 'text-slate-700 hover:text-[#101249] hover:bg-slate-100'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-blue-400" />
                    <span>Fund Seekers & CRM</span>
                    {dealPipeline.length > 0 && (
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-100 text-blue-900 font-extrabold font-mono">
                        {dealPipeline.length}
                      </span>
                    )}
                  </button>

                  <button
                    id="nav-tab-directory"
                    onClick={() => setCurrentView('directory')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      currentView === 'directory'
                        ? 'bg-[#101249] text-white shadow-sm'
                        : 'text-slate-700 hover:text-[#101249] hover:bg-slate-100'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 text-slate-600" />
                    <span>MRR Leaderboard</span>
                  </button>

                  <button
                    id="nav-tab-community"
                    onClick={() => setCurrentView('community')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      currentView === 'community'
                        ? 'bg-[#101249] text-white shadow-sm'
                        : 'text-slate-700 hover:text-[#101249] hover:bg-slate-100'
                    }`}
                  >
                    <Users className="w-4 h-4 text-slate-600" />
                    <span>Community</span>
                  </button>

                  <button
                    onClick={() => setIsChatDrawerOpen(true)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer text-slate-700 hover:text-[#101249] hover:bg-slate-100"
                  >
                    <MessageSquare className="w-4 h-4 text-amber-500" />
                    <span>Messages</span>
                    {totalUserUnreadMessages > 0 && (
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-400 text-slate-950 font-extrabold font-mono">
                        {totalUserUnreadMessages}
                      </span>
                    )}
                  </button>

                  <button
                    id="nav-tab-pricing-investor"
                    onClick={() => setIsSubscriptionModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer text-slate-700 hover:text-[#101249] hover:bg-slate-100"
                  >
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span>Plans & Pricing</span>
                  </button>
                </>
              )}

              {currentRole === 'admin' && isAdminAuthenticated && (
                <>
                  <button
                    id="nav-tab-admin"
                    onClick={() => setCurrentView('admin_panel')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      currentView === 'admin_panel'
                        ? 'bg-[#101249] text-white shadow-sm'
                        : 'text-slate-700 hover:text-[#101249] hover:bg-slate-100'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Admin Console</span>
                    {pendingVerificationCount > 0 && (
                      <span className="w-4 h-4 flex items-center justify-center text-[10px] font-bold rounded-full bg-amber-400 text-slate-950">
                        {pendingVerificationCount}
                      </span>
                    )}
                  </button>

                  <button
                    id="nav-tab-directory"
                    onClick={() => setCurrentView('directory')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      currentView === 'directory'
                        ? 'bg-[#101249] text-white shadow-sm'
                        : 'text-slate-700 hover:text-[#101249] hover:bg-slate-100'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 text-slate-600" />
                    <span>MRR Directory</span>
                  </button>

                  <button
                    id="nav-tab-community"
                    onClick={() => setCurrentView('community')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      currentView === 'community'
                        ? 'bg-[#101249] text-white shadow-sm'
                        : 'text-slate-700 hover:text-[#101249] hover:bg-slate-100'
                    }`}
                  >
                    <Users className="w-4 h-4 text-slate-600" />
                    <span>Community</span>
                  </button>
                </>
              )}
            </nav>
          )}

          {/* Right Action Area & User Authentication */}
          <div className="flex items-center space-x-2.5" ref={dropdownRef}>
            {/* Quick Role Switcher for Founders */}
            {isAuthenticated && currentRole === 'founder' && (
              <button
                id="switch-to-investor-btn"
                onClick={() => switchRoleQuick('investor')}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#101249] border border-slate-300 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer group"
                title="Switch view to Investor CRM"
              >
                <Briefcase className="w-3.5 h-3.5 text-blue-700 group-hover:scale-110 transition-transform" />
                <span>Switch to Investor</span>
              </button>
            )}

            {/* Quick Role Switcher for Investors */}
            {isAuthenticated && currentRole === 'investor' && (
              <button
                id="switch-to-founder-btn"
                onClick={() => switchRoleQuick('founder')}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer group"
                title="Switch view to Founder Hub"
              >
                <TrendingUp className="w-3.5 h-3.5 text-blue-700 group-hover:scale-110 transition-transform" />
                <span>Switch to Founder</span>
              </button>
            )}

            {/* Quick Action Button for Founders when logged in */}
            {isAuthenticated && currentRole === 'founder' && onOpenNewStartupModal && (
              <button
                id="quick-add-startup-btn"
                onClick={onOpenNewStartupModal}
                className="hidden sm:flex items-center space-x-1.5 px-4 py-2 bg-[#101249] hover:bg-[#1a1d6e] text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>List Startup</span>
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              id="navbar-theme-toggle-btn"
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-300 hover:border-slate-400 bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer shadow-xs"
              aria-label={`Toggle Theme (${theme === 'light' ? 'Switch to Dark' : 'Switch to White Mode'})`}
              title={`Toggle Theme (Current: ${theme === 'light' ? 'White Mode' : 'Dark Mode'})`}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-800" />
              ) : (
                <Sun className="w-4 h-4 text-blue-600" />
              )}
            </button>

            {/* AUTHENTICATION STATE */}
            {!isAuthenticated ? (
              /* GUEST / LOGGED OUT VIEW: Only show Login and Register buttons */
              <div className="flex items-center space-x-2">
                <button
                  id="navbar-login-btn"
                  onClick={() => openAuthModal({ mode: 'login' })}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#101249] border border-slate-300 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-700" />
                  <span>Log In</span>
                </button>

                <button
                  id="navbar-signup-btn"
                  onClick={() => openAuthModal({ mode: 'signup', role: 'founder' })}
                  className="px-4 py-2 bg-[#101249] hover:bg-[#1a1d6e] text-white rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>Get Started / Register</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* LOGGED IN USER PROFILE & LOGOUT CONTROLS */
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border-2 text-xs transition-all cursor-pointer ${roleStyles[currentRole].bg} ${roleStyles[currentRole].border}`}
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-300 shadow-xs"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="font-bold text-[#101249] text-xs flex items-center space-x-1.5">
                      <span className="truncate max-w-[100px]">{currentUser.name.split(' ')[0]}</span>
                      <span className={`text-[9px] px-2 py-0.2 rounded-md font-mono font-bold uppercase ${
                        currentRole === 'founder' ? 'bg-blue-100 text-blue-900' :
                        currentRole === 'investor' ? 'bg-[#101249] text-white' :
                        'bg-slate-800 text-white'
                      }`}>
                        {roleStyles[currentRole].badge}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 p-2 divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User Identity Header */}
                    <div className="px-3 py-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#101249] truncate">{currentUser.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                          <p className="text-[10px] text-blue-800 font-bold mt-0.5 truncate">{currentUser.companyOrFirm}</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Panel Links */}
                    <div className="py-2 space-y-1">
                      <button
                        onClick={() => {
                          openSocialProfileModal(currentUser.id);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center space-x-2 transition-colors cursor-pointer group"
                      >
                        <User className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                        <span>View My Social Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          openSocialNetworkModal(currentUser.id, 'connections');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center justify-between transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                          <span>My Connections & Network</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                          {getUserConnectionsCount(currentUser.id)}
                        </span>
                      </button>

                      {currentRole === 'founder' && (
                        <button
                          onClick={() => {
                            setCurrentView('founder_dashboard');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <TrendingUp className="w-4 h-4 text-blue-700" />
                          <span>My Startup Dashboard & Raise</span>
                        </button>
                      )}

                      {currentRole === 'investor' && (
                        <button
                          onClick={() => {
                            setCurrentView('investor_dashboard');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <Briefcase className="w-4 h-4 text-blue-700" />
                          <span>Deal Flow CRM & Fund Seekers</span>
                        </button>
                      )}

                      {currentRole === 'admin' && isAdminAuthenticated && (
                        <button
                          onClick={() => {
                            setCurrentView('admin_panel');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-500" />
                          <span>Executive Admin Console</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsSubscriptionModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center space-x-2 transition-colors cursor-pointer group"
                      >
                        <Crown className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="text-slate-700">Subscription:</span>
                          <span className="font-bold text-[#0A1128] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-mono truncate max-w-[120px]">
                            {subscriptionPlans.find(p => p.id === currentUser.subscriptionTier)?.name || currentUser.subscriptionTier.replace('_', ' ')}
                          </span>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsChatDrawerOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4 text-amber-500" />
                          <span>1-on-1 Messages</span>
                        </div>
                        {totalUserUnreadMessages > 0 && (
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-400 text-slate-950 font-extrabold font-mono">
                            {totalUserUnreadMessages}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsSupportModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center space-x-2 transition-colors cursor-pointer"
                      >
                        <LifeBuoy className="w-4 h-4 text-amber-500" />
                        <span>Help & Support Desk</span>
                      </button>

                      <div className="pt-1.5 px-3 flex items-center justify-between text-xs">
                        <span className="text-slate-700 font-semibold flex items-center space-x-1.5">
                          {theme === 'light' ? <Sun className="w-4 h-4 text-blue-700" /> : <Moon className="w-4 h-4 text-blue-700" />}
                          <span>Appearance</span>
                        </span>
                        <button
                          onClick={toggleTheme}
                          className="px-3 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition-colors cursor-pointer"
                        >
                          {theme === 'light' ? '☀️ White Mode' : '🌙 Dark Mode'}
                        </button>
                      </div>
                    </div>

                    {/* Switch Account Persona - ONLY FOUNDER & INVESTOR */}
                    <div className="py-2 space-y-1.5">
                      <div className="px-3 py-0.5 flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                        <span>Switch Persona Account</span>
                        <RefreshCw className="w-3 h-3 text-slate-400" />
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 px-1">
                        <button
                          onClick={() => {
                            login('founder');
                            setIsUserMenuOpen(false);
                          }}
                          className={`py-1.5 px-2 rounded-xl text-[11px] font-bold text-center transition-colors cursor-pointer ${
                            currentRole === 'founder' ? 'bg-[#101249] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          Founder
                        </button>

                        <button
                          onClick={() => {
                            login('investor');
                            setIsUserMenuOpen(false);
                          }}
                          className={`py-1.5 px-2 rounded-xl text-[11px] font-bold text-center transition-colors cursor-pointer ${
                            currentRole === 'investor' ? 'bg-[#101249] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          Investor
                        </button>
                      </div>
                    </div>

                    {/* LOGOUT BUTTON */}
                    <div className="pt-2 px-1">
                      {currentRole === 'admin' ? (
                        <button
                          id="admin-logout-button"
                          onClick={() => {
                            adminLogout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5 text-red-600" />
                          <span>Exit Admin Console</span>
                        </button>
                      ) : (
                        <button
                          id="logout-button"
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5 text-slate-600" />
                          <span>Sign Out / Log Out</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar - ONLY RENDERED WHEN AUTHENTICATED */}
      {isAuthenticated && (
        <div className="md:hidden flex items-center justify-around border-t border-slate-200 bg-white py-2 px-1 shadow-sm">
          {currentRole === 'founder' && (
            <>
              <button
                onClick={() => setCurrentView('founder_dashboard')}
                className={`flex flex-col items-center text-[10px] font-bold ${currentView === 'founder_dashboard' ? 'text-[#101249]' : 'text-slate-600'}`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>My Startup</span>
              </button>
              <button
                onClick={() => setCurrentView('directory')}
                className={`flex flex-col items-center text-[10px] font-bold ${currentView === 'directory' ? 'text-[#101249]' : 'text-slate-600'}`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>MRR Feed</span>
              </button>
              <button
                onClick={() => switchRoleQuick('investor')}
                className="flex flex-col items-center text-[10px] text-blue-700 font-bold"
              >
                <Briefcase className="w-4 h-4" />
                <span>To Investor</span>
              </button>
              <button
                onClick={() => setCurrentView('community')}
                className={`flex flex-col items-center text-[10px] font-bold ${currentView === 'community' ? 'text-[#101249]' : 'text-slate-600'}`}
              >
                <Users className="w-4 h-4" />
                <span>Community</span>
              </button>
              <button
                onClick={() => setIsChatDrawerOpen(true)}
                className="flex flex-col items-center text-[10px] text-amber-600 font-bold relative"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Messages</span>
                {totalUserUnreadMessages > 0 && (
                  <span className="absolute -top-1 right-2 w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-extrabold flex items-center justify-center font-mono">
                    {totalUserUnreadMessages}
                  </span>
                )}
              </button>
            </>
          )}

          {currentRole === 'investor' && (
            <>
              <button
                onClick={() => setCurrentView('investor_dashboard')}
                className={`flex flex-col items-center text-[10px] font-bold ${currentView === 'investor_dashboard' ? 'text-[#101249]' : 'text-slate-600'}`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Deals CRM</span>
              </button>
              <button
                onClick={() => setCurrentView('directory')}
                className={`flex flex-col items-center text-[10px] font-bold ${currentView === 'directory' ? 'text-[#101249]' : 'text-slate-600'}`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>MRR Feed</span>
              </button>
              <button
                onClick={() => switchRoleQuick('founder')}
                className="flex flex-col items-center text-[10px] text-blue-700 font-bold"
              >
                <TrendingUp className="w-4 h-4" />
                <span>To Founder</span>
              </button>
              <button
                onClick={() => setCurrentView('community')}
                className={`flex flex-col items-center text-[10px] font-bold ${currentView === 'community' ? 'text-[#101249]' : 'text-slate-600'}`}
              >
                <Users className="w-4 h-4" />
                <span>Community</span>
              </button>
              <button
                onClick={() => setIsChatDrawerOpen(true)}
                className="flex flex-col items-center text-[10px] text-amber-600 font-bold relative"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Messages</span>
                {totalUserUnreadMessages > 0 && (
                  <span className="absolute -top-1 right-2 w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-extrabold flex items-center justify-center font-mono">
                    {totalUserUnreadMessages}
                  </span>
                )}
              </button>
            </>
          )}

          {currentRole === 'admin' && isAdminAuthenticated && (
            <>
              <button
                onClick={() => setCurrentView('admin_panel')}
                className={`flex flex-col items-center text-[10px] font-bold ${currentView === 'admin_panel' ? 'text-[#101249]' : 'text-slate-600'}`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Admin</span>
              </button>
              <button
                onClick={() => setCurrentView('directory')}
                className={`flex flex-col items-center text-[10px] font-bold ${currentView === 'directory' ? 'text-[#101249]' : 'text-slate-600'}`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Directory</span>
              </button>
              <button
                onClick={() => switchRoleQuick('founder')}
                className="flex flex-col items-center text-[10px] text-blue-700 font-bold"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Founder</span>
              </button>
              <button
                onClick={() => switchRoleQuick('investor')}
                className="flex flex-col items-center text-[10px] text-blue-700 font-bold"
              >
                <Briefcase className="w-4 h-4" />
                <span>Investor</span>
              </button>
            </>
          )}

          <button
            onClick={currentRole === 'admin' ? adminLogout : logout}
            className="flex flex-col items-center text-[10px] text-slate-700 font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span>{currentRole === 'admin' ? 'Exit Admin' : 'Sign Out'}</span>
          </button>
        </div>
      )}
    </header>
  );
};
