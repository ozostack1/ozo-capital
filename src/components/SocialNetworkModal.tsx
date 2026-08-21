import React, { useState } from 'react';
import { 
  X, 
  Users, 
  UserCheck, 
  UserPlus, 
  UserMinus, 
  Star, 
  MessageCircle, 
  Search, 
  ShieldCheck, 
  Building2, 
  ArrowRight,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole, PlatformUser, UserConnection } from '../types';

export const SocialNetworkModal: React.FC = () => {
  const { 
    isSocialNetworkModalOpen, 
    selectedNetworkModalUserId, 
    networkModalActiveTab, 
    closeSocialNetworkModal,
    currentUser,
    userConnections,
    userFollows,
    platformUsers,
    investors,
    startups,
    getUserProfile,
    openSocialProfileModal,
    openChatWithUser,
    sendConnectionRequest,
    removeConnection,
    toggleFollowUser,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'connections' | 'followers' | 'following'>(networkModalActiveTab);
  const [searchQuery, setSearchQuery] = useState('');

  // Keep internal tab in sync when opened with a specific tab
  React.useEffect(() => {
    setActiveTab(networkModalActiveTab);
  }, [networkModalActiveTab, isSocialNetworkModalOpen]);

  if (!isSocialNetworkModalOpen || !selectedNetworkModalUserId) return null;

  const targetUser = getUserProfile(selectedNetworkModalUserId) || currentUser;
  const isSelf = targetUser.id === currentUser.id;

  // 1. Resolve Connections
  const connections = userConnections
    .filter(c => (c.userId === targetUser.id || c.targetUserId === targetUser.id) && c.status === 'connected')
    .map(c => {
      const otherId = c.userId === targetUser.id ? c.targetUserId : c.userId;
      return getUserProfile(otherId) || {
        id: otherId,
        name: c.targetUserName,
        avatar: c.targetUserAvatar,
        role: c.targetUserRole,
        companyOrFirm: c.targetUserCompany,
        title: c.targetUserRole === 'founder' ? 'Founder & CEO' : 'Accredited Investor',
        subscriptionTier: 'free' as const,
        isAccredited: c.targetUserRole === 'investor',
        isStripeVerified: c.targetUserRole === 'founder',
        status: 'active' as const,
        joinedAt: '2026-01-01'
      };
    });

  // 2. Resolve Followers (people following targetUser)
  const followerUserIds = userFollows
    .filter(f => f.followingId === targetUser.id)
    .map(f => f.followerId);

  const followers = followerUserIds
    .map(id => getUserProfile(id))
    .filter((u): u is PlatformUser => u !== null);

  // 3. Resolve Following (people targetUser follows)
  const followingUserIds = userFollows
    .filter(f => f.followerId === targetUser.id)
    .map(f => f.followingId);

  const following = followingUserIds
    .map(id => getUserProfile(id))
    .filter((u): u is PlatformUser => u !== null);

  // Filter current list based on search
  const filterList = (list: PlatformUser[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(u => 
      u.name.toLowerCase().includes(q) || 
      u.companyOrFirm.toLowerCase().includes(q) ||
      u.title.toLowerCase().includes(q)
    );
  };

  const currentDisplayList = 
    activeTab === 'connections' ? filterList(connections) :
    activeTab === 'followers' ? filterList(followers) :
    filterList(following);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        id="social-network-modal"
        className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] my-auto text-[#0A1128]"
      >
        {/* Header */}
        <div className="bg-[#0A1128] px-6 py-5 border-b border-slate-800 text-white relative">
          <button
            onClick={closeSocialNetworkModal}
            className="absolute top-4 right-4 text-slate-300 hover:text-white bg-[#162038] hover:bg-slate-700 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white font-mono">
                {isSelf ? 'My Professional Network' : `${targetUser.name}'s Network`}
              </h3>
              <p className="text-xs text-slate-300">
                Inspect active connections, followers, and mutual network reach.
              </p>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="flex items-center space-x-2 mt-5 pt-3 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('connections')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'connections'
                  ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#162038]'
              }`}
            >
              <span>Connections</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activeTab === 'connections' ? 'bg-slate-950 text-amber-400 font-bold' : 'bg-slate-800 text-slate-300'}`}>
                {connections.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('followers')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'followers'
                  ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#162038]'
              }`}
            >
              <span>Followers</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activeTab === 'followers' ? 'bg-slate-950 text-amber-400 font-bold' : 'bg-slate-800 text-slate-300'}`}>
                {followers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('following')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'following'
                  ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#162038]'
              }`}
            >
              <span>Following</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activeTab === 'following' ? 'bg-slate-950 text-amber-400 font-bold' : 'bg-slate-800 text-slate-300'}`}>
                {following.length}
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 sm:px-6 bg-slate-50 border-b border-slate-200">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#0A1128] focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* List Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 divide-y divide-slate-100 space-y-3">
          {currentDisplayList.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500 space-y-1">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-700">No {activeTab} found</p>
              <p className="text-slate-400 text-[11px]">
                {searchQuery ? 'Try adjusting your search term.' : `No members in this list yet.`}
              </p>
            </div>
          ) : (
            currentDisplayList.map((user) => {
              const isUserSelf = user.id === currentUser.id;
              const isConn = userConnections.some(
                c => (c.targetUserId === user.id || c.userId === user.id) && c.status === 'connected'
              );
              const isFoll = userFollows.some(
                f => f.followerId === currentUser.id && f.followingId === user.id
              );

              return (
                <div key={user.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  {/* User info */}
                  <div 
                    onClick={() => {
                      closeSocialNetworkModal();
                      openSocialProfileModal(user.id);
                    }}
                    className="flex items-center space-x-3 cursor-pointer group min-w-0 flex-1"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 group-hover:ring-2 group-hover:ring-amber-400 transition-all"
                      />
                      {user.role === 'founder' && user.isStripeVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-0.5 rounded-full shadow-xs">
                          <ShieldCheck className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-xs text-[#0A1128] group-hover:text-amber-600 transition-colors truncate">
                          {user.name}
                        </span>
                        <span className={`text-[9px] font-bold font-mono px-1.5 py-0.2 rounded ${
                          user.role === 'founder' ? 'bg-amber-100 text-amber-900' :
                          user.role === 'investor' ? 'bg-blue-100 text-blue-900' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {user.role === 'founder' ? 'Founder' : user.role === 'investor' ? 'Investor' : 'Admin'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {user.title} at <strong className="text-slate-700">{user.companyOrFirm}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  {!isUserSelf && (
                    <div className="flex items-center space-x-2 shrink-0">
                      {/* Follow toggle */}
                      <button
                        onClick={() => toggleFollowUser(user.id)}
                        className={`p-2 rounded-xl text-xs transition-all cursor-pointer ${
                          isFoll
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                        title={isFoll ? 'Unfollow' : 'Follow'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFoll ? 'fill-amber-500 text-amber-500' : ''}`} />
                      </button>

                      {/* Connect / Disconnect */}
                      {isConn ? (
                        <button
                          onClick={() => removeConnection(user.id)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-red-100 hover:text-red-700 text-slate-700 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                        >
                          Connected
                        </button>
                      ) : (
                        <button
                          onClick={() => sendConnectionRequest({
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar,
                            role: user.role,
                            company: user.companyOrFirm
                          })}
                          className="px-2.5 py-1.5 bg-[#0A1128] hover:bg-[#162038] text-white rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                        >
                          + Connect
                        </button>
                      )}

                      {/* Message */}
                      <button
                        onClick={() => {
                          closeSocialNetworkModal();
                          openChatWithUser({
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar,
                            role: user.role,
                            company: user.companyOrFirm
                          });
                        }}
                        className="p-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                        title="Send Direct Message"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
