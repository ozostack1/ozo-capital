import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Startup, 
  Investor, 
  PitchRequest, 
  DealPipelineItem, 
  CommunityPost, 
  VerificationRequest, 
  UserRole, 
  ThemeMode,
  AppView,
  SubscriptionTier,
  DealStage,
  PitchMessage,
  CurrentUserProfile,
  FounderOnboardingData,
  InvestorCredentialDocument,
  InvestorPitchPreferences,
  UserConnection,
  UserFollow,
  InvestorInterest,
  DirectChatMessage,
  DirectChatConversation,
  MessageAttachment,
  FeedCategory,
  PlatformUser,
  SupportTicket,
  AuditLogEntry,
  SubscriptionPlan,
  SubscriberRecord
} from '../types';
import { 
  INITIAL_STARTUPS, 
  INITIAL_INVESTORS, 
  INITIAL_PITCH_REQUESTS, 
  INITIAL_DEAL_PIPELINE, 
  INITIAL_COMMUNITY_POSTS, 
  INITIAL_VERIFICATION_REQUESTS,
  INITIAL_USER_CONNECTIONS,
  INITIAL_USER_FOLLOWS,
  INITIAL_INVESTOR_INTERESTS,
  INITIAL_DIRECT_CHAT_CONVERSATIONS,
  INITIAL_PLATFORM_USERS,
  SUBSCRIPTION_PLANS,
  INITIAL_SUBSCRIBERS
} from '../data/mockData';

export type { CurrentUserProfile };

interface AppContextType {
  // User & Auth State
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: CurrentUserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUserProfile>>;
  switchRoleQuick: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (role: UserRole, customData?: Partial<CurrentUserProfile>) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalOptions: { mode: 'login' | 'signup'; role: UserRole };
  openAuthModal: (modeOrOptions?: 'login' | 'signup' | { mode?: 'login' | 'signup'; role?: UserRole }, role?: UserRole) => void;

  // Founder Onboarding
  isOnboardingModalOpen: boolean;
  setIsOnboardingModalOpen: (open: boolean) => void;
  openOnboardingModal: () => void;
  completeFounderOnboarding: (data: FounderOnboardingData) => void;
  
  // Data Collections
  startups: Startup[];
  investors: Investor[];
  pitchRequests: PitchRequest[];
  dealPipeline: DealPipelineItem[];
  communityPosts: CommunityPost[];
  verificationQueue: VerificationRequest[];
  platformUsers: PlatformUser[];
  
  // Actions - Startups
  addStartup: (startup: Omit<Startup, 'id' | 'createdAt' | 'viewsCount' | 'savesCount' | 'diligenceRequestsCount'>) => void;
  updateStartup: (startupId: string, updates: Partial<Startup>) => void;
  deleteStartup: (startupId: string) => void;
  toggleFeatureStartup: (startupId: string) => void;
  toggleVerifyStartup: (startupId: string) => void;
  requestMRRVerification: (startupId: string, proofType: VerificationRequest['proofType'], proofDetails: string) => void;
  toggleSaveStartup: (startupId: string) => void;
  savedStartupIds: string[];
  
  // Actions - Pitches & Messaging
  createPitch: (investorId: string, startupId: string, checkAmount: number, valuation: number, deckUrl: string, note: string) => void;
  sendPitch: (investorId: string, startupId: string, checkAmount: number, valuation: number, deckUrl: string, note: string) => void;
  sendPitchToInvestor: (investorId: string, startupId: string, checkAmount: number, valuation: number, deckUrl: string, note: string) => void;
  sendPitchMessage: (pitchId: string, text: string) => void;
  updatePitchStatus: (pitchId: string, status: PitchRequest['status']) => void;

  // Actions - Investor Profile & KYC
  updateInvestor: (investorId: string, updates: Partial<Investor>) => void;
  toggleInvestorAcceptingPitches: (investorId: string) => void;
  addInvestorCredentialDocument: (investorId: string, doc: Omit<InvestorCredentialDocument, 'id' | 'uploadedAt'>) => void;
  deleteInvestorCredentialDocument: (investorId: string, docId: string) => void;
  
  // Actions - Deal CRM Pipeline
  addDealToPipeline: (startupId: string, stage?: DealStage, targetCheck?: number, notes?: string) => void;
  updateDealStage: (dealId: string, newStage: DealStage) => void;
  removeDealFromPipeline: (dealId: string) => void;
  
  // Actions - Feed & Community
  createCommunityPost: (title: string, content: string, category: FeedCategory, mrrMilestone?: number, taggedStartupId?: string, tags?: string[], fundingAmount?: number) => void;
  likeCommunityPost: (postId: string) => void;
  addCommunityComment: (postId: string, content: string) => void;
  shareCommunityPost: (postId: string) => void;
  deleteCommunityPost: (postId: string) => void;
  togglePinCommunityPost: (postId: string) => void;
  deleteCommunityComment: (postId: string, commentId: string) => void;

  // Actions - Network, Followers & Social Graph
  userConnections: UserConnection[];
  userFollows: UserFollow[];
  sendConnectionRequest: (targetUser: { id: string; name: string; avatar: string; role: UserRole; company: string }) => void;
  acceptConnectionRequest: (connectionId: string) => void;
  removeConnection: (targetUserId: string) => void;
  followedUserIds: string[];
  toggleFollowUser: (userId: string) => void;
  getUserConnectionsCount: (userId: string) => number;
  getUserFollowersCount: (userId: string) => number;
  getUserFollowingCount: (userId: string) => number;
  getUserProfile: (userId: string) => PlatformUser | null;
  selectedProfileUserId: string | null;
  isSocialProfileModalOpen: boolean;
  openSocialProfileModal: (userId: string) => void;
  closeSocialProfileModal: () => void;
  selectedNetworkModalUserId: string | null;
  isSocialNetworkModalOpen: boolean;
  networkModalActiveTab: 'connections' | 'followers' | 'following';
  openSocialNetworkModal: (userId: string, initialTab?: 'connections' | 'followers' | 'following') => void;
  closeSocialNetworkModal: () => void;

  // Actions - Investor Interest & Deal Signals
  investorInterests: InvestorInterest[];
  signalInvestorInterest: (startupId: string, indicativeCheckSize?: number, note?: string, interestLevel?: 'exploring' | 'high_conviction' | 'term_sheet_ready') => void;
  removeInvestorInterest: (startupId: string) => void;
  updateInvestorInterestStatus: (interestId: string, status: InvestorInterest['status']) => void;
  getStartupInterests: (startupId: string) => InvestorInterest[];
  getFounderReceivedInterests: (founderId: string) => InvestorInterest[];
  isInvestorInterestedInStartup: (startupId: string, investorId?: string) => boolean;
  getInvestorInterestForStartup: (startupId: string, investorId?: string) => InvestorInterest | undefined;
  reachOutToInterestedInvestor: (interest: InvestorInterest, customMessage?: string) => void;

  // Actions - 1-on-1 Direct Chat & Messenger (Recipient Encrypted)
  chatConversations: DirectChatConversation[];
  activeChatParticipantId: string | null;
  setActiveChatParticipantId: (id: string | null) => void;
  isChatDrawerOpen: boolean;
  setIsChatDrawerOpen: (open: boolean) => void;
  openChatWithUser: (user: { id: string; name: string; avatar: string; role: UserRole; company?: string; initialMessage?: string }) => void;
  sendDirectChatMessage: (conversationId: string, text: string, attachments?: MessageAttachment[]) => void;
  markConversationAsRead: (conversationId: string) => void;
  canUserReadDirectMessage: (message: DirectChatMessage) => boolean;
  sendAdminDirectMessage: (targetUserIds: string[], text: string, subject?: string) => void;
  resetChatConversationsToDefault: () => void;
  
  // Actions - Admin Verification, Authentication & Platform User Control
  isAdminAuthenticated: boolean;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  openAdminLoginModal: () => void;
  adminLogin: (password: string, email?: string) => boolean;
  adminLogout: () => void;
  approveVerification: (requestId: string) => void;
  rejectVerification: (requestId: string, notes?: string) => void;
  updatePlatformUser: (userId: string, updates: Partial<PlatformUser>) => void;
  toggleUserStatus: (userId: string) => void;
  toggleUserAccredited: (userId: string) => void;
  toggleUserStripeVerified: (userId: string) => void;
  changeUserRole: (userId: string, newRole: UserRole) => void;
  deletePlatformUser: (userId: string) => void;
  updatePostModerationStatus: (postId: string, status: 'published' | 'held' | 'deleted', reason?: string) => void;
  supportTickets: SupportTicket[];
  isSupportModalOpen: boolean;
  setIsSupportModalOpen: (open: boolean) => void;
  createSupportTicket: (data: { subject: string; message: string; category?: SupportTicket['category']; priority?: SupportTicket['priority'] }) => SupportTicket;
  updateTicketStatus: (ticketId: string, status: 'open' | 'in_progress' | 'resolved', notes?: string) => void;
  replyToSupportTicket: (ticketId: string, replyMessage: string, newStatus?: SupportTicket['status']) => void;
  auditLogs: AuditLogEntry[];
  
  // Subscription Plan Builder & Subscribers Management
  subscriptionPlans: SubscriptionPlan[];
  subscribers: SubscriberRecord[];
  createSubscriptionPlan: (plan: SubscriptionPlan) => void;
  updateSubscriptionPlan: (planId: string, updates: Partial<SubscriptionPlan>) => void;
  deleteSubscriptionPlan: (planId: string) => void;
  togglePlanActive: (planId: string) => void;
  updateSubscriberStatus: (subscriberId: string, status: SubscriberRecord['status']) => void;
  updateSubscriberPlan: (subscriberId: string, newPlanId: string) => void;
  grantComplimentaryVIP: (userId: string, planId: string) => void;
  extendSubscriptionRenewal: (subscriberId: string, days: number) => void;
  cancelUserSubscription: (subscriberId: string) => void;

  // Navigation & Views
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  
  // Modals & UI States
  selectedStartup: Startup | null;
  setSelectedStartup: (startup: Startup | null) => void;
  isSubscriptionModalOpen: boolean;
  setIsSubscriptionModalOpen: (open: boolean) => void;
  targetUpgradePlan: SubscriptionTier | null;
  setTargetUpgradePlan: (plan: SubscriptionTier | null) => void;
  upgradeSubscription: (tier: SubscriptionTier) => void;
  
  // AI Deal Memo Modal
  aiModalStartup: Startup | null;
  setAiModalStartup: (startup: Startup | null) => void;
  
  // Pitch Builder Modal
  pitchModalInvestor: Investor | null;
  setPitchModalInvestor: (investor: Investor | null) => void;
  
  // Investor Profile Settings Modal
  isInvestorProfileSettingsModalOpen: boolean;
  setIsInvestorProfileSettingsModalOpen: (open: boolean) => void;
  openInvestorProfileSettingsModal: () => void;
  
  // Notification Banner
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Theme Management
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const PRESET_USERS: Record<UserRole, CurrentUserProfile> = {
  guest: {
    id: 'user-guest',
    name: 'Guest Explorer',
    email: 'visitor@trustmrr.pulse',
    role: 'guest',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    companyOrFirm: 'Independent',
    title: 'Public Explorer',
    subscriptionTier: 'free',
    isAccredited: false,
    isStripeVerified: false,
    hasCompletedOnboarding: false
  },
  founder: {
    id: 'user-alex',
    name: 'Alex Vance',
    email: 'alex@flowops.ai',
    role: 'founder',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    companyOrFirm: 'FlowOps AI',
    title: 'Founder & CEO',
    subscriptionTier: 'pro_founder',
    isAccredited: false,
    isStripeVerified: true,
    associatedStartupId: 'startup-1',
    hasCompletedOnboarding: true
  },
  investor: {
    id: 'inv-1',
    name: 'Sarah Chen',
    email: 'sarah@horizonvc.io',
    role: 'investor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    companyOrFirm: 'Horizon Venture Capital',
    title: 'General Partner',
    subscriptionTier: 'accredited_investor',
    isAccredited: true,
    isStripeVerified: false,
    hasCompletedOnboarding: true
  },
  admin: {
    id: 'user-admin',
    name: 'TrustMRR Compliance Officer',
    email: 'audit@trustmrr.pulse',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    companyOrFirm: 'TrustMRR Trust & Safety',
    title: 'Director of Verification',
    subscriptionTier: 'institutional_vc',
    isAccredited: true,
    isStripeVerified: true,
    hasCompletedOnboarding: true
  }
};

// Canonical 1-to-1 conversation ID generator
export const get1on1ConversationId = (userA: string, userB: string) => {
  const sorted = [userA, userB].sort();
  return `chat__${sorted[0]}__${sorted[1]}`;
};

// Strict sanitization of 1-to-1 conversations to guarantee single-user isolation
function sanitize1on1Conversations(convos: any[]): DirectChatConversation[] {
  if (!Array.isArray(convos) || convos.length === 0) return INITIAL_DIRECT_CHAT_CONVERSATIONS;

  const validConvos: DirectChatConversation[] = [];

  for (const c of convos) {
    if (!c || typeof c !== 'object') continue;

    // Resolve exact two participant IDs
    let pIds: string[] = [];
    if (Array.isArray(c.participantIds) && c.participantIds.length === 2 && c.participantIds[0] !== c.participantIds[1]) {
      pIds = [c.participantIds[0], c.participantIds[1]];
    } else if (c.id === 'chat-sarah' || c.id === 'chat__inv-1__user-alex') {
      pIds = ['user-alex', 'inv-1'];
    } else if (c.id === 'chat-rohan' || c.id === 'chat__user-alex__user-rohan') {
      pIds = ['user-alex', 'user-rohan'];
    } else if (c.participantId && c.messages && c.messages.length > 0) {
      const sIds = Array.from(new Set((c.messages as any[]).map(m => m.senderId).filter(Boolean))) as string[];
      const rIds = Array.from(new Set((c.messages as any[]).map(m => m.recipientId).filter(Boolean))) as string[];
      const combined = Array.from(new Set([...sIds, ...rIds, c.participantId]));
      if (combined.length >= 2) {
        pIds = [combined[0], combined[1]];
      }
    }

    if (pIds.length !== 2) continue;

    const canonicalId = get1on1ConversationId(pIds[0], pIds[1]);

    // Sanitize messages so each message has senderId and recipientId strictly matching the 2 participants
    const cleanMessages = (Array.isArray(c.messages) ? c.messages : []).filter((m: any) => {
      if (!m || !m.senderId) return false;
      const sId = m.senderId;
      const rId = m.recipientId || (sId === pIds[0] ? pIds[1] : pIds[0]);
      return pIds.includes(sId) && pIds.includes(rId);
    }).map((m: any) => {
      const sId = m.senderId;
      const rId = m.recipientId || (sId === pIds[0] ? pIds[1] : pIds[0]);
      return {
        ...m,
        conversationId: canonicalId,
        senderId: sId,
        recipientId: rId
      };
    });

    const convoObj: DirectChatConversation = {
      ...c,
      id: canonicalId,
      participantIds: [pIds[0], pIds[1]],
      participantId: c.participantId || pIds[1],
      messages: cleanMessages
    };

    const existingIdx = validConvos.findIndex(v => v.id === canonicalId);
    if (existingIdx >= 0) {
      validConvos[existingIdx] = convoObj;
    } else {
      validConvos.push(convoObj);
    }
  }

  // Ensure default seeds exist
  for (const init of INITIAL_DIRECT_CHAT_CONVERSATIONS) {
    const initId = get1on1ConversationId(init.participantIds[0], init.participantIds[1]);
    if (!validConvos.some(v => v.id === initId)) {
      validConvos.push({ ...init, id: initId });
    }
  }

  return validConvos;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('trustmrr_current_role');
      if (saved && (saved === 'founder' || saved === 'investor' || saved === 'admin' || saved === 'guest')) {
        return saved as UserRole;
      }
    } catch {}
    return 'founder';
  });
  const [currentUser, setCurrentUser] = useState<CurrentUserProfile>(() => {
    try {
      const savedUser = localStorage.getItem('trustmrr_current_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
      const savedRole = localStorage.getItem('trustmrr_current_role') as UserRole;
      if (savedRole && PRESET_USERS[savedRole]) {
        return PRESET_USERS[savedRole];
      }
    } catch {}
    return PRESET_USERS['founder'];
  });

  // Automatically sync auth state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('trustmrr_current_role', currentRole);
      localStorage.setItem('trustmrr_current_user', JSON.stringify(currentUser));
    } catch {}
  }, [currentRole, currentUser]);
  
  // Persistent Collections
  const [startups, setStartups] = useState<Startup[]>(() => {
    const saved = localStorage.getItem('trustmrr_startups');
    return saved ? JSON.parse(saved) : INITIAL_STARTUPS;
  });

  const [investors, setInvestors] = useState<Investor[]>(() => {
    const saved = localStorage.getItem('trustmrr_investors');
    return saved ? JSON.parse(saved) : INITIAL_INVESTORS;
  });

  const [pitchRequests, setPitchRequests] = useState<PitchRequest[]>(() => {
    const saved = localStorage.getItem('trustmrr_pitches');
    return saved ? JSON.parse(saved) : INITIAL_PITCH_REQUESTS;
  });

  const [dealPipeline, setDealPipeline] = useState<DealPipelineItem[]>(() => {
    const saved = localStorage.getItem('trustmrr_pipeline');
    return saved ? JSON.parse(saved) : INITIAL_DEAL_PIPELINE;
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('trustmrr_community');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_POSTS;
  });

  const [verificationQueue, setVerificationQueue] = useState<VerificationRequest[]>(() => {
    const saved = localStorage.getItem('trustmrr_verifications');
    return saved ? JSON.parse(saved) : INITIAL_VERIFICATION_REQUESTS;
  });

  const [savedStartupIds, setSavedStartupIds] = useState<string[]>(['startup-1', 'startup-3']);

  // Network Connections, Follows & Direct Chat States
  const [userConnections, setUserConnections] = useState<UserConnection[]>(() => {
    const saved = localStorage.getItem('trustmrr_connections');
    return saved ? JSON.parse(saved) : INITIAL_USER_CONNECTIONS;
  });

  const [userFollows, setUserFollows] = useState<UserFollow[]>(() => {
    const saved = localStorage.getItem('trustmrr_user_follows');
    return saved ? JSON.parse(saved) : INITIAL_USER_FOLLOWS;
  });

  const [investorInterests, setInvestorInterests] = useState<InvestorInterest[]>(() => {
    const saved = localStorage.getItem('trustmrr_investor_interests');
    return saved ? JSON.parse(saved) : INITIAL_INVESTOR_INTERESTS;
  });

  const [followedUserIds, setFollowedUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('trustmrr_follows');
    return saved ? JSON.parse(saved) : ['inv-1', 'user-rohan'];
  });

  // Social Profile & Network Modal States
  const [selectedProfileUserId, setSelectedProfileUserId] = useState<string | null>(null);
  const [isSocialProfileModalOpen, setIsSocialProfileModalOpen] = useState<boolean>(false);
  const [selectedNetworkModalUserId, setSelectedNetworkModalUserId] = useState<string | null>(null);
  const [isSocialNetworkModalOpen, setIsSocialNetworkModalOpen] = useState<boolean>(false);
  const [networkModalActiveTab, setNetworkModalActiveTab] = useState<'connections' | 'followers' | 'following'>('connections');

  const [chatConversations, setChatConversations] = useState<DirectChatConversation[]>(() => {
    try {
      const saved = localStorage.getItem('trustmrr_chats');
      if (saved) {
        return sanitize1on1Conversations(JSON.parse(saved));
      }
      return INITIAL_DIRECT_CHAT_CONVERSATIONS;
    } catch {
      return INITIAL_DIRECT_CHAT_CONVERSATIONS;
    }
  });

  const [activeChatParticipantId, setActiveChatParticipantId] = useState<string | null>(null);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState<boolean>(false);

  // Platform Users (Admin User Directory)
  const [platformUsers, setPlatformUsers] = useState<PlatformUser[]>(() => {
    const saved = localStorage.getItem('trustmrr_users');
    return saved ? JSON.parse(saved) : INITIAL_PLATFORM_USERS;
  });

  // Admin Portal & Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('trustmrr_admin_auth') === 'true';
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Support Tickets
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('trustmrr_support_tickets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse trustmrr_support_tickets', e);
      }
    }
    return [
      {
        id: 't-101',
        userId: 'user-alex',
        userEmail: 'alex@flowops.ai',
        userName: 'Alex Vance',
        userRole: 'founder',
        subject: 'Stripe Webhook Sync Delay on Invoice #4092',
        message: 'Our latest enterprise customer annual invoice took 4 hours to reflect on the verified MRR badge.',
        status: 'in_progress',
        priority: 'high',
        category: 'stripe_verification',
        createdAt: '2026-08-21 14:30',
        assignedTo: 'Venture Desk Admin'
      },
      {
        id: 't-102',
        userId: 'inv-1',
        userEmail: 'sarah@horizonvc.io',
        userName: 'Sarah Chen',
        userRole: 'investor',
        subject: 'Request for custom due diligence memo export format',
        message: 'Can we configure the AI deal memo engine to output in standard LP committee memo format?',
        status: 'open',
        priority: 'medium',
        category: 'diligence_vault',
        createdAt: '2026-08-21 11:15'
      },
      {
        id: 't-103',
        userId: 'user-rohan',
        userEmail: 'rohan@metricscale.io',
        userName: 'Rohan Sharma',
        userRole: 'founder',
        subject: 'Pre-Seed SAFE Term Sheet Generator Template',
        message: 'Is the standard YC Post-Money SAFE template legally compatible with Indian and Singapore entities?',
        status: 'resolved',
        priority: 'low',
        category: 'general',
        createdAt: '2026-08-20 09:00',
        resolutionNotes: 'Confirmed Singapore and Delaware jurisdiction compatibility.'
      }
    ];
  });

  // Audit Trail Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'aud-1',
      adminEmail: 'compliance@trustmrr.com',
      action: 'Approved Stripe KYC Verification',
      targetType: 'verification',
      targetId: 'verif-1',
      timestamp: '2026-08-21 17:15',
      details: 'Verified $48.5k MRR for FlowOps AI with live OAuth token',
      ipAddress: '192.0.2.45'
    },
    {
      id: 'aud-2',
      adminEmail: 'compliance@trustmrr.com',
      action: 'Featured Startup on Deal Radar',
      targetType: 'startup',
      targetId: 'startup-1',
      timestamp: '2026-08-21 16:40',
      details: 'Activated Gold Deal Radar badge for FlowOps AI',
      ipAddress: '192.0.2.45'
    },
    {
      id: 'aud-3',
      adminEmail: 'compliance@trustmrr.com',
      action: 'Moderated Community Post',
      targetType: 'post',
      targetId: 'post-103',
      timestamp: '2026-08-21 15:20',
      details: 'Flagged and soft-deleted unverified promotion post (Reason: Spam)',
      ipAddress: '192.0.2.45'
    },
    {
      id: 'aud-4',
      adminEmail: 'compliance@trustmrr.com',
      action: 'Granted Accredited VC Badge',
      targetType: 'user',
      targetId: 'inv-1',
      timestamp: '2026-08-21 12:00',
      details: 'Accreditation verified for Sarah Chen (Horizon VC)',
      ipAddress: '192.0.2.45'
    }
  ]);

  // Dynamic Subscription Plans State (Persisted)
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(() => {
    try {
      const saved = localStorage.getItem('trustmrr_subscription_plans');
      return saved ? JSON.parse(saved) : SUBSCRIPTION_PLANS;
    } catch {
      return SUBSCRIPTION_PLANS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('trustmrr_subscription_plans', JSON.stringify(subscriptionPlans));
    } catch (e) {
      console.error('Failed to persist subscription plans', e);
    }
  }, [subscriptionPlans]);

  // Subscribers CRM Ledger (Persisted)
  const [subscribers, setSubscribers] = useState<SubscriberRecord[]>(() => {
    try {
      const saved = localStorage.getItem('trustmrr_subscribers');
      return saved ? JSON.parse(saved) : INITIAL_SUBSCRIBERS;
    } catch {
      return INITIAL_SUBSCRIBERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('trustmrr_subscribers', JSON.stringify(subscribers));
    } catch (e) {
      console.error('Failed to persist subscribers', e);
    }
  }, [subscribers]);

  useEffect(() => {
    try {
      localStorage.setItem('trustmrr_chats', JSON.stringify(chatConversations));
    } catch (e) {
      console.error('Failed to persist chats', e);
    }
  }, [chatConversations]);

  useEffect(() => {
    try {
      localStorage.setItem('trustmrr_support_tickets', JSON.stringify(supportTickets));
    } catch (e) {
      console.error('Failed to persist support tickets', e);
    }
  }, [supportTickets]);

  useEffect(() => {
    try {
      localStorage.setItem('trustmrr_users', JSON.stringify(platformUsers));
    } catch (e) {
      console.error('Failed to persist platform users', e);
    }
  }, [platformUsers]);

  // Modals & Auth State
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [targetUpgradePlan, setTargetUpgradePlan] = useState<SubscriptionTier | null>(null);
  const [aiModalStartup, setAiModalStartup] = useState<Startup | null>(null);
  const [pitchModalInvestor, setPitchModalInvestor] = useState<Investor | null>(null);
  const [isInvestorProfileSettingsModalOpen, setIsInvestorProfileSettingsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [authModalOptions, setAuthModalOptions] = useState<{ mode: 'login' | 'signup'; role: UserRole }>({
    mode: 'login',
    role: 'founder'
  });

  // Theme Mode (Default to 'light' for White Mode)
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('trustmrr_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('trustmrr_theme', newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('trustmrr_theme', next);
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    }
  }, [theme]);

  const isAuthenticated = currentRole !== 'guest';

  const openAuthModal = (modeOrOptions?: 'login' | 'signup' | { mode?: 'login' | 'signup'; role?: UserRole }, role?: UserRole) => {
    let mode: 'login' | 'signup' = 'login';
    let targetRole: UserRole = 'founder';

    if (typeof modeOrOptions === 'string') {
      mode = modeOrOptions;
      if (role) targetRole = role;
    } else if (modeOrOptions && typeof modeOrOptions === 'object') {
      if (modeOrOptions.mode) mode = modeOrOptions.mode;
      if (modeOrOptions.role) targetRole = modeOrOptions.role;
    }

    setAuthModalOptions({
      mode,
      role: targetRole
    });
    setIsAuthModalOpen(true);
  };

  const openOnboardingModal = () => {
    setIsOnboardingModalOpen(true);
  };

  const openInvestorProfileSettingsModal = () => {
    setIsInvestorProfileSettingsModalOpen(true);
  };

  const login = (role: UserRole, customData?: Partial<CurrentUserProfile>) => {
    const inputEmail = customData?.email?.toLowerCase().trim();
    const inputId = customData?.id;

    // Search existing directories for matches
    const matchedUser = platformUsers.find(u => 
      (inputId && u.id === inputId) || 
      (inputEmail && u.email.toLowerCase().trim() === inputEmail)
    );

    const matchedInvestor = investors.find(i => 
      (inputId && i.id === inputId) || 
      (inputEmail && i.email?.toLowerCase().trim() === inputEmail)
    );

    const matchedStartup = startups.find(s => 
      (inputId && (s.founderId === inputId || s.id === inputId)) ||
      (inputEmail && s.founderEmail?.toLowerCase().trim() === inputEmail)
    );

    const baseProfile = PRESET_USERS[role] || PRESET_USERS.founder;

    let resolvedId = customData?.id || (inputEmail ? `user-${inputEmail.replace(/[^a-zA-Z0-9]/g, '_')}` : baseProfile.id);
    let resolvedName = customData?.name || baseProfile.name;
    let resolvedEmail = customData?.email || baseProfile.email;
    let resolvedAvatar = customData?.avatar || baseProfile.avatar;
    let resolvedCompany = customData?.companyOrFirm || baseProfile.companyOrFirm;
    let resolvedTitle = customData?.title || baseProfile.title;
    let resolvedStartupId = customData?.associatedStartupId || baseProfile.associatedStartupId;

    if (matchedUser) {
      resolvedId = matchedUser.id;
      resolvedName = customData?.name || matchedUser.name;
      resolvedEmail = matchedUser.email;
      resolvedAvatar = matchedUser.avatar;
      resolvedCompany = matchedUser.companyOrFirm;
      resolvedTitle = matchedUser.title;
      resolvedStartupId = matchedUser.associatedStartupId || resolvedStartupId;
    } else if (matchedInvestor) {
      resolvedId = matchedInvestor.id;
      resolvedName = customData?.name || matchedInvestor.name;
      resolvedEmail = matchedInvestor.email || resolvedEmail;
      resolvedAvatar = matchedInvestor.avatar || resolvedAvatar;
      resolvedCompany = matchedInvestor.firmName;
      resolvedTitle = matchedInvestor.roleTitle;
    } else if (matchedStartup) {
      resolvedId = matchedStartup.founderId;
      resolvedName = customData?.name || matchedStartup.founderName;
      resolvedEmail = matchedStartup.founderEmail || resolvedEmail;
      resolvedAvatar = matchedStartup.founderAvatar || resolvedAvatar;
      resolvedCompany = matchedStartup.name;
      resolvedStartupId = matchedStartup.id;
    }

    const newProfile: CurrentUserProfile = {
      ...baseProfile,
      ...customData,
      id: resolvedId,
      name: resolvedName,
      email: resolvedEmail,
      avatar: resolvedAvatar,
      companyOrFirm: resolvedCompany,
      title: resolvedTitle,
      associatedStartupId: resolvedStartupId,
      role: role
    };

    setCurrentRole(role);
    setCurrentUser(newProfile);

    // Save session to localStorage
    try {
      localStorage.setItem('trustmrr_current_role', role);
      localStorage.setItem('trustmrr_current_user', JSON.stringify(newProfile));
    } catch {}

    // Route dynamically based on role
    if (role === 'founder') {
      setCurrentView('founder_dashboard');
      if (customData?.hasCompletedOnboarding === false || (!customData?.hasCompletedOnboarding && !newProfile.associatedStartupId)) {
        setIsOnboardingModalOpen(true);
      }
    } else if (role === 'investor') {
      setCurrentView('investor_dashboard');
    } else if (role === 'admin') {
      setCurrentView('admin_panel');
      setIsAdminAuthenticated(true);
      try {
        localStorage.setItem('trustmrr_admin_auth', 'true');
      } catch {}
    } else {
      setCurrentView('landing');
    }

    showToast(`Welcome, ${newProfile.name}! Logged in as ${role.toUpperCase()}.`);
  };

  const logout = () => {
    setCurrentRole('guest');
    setCurrentUser(PRESET_USERS.guest);
    setCurrentView('landing');
    setIsOnboardingModalOpen(false);
    try {
      localStorage.setItem('trustmrr_current_role', 'guest');
      localStorage.setItem('trustmrr_current_user', JSON.stringify(PRESET_USERS.guest));
    } catch {}
    showToast('You have been logged out. Now viewing in Guest mode.');
  };

  const completeFounderOnboarding = (data: FounderOnboardingData) => {
    setCurrentUser(prev => ({
      ...prev,
      name: data.founderName,
      email: data.founderEmail,
      title: data.founderTitle,
      avatar: data.founderAvatar,
      companyOrFirm: data.startupName,
      hasCompletedOnboarding: true,
      isStripeVerified: data.stripeConnected
    }));

    const existing = startups.find(s => s.founderId === currentUser.id || s.id === currentUser.associatedStartupId);
    if (existing) {
      updateStartup(existing.id, {
        name: data.startupName,
        tagline: data.tagline,
        category: data.category,
        stage: data.stage,
        website: data.website,
        foundedYear: data.foundedYear,
        location: data.location,
        mrr: data.mrr,
        arr: data.arr,
        growthRateMoM: data.growthRateMoM,
        churnRateMonthly: data.churnRateMonthly,
        customersCount: data.customersCount,
        askAmount: data.askAmount,
        valuation: data.valuation,
        targetRound: data.targetRound,
        isActivelyRaising: data.isActivelyRaising,
        keyMetricsHighlights: data.keyMetricsHighlights,
        isVerified: data.stripeConnected,
        verificationStatus: data.verificationStatus,
        verificationProofDate: data.verificationProofDate,
        stripeConnected: data.stripeConnected,
        founderName: data.founderName,
        founderAvatar: data.founderAvatar,
        founderBio: data.founderBio,
        founderEmail: data.founderEmail
      });
    } else {
      const newCreated = addStartup({
        name: data.startupName,
        tagline: data.tagline,
        description: data.tagline,
        category: data.category,
        logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        stage: data.stage,
        foundedYear: data.foundedYear,
        location: data.location,
        website: data.website,
        mrr: data.mrr,
        arr: data.arr,
        growthRateMoM: data.growthRateMoM,
        churnRateMonthly: data.churnRateMonthly,
        cac: 420,
        ltv: 6800,
        customersCount: data.customersCount,
        askAmount: data.askAmount,
        valuation: data.valuation,
        targetRound: data.targetRound,
        isActivelyRaising: data.isActivelyRaising,
        minTicketSize: 25000,
        useOfFunds: '45% AI Core & Engineering, 35% GTM Sales, 20% Security Audit & Operations',
        isVerified: data.stripeConnected,
        verificationStatus: data.verificationStatus,
        verificationProofDate: data.verificationProofDate,
        stripeConnected: data.stripeConnected,
        pitchDeckTitle: `${data.startupName} ${data.targetRound} Pitch Deck`,
        pitchDeckSlidesCount: 12,
        pitchSummary: data.tagline,
        keyMetricsHighlights: data.keyMetricsHighlights,
        capTable: [
          { holder: data.founderName, role: 'Founder & CEO', equityPercent: 78 },
          { holder: 'Employee Pool & Advisors', role: 'Option Pool', equityPercent: 12 },
          { holder: 'Early Backers', role: 'Pre-Seed Angels', equityPercent: 10 }
        ],
        teamSize: 4,
        founderId: currentUser.id,
        founderName: data.founderName,
        founderAvatar: data.founderAvatar,
        founderBio: data.founderBio,
        founderEmail: data.founderEmail,
        mrrHistory: [
          { month: 'Mar', mrr: Math.round(data.mrr * 0.52), arr: Math.round(data.mrr * 0.52 * 12), newCustomers: 12, churnedCustomers: 1, netRetentionRate: 114 },
          { month: 'Apr', mrr: Math.round(data.mrr * 0.64), arr: Math.round(data.mrr * 0.64 * 12), newCustomers: 16, churnedCustomers: 1, netRetentionRate: 116 },
          { month: 'May', mrr: Math.round(data.mrr * 0.76), arr: Math.round(data.mrr * 0.76 * 12), newCustomers: 21, churnedCustomers: 1, netRetentionRate: 119 },
          { month: 'Jun', mrr: Math.round(data.mrr * 0.86), arr: Math.round(data.mrr * 0.86 * 12), newCustomers: 26, churnedCustomers: 2, netRetentionRate: 121 },
          { month: 'Jul', mrr: Math.round(data.mrr * 0.94), arr: Math.round(data.mrr * 0.94 * 12), newCustomers: 29, churnedCustomers: 1, netRetentionRate: 123 },
          { month: 'Aug', mrr: data.mrr, arr: data.arr, newCustomers: 34, churnedCustomers: 1, netRetentionRate: 126 }
        ],
        tags: [data.category, data.stage, 'Stripe Verified'],
        aiDealScore: 91,
        aiValuationMultiple: '12.8x ARR',
        aiThesisSnippet: 'High-margin SaaS with authenticated Stripe subscription recurring growth and low churn metrics.'
      });
      setCurrentUser(prev => ({ ...prev, associatedStartupId: newCreated.id }));
    }

    showToast('🎉 Profile & Stripe verification completed! Your startup is live.');
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('trustmrr_startups', JSON.stringify(startups));
  }, [startups]);

  useEffect(() => {
    localStorage.setItem('trustmrr_investors', JSON.stringify(investors));
  }, [investors]);

  useEffect(() => {
    localStorage.setItem('trustmrr_pitches', JSON.stringify(pitchRequests));
  }, [pitchRequests]);

  useEffect(() => {
    localStorage.setItem('trustmrr_pipeline', JSON.stringify(dealPipeline));
  }, [dealPipeline]);

  useEffect(() => {
    localStorage.setItem('trustmrr_community', JSON.stringify(communityPosts));
  }, [communityPosts]);

  useEffect(() => {
    localStorage.setItem('trustmrr_connections', JSON.stringify(userConnections));
  }, [userConnections]);

  useEffect(() => {
    localStorage.setItem('trustmrr_follows', JSON.stringify(followedUserIds));
  }, [followedUserIds]);

  useEffect(() => {
    localStorage.setItem('trustmrr_user_follows', JSON.stringify(userFollows));
  }, [userFollows]);

  useEffect(() => {
    localStorage.setItem('trustmrr_investor_interests', JSON.stringify(investorInterests));
  }, [investorInterests]);

  useEffect(() => {
    localStorage.setItem('trustmrr_chats', JSON.stringify(chatConversations));
  }, [chatConversations]);

  useEffect(() => {
    localStorage.setItem('trustmrr_verifications', JSON.stringify(verificationQueue));
  }, [verificationQueue]);

  useEffect(() => {
    localStorage.setItem('trustmrr_users', JSON.stringify(platformUsers));
  }, [platformUsers]);

  useEffect(() => {
    localStorage.setItem('trustmrr_support_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const switchRoleQuick = (role: UserRole) => {
    if (role === 'admin' && !isAdminAuthenticated) {
      openAdminLoginModal();
      return;
    }
    setCurrentRole(role);
    setCurrentUser(PRESET_USERS[role]);
    if (role === 'founder') {
      setCurrentView('founder_dashboard');
    } else if (role === 'investor') {
      setCurrentView('investor_dashboard');
    } else if (role === 'admin') {
      setCurrentView('admin_panel');
    } else {
      setCurrentView('landing');
    }
    showToast(`Switched view to ${role.toUpperCase()} mode`);
  };

  const openAdminLoginModal = () => {
    setIsAdminLoginModalOpen(true);
  };

  const adminLogin = (password: string, email?: string): boolean => {
    if (password === 'admin123' || password === 'admin' || password === 'venture2026' || password === 'admin@123') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('trustmrr_admin_auth', 'true');
      setCurrentRole('admin');
      const adminUser: CurrentUserProfile = {
        id: 'admin-1',
        name: 'Venture Desk Admin',
        email: email || 'compliance@trustmrr.com',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        companyOrFirm: 'TrustMRR Security & Compliance',
        title: 'Chief Compliance Officer',
        subscriptionTier: 'institutional_vc',
        isAccredited: true,
        isStripeVerified: true,
        hasCompletedOnboarding: true
      };
      setCurrentUser(adminUser);
      setCurrentView('admin_panel');
      setIsAdminLoginModalOpen(false);

      // Add to audit logs
      setAuditLogs(prev => [{
        id: `aud-${Date.now()}`,
        adminEmail: email || 'compliance@trustmrr.com',
        action: 'Administrator Logged In',
        targetType: 'settings',
        targetId: 'admin-session',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        details: 'Admin portal session authenticated with password'
      }, ...prev]);

      showToast('🛡️ Welcome, Administrator. Secure Session Established.');
      return true;
    } else {
      showToast('❌ Invalid administrator credentials or access key.');
      return false;
    }
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('trustmrr_admin_auth');
    setCurrentRole('guest');
    setCurrentUser(PRESET_USERS.guest);
    setCurrentView('landing');
    showToast('🔒 Admin session terminated. Returned to public exchange.');
  };

  const updatePostModerationStatus = (postId: string, status: 'published' | 'held' | 'deleted', reason?: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          moderationStatus: status,
          deletionReason: reason !== undefined ? reason : p.deletionReason
        };
      }
      return p;
    }));

    setAuditLogs(prev => [{
      id: `aud-${Date.now()}`,
      adminEmail: currentUser.email || 'compliance@trustmrr.com',
      action: `Post Moderated: ${status.toUpperCase()}`,
      targetType: 'post',
      targetId: postId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      details: `Changed post status to ${status}${reason ? ` (Reason: ${reason})` : ''}`
    }, ...prev]);

    showToast(`Post status updated to ${status.toUpperCase()}${reason ? ` (${reason})` : ''}`);
  };

  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const createSupportTicket = (data: {
    subject: string;
    message: string;
    category?: SupportTicket['category'];
    priority?: SupportTicket['priority'];
  }): SupportTicket => {
    const newTicket: SupportTicket = {
      id: `t-${100 + supportTickets.length + 1}`,
      userId: currentUser.id,
      userEmail: currentUser.email || 'user@trustmrr.com',
      userName: currentUser.name || 'Platform Member',
      userRole: currentUser.role || 'founder',
      subject: data.subject.trim(),
      message: data.message.trim(),
      category: data.category || 'general',
      priority: data.priority || 'medium',
      status: 'open',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setSupportTickets(prev => [newTicket, ...prev]);
    showToast(`🎫 Support Ticket #${newTicket.id} created successfully! Our compliance team will respond shortly.`);
    return newTicket;
  };

  const updateTicketStatus = (ticketId: string, status: 'open' | 'in_progress' | 'resolved', notes?: string) => {
    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status,
          resolutionNotes: notes || t.resolutionNotes
        };
      }
      return t;
    }));
    showToast(`Support Ticket #${ticketId} marked as ${status.replace('_', ' ').toUpperCase()}`);
  };

  const replyToSupportTicket = (ticketId: string, replyMessage: string, newStatus?: SupportTicket['status']) => {
    const timeNow = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: newStatus || 'resolved',
          adminReply: replyMessage.trim(),
          resolutionNotes: replyMessage.trim(),
          repliedAt: timeNow
        };
      }
      return t;
    }));

    showToast(`💬 Replied to Support Ticket #${ticketId} & updated status.`);
  };

  // Add startup
  const addStartup = (data: Omit<Startup, 'id' | 'createdAt' | 'viewsCount' | 'savesCount' | 'diligenceRequestsCount'>): Startup => {
    const newStartup: Startup = {
      ...data,
      id: `startup-${Date.now()}`,
      viewsCount: 1,
      savesCount: 0,
      diligenceRequestsCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setStartups(prev => [newStartup, ...prev]);
    showToast(`Startup "${newStartup.name}" listed successfully on TrustMRR`);
    return newStartup;
  };

  const updateStartup = (id: string, updates: Partial<Startup>) => {
    setStartups(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    showToast('Startup profile & metrics updated');
  };

  const requestMRRVerification = (startupId: string, proofType: any, proofDetails: string) => {
    const startup = startups.find(s => s.id === startupId);
    if (!startup) return;

    const newRequest: VerificationRequest = {
      id: `vr-${Date.now()}`,
      startupId: startup.id,
      startupName: startup.name,
      founderName: currentUser.name,
      founderEmail: currentUser.email,
      claimedMrr: startup.mrr,
      claimedArr: startup.arr,
      growthRate: startup.growthRateMoM,
      proofType: proofType || 'Stripe API Live Sync',
      proofDetails: proofDetails || 'Live Stripe webhook token sync submitted for revenue verification.',
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    setVerificationQueue(prev => [newRequest, ...prev]);
    updateStartup(startupId, { verificationStatus: 'pending' });
    showToast('Verification audit request submitted to TrustMRR Compliance');
  };

  const toggleSaveStartup = (startupId: string) => {
    setSavedStartupIds(prev => {
      const exists = prev.includes(startupId);
      const updated = exists ? prev.filter(id => id !== startupId) : [...prev, startupId];
      // Also update count
      setStartups(sList => sList.map(s => {
        if (s.id === startupId) {
          return { ...s, savesCount: Math.max(0, s.savesCount + (exists ? -1 : 1)) };
        }
        return s;
      }));
      showToast(exists ? 'Removed from saved deals' : 'Saved to your Deal Watchlist');
      return updated;
    });
  };

  // Pitches
  const sendPitchToInvestor = (investorId: string, startupId: string, subject: string, message: string, proposedEquity: number) => {
    const investor = investors.find(i => i.id === investorId);
    const startup = startups.find(s => s.id === startupId);
    if (!investor || !startup) return;

    const newPitch: PitchRequest = {
      id: `pitch-${Date.now()}`,
      startupId: startup.id,
      startupName: startup.name,
      startupLogo: startup.logo,
      founderId: currentUser.id,
      founderName: currentUser.name,
      founderAvatar: currentUser.avatar,
      investorId: investor.id,
      investorName: investor.name,
      investorAvatar: investor.avatar,
      investorFirm: investor.firm,
      askAmount: startup.askAmount,
      proposedEquity: proposedEquity || 10,
      pitchSubject: subject || `${startup.name} Seed Round Pitch ($${(startup.mrr / 1000).toFixed(1)}k MRR)`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      deckUrl: startup.website,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderRole: 'founder',
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          text: message,
          timestamp: new Date().toISOString()
        }
      ]
    };

    setPitchRequests(prev => [newPitch, ...prev]);
    // increment investor's received count
    setInvestors(prev => prev.map(inv => inv.id === investor.id ? { ...inv, receivedPitchesCount: (inv.receivedPitchesCount || 0) + 1 } : inv));
    showToast(`Pitch sent directly to ${investor.name} (${investor.firm})`);
  };

  const sendPitch = (
    startupId: string,
    investorId: string,
    askAmount: number,
    proposedEquity: number,
    subject: string,
    message: string
  ) => {
    sendPitchToInvestor(investorId, startupId, subject, message, proposedEquity);
  };

  const updateInvestor = (investorId: string, updates: Partial<Investor>) => {
    setInvestors(prev => prev.map(inv => {
      if (inv.id === investorId) {
        const updated = { ...inv, ...updates };
        // Sync with currentUser if currently logged in as this investor
        if (currentUser.id === investorId || currentUser.role === 'investor') {
          setCurrentUser(prevUser => ({
            ...prevUser,
            name: updates.name || prevUser.name,
            companyOrFirm: updates.firm || prevUser.companyOrFirm,
            title: updates.title || prevUser.title,
            isAccredited: updates.isAccredited !== undefined ? updates.isAccredited : prevUser.isAccredited,
          }));
        }
        return updated;
      }
      return inv;
    }));
    showToast('Investor profile and preferences saved');
  };

  const addInvestorCredentialDocument = (
    investorId: string, 
    doc: Omit<InvestorCredentialDocument, 'id' | 'uploadedAt'>
  ) => {
    const newDoc: InvestorCredentialDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
      status: doc.status || 'verified'
    };

    setInvestors(prev => prev.map(inv => {
      if (inv.id === investorId) {
        const currentDocs = inv.credentialsDocuments || [];
        return {
          ...inv,
          credentialsDocuments: [newDoc, ...currentDocs],
          isAccredited: true,
          accreditationStatus: 'verified'
        };
      }
      return inv;
    }));

    showToast(`Uploaded ${newDoc.fileName} (${newDoc.documentType}) successfully!`);
  };

  const deleteInvestorCredentialDocument = (investorId: string, docId: string) => {
    setInvestors(prev => prev.map(inv => {
      if (inv.id === investorId) {
        const filteredDocs = (inv.credentialsDocuments || []).filter(d => d.id !== docId);
        return {
          ...inv,
          credentialsDocuments: filteredDocs,
          accreditationStatus: filteredDocs.length > 0 ? 'verified' : 'pending'
        };
      }
      return inv;
    }));

    showToast('Credential document removed.');
  };

  const toggleInvestorAcceptingPitches = (investorId: string) => {
    setInvestors(prev => prev.map(inv => {
      if (inv.id === investorId) {
        const nextStatus = !inv.acceptingPitches;
        showToast(nextStatus ? 'Now accepting inbound pitches from founders' : 'Inbound pitches paused');
        return { ...inv, acceptingPitches: nextStatus };
      }
      return inv;
    }));
  };

  const sendPitchMessage = (pitchId: string, text: string) => {
    const newMsg: PitchMessage = {
      id: `msg-${Date.now()}`,
      senderRole: currentUser.role === 'investor' ? 'investor' : 'founder',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text,
      timestamp: new Date().toISOString()
    };

    setPitchRequests(prev => prev.map(p => {
      if (p.id === pitchId) {
        return {
          ...p,
          messages: [...p.messages, newMsg]
        };
      }
      return p;
    }));
  };

  const updatePitchStatus = (pitchId: string, status: PitchRequest['status']) => {
    setPitchRequests(prev => prev.map(p => p.id === pitchId ? { ...p, status } : p));
    showToast(`Pitch status changed to ${status.replace('_', ' ').toUpperCase()}`);
  };

  // Pipeline CRM
  const addDealToPipeline = (startupId: string, stage: DealStage = 'Lead', targetCheck: number = 100000, notes: string = 'Added from verified directory') => {
    const exists = dealPipeline.find(d => d.startupId === startupId && d.investorId === currentUser.id);
    if (exists) {
      showToast('Deal is already in your active pipeline');
      return;
    }

    const newItem: DealPipelineItem = {
      id: `pipe-${Date.now()}`,
      startupId,
      investorId: currentUser.id,
      stage,
      notes,
      targetCheck,
      addedAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setDealPipeline(prev => [newItem, ...prev]);
    showToast('Added to Investor Deal CRM Pipeline');
  };

  const updateDealStage = (dealId: string, newStage: DealStage) => {
    setDealPipeline(prev => prev.map(d => d.id === dealId ? { ...d, stage: newStage, lastUpdated: new Date().toISOString().split('T')[0] } : d));
    showToast(`Moved deal to "${newStage}" stage`);
  };

  const removeDealFromPipeline = (dealId: string) => {
    setDealPipeline(prev => prev.filter(d => d.id !== dealId));
    showToast('Deal removed from pipeline');
  };

  // Feed & Community
  const createCommunityPost = (
    title: string, 
    content: string, 
    category: FeedCategory, 
    mrrMilestone?: number, 
    taggedStartupId?: string,
    tags?: string[],
    fundingAmount?: number
  ) => {
    const taggedStartup = startups.find(s => s.id === taggedStartupId);

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatar,
      isVerified: currentUser.isStripeVerified || currentUser.isAccredited,
      authorCompany: currentUser.companyOrFirm,
      title,
      content,
      category,
      likesCount: 1,
      likedBy: [currentUser.id],
      comments: [],
      createdAt: new Date().toISOString(),
      mrrMilestone,
      fundingAmount,
      taggedStartupId,
      taggedStartupName: taggedStartup?.name,
      tags: tags || ['#VentureFeed', `#${category.replace(/\s+/g, '')}`],
      sharesCount: 0
    };

    setCommunityPosts(prev => [newPost, ...prev]);
    showToast('🚀 Post published to Venture Feed & Community!');
  };

  const likeCommunityPost = (postId: string) => {
    setCommunityPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedBy.includes(currentUser.id);
        return {
          ...post,
          likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1,
          likedBy: isLiked ? post.likedBy.filter(id => id !== currentUser.id) : [...post.likedBy, currentUser.id]
        };
      }
      return post;
    }));
  };

  const addCommunityComment = (postId: string, content: string) => {
    const newComment = {
      id: `comm-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatar,
      authorBadge: currentUser.role === 'investor' ? 'Accredited VC' : currentUser.role === 'admin' ? 'Trust & Safety' : 'Verified Founder',
      content,
      createdAt: new Date().toISOString()
    };

    setCommunityPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));
    showToast('💬 Reply posted to discussion');
  };

  const shareCommunityPost = (postId: string) => {
    setCommunityPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          sharesCount: (post.sharesCount || 0) + 1
        };
      }
      return post;
    }));
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#feed-${postId}`).catch(() => {});
    }
    showToast('🔗 Post link copied to clipboard! Shared to network.');
  };

  // Network & Connections
  const sendConnectionRequest = (targetUser: { id: string; name: string; avatar: string; role: UserRole; company: string }) => {
    setUserConnections(prev => {
      const existing = prev.find(c => c.targetUserId === targetUser.id);
      if (existing) {
        if (existing.status === 'pending') {
          showToast(`Connection request already pending with ${targetUser.name}.`);
          return prev;
        }
        if (existing.status === 'connected') {
          showToast(`You are already connected with ${targetUser.name}!`);
          return prev;
        }
      }

      const newConn: UserConnection = {
        id: `conn-${Date.now()}`,
        userId: currentUser.id,
        targetUserId: targetUser.id,
        targetUserName: targetUser.name,
        targetUserAvatar: targetUser.avatar,
        targetUserRole: targetUser.role,
        targetUserCompany: targetUser.company,
        status: 'connected', // Instant mutual connection for seamless demo experience
        createdAt: new Date().toISOString()
      };

      showToast(`🤝 Connected with ${targetUser.name}! You can now direct chat.`);
      return [newConn, ...prev];
    });
  };

  const acceptConnectionRequest = (connectionId: string) => {
    setUserConnections(prev => prev.map(c => {
      if (c.id === connectionId) {
        showToast(`🤝 Connection accepted!`);
        return { ...c, status: 'connected' as const };
      }
      return c;
    }));
  };

  const removeConnection = (targetUserId: string) => {
    const conn = userConnections.find(c => c.targetUserId === targetUserId || c.id === targetUserId);
    const targetName = conn?.targetUserName || 'user';
    setUserConnections(prev => prev.filter(c => c.targetUserId !== targetUserId && c.id !== targetUserId));
    showToast(`🔌 Disconnected from ${targetName}.`);
  };

  const toggleFollowUser = (userId: string) => {
    const isFollowing = userFollows.some(f => f.followerId === currentUser.id && f.followingId === userId) || followedUserIds.includes(userId);
    if (isFollowing) {
      setUserFollows(prev => prev.filter(f => !(f.followerId === currentUser.id && f.followingId === userId)));
      setFollowedUserIds(prev => prev.filter(id => id !== userId));
      showToast('Unfollowed user.');
    } else {
      const newFollow: UserFollow = {
        id: `f-${Date.now()}`,
        followerId: currentUser.id,
        followingId: userId,
        createdAt: new Date().toISOString()
      };
      setUserFollows(prev => [...prev, newFollow]);
      setFollowedUserIds(prev => [...prev, userId]);
      showToast('⭐ Following user for real-time feed updates!');
    }
  };

  const getUserConnectionsCount = (userId: string) => {
    return userConnections.filter(c => (c.userId === userId || c.targetUserId === userId) && c.status === 'connected').length;
  };

  const getUserFollowersCount = (userId: string) => {
    return userFollows.filter(f => f.followingId === userId).length;
  };

  const getUserFollowingCount = (userId: string) => {
    return userFollows.filter(f => f.followerId === userId).length;
  };

  const getUserProfile = (userId: string): PlatformUser | null => {
    const foundPlatform = platformUsers.find(u => u.id === userId);
    if (foundPlatform) return foundPlatform;

    if (userId === currentUser.id) {
      return {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        avatar: currentUser.avatar,
        companyOrFirm: currentUser.companyOrFirm,
        title: currentUser.title,
        subscriptionTier: currentUser.subscriptionTier,
        isAccredited: currentUser.isAccredited,
        isStripeVerified: currentUser.isStripeVerified,
        status: 'active',
        joinedAt: '2026-01-15',
        associatedStartupId: currentUser.associatedStartupId,
        bio: currentUser.role === 'founder' 
          ? 'Building verified SaaS ventures. Focused on scalable B2B architecture, efficient customer acquisition, and high net revenue retention.' 
          : 'Active venture investor focused on Seed and Series A B2B software companies with verified Stripe unit economics.',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com'
      };
    }

    const foundInvestor = investors.find(i => i.id === userId || i.name.toLowerCase() === userId.toLowerCase());
    if (foundInvestor) {
      return {
        id: foundInvestor.id,
        name: foundInvestor.name,
        email: foundInvestor.email,
        role: 'investor',
        avatar: foundInvestor.avatar,
        companyOrFirm: foundInvestor.firm,
        title: foundInvestor.title,
        subscriptionTier: foundInvestor.subscriptionTier,
        isAccredited: foundInvestor.isAccredited,
        isStripeVerified: false,
        status: 'active',
        joinedAt: '2025-11-20',
        bio: foundInvestor.bio,
        location: foundInvestor.location,
        linkedin: foundInvestor.linkedin
      };
    }

    const foundStartup = startups.find(s => s.founderId === userId || s.id === userId);
    if (foundStartup) {
      return {
        id: foundStartup.founderId,
        name: foundStartup.founderName,
        email: foundStartup.founderEmail,
        role: 'founder',
        avatar: foundStartup.founderAvatar,
        companyOrFirm: foundStartup.name,
        title: 'Founder & CEO',
        subscriptionTier: 'pro_founder',
        isAccredited: false,
        isStripeVerified: foundStartup.isVerified,
        status: 'active',
        joinedAt: '2026-02-10',
        associatedStartupId: foundStartup.id,
        bio: foundStartup.founderBio,
        location: foundStartup.location,
        website: foundStartup.website
      };
    }

    // Fallback: check in investor interests
    const foundInterest = investorInterests.find(i => i.investorId === userId || i.id === userId);
    if (foundInterest) {
      return {
        id: foundInterest.investorId,
        name: foundInterest.investorName,
        email: foundInterest.investorEmail || 'investor@venturefirm.com',
        role: 'investor',
        avatar: foundInterest.investorAvatar,
        companyOrFirm: foundInterest.investorFirm,
        title: foundInterest.investorTitle,
        subscriptionTier: 'accredited_investor',
        isAccredited: foundInterest.isAccredited,
        isStripeVerified: false,
        status: 'active',
        joinedAt: '2025-11-20',
        bio: `${foundInterest.investorTitle} at ${foundInterest.investorFirm}. Active venture investor evaluating verified MRR startups.`,
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com'
      };
    }

    return null;
  };

  const openSocialProfileModal = (userId: string) => {
    setSelectedProfileUserId(userId);
    setIsSocialProfileModalOpen(true);
  };

  const closeSocialProfileModal = () => {
    setIsSocialProfileModalOpen(false);
    setSelectedProfileUserId(null);
  };

  const openSocialNetworkModal = (userId: string, initialTab: 'connections' | 'followers' | 'following' = 'connections') => {
    setSelectedNetworkModalUserId(userId);
    setNetworkModalActiveTab(initialTab);
    setIsSocialNetworkModalOpen(true);
  };

  const closeSocialNetworkModal = () => {
    setIsSocialNetworkModalOpen(false);
    setSelectedNetworkModalUserId(null);
  };

  // Actions - Investor Interest & Deal Signals
  const signalInvestorInterest = (
    startupId: string, 
    indicativeCheckSize?: number, 
    note: string = '', 
    interestLevel: 'exploring' | 'high_conviction' | 'term_sheet_ready' = 'high_conviction'
  ) => {
    const targetStartup = startups.find(s => s.id === startupId);
    if (!targetStartup) return;

    const checkAmount = indicativeCheckSize || Math.min(250000, targetStartup.askAmount);

    const newInterest: InvestorInterest = {
      id: `int-${Date.now()}`,
      startupId: targetStartup.id,
      startupName: targetStartup.name,
      startupLogo: targetStartup.logo,
      founderId: targetStartup.founderId,
      founderName: targetStartup.founderName,
      investorId: currentUser.id,
      investorName: currentUser.name,
      investorAvatar: currentUser.avatar,
      investorFirm: currentUser.companyOrFirm,
      investorTitle: currentUser.title,
      investorEmail: currentUser.email,
      isAccredited: currentUser.isAccredited,
      indicativeCheckSize: checkAmount,
      interestLevel,
      note: note || `Interested in participating in ${targetStartup.name}'s fundraising round with indicative check of $${(checkAmount / 1000).toFixed(0)}k.`,
      signaledAt: new Date().toISOString(),
      status: 'new'
    };

    setInvestorInterests(prev => {
      const filtered = prev.filter(i => !(i.startupId === startupId && i.investorId === currentUser.id));
      return [newInterest, ...filtered];
    });

    showToast(`🚀 Interest signaled to ${targetStartup.founderName} (${targetStartup.name})! They can now reach out directly.`);
  };

  const removeInvestorInterest = (startupId: string) => {
    setInvestorInterests(prev => prev.filter(i => !(i.startupId === startupId && i.investorId === currentUser.id)));
    showToast('Interest signal removed.');
  };

  const updateInvestorInterestStatus = (interestId: string, status: InvestorInterest['status']) => {
    setInvestorInterests(prev => prev.map(i => {
      if (i.id === interestId) {
        return {
          ...i,
          status,
          lastContactedAt: new Date().toISOString()
        };
      }
      return i;
    }));
  };

  const getStartupInterests = (startupId: string): InvestorInterest[] => {
    return investorInterests.filter(i => i.startupId === startupId);
  };

  const getFounderReceivedInterests = (founderId: string): InvestorInterest[] => {
    const userStartup = startups.find(s => s.founderId === founderId || s.id === currentUser.associatedStartupId);
    return investorInterests.filter(i => 
      i.founderId === founderId || 
      (userStartup && i.startupId === userStartup.id) ||
      (founderId === 'user-alex' && i.startupId === 'startup-1')
    );
  };

  const isInvestorInterestedInStartup = (startupId: string, investorId: string = currentUser.id): boolean => {
    return investorInterests.some(i => i.startupId === startupId && i.investorId === investorId);
  };

  const getInvestorInterestForStartup = (startupId: string, investorId: string = currentUser.id): InvestorInterest | undefined => {
    return investorInterests.find(i => i.startupId === startupId && i.investorId === investorId);
  };

  // --- 1-to-1 Secure Messaging Engine (Recipient-Only Privacy) ---
  const canUserReadDirectMessage = (message: DirectChatMessage): boolean => {
    if (!currentUser || currentUser.role === 'guest') return false;
    return message.recipientId === currentUser.id || message.senderId === currentUser.id;
  };

  // Automatically reset active chat participant when user switches account
  useEffect(() => {
    setActiveChatParticipantId(null);
  }, [currentUser?.id]);

  const markConversationAsRead = (conversationId: string) => {
    if (!currentUser || currentUser.role === 'guest') return;

    setChatConversations(prev => prev.map(convo => {
      if ((convo.id === conversationId || (convo.participantIds && convo.participantIds.includes(conversationId))) && convo.participantIds.includes(currentUser.id)) {
        const hasUnread = convo.messages.some(m => m.recipientId === currentUser.id && !m.isRead);
        if (!hasUnread && (convo.unreadCounts?.[currentUser.id] || 0) === 0) {
          return convo;
        }

        const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updatedMessages = convo.messages.map(m => {
          if (m.recipientId === currentUser.id && !m.isRead) {
            return {
              ...m,
              isRead: true,
              readAt: nowTime,
              deliveryStatus: 'read' as const
            };
          }
          return m;
        });

        const updatedCounts = {
          ...(convo.unreadCounts || {}),
          [currentUser.id]: 0
        };

        return {
          ...convo,
          unreadCount: 0,
          unreadCounts: updatedCounts,
          messages: updatedMessages
        };
      }
      return convo;
    }));

    try {
      fetch('/api/messages/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          recipientId: currentUser.id
        })
      }).catch(() => {});
    } catch {}
  };

  const reachOutToInterestedInvestor = (interest: InvestorInterest, customMessage?: string) => {
    if (!currentUser || currentUser.role === 'guest') return;
    updateInvestorInterestStatus(interest.id, 'founder_reached_out');

    const convoId = get1on1ConversationId(currentUser.id, interest.investorId);
    const introText = customMessage || `Hi ${interest.investorName}! Thank you for signaling interest in ${interest.startupName}'s fundraising round ($${(interest.indicativeCheckSize / 1000).toFixed(0)}k indicative check). I would love to share our live Stripe diligence memo and answer any questions!`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowIso = now.toISOString();

    setChatConversations(prev => {
      const existingIdx = prev.findIndex(c => 
        c.id === convoId ||
        (c.participantIds.includes(currentUser.id) && c.participantIds.includes(interest.investorId))
      );

      const founderMsg: DirectChatMessage = {
        id: `m-${Date.now()}`,
        conversationId: convoId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        senderRole: currentUser.role || 'founder',
        recipientId: interest.investorId,
        recipientName: interest.investorName,
        recipientAvatar: interest.investorAvatar,
        recipientRole: 'investor',
        text: introText,
        timestamp: timeStr,
        createdAt: nowIso,
        isRead: false,
        deliveryStatus: 'delivered',
        isEncrypted: true,
        encryptionFingerprint: `e2ee-sha256-${Math.random().toString(36).substring(2, 10)}`,
        attachments: [
          {
            id: `att-${Date.now()}`,
            type: 'diligence_memo',
            title: `${interest.startupName} Diligence Memo`,
            subtitle: 'Verified Stripe MRR & Financial Unit Economics'
          }
        ]
      };

      if (existingIdx >= 0) {
        return prev.map((c, idx) => idx === existingIdx ? {
          ...c,
          id: convoId,
          participantIds: [currentUser.id, interest.investorId],
          lastMessage: introText,
          lastMessageTime: timeStr,
          lastSenderId: currentUser.id,
          unreadCounts: {
            ...(c.unreadCounts || {}),
            [interest.investorId]: ((c.unreadCounts || {})[interest.investorId] || 0) + 1
          },
          messages: [...c.messages, founderMsg]
        } : c);
      } else {
        const newConvo: DirectChatConversation = {
          id: convoId,
          participantIds: [currentUser.id, interest.investorId],
          participantId: interest.investorId,
          participantName: interest.investorName,
          participantAvatar: interest.investorAvatar,
          participantRole: 'investor',
          participantCompany: interest.investorFirm,
          lastMessage: introText,
          lastMessageTime: timeStr,
          lastSenderId: currentUser.id,
          unreadCount: 0,
          unreadCounts: {
            [currentUser.id]: 0,
            [interest.investorId]: 1
          },
          isEndToEndEncrypted: true,
          createdAt: nowIso,
          updatedAt: nowIso,
          messages: [founderMsg]
        };
        return [newConvo, ...prev];
      }
    });

    setActiveChatParticipantId(interest.investorId);
    setIsChatDrawerOpen(true);
    showToast(`💬 Direct 1-to-1 encrypted message sent to ${interest.investorName}!`);
  };

  // Direct 1-on-1 Chat Launcher
  const openChatWithUser = (user: { id: string; name: string; avatar: string; role: UserRole; company?: string; initialMessage?: string }) => {
    if (!currentUser || currentUser.role === 'guest' || user.id === currentUser.id) return;

    const convoId = get1on1ConversationId(currentUser.id, user.id);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowIso = now.toISOString();

    setChatConversations(prev => {
      const exists = prev.find(c => 
        c.id === convoId || 
        (c.participantIds.includes(user.id) && c.participantIds.includes(currentUser.id))
      );

      if (!exists) {
        const initialMsg: DirectChatMessage = {
          id: `m-init-${Date.now()}`,
          conversationId: convoId,
          senderId: user.id,
          senderName: user.name,
          senderAvatar: user.avatar,
          senderRole: user.role,
          recipientId: currentUser.id,
          recipientName: currentUser.name,
          recipientAvatar: currentUser.avatar,
          recipientRole: currentUser.role,
          text: user.initialMessage || `Hi ${currentUser.name}! Great connecting with you on TrustMRR Venture Exchange. Looking forward to collaborating!`,
          timestamp: timeStr,
          createdAt: nowIso,
          isRead: true,
          readAt: timeStr,
          deliveryStatus: 'read',
          isEncrypted: true,
          encryptionFingerprint: `e2ee-sha256-${Math.random().toString(36).substring(2, 10)}`
        };

        const newConvo: DirectChatConversation = {
          id: convoId,
          participantIds: [currentUser.id, user.id],
          participantId: user.id,
          participantName: user.name,
          participantAvatar: user.avatar,
          participantRole: user.role,
          participantCompany: user.company || 'Venture Member',
          lastMessage: initialMsg.text,
          lastMessageTime: timeStr,
          lastSenderId: user.id,
          unreadCount: 0,
          unreadCounts: {
            [currentUser.id]: 0,
            [user.id]: 0
          },
          isEndToEndEncrypted: true,
          createdAt: nowIso,
          updatedAt: nowIso,
          messages: [initialMsg]
        };
        return [newConvo, ...prev];
      }
      return prev;
    });

    setActiveChatParticipantId(user.id);
    setIsChatDrawerOpen(true);
  };

  const sendDirectChatMessage = (conversationId: string, text: string, attachments?: MessageAttachment[]) => {
    if (!text.trim() && (!attachments || attachments.length === 0)) return;
    if (!currentUser || currentUser.role === 'guest') return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowIso = now.toISOString();

    // Find the exact target conversation belonging to currentUser
    const targetConvo = chatConversations.find(c => 
      (c.id === conversationId || (activeChatParticipantId && c.participantIds.includes(activeChatParticipantId))) &&
      c.participantIds.includes(currentUser.id)
    );

    if (!targetConvo) return;

    // Identify recipient who is the other participant in this 2-party chat
    const recipientId = targetConvo.participantIds.find(id => id !== currentUser.id) || 
      (targetConvo.participantId !== currentUser.id ? targetConvo.participantId : '');

    if (!recipientId || recipientId === currentUser.id) return;

    const targetUser = platformUsers.find(u => u.id === recipientId) || 
      investors.find(i => i.id === recipientId) || 
      startups.find(s => s.id === recipientId);

    const recipientName = (targetUser as any)?.name || (targetUser as any)?.founderName || targetConvo.participantName || 'Recipient';
    const recipientAvatar = (targetUser as any)?.avatar || (targetUser as any)?.logo || targetConvo.participantAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';
    const recipientRole: UserRole = (targetUser as any)?.role || targetConvo.participantRole || 'investor';
    const recipientCompany = (targetUser as any)?.companyOrFirm || (targetUser as any)?.firmName || targetConvo.participantCompany || 'Venture Partner';

    const userMsg: DirectChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      conversationId: targetConvo.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      recipientId,
      recipientName,
      recipientAvatar,
      recipientRole,
      text: text.trim(),
      timestamp: timeStr,
      createdAt: nowIso,
      isRead: false,
      deliveryStatus: 'delivered',
      isEncrypted: true,
      encryptionFingerprint: `e2ee-sha256-${Math.random().toString(36).substring(2, 10)}`,
      attachments: attachments || []
    };

    setChatConversations(prev => prev.map(convo => {
      if (convo.id === targetConvo.id) {
        const updatedUnread = {
          ...(convo.unreadCounts || {}),
          [recipientId]: ((convo.unreadCounts || {})[recipientId] || 0) + 1
        };
        return {
          ...convo,
          participantIds: [currentUser.id, recipientId],
          lastMessage: text.trim() || (attachments?.[0]?.title ?? 'Shared Attachment'),
          lastMessageTime: timeStr,
          lastSenderId: currentUser.id,
          unreadCounts: updatedUnread,
          unreadCount: updatedUnread[currentUser.id] || 0,
          messages: [...convo.messages, userMsg]
        };
      }
      return convo;
    }));

    try {
      fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: targetConvo.id,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          senderRole: currentUser.role,
          recipientId,
          recipientName,
          recipientAvatar,
          recipientRole,
          recipientCompany,
          text: text.trim(),
          attachments
        })
      }).catch(() => {});
    } catch {}
  };

  const sendAdminDirectMessage = (targetUserIds: string[], text: string, subject?: string) => {
    if (!targetUserIds.length || !text.trim()) return;

    const formattedText = subject ? `[ADMIN NOTICE: ${subject.toUpperCase()}]\n${text.trim()}` : text.trim();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowIso = now.toISOString();

    targetUserIds.forEach(targetId => {
      const targetUser = platformUsers.find(u => u.id === targetId) || 
        investors.find(i => i.id === targetId) || 
        startups.find(s => s.id === targetId);

      const targetName = (targetUser as any)?.name || (targetUser as any)?.founderName || 'Platform Member';
      const targetAvatar = (targetUser as any)?.avatar || (targetUser as any)?.logo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
      const targetRole = (targetUser as any)?.role || 'founder';
      const targetCompany = (targetUser as any)?.companyOrFirm || (targetUser as any)?.firmName || (targetUser as any)?.name || 'Venture Member';
      const canonicalId = get1on1ConversationId(currentUser.id, targetId);

      setChatConversations(prev => {
        const existingConvoIndex = prev.findIndex(c => 
          c.id === canonicalId ||
          (c.participantIds && c.participantIds.includes(targetId) && c.participantIds.includes(currentUser.id))
        );

        const adminMsg: DirectChatMessage = {
          id: `msg-admin-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          conversationId: canonicalId,
          senderId: currentUser.id,
          senderName: 'Compliance Officer (Admin)',
          senderAvatar: currentUser.avatar,
          senderRole: 'admin',
          recipientId: targetId,
          recipientName: targetName,
          recipientAvatar: targetAvatar,
          recipientRole: targetRole,
          text: formattedText,
          timestamp: timeStr,
          createdAt: nowIso,
          isRead: false,
          deliveryStatus: 'delivered',
          isEncrypted: true,
          encryptionFingerprint: `e2ee-sha256-${Math.random().toString(36).substring(2, 10)}`
        };

        if (existingConvoIndex >= 0) {
          return prev.map((c, idx) => {
            if (idx === existingConvoIndex) {
              const updatedUnread = {
                ...(c.unreadCounts || {}),
                [targetId]: ((c.unreadCounts || {})[targetId] || 0) + 1
              };
              return {
                ...c,
                id: canonicalId,
                participantIds: [currentUser.id, targetId],
                lastMessage: formattedText,
                lastMessageTime: timeStr,
                lastSenderId: currentUser.id,
                unreadCounts: updatedUnread,
                messages: [...c.messages, adminMsg]
              };
            }
            return c;
          });
        } else {
          const newConvo: DirectChatConversation = {
            id: canonicalId,
            participantIds: [currentUser.id, targetId],
            participantId: targetId,
            participantName: targetName,
            participantAvatar: targetAvatar,
            participantRole: targetRole,
            participantCompany: targetCompany,
            lastMessage: formattedText,
            lastMessageTime: timeStr,
            lastSenderId: currentUser.id,
            unreadCount: 0,
            unreadCounts: {
              [currentUser.id]: 0,
              [targetId]: 1
            },
            isEndToEndEncrypted: true,
            createdAt: nowIso,
            updatedAt: nowIso,
            messages: [adminMsg]
          };
          return [newConvo, ...prev];
        }
      });
    });

    const actionSummary = targetUserIds.length === 1 
      ? `Dispatched personal admin message to ${targetUserIds[0]}`
      : `Broadcasted admin message to ${targetUserIds.length} users`;

    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      adminEmail: currentUser.email || 'admin@trustmrr.com',
      action: 'admin_direct_message',
      targetType: 'user',
      targetId: targetUserIds.join(','),
      timestamp: new Date().toISOString(),
      details: `${actionSummary}: "${text.trim().substring(0, 60)}..."`
    };

    setAuditLogs(prev => [newLog, ...prev]);
    showToast(`✉️ Admin message sent to ${targetUserIds.length} user(s).`);
  };

  const resetChatConversationsToDefault = () => {
    try {
      localStorage.removeItem('trustmrr_chats');
    } catch {}
    setChatConversations(INITIAL_DIRECT_CHAT_CONVERSATIONS);
    setActiveChatParticipantId(null);
    showToast('Reset direct chat conversations to default 1-to-1 seed state.');
  };

  // Admin Actions
  const approveVerification = (requestId: string) => {
    const req = verificationQueue.find(v => v.id === requestId);
    if (!req) return;

    setVerificationQueue(prev => prev.map(v => v.id === requestId ? { ...v, status: 'approved', adminNotes: 'Approved by Compliance Officer. Verified Stripe Badge activated.' } : v));
    
    // Update target startup
    setStartups(prev => prev.map(s => {
      if (s.id === req.startupId || s.name.toLowerCase() === req.startupName.toLowerCase()) {
        return {
          ...s,
          isVerified: true,
          verificationStatus: 'verified_stripe',
          stripeConnected: true,
          verificationProofDate: new Date().toISOString().split('T')[0]
        };
      }
      return s;
    }));

    showToast(`Verification Approved for "${req.startupName}". Verified Badge published!`);
  };

  const rejectVerification = (requestId: string, notes?: string) => {
    const req = verificationQueue.find(v => v.id === requestId);
    if (!req) return;

    setVerificationQueue(prev => prev.map(v => v.id === requestId ? { ...v, status: 'rejected', adminNotes: notes || 'Documentation did not match claimed recurring revenue volume.' } : v));
    
    setStartups(prev => prev.map(s => {
      if (s.id === req.startupId) {
        return { ...s, verificationStatus: 'rejected', isVerified: false };
      }
      return s;
    }));

    showToast(`Verification request rejected for "${req.startupName}"`);
  };

  // Admin Actions - Startups
  const deleteStartup = (startupId: string) => {
    setStartups(prev => prev.filter(s => s.id !== startupId));
    showToast('Startup listing removed from platform.');
  };

  const toggleFeatureStartup = (startupId: string) => {
    setStartups(prev => prev.map(s => {
      if (s.id === startupId) {
        const isFeatured = !s.featured;
        showToast(isFeatured ? `⭐ Featured "${s.name}" on homepage deal radar!` : `Unfeatured "${s.name}".`);
        return { ...s, featured: isFeatured };
      }
      return s;
    }));
  };

  const toggleVerifyStartup = (startupId: string) => {
    setStartups(prev => prev.map(s => {
      if (s.id === startupId) {
        const isVerified = !s.isVerified;
        showToast(isVerified ? `🛡️ Issued Verified Stripe Badge to "${s.name}"!` : `Revoked verification badge.`);
        return {
          ...s,
          isVerified,
          verificationStatus: isVerified ? 'verified_stripe' : 'unverified',
          stripeConnected: isVerified,
          verificationProofDate: isVerified ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return s;
    }));
  };

  // Admin Actions - Community Posts
  const deleteCommunityPost = (postId: string) => {
    setCommunityPosts(prev => prev.filter(p => p.id !== postId));
    showToast('Post removed from community feed.');
  };

  const togglePinCommunityPost = (postId: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const pinned = !p.isPinned;
        showToast(pinned ? '📌 Post pinned to top of Venture Feed!' : 'Post unpinned.');
        return { ...p, isPinned: pinned };
      }
      return p;
    }));
  };

  const deleteCommunityComment = (postId: string, commentId: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: p.comments.filter(c => c.id !== commentId)
        };
      }
      return p;
    }));
    showToast('Comment deleted by moderator.');
  };

  // Admin Actions - User Management
  const updatePlatformUser = (userId: string, updates: Partial<PlatformUser>) => {
    setPlatformUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    showToast('User profile updated.');
  };

  const toggleUserStatus = (userId: string) => {
    setPlatformUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'active' ? 'suspended' : 'active';
        showToast(newStatus === 'active' ? `Activated account for ${u.name}.` : `⚠️ Suspended account for ${u.name}.`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const toggleUserAccredited = (userId: string) => {
    setPlatformUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const accredited = !u.isAccredited;
        showToast(accredited ? `✅ Accredited Investor status granted to ${u.name}.` : `Revoked accredited status.`);
        return { ...u, isAccredited: accredited };
      }
      return u;
    }));
    // Sync with investor list
    setInvestors(prev => prev.map(inv => inv.id === userId ? { ...inv, isAccredited: !inv.isAccredited } : inv));
  };

  const toggleUserStripeVerified = (userId: string) => {
    setPlatformUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const verified = !u.isStripeVerified;
        showToast(verified ? `🛡️ Stripe Revenue Verification badge granted to ${u.name}.` : `Revoked verification badge.`);
        return { ...u, isStripeVerified: verified };
      }
      return u;
    }));
  };

  const changeUserRole = (userId: string, newRole: UserRole) => {
    setPlatformUsers(prev => prev.map(u => {
      if (u.id === userId) {
        showToast(`Changed ${u.name}'s role to ${newRole.toUpperCase()}.`);
        return { ...u, role: newRole };
      }
      return u;
    }));
  };

  const deletePlatformUser = (userId: string) => {
    setPlatformUsers(prev => prev.filter(u => u.id !== userId));
    showToast('User account removed from platform.');
  };

  const upgradeSubscription = (tier: SubscriptionTier) => {
    setCurrentUser(prev => ({
      ...prev,
      subscriptionTier: tier
    }));
    const plan = subscriptionPlans.find(p => p.id === tier) || SUBSCRIPTION_PLANS.find(p => p.id === tier);
    
    // Register or update in subscribers CRM
    setSubscribers(prev => {
      const existing = prev.find(s => s.userId === currentUser.id);
      if (existing) {
        return prev.map(s => s.userId === currentUser.id ? {
          ...s,
          planId: tier,
          planName: plan?.name || tier,
          amount: plan?.priceMonthly || 0,
          status: 'active',
          renewsAt: '2026-09-21'
        } : s);
      }
      return [
        {
          id: `sub-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userEmail: currentUser.email,
          userRole: currentUser.role,
          userAvatar: currentUser.avatar,
          companyName: currentUser.companyOrFirm,
          planId: tier,
          planName: plan?.name || tier,
          billingCycle: 'monthly',
          amount: plan?.priceMonthly || 0,
          status: 'active',
          startDate: new Date().toISOString().split('T')[0],
          renewsAt: '2026-09-21',
          paymentMethod: 'Stripe Card ending in 4242'
        },
        ...prev
      ];
    });

    showToast(`🎉 Upgraded successfully to ${plan?.name || tier}! Premium features unlocked.`);
    setIsSubscriptionModalOpen(false);
  };

  // Subscription Plan Builder & Subscribers Functions
  const createSubscriptionPlan = (plan: SubscriptionPlan) => {
    setSubscriptionPlans(prev => [...prev, plan]);
    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        adminEmail: 'compliance@trustmrr.com',
        action: 'Created Subscription Plan',
        targetType: 'system',
        targetId: plan.id,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        details: `Published new plan: ${plan.name} ($${plan.priceMonthly}/mo)`,
        ipAddress: '192.0.2.45'
      },
      ...prev
    ]);
    showToast(`✨ Created subscription plan "${plan.name}" successfully!`);
  };

  const updateSubscriptionPlan = (planId: string, updates: Partial<SubscriptionPlan>) => {
    setSubscriptionPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return { ...p, ...updates };
      }
      return p;
    }));

    // Cascade sync to all active subscribers CRM records
    setSubscribers(prev => prev.map(s => {
      if (s.planId === planId) {
        return {
          ...s,
          planName: updates.name || s.planName,
          amount: s.billingCycle === 'annual' 
            ? (updates.priceAnnual !== undefined ? updates.priceAnnual * 12 : s.amount)
            : (updates.priceMonthly !== undefined ? updates.priceMonthly : s.amount)
        };
      }
      return s;
    }));

    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        adminEmail: 'compliance@trustmrr.com',
        action: 'Updated Subscription Plan',
        targetType: 'system',
        targetId: planId,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        details: `Updated parameters for plan ${updates.name || planId}`,
        ipAddress: '192.0.2.45'
      },
      ...prev
    ]);
    showToast(`Updated plan details successfully across all views.`);
  };

  const deleteSubscriptionPlan = (planId: string) => {
    setSubscriptionPlans(prev => prev.filter(p => p.id !== planId));
    
    // Safely update subscribers on the deleted plan to default
    setSubscribers(prev => prev.map(s => {
      if (s.planId === planId) {
        return {
          ...s,
          planId: 'founder_free',
          planName: 'Explorer Tier (Free)',
          amount: 0
        };
      }
      return s;
    }));

    if (currentUser.subscriptionTier === planId) {
      setCurrentUser(prev => ({
        ...prev,
        subscriptionTier: 'founder_free'
      }));
    }

    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        adminEmail: 'compliance@trustmrr.com',
        action: 'Deleted Subscription Plan',
        targetType: 'system',
        targetId: planId,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        details: `Archived plan ${planId}`,
        ipAddress: '192.0.2.45'
      },
      ...prev
    ]);
    showToast(`Subscription plan archived.`);
  };

  const togglePlanActive = (planId: string) => {
    setSubscriptionPlans(prev => prev.map(p => {
      if (p.id === planId) {
        const next = p.isActive === false ? true : false;
        showToast(next ? `Plan ${p.name} is now LIVE for public checkout.` : `Plan ${p.name} deactivated.`);
        return { ...p, isActive: next };
      }
      return p;
    }));
  };

  const updateSubscriberStatus = (subscriberId: string, status: SubscriberRecord['status']) => {
    setSubscribers(prev => prev.map(s => {
      if (s.id === subscriberId) {
        showToast(`Subscriber status changed to ${status.toUpperCase()}.`);
        return { ...s, status };
      }
      return s;
    }));
  };

  const updateSubscriberPlan = (subscriberId: string, newPlanId: string) => {
    const plan = subscriptionPlans.find(p => p.id === newPlanId);
    setSubscribers(prev => prev.map(s => {
      if (s.id === subscriberId) {
        setPlatformUsers(uPrev => uPrev.map(u => {
          if (u.id === s.userId) {
            return { ...u, subscriptionTier: newPlanId as SubscriptionTier };
          }
          return u;
        }));
        showToast(`Changed subscriber plan to ${plan?.name || newPlanId}.`);
        return {
          ...s,
          planId: newPlanId,
          planName: plan?.name || newPlanId,
          amount: s.billingCycle === 'annual' ? (plan?.priceAnnual || 0) * 12 : (plan?.priceMonthly || 0)
        };
      }
      return s;
    }));
  };

  const grantComplimentaryVIP = (userId: string, planId: string) => {
    const user = platformUsers.find(u => u.id === userId);
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!user) return;

    setPlatformUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, subscriptionTier: planId as SubscriptionTier };
      }
      return u;
    }));

    setSubscribers(prev => {
      const exists = prev.find(s => s.userId === userId);
      if (exists) {
        return prev.map(s => s.userId === userId ? {
          ...s,
          planId,
          planName: `${plan?.name || planId} (Comped VIP)`,
          amount: 0,
          status: 'active',
          renewsAt: '2028-12-31',
          paymentMethod: 'VIP Complimentary Sponsorship'
        } : s);
      }
      return [
        {
          id: `sub-${Date.now()}`,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          userRole: user.role,
          userAvatar: user.avatar,
          companyName: user.companyOrFirm,
          planId,
          planName: `${plan?.name || planId} (Comped VIP)`,
          billingCycle: 'annual',
          amount: 0,
          status: 'active',
          startDate: new Date().toISOString().split('T')[0],
          renewsAt: '2028-12-31',
          paymentMethod: 'VIP Complimentary Sponsorship'
        },
        ...prev
      ];
    });

    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        adminEmail: 'compliance@trustmrr.com',
        action: 'Granted VIP Complimentary Access',
        targetType: 'user',
        targetId: userId,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        details: `Granted 100% comped ${plan?.name} access to ${user.name}`,
        ipAddress: '192.0.2.45'
      },
      ...prev
    ]);

    showToast(`🌟 VIP Complimentary access granted to ${user.name}!`);
  };

  const extendSubscriptionRenewal = (subscriberId: string, days: number = 30) => {
    setSubscribers(prev => prev.map(s => {
      if (s.id === subscriberId) {
        const curr = new Date(s.renewsAt || Date.now());
        curr.setDate(curr.getDate() + days);
        const newRenewal = curr.toISOString().split('T')[0];
        showToast(`Extended ${s.userName}'s renewal date by ${days} days.`);
        return { ...s, renewsAt: newRenewal };
      }
      return s;
    }));
  };

  const cancelUserSubscription = (subscriberId: string) => {
    setSubscribers(prev => prev.map(s => {
      if (s.id === subscriberId) {
        showToast(`Canceled subscription for ${s.userName}.`);
        return { ...s, status: 'canceled' };
      }
      return s;
    }));
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        setCurrentUser,
        switchRoleQuick,
        isAuthenticated,
        login,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalOptions,
        openAuthModal,
        isOnboardingModalOpen,
        setIsOnboardingModalOpen,
        openOnboardingModal,
        completeFounderOnboarding,
        startups,
        investors,
        pitchRequests,
        dealPipeline,
        communityPosts,
        verificationQueue,
        platformUsers,
        addStartup,
        updateStartup,
        deleteStartup,
        toggleFeatureStartup,
        toggleVerifyStartup,
        requestMRRVerification,
        toggleSaveStartup,
        savedStartupIds,
        createPitch: sendPitch,
        sendPitch,
        sendPitchToInvestor,
        sendPitchMessage,
        updatePitchStatus,
        updateInvestor,
        toggleInvestorAcceptingPitches,
        addInvestorCredentialDocument,
        deleteInvestorCredentialDocument,
        addDealToPipeline,
        updateDealStage,
        removeDealFromPipeline,
        createCommunityPost,
        likeCommunityPost,
        addCommunityComment,
        shareCommunityPost,
        deleteCommunityPost,
        togglePinCommunityPost,
        deleteCommunityComment,
        userConnections,
        userFollows,
        sendConnectionRequest,
        acceptConnectionRequest,
        removeConnection,
        followedUserIds,
        toggleFollowUser,
        getUserConnectionsCount,
        getUserFollowersCount,
        getUserFollowingCount,
        getUserProfile,
        selectedProfileUserId,
        isSocialProfileModalOpen,
        openSocialProfileModal,
        closeSocialProfileModal,
        selectedNetworkModalUserId,
        isSocialNetworkModalOpen,
        networkModalActiveTab,
        openSocialNetworkModal,
        closeSocialNetworkModal,
        investorInterests,
        signalInvestorInterest,
        removeInvestorInterest,
        updateInvestorInterestStatus,
        getStartupInterests,
        getFounderReceivedInterests,
        isInvestorInterestedInStartup,
        getInvestorInterestForStartup,
        reachOutToInterestedInvestor,
        chatConversations,
        activeChatParticipantId,
        setActiveChatParticipantId,
        isChatDrawerOpen,
        setIsChatDrawerOpen,
        openChatWithUser,
        sendDirectChatMessage,
        markConversationAsRead,
        canUserReadDirectMessage,
        sendAdminDirectMessage,
        resetChatConversationsToDefault,
        approveVerification,
        rejectVerification,
        isAdminAuthenticated,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        openAdminLoginModal,
        adminLogin,
        adminLogout,
        updatePlatformUser,
        toggleUserStatus,
        toggleUserAccredited,
        toggleUserStripeVerified,
        changeUserRole,
        deletePlatformUser,
        updatePostModerationStatus,
        supportTickets,
        isSupportModalOpen,
        setIsSupportModalOpen,
        createSupportTicket,
        updateTicketStatus,
        replyToSupportTicket,
        auditLogs,
        subscriptionPlans,
        subscribers,
        createSubscriptionPlan,
        updateSubscriptionPlan,
        deleteSubscriptionPlan,
        togglePlanActive,
        updateSubscriberStatus,
        updateSubscriberPlan,
        grantComplimentaryVIP,
        extendSubscriptionRenewal,
        cancelUserSubscription,
        currentView,
        setCurrentView,
        selectedStartup,
        setSelectedStartup,
        isSubscriptionModalOpen,
        setIsSubscriptionModalOpen,
        targetUpgradePlan,
        setTargetUpgradePlan,
        upgradeSubscription,
        aiModalStartup,
        setAiModalStartup,
        pitchModalInvestor,
        setPitchModalInvestor,
        isInvestorProfileSettingsModalOpen,
        setIsInvestorProfileSettingsModalOpen,
        openInvestorProfileSettingsModal,
        toastMessage,
        showToast,
        theme,
        setTheme,
        toggleTheme
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
