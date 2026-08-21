import React, { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Minimize2, 
  Maximize2, 
  ShieldCheck, 
  UserCheck, 
  UserMinus,
  UserX,
  Star,
  Sparkles, 
  Circle, 
  Search,
  ExternalLink,
  ChevronRight,
  Users,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DirectChatConversation, UserRole } from '../types';

export const DirectChatDrawer: React.FC = () => {
  const {
    chatConversations,
    activeChatParticipantId,
    setActiveChatParticipantId,
    isChatDrawerOpen,
    setIsChatDrawerOpen,
    sendDirectChatMessage,
    currentUser,
    userConnections,
    removeConnection,
    toggleFollowUser,
    followedUserIds,
    platformUsers,
    investors,
    startups,
    setCurrentView
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [mobileChatView, setMobileChatView] = useState<'contacts' | 'chat'>('chat');

  // STRICT SINGLE-USER ISOLATION:
  // Only display conversations where the currently logged-in user is a verified participant!
  const userConversations = chatConversations.filter(c => {
    if (!currentUser) return false;
    if (c.participantIds && c.participantIds.length > 0) {
      return c.participantIds.includes(currentUser.id);
    }
    // Legacy fallback: check if participant matches currentUser or messages contain currentUser
    if (c.participantId === currentUser.id) return true;
    if (c.messages && c.messages.some(m => m.senderId === currentUser.id)) return true;
    return false;
  });

  // Helper to dynamically resolve the OTHER participant (the counterpart)
  const getCounterpartInfo = (convo: DirectChatConversation) => {
    if (convo.participantId !== currentUser.id) {
      return {
        id: convo.participantId,
        name: convo.participantName,
        avatar: convo.participantAvatar,
        company: convo.participantCompany,
        role: convo.participantRole
      };
    }

    const otherId = convo.participantIds?.find(id => id !== currentUser.id) || 
      convo.messages.find(m => m.senderId !== currentUser.id)?.senderId;

    const otherUser = platformUsers.find(u => u.id === otherId) ||
      investors.find(i => i.id === otherId) ||
      startups.find(s => s.id === otherId);

    if (otherUser) {
      return {
        id: (otherUser as any).id,
        name: (otherUser as any).name || (otherUser as any).founderName || 'Venture Member',
        avatar: (otherUser as any).avatar || (otherUser as any).logo || convo.participantAvatar,
        company: (otherUser as any).companyOrFirm || (otherUser as any).firmName || (otherUser as any).name || 'Venture Partner',
        role: (otherUser as any).role || 'founder'
      };
    }

    return {
      id: convo.participantId,
      name: convo.participantName,
      avatar: convo.participantAvatar,
      company: convo.participantCompany,
      role: convo.participantRole
    };
  };

  // Find active conversation from user's isolated list
  const activeConversation = userConversations.find(
    c => c.participantId === activeChatParticipantId || c.id === activeChatParticipantId || c.participantIds?.includes(activeChatParticipantId || '')
  ) || userConversations[0] || null;

  const totalUnread = userConversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const filteredConversations = userConversations.filter(c => {
    const cp = getCounterpartInfo(c);
    return (
      cp.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      cp.company.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchFilter.toLowerCase())
    );
  });

  const activeCounterpart = activeConversation ? getCounterpartInfo(activeConversation) : null;

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !activeConversation) return;

    sendDirectChatMessage(activeConversation.id, messageInput);
    setMessageInput('');
  };

  const handleQuickEmoji = (emoji: string) => {
    if (!activeConversation) return;
    sendDirectChatMessage(activeConversation.id, emoji);
  };

  // If drawer is closed, render refined floating chat button
  if (!isChatDrawerOpen) {
    return (
      <button
        onClick={() => setIsChatDrawerOpen(true)}
        className="fixed bottom-5 right-5 z-40 px-3.5 py-2.5 bg-[#0A1128] hover:bg-[#162038] text-white rounded-2xl shadow-xl border border-slate-700 flex items-center space-x-2 transition-all cursor-pointer transform hover:scale-105 group"
        title="Open Direct Messages & Network Chat"
      >
        <div className="relative">
          <MessageSquare className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          {totalUnread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold flex items-center justify-center font-mono animate-pulse">
              {totalUnread}
            </span>
          )}
        </div>
        <span className="text-xs font-bold font-mono tracking-tight text-white">
          Messages {totalUnread > 0 && `(${totalUnread})`}
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-50 flex flex-col items-end animate-in slide-in-from-bottom-5 duration-200">
      {/* Main Messenger Container */}
      <div className={`bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col w-[92vw] sm:w-[580px] transition-all ${
        isMinimized ? 'h-14' : 'h-[540px] sm:h-[580px]'
      }`}>
        {/* Top Header Bar - Deep Navy */}
        <div className="bg-[#0A1128] px-4 py-3 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-[#162038] border border-amber-400/40 flex items-center justify-center shadow-xs">
                <MessageSquare className="w-4 h-4 text-amber-400" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#0A1128]"></span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-xs sm:text-sm text-white font-mono">1-on-1 Venture Messenger</h3>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-extrabold font-mono uppercase">
                  {currentUser.role} INBOX
                </span>
              </div>
              <p className="text-[10px] text-slate-300">
                End-to-end encrypted personal messages for {currentUser.name}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setIsChatDrawerOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Messenger"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messenger Body - 2 Columns (Conversation List + Active Chat) */}
        {!isMinimized && (
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 min-h-0 bg-white">
            {/* Left Sidebar: Conversations List */}
            <div className={`sm:col-span-5 border-r border-slate-200 bg-slate-50 flex-col min-h-0 ${
              mobileChatView === 'chat' ? 'hidden sm:flex' : 'flex'
            }`}>
              {/* Search contacts */}
              <div className="p-2.5 border-b border-slate-200">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search personal chats..."
                    className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-200/60 p-1.5 space-y-1">
                {filteredConversations.map(convo => {
                  const cp = getCounterpartInfo(convo);
                  const isSelected = activeConversation?.id === convo.id;
                  return (
                    <button
                      key={convo.id}
                      onClick={() => {
                        setActiveChatParticipantId(cp.id);
                        setMobileChatView('chat');
                      }}
                      className={`w-full text-left p-2 rounded-xl transition-all cursor-pointer flex items-start space-x-2.5 ${
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
                          <span className="font-extrabold text-xs text-[#0A1128] truncate">{cp.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{convo.lastMessageTime}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{cp.company}</p>
                        <p className="text-[11px] text-slate-600 truncate font-medium mt-0.5">{convo.lastMessage}</p>
                      </div>
                    </button>
                  );
                })}

                {filteredConversations.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-500 space-y-2">
                    <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-bold text-[#0A1128]">No personal conversations yet</p>
                    <p className="text-[11px] text-slate-400">
                      Connect with founders or investors in the Venture Feed or Directory to start 1-on-1 chatting.
                    </p>
                    <button
                      onClick={() => {
                        setIsChatDrawerOpen(false);
                        setCurrentView('community');
                      }}
                      className="px-3 py-1.5 bg-amber-400 text-slate-950 rounded-xl text-[11px] font-extrabold cursor-pointer hover:bg-amber-300 transition-all shadow-xs"
                    >
                      Explore Venture Feed
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Active Chat Thread */}
            <div className={`sm:col-span-7 flex-col min-h-0 bg-white ${
              mobileChatView === 'contacts' ? 'hidden sm:flex' : 'flex'
            }`}>
              {activeConversation && activeCounterpart ? (
                <>
                  {/* Chat Contact Header */}
                  <div className="p-3 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
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
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200"
                        />
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white"></span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <h4 className="font-extrabold text-xs text-[#0A1128] truncate">{activeCounterpart.name}</h4>
                        </div>
                        <span className="text-[10px] text-slate-500 block truncate">{activeCounterpart.company}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      {/* Follow / Unfollow Toggle */}
                      <button
                        onClick={() => toggleFollowUser(activeCounterpart.id)}
                        className={`p-1.5 rounded-lg border text-[11px] font-bold flex items-center space-x-1 transition-colors cursor-pointer ${
                          followedUserIds.includes(activeCounterpart.id)
                            ? 'bg-amber-50 border-amber-300 text-amber-700'
                            : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                        }`}
                        title={followedUserIds.includes(activeCounterpart.id) ? 'Following user (Click to Unfollow)' : 'Follow user'}
                      >
                        <Star className={`w-3 h-3 ${followedUserIds.includes(activeCounterpart.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
                        <span className="hidden sm:inline text-[10px]">
                          {followedUserIds.includes(activeCounterpart.id) ? 'Following' : 'Follow'}
                        </span>
                      </button>

                      {/* Disconnect / Remove Connection */}
                      {userConnections.some(c => c.targetUserId === activeCounterpart.id) && (
                        <button
                          onClick={() => removeConnection(activeCounterpart.id)}
                          className="p-1.5 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 text-slate-500 hover:text-red-600 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-colors cursor-pointer shadow-2xs"
                          title="Disconnect / Remove Connection"
                        >
                          <UserMinus className="w-3 h-3" />
                          <span className="hidden sm:inline">Disconnect</span>
                        </button>
                      )}

                      <span className="text-[9px] text-emerald-600 font-bold font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 hidden sm:inline">
                        ● Active
                      </span>
                    </div>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 bg-slate-50/40">
                    <div className="text-center my-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-mono font-medium">
                        Personal 1-on-1 Chat • End-to-End Encrypted
                      </span>
                    </div>

                    {activeConversation.messages.map(msg => {
                      const isMe = msg.senderId === currentUser.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div className="flex items-center space-x-1 text-[10px] text-slate-400 mb-0.5">
                            <span>{msg.senderName}</span>
                            <span>•</span>
                            <span>{msg.timestamp}</span>
                          </div>
                          <div
                            className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed shadow-xs ${
                              isMe
                                ? 'bg-[#0A1128] text-white rounded-br-none'
                                : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick Reactions */}
                  <div className="px-3 pt-2 flex items-center space-x-1.5 text-xs border-t border-slate-100 bg-white">
                    <span className="text-[10px] text-slate-400 font-bold">Quick:</span>
                    {['🚀', '🤝', '📈', '💡', '🔥'].map(emoji => (
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

                  {/* Message Input Box */}
                  <form onSubmit={handleSendMessage} className="p-2.5 bg-white flex items-center space-x-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message or share terms..."
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl transition-colors cursor-pointer shadow-xs"
                      title="Send Message"
                    >
                      <Send className="w-4 h-4 text-slate-950" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-xs text-slate-400 space-y-3">
                  <Compass className="w-10 h-10 text-slate-300" />
                  <p className="font-bold text-[#0A1128]">No active conversation selected</p>
                  <p className="text-slate-400 max-w-xs">
                    Choose a conversation on the left, or connect with a founder or investor in the Venture Feed to start chatting.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
