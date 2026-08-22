import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Minimize2, 
  Maximize2, 
  ShieldCheck, 
  Lock,
  UserCheck, 
  UserMinus,
  Star,
  Sparkles, 
  Search,
  Plus,
  Check,
  CheckCheck,
  FileText,
  TrendingUp,
  Coins,
  Calendar,
  Info,
  ArrowRightLeft,
  Users,
  Compass,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DirectChatConversation, DirectChatMessage, MessageAttachment, UserRole } from '../types';

export const DirectChatDrawer: React.FC = () => {
  const {
    chatConversations,
    activeChatParticipantId,
    setActiveChatParticipantId,
    isChatDrawerOpen,
    setIsChatDrawerOpen,
    sendDirectChatMessage,
    markConversationAsRead,
    canUserReadDirectMessage,
    openChatWithUser,
    currentUser,
    setCurrentUser,
    setCurrentRole,
    isAuthenticated,
    userConnections,
    removeConnection,
    toggleFollowUser,
    followedUserIds,
    platformUsers,
    investors,
    startups,
    setCurrentView,
    showToast,
    resetChatConversationsToDefault
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [mobileChatView, setMobileChatView] = useState<'contacts' | 'chat'>('chat');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState('');
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);
  const [attachmentPickerOpen, setAttachmentPickerOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // STRICT 1-TO-1 ISOLATION:
  // Only display conversations where the currently logged-in user is one of the 2 participants!
  const userConversations = chatConversations.filter(c => {
    if (!currentUser || currentUser.role === 'guest') return false;
    return (
      Array.isArray(c.participantIds) &&
      c.participantIds.length === 2 &&
      c.participantIds.includes(currentUser.id)
    );
  });

  // Helper to dynamically resolve the OTHER participant (the counterpart)
  const getCounterpartInfo = (convo: DirectChatConversation) => {
    const currentUserId = currentUser?.id;
    const otherId = convo.participantIds?.find(id => id !== currentUserId) || 
      (convo.participantId !== currentUserId ? convo.participantId : '');

    const otherUser = platformUsers.find(u => u.id === otherId) ||
      investors.find(i => i.id === otherId) ||
      startups.find(s => s.id === otherId);

    if (otherUser) {
      return {
        id: (otherUser as any).id,
        name: (otherUser as any).name || (otherUser as any).founderName || 'Venture Member',
        avatar: (otherUser as any).avatar || (otherUser as any).logo || convo.participantAvatar,
        company: (otherUser as any).companyOrFirm || (otherUser as any).firmName || (otherUser as any).name || 'Venture Partner',
        role: (otherUser as any).role || 'founder',
        isStripeVerified: (otherUser as any).isStripeVerified || false,
        isAccredited: (otherUser as any).isAccredited || false
      };
    }

    return {
      id: convo.participantId || otherId || 'unknown',
      name: convo.participantName,
      avatar: convo.participantAvatar,
      company: convo.participantCompany,
      role: convo.participantRole,
      isStripeVerified: false,
      isAccredited: false
    };
  };

  // Find active conversation from user's isolated list
  const activeConversation = userConversations.find(
    c => (activeChatParticipantId && c.participantIds.includes(activeChatParticipantId)) || c.id === activeChatParticipantId
  ) || (userConversations.length > 0 ? userConversations[0] : null);

  const activeCounterpart = activeConversation ? getCounterpartInfo(activeConversation) : null;

  // Auto-mark conversation as read when active (Called unconditionally for React Hook consistency)
  useEffect(() => {
    if (!isAuthenticated || !currentUser || currentUser.role === 'guest') return;
    if (activeConversation && isChatDrawerOpen && !isMinimized) {
      markConversationAsRead(activeConversation.id);
    }
  }, [isAuthenticated, currentUser?.role, activeConversation?.id, activeConversation?.messages?.length, isChatDrawerOpen, isMinimized]);

  // Scroll to bottom on new messages (Called unconditionally for React Hook consistency)
  useEffect(() => {
    if (!isAuthenticated || !currentUser || currentUser.role === 'guest') return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isAuthenticated, currentUser?.role, activeConversation?.messages?.length]);

  // Calculate user-specific total unread messages
  const totalUserUnread = userConversations.reduce((acc, c) => {
    const userUnread = c.messages.filter(m => currentUser?.id && m.recipientId === currentUser.id && !m.isRead).length;
    return acc + userUnread;
  }, 0);

  // STRICT AUTHENTICATION GUARD (Render check after all hooks have executed):
  if (!isAuthenticated || !currentUser || currentUser.role === 'guest') {
    return null;
  }

  const filteredConversations = userConversations.filter(c => {
    const cp = getCounterpartInfo(c);
    return (
      cp.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      cp.company.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchFilter.toLowerCase())
    );
  });

  const handleSendMessage = (e?: React.FormEvent, customAttachments?: MessageAttachment[]) => {
    if (e) e.preventDefault();
    if ((!messageInput.trim() && (!customAttachments || customAttachments.length === 0)) || !activeConversation) return;

    sendDirectChatMessage(activeConversation.id, messageInput, customAttachments);
    setMessageInput('');
    setAttachmentPickerOpen(false);
  };

  const handleQuickEmoji = (emoji: string) => {
    if (!activeConversation) return;
    sendDirectChatMessage(activeConversation.id, emoji);
  };

  const handleAttachPreset = (type: 'mrr_snapshot' | 'term_sheet' | 'diligence_memo' | 'meeting') => {
    if (!activeConversation || !activeCounterpart) return;

    let attachment: MessageAttachment;
    let autoText = '';

    if (type === 'mrr_snapshot') {
      attachment = {
        id: `att-${Date.now()}`,
        type: 'mrr_snapshot',
        title: `${currentUser.companyOrFirm || 'FlowOps AI'} Verified MRR Snapshot`,
        subtitle: 'Live Stripe OAuth sync: $48,500 MRR (+23.4% MoM) • 0% Enterprise Churn',
        data: { mrr: 48500, growth: 23.4, churn: 0 }
      };
      autoText = 'Sharing our verified live Stripe MRR metrics for diligence review.';
    } else if (type === 'term_sheet') {
      attachment = {
        id: `att-${Date.now()}`,
        type: 'term_sheet',
        title: 'Indicative SAFE Investment Terms',
        subtitle: 'Standard YC Post-Money SAFE: $500,000 at $6.5M Valuation Cap (7.69% Equity)',
        data: { checkSize: 500000, valuationCap: 6500000, equity: 7.69 }
      };
      autoText = 'Enclosing our indicative SAFE term sheet summary for review.';
    } else if (type === 'diligence_memo') {
      attachment = {
        id: `att-${Date.now()}`,
        type: 'diligence_memo',
        title: 'Institutional Diligence Memo & Cohort Data Room',
        subtitle: 'AES-256 Diligence Room Access Token Granted • Valid for 7 Days',
        data: { roomId: 'room-diligence-984' }
      };
      autoText = 'Granted confidential access to our comprehensive diligence room.';
    } else {
      attachment = {
        id: `att-${Date.now()}`,
        type: 'link',
        title: 'Partner Diligence Call Invitation',
        subtitle: '30-Min Live Deep Dive • Zoom / Google Meet Link'
      };
      autoText = 'Would you be open to a 30-minute diligence partner call this week?';
    }

    sendDirectChatMessage(activeConversation.id, autoText, [attachment]);
    setAttachmentPickerOpen(false);
  };

  // Instant 1-Click Switch Account to Counterpart (for live testing & recipient verification)
  const handleSwitchToCounterpart = (targetId: string) => {
    const previousUserId = currentUser.id;
    const targetUser = platformUsers.find(u => u.id === targetId);
    const targetInv = investors.find(i => i.id === targetId);

    if (targetUser) {
      setCurrentRole(targetUser.role);
      setCurrentUser({
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        avatar: targetUser.avatar,
        companyOrFirm: targetUser.companyOrFirm,
        title: targetUser.title,
        subscriptionTier: targetUser.subscriptionTier,
        isAccredited: targetUser.isAccredited,
        isStripeVerified: targetUser.isStripeVerified,
        associatedStartupId: targetUser.associatedStartupId,
        hasCompletedOnboarding: true
      });
      setTimeout(() => {
        setActiveChatParticipantId(previousUserId);
      }, 50);
      showToast(`Switched account to ${targetUser.name} (${targetUser.role.toUpperCase()}) to verify recipient inbox.`);
    } else if (targetInv) {
      setCurrentRole('investor');
      setCurrentUser({
        id: targetInv.id,
        name: targetInv.name,
        email: targetInv.email || `${targetInv.name.toLowerCase().replace(/\s+/g, '.')}@horizonvc.io`,
        role: 'investor',
        avatar: targetInv.avatar,
        companyOrFirm: targetInv.firmName,
        title: targetInv.roleTitle,
        subscriptionTier: 'accredited_investor',
        isAccredited: true,
        isStripeVerified: false,
        hasCompletedOnboarding: true
      });
      setTimeout(() => {
        setActiveChatParticipantId(previousUserId);
      }, 50);
      showToast(`Switched account to ${targetInv.name} (INVESTOR) to verify recipient inbox.`);
    }
  };

  // All eligible members for starting a new 1-on-1 chat
  const eligibleNewChatUsers = platformUsers
    .filter(u => u.id !== currentUser.id && u.role !== 'guest')
    .filter(u => 
      u.name.toLowerCase().includes(newChatSearch.toLowerCase()) ||
      u.companyOrFirm.toLowerCase().includes(newChatSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(newChatSearch.toLowerCase())
    );

  // If drawer is closed, render floating button with real-time recipient unread counter
  if (!isChatDrawerOpen) {
    return (
      <button
        id="open-direct-messages-btn"
        onClick={() => setIsChatDrawerOpen(true)}
        className="fixed bottom-5 right-5 z-40 px-3.5 py-2.5 bg-[#0A1128] hover:bg-[#162038] text-white rounded-2xl shadow-2xl border border-slate-700/80 flex items-center space-x-2.5 transition-all cursor-pointer transform hover:scale-105 group"
        title="Open 1-to-1 Private Venture Messenger"
      >
        <div className="relative">
          <MessageSquare className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          {totalUserUnread > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold flex items-center justify-center font-mono animate-pulse shadow-md">
              {totalUserUnread}
            </span>
          )}
        </div>
        <span className="text-xs font-bold font-mono tracking-tight text-white">
          Messages {totalUserUnread > 0 && `(${totalUserUnread})`}
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-50 flex flex-col items-end animate-in slide-in-from-bottom-5 duration-200">
      {/* Main Messenger Container */}
      <div className={`bg-white border border-slate-300 rounded-3xl shadow-2xl overflow-hidden flex flex-col w-[94vw] sm:w-[620px] transition-all ${
        isMinimized ? 'h-14' : 'h-[580px] sm:h-[620px]'
      }`}>
        {/* Top Header Bar - Deep Navy with Gold Shield */}
        <div className="bg-[#0A1128] px-4 py-3 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-xl bg-[#162038] border border-amber-400/40 flex items-center justify-center shadow-xs">
                <Lock className="w-4 h-4 text-amber-400" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#0A1128]"></span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-xs sm:text-sm text-white font-mono truncate">1-to-1 Venture Messenger</h3>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-extrabold font-mono uppercase tracking-wider shrink-0">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-[10px] text-slate-300 truncate">
                Private recipient-locked channel for <strong className="text-amber-300">{currentUser.name}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              onClick={() => setShowSecurityInfo(!showSecurityInfo)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors cursor-pointer"
              title="View E2EE Recipient Security Certificate"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setIsChatDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Messenger"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Security Certificate Popover */}
        {showSecurityInfo && (
          <div className="bg-[#101935] text-white px-4 py-2.5 text-xs border-b border-slate-800 flex items-start justify-between space-x-2 animate-in slide-in-from-top-2">
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 text-amber-400 font-bold font-mono">
                <Lock className="w-3.5 h-3.5" />
                <span>Recipient Privacy & Access Control Active</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Messages in this 1-to-1 conversation are addressed explicitly to the sender and recipient. No other platform member or guest can decrypt or read these communications.
              </p>
            </div>
            <button 
              onClick={() => setShowSecurityInfo(false)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Messenger Body - 2 Columns (Conversation List + Active Chat) */}
        {!isMinimized && (
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 min-h-0 bg-white">
            {/* Left Sidebar: Conversations List */}
            <div className={`sm:col-span-5 border-r border-slate-200 bg-slate-50 flex-col min-h-0 ${
              mobileChatView === 'chat' ? 'hidden sm:flex' : 'flex'
            }`}>
              {/* Search contacts & New Chat Button */}
              <div className="p-2.5 border-b border-slate-200 space-y-2 bg-white">
                <div className="flex items-center space-x-1.5">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Search 1-to-1 chats..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>
                  <button
                    onClick={() => setIsNewChatModalOpen(true)}
                    className="p-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl transition-all cursor-pointer shadow-xs shrink-0"
                    title="Start New 1-to-1 Chat"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-200/60 p-1.5 space-y-1">
                {filteredConversations.map(convo => {
                  const cp = getCounterpartInfo(convo);
                  const isSelected = activeConversation?.id === convo.id;
                  const unreadForMe = convo.messages.filter(m => m.recipientId === currentUser.id && !m.isRead).length;

                  return (
                    <button
                      key={convo.id}
                      onClick={() => {
                        setActiveChatParticipantId(cp.id);
                        setMobileChatView('chat');
                      }}
                      className={`w-full text-left p-2 rounded-xl transition-all cursor-pointer flex items-start space-x-2.5 relative ${
                        isSelected
                          ? 'bg-white border-2 border-amber-400 shadow-xs'
                          : 'hover:bg-white hover:border-slate-300 border border-transparent text-slate-600'
                      }`}
                    >
                      <div className="relative shrink-0 mt-0.5">
                        <img
                          src={cp.avatar}
                          alt={cp.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white"></span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-extrabold text-xs text-[#0A1128] truncate flex items-center space-x-1">
                            <span>{cp.name}</span>
                            {cp.role === 'investor' && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-blue-100 text-blue-800 font-mono">VC</span>
                            )}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">{convo.lastMessageTime}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{cp.company}</p>
                        <p className="text-[11px] text-slate-700 truncate font-medium mt-0.5 flex items-center space-x-1">
                          <span className="truncate">{convo.lastMessage}</span>
                        </p>
                      </div>

                      {/* Unread badge for this specific user */}
                      {unreadForMe > 0 && (
                        <span className="shrink-0 mt-1 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-mono text-[10px] font-black shadow-xs">
                          {unreadForMe}
                        </span>
                      )}
                    </button>
                  );
                })}

                {filteredConversations.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-500 space-y-2">
                    <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-bold text-[#0A1128]">No private conversations yet</p>
                    <p className="text-[11px] text-slate-400">
                      Start a 1-to-1 private chat with any founder, investor, or team member.
                    </p>
                    <button
                      onClick={() => setIsNewChatModalOpen(true)}
                      className="px-3 py-1.5 bg-amber-400 text-slate-950 rounded-xl text-[11px] font-extrabold cursor-pointer hover:bg-amber-300 transition-all shadow-xs"
                    >
                      + Start 1-to-1 Chat
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Active 1-to-1 Chat Thread */}
            <div className={`sm:col-span-7 flex-col min-h-0 bg-white ${
              mobileChatView === 'contacts' ? 'hidden sm:flex' : 'flex'
            }`}>
              {activeConversation && activeCounterpart ? (
                <>
                  {/* Chat Header & Switch-to-Recipient Test Action */}
                  <div className="p-3 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between shrink-0">
                    <div className="flex items-center space-x-2 min-w-0">
                      <button
                        onClick={() => setMobileChatView('contacts')}
                        className="sm:hidden text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center space-x-0.5 shrink-0 bg-slate-200 px-2 py-1 rounded-lg"
                      >
                        <span>← Chats</span>
                      </button>
                      <div className="relative shrink-0">
                        <img
                          src={activeCounterpart.avatar}
                          alt={activeCounterpart.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white"></span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <h4 className="font-extrabold text-xs text-[#0A1128] truncate">{activeCounterpart.name}</h4>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-mono font-bold uppercase">
                            {activeCounterpart.role}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block truncate">{activeCounterpart.company}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      {/* Interactive Switch to Recipient Button for live privacy verification */}
                      <button
                        onClick={() => handleSwitchToCounterpart(activeCounterpart.id)}
                        className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-all cursor-pointer shadow-2xs group"
                        title={`Switch view to ${activeCounterpart.name} to verify recipient-only access`}
                      >
                        <ArrowRightLeft className="w-3 h-3 text-amber-700 group-hover:rotate-180 transition-transform" />
                        <span className="hidden sm:inline">View as {activeCounterpart.name.split(' ')[0]}</span>
                        <span className="sm:hidden">Switch</span>
                      </button>

                      {/* Follow / Unfollow Toggle */}
                      <button
                        onClick={() => toggleFollowUser(activeCounterpart.id)}
                        className={`p-1.5 rounded-lg border text-[11px] font-bold flex items-center space-x-1 transition-colors cursor-pointer ${
                          followedUserIds.includes(activeCounterpart.id)
                            ? 'bg-amber-50 border-amber-300 text-amber-700'
                            : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                        }`}
                        title={followedUserIds.includes(activeCounterpart.id) ? 'Following' : 'Follow'}
                      >
                        <Star className={`w-3 h-3 ${followedUserIds.includes(activeCounterpart.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Privacy Seal Notice */}
                  <div className="bg-emerald-50/70 border-b border-emerald-100 px-3 py-1.5 text-[10px] text-emerald-800 flex items-center justify-between shrink-0">
                    <div className="flex items-center space-x-1.5 truncate">
                      <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">
                        <strong>1-to-1 Recipient Encrypted:</strong> Only <strong>{currentUser.name}</strong> and <strong>{activeCounterpart.name}</strong> can read.
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-700 font-bold uppercase shrink-0">
                      AES-256
                    </span>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/40 min-h-0">
                    {activeConversation.messages.map(msg => {
                      const isMe = msg.senderId === currentUser.id;
                      const canRead = canUserReadDirectMessage(msg);

                      // STRICT PRIVACY REDACTION:
                      // If viewer is neither sender nor recipient, content is locked
                      if (!canRead) {
                        return (
                          <div key={msg.id} className="flex justify-center my-2">
                            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-xl text-[11px] flex items-center space-x-1.5 shadow-2xs">
                              <Lock className="w-3.5 h-3.5 text-red-500" />
                              <span>Restricted: Intended recipient only ({msg.recipientName || 'Member'})</span>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div className="flex items-center space-x-1 text-[10px] text-slate-400 mb-0.5">
                            <span className="font-semibold text-slate-500">{msg.senderName}</span>
                            <span>•</span>
                            <span>{msg.timestamp}</span>
                            {msg.isEncrypted && (
                              <Lock className="w-2.5 h-2.5 text-amber-500" title="Recipient Sealed" />
                            )}
                          </div>

                          {/* Message Bubble */}
                          <div
                            className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                              isMe
                                ? 'bg-[#0A1128] text-white rounded-br-none'
                                : 'bg-white text-slate-900 rounded-bl-none border border-slate-200'
                            }`}
                          >
                            <p className="whitespace-pre-line">{msg.text}</p>

                            {/* Attachments (if any) */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="mt-2 space-y-1.5 pt-2 border-t border-white/10">
                                {msg.attachments.map(att => (
                                  <div 
                                    key={att.id}
                                    className={`p-2 rounded-xl text-left flex items-start space-x-2 ${
                                      isMe ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-800 border border-slate-200'
                                    }`}
                                  >
                                    <div className="p-1 rounded-lg bg-amber-400/20 text-amber-400 shrink-0 mt-0.5">
                                      {att.type === 'mrr_snapshot' && <TrendingUp className="w-3.5 h-3.5 text-amber-400" />}
                                      {att.type === 'term_sheet' && <Coins className="w-3.5 h-3.5 text-amber-400" />}
                                      {att.type === 'diligence_memo' && <FileText className="w-3.5 h-3.5 text-amber-400" />}
                                      {att.type === 'link' && <Calendar className="w-3.5 h-3.5 text-amber-400" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <h5 className="font-bold text-[11px] truncate">{att.title}</h5>
                                      {att.subtitle && (
                                        <p className="text-[10px] opacity-80 truncate">{att.subtitle}</p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Delivery & Read Receipts (Sent by Me) */}
                            {isMe && (
                              <div className="flex items-center justify-end space-x-1 mt-1 text-[9px] text-slate-300 font-mono">
                                {msg.isRead ? (
                                  <span className="flex items-center space-x-0.5 text-sky-400 font-bold" title={`Read by ${msg.recipientName || 'recipient'}`}>
                                    <CheckCheck className="w-3 h-3 text-sky-400" />
                                    <span>Read {msg.readAt || ''}</span>
                                  </span>
                                ) : (
                                  <span className="flex items-center space-x-0.5 text-slate-400" title="Delivered to recipient inbox">
                                    <Check className="w-3 h-3 text-slate-400" />
                                    <span>Delivered</span>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Attachment Preset Picker Drawer */}
                  {attachmentPickerOpen && (
                    <div className="p-2.5 bg-slate-50 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs animate-in slide-in-from-bottom-2">
                      <button
                        type="button"
                        onClick={() => handleAttachPreset('mrr_snapshot')}
                        className="p-2 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-left flex items-center space-x-2 transition-all cursor-pointer"
                      >
                        <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div className="min-w-0">
                          <span className="font-bold text-[#0A1128] block truncate">MRR Snapshot</span>
                          <span className="text-[10px] text-slate-500 block truncate">Live Stripe sync</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAttachPreset('term_sheet')}
                        className="p-2 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-left flex items-center space-x-2 transition-all cursor-pointer"
                      >
                        <Coins className="w-4 h-4 text-amber-500 shrink-0" />
                        <div className="min-w-0">
                          <span className="font-bold text-[#0A1128] block truncate">SAFE Term Sheet</span>
                          <span className="text-[10px] text-slate-500 block truncate">Indicative terms</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAttachPreset('diligence_memo')}
                        className="p-2 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-left flex items-center space-x-2 transition-all cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <div className="min-w-0">
                          <span className="font-bold text-[#0A1128] block truncate">Diligence Room</span>
                          <span className="text-[10px] text-slate-500 block truncate">AES-256 room pass</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAttachPreset('meeting')}
                        className="p-2 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-left flex items-center space-x-2 transition-all cursor-pointer"
                      >
                        <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
                        <div className="min-w-0">
                          <span className="font-bold text-[#0A1128] block truncate">Schedule Call</span>
                          <span className="text-[10px] text-slate-500 block truncate">30-min deep dive</span>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Quick Reactions & Attachments Trigger */}
                  <div className="px-3 pt-2 flex items-center justify-between text-xs border-t border-slate-100 bg-white">
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setAttachmentPickerOpen(!attachmentPickerOpen)}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-colors cursor-pointer ${
                          attachmentPickerOpen ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Plus className="w-3 h-3" />
                        <span>Attach Deal Info</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-1">
                      {['🤝', '🚀', '📈', '💡', '🔥'].map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleQuickEmoji(emoji)}
                          className="p-1 hover:bg-slate-100 rounded-lg text-sm transition-transform hover:scale-125 cursor-pointer"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Input Box */}
                  <form onSubmit={handleSendMessage} className="p-2.5 bg-white flex items-center space-x-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder={`Send private message to ${activeCounterpart.name}...`}
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                    <button
                      type="submit"
                      disabled={!messageInput.trim()}
                      className="p-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 rounded-xl transition-colors cursor-pointer shadow-xs shrink-0"
                      title="Send 1-to-1 Message"
                    >
                      <Send className="w-4 h-4 text-slate-950" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-xs text-slate-400 space-y-3">
                  <Compass className="w-10 h-10 text-slate-300" />
                  <p className="font-bold text-[#0A1128]">No active 1-to-1 chat selected</p>
                  <p className="text-slate-400 max-w-xs">
                    Choose a conversation on the left, or start a new private 1-to-1 conversation with any member.
                  </p>
                  <button
                    onClick={() => setIsNewChatModalOpen(true)}
                    className="px-3.5 py-2 bg-amber-400 text-slate-950 rounded-xl text-xs font-bold cursor-pointer hover:bg-amber-300 transition-all shadow-xs"
                  >
                    + New 1-to-1 Chat
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* New 1-to-1 Chat Modal */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-[#0A1128] p-4 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm font-mono">Start 1-to-1 Private Chat</h3>
              </div>
              <button
                onClick={() => setIsNewChatModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={newChatSearch}
                  onChange={(e) => setNewChatSearch(e.target.value)}
                  placeholder="Search founders, investors, partners..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500 font-medium"
                  autoFocus
                />
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1 divide-y divide-slate-100">
                {eligibleNewChatUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => {
                      openChatWithUser({
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar,
                        role: user.role,
                        company: user.companyOrFirm
                      });
                      setIsNewChatModalOpen(false);
                    }}
                    className="w-full p-2.5 hover:bg-amber-50/50 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-xs text-[#0A1128] truncate">{user.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                            user.role === 'investor' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{user.companyOrFirm} • {user.title}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-amber-600 group-hover:translate-x-0.5 transition-transform">
                      Chat →
                    </span>
                  </button>
                ))}

                {eligibleNewChatUsers.length === 0 && (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No matching members found.
                  </div>
                )}
              </div>

              {/* Reset Test Storage Option */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Need to reset demo chat threads?</span>
                <button
                  type="button"
                  onClick={() => {
                    resetChatConversationsToDefault();
                    setIsNewChatModalOpen(false);
                  }}
                  className="px-2 py-1 text-[10px] font-bold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors cursor-pointer"
                >
                  Reset Chats to Seed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
