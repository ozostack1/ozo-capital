export type UserRole = 'guest' | 'founder' | 'investor' | 'admin';

export type ThemeMode = 'light' | 'dark';

export type AppView = 'landing' | 'directory' | 'founder_dashboard' | 'investor_dashboard' | 'community' | 'admin_panel';

export type SubscriptionTier = 
  | 'free' 
  | 'pro_founder' 
  | 'elite_founder' 
  | 'accredited_investor' 
  | 'institutional_vc';

export type VerificationStatus = 'unverified' | 'pending' | 'verified_stripe' | 'verified_bank' | 'rejected';

export type StartupStage = 'Bootstrapped' | 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B' | 'Profitable';

export type StartupCategory = 
  | 'AI & Machine Learning' 
  | 'B2B SaaS' 
  | 'FinTech & Payments' 
  | 'DevTools & Infra' 
  | 'E-Commerce & Retail' 
  | 'Security & Privacy' 
  | 'HealthTech' 
  | 'Productivity & Work';

export interface MRRDataPoint {
  month: string;
  mrr: number;
  arr: number;
  newCustomers: number;
  churnedCustomers: number;
  netRetentionRate: number;
}

export interface CapTableItem {
  holder: string;
  role: string;
  equityPercent: number;
}

export interface Startup {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: StartupCategory;
  logo: string;
  stage: StartupStage;
  foundedYear: number;
  location: string;
  website: string;
  mrr: number; // in USD
  arr: number; // in USD
  growthRateMoM: number; // percentage
  churnRateMonthly: number; // percentage
  cac: number; // USD
  ltv: number; // USD
  customersCount: number;
  askAmount: number; // USD
  valuation: number; // USD
  targetRound: string;
  isActivelyRaising?: boolean;
  minTicketSize?: number; // USD
  useOfFunds?: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  verificationProofDate?: string;
  stripeConnected?: boolean;
  pitchDeckTitle: string;
  pitchDeckSlidesCount: number;
  pitchSummary: string;
  keyMetricsHighlights: string[];
  capTable: CapTableItem[];
  teamSize: number;
  founderId: string;
  founderName: string;
  founderAvatar: string;
  founderBio: string;
  founderEmail: string;
  mrrHistory: MRRDataPoint[];
  tags: string[];
  viewsCount: number;
  savesCount: number;
  diligenceRequestsCount: number;
  aiDealScore?: number;
  aiValuationMultiple?: string;
  aiThesisSnippet?: string;
  featured?: boolean;
  createdAt: string;
}

export interface InvestorCredentialDocument {
  id: string;
  title: string;
  documentType: 'cpa_letter' | 'accreditation_cert' | 'fund_lp_agreement' | 'finra_license' | 'tax_k1' | 'entity_formation';
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: 'verified' | 'pending' | 'rejected';
  issuerOrAuthority?: string;
  verificationNotes?: string;
  fileUrl?: string;
}

export interface InvestorPitchPreferences {
  responseSla: '24_hours' | '48_hours' | '1_week' | 'batch_review';
  emailNotifications: boolean;
  inAppAlerts: boolean;
  weeklyDigest: boolean;
  smsGrowthAlerts: boolean;
  requireVerifiedStripe: boolean;
  requirePitchDeck: boolean;
  requireCapTableAccess: boolean;
  autoDeclineBelowMrr: boolean;
  autoReplyMessage?: string;
}

export interface Investor {
  id: string;
  name: string;
  title: string;
  firm: string;
  avatar: string;
  bio: string;
  email: string;
  checkSizeMin: number; // USD
  checkSizeMax: number; // USD
  targetStages: StartupStage[];
  targetSectors: StartupCategory[];
  portfolioCount: number;
  totalInvested: string;
  isAccredited: boolean;
  accreditationStatus: 'verified' | 'pending' | 'none';
  accreditationType?: 'sec_rule_501' | 'finra_licensed' | 'institutional_fund' | 'qualified_purchaser' | 'family_office';
  firmWebsite?: string;
  fundAum?: string;
  location: string;
  linkedin: string;
  crunchbase?: string;
  preferredGeographies?: string[];
  minGrowthRateMoM?: number;
  maxChurnRateMonthly?: number;
  subscriptionTier: SubscriptionTier;
  savedStartupIds: string[];
  acceptingPitches: boolean; // Whether investor is actively open to receiving pitches
  minMrrToPitch?: number; // Minimum MRR requirement in USD
  pitchIntakeInstructions?: string;
  receivedPitchesCount?: number;
  credentialsDocuments?: InvestorCredentialDocument[];
  pitchPreferences?: InvestorPitchPreferences;
}

export type DealStage = 'Lead' | 'Diligence' | 'Pitch Review' | 'Term Sheet' | 'Invested' | 'Passed';

export interface DealPipelineItem {
  id: string;
  startupId: string;
  investorId: string;
  stage: DealStage;
  notes: string;
  targetCheck: number;
  addedAt: string;
  lastUpdated: string;
}

export interface PitchMessage {
  id: string;
  senderRole: 'founder' | 'investor';
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  attachments?: string[];
}

export interface PitchRequest {
  id: string;
  startupId: string;
  startupName: string;
  startupLogo: string;
  founderId: string;
  founderName: string;
  founderAvatar: string;
  investorId: string;
  investorName: string;
  investorAvatar: string;
  investorFirm: string;
  askAmount: number;
  proposedEquity: number;
  pitchSubject: string;
  status: 'pending' | 'reviewed' | 'meeting_scheduled' | 'term_sheet_sent' | 'declined';
  createdAt: string;
  deckUrl: string;
  messages: PitchMessage[];
}

export interface InvestorInterest {
  id: string;
  startupId: string;
  startupName: string;
  startupLogo?: string;
  founderId: string;
  founderName?: string;
  investorId: string;
  investorName: string;
  investorAvatar: string;
  investorFirm: string;
  investorTitle: string;
  investorEmail: string;
  isAccredited: boolean;
  indicativeCheckSize: number; // USD
  interestLevel: 'exploring' | 'high_conviction' | 'term_sheet_ready';
  note: string;
  signaledAt: string;
  status: 'new' | 'founder_reached_out' | 'meeting_scheduled' | 'data_room_shared' | 'passed';
  lastContactedAt?: string;
}

export type FeedCategory = 
  | 'Funding & Deals'
  | 'MRR Milestones'
  | 'New Tech & AI'
  | 'Startup Discussions'
  | 'Investor Insights'
  | 'GTM & Growth'
  | 'Milestone'
  | 'Pitch Feedback'
  | 'Investor AMA'
  | 'Growth & Scale'
  | 'Deal Talk';

export interface CommunityComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  authorBadge?: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  isVerified: boolean;
  authorCompany?: string;
  title: string;
  content: string;
  category: FeedCategory;
  likesCount: number;
  likedBy: string[];
  comments: CommunityComment[];
  createdAt: string;
  taggedStartupId?: string;
  taggedStartupName?: string;
  mrrMilestone?: number;
  fundingAmount?: number;
  tags?: string[];
  sharesCount?: number;
  isPinned?: boolean;
  moderationStatus?: 'published' | 'held' | 'deleted';
  deletionReason?: string;
}

export interface SupportTicket {
  id: string;
  userId?: string;
  userEmail: string;
  userName: string;
  userRole: UserRole;
  subject: string;
  message: string;
  category?: 'stripe_verification' | 'billing' | 'diligence_vault' | 'bug_report' | 'general';
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  assignedTo?: string;
  resolutionNotes?: string;
  adminReply?: string;
  repliedAt?: string;
}

export interface AuditLogEntry {
  id: string;
  adminEmail: string;
  action: string;
  targetType: 'user' | 'startup' | 'post' | 'verification' | 'subscription' | 'settings';
  targetId: string;
  timestamp: string;
  details: string;
  ipAddress?: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  companyOrFirm: string;
  title: string;
  subscriptionTier: SubscriptionTier;
  isAccredited: boolean;
  isStripeVerified: boolean;
  status: 'active' | 'suspended' | 'pending';
  joinedAt: string;
  associatedStartupId?: string;
  bio?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
}

export interface UserConnection {
  id: string;
  userId: string;
  targetUserId: string;
  targetUserName: string;
  targetUserAvatar: string;
  targetUserRole: UserRole;
  targetUserCompany: string;
  status: 'connected' | 'pending' | 'received';
  createdAt: string;
}

export interface UserFollow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface DirectChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
}

export interface DirectChatConversation {
  id: string;
  participantIds?: string[];
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: UserRole;
  participantCompany: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: DirectChatMessage[];
}

export interface VerificationRequest {
  id: string;
  startupId: string;
  startupName: string;
  founderName: string;
  founderEmail: string;
  claimedMrr: number;
  claimedArr: number;
  growthRate: number;
  proofType: 'Stripe API Live Sync' | 'Bank Statements & Merchant Audit' | 'ChartMogul / ProfitWell Integration';
  proofDetails: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
}

export interface CurrentUserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  companyOrFirm: string;
  title: string;
  subscriptionTier: SubscriptionTier;
  isAccredited: boolean;
  isStripeVerified: boolean;
  associatedStartupId?: string;
  hasCompletedOnboarding?: boolean;
}

export interface FounderOnboardingData {
  // Founder Profile
  founderName: string;
  founderEmail: string;
  founderTitle: string;
  founderAvatar: string;
  founderBio: string;
  founderLinkedin?: string;
  
  // Startup Profile
  startupName: string;
  tagline: string;
  category: StartupCategory;
  stage: StartupStage;
  website: string;
  foundedYear: number;
  location: string;
  description?: string;

  // Financials & Targets
  mrr: number;
  arr: number;
  growthRateMoM: number;
  churnRateMonthly: number;
  customersCount: number;
  askAmount: number;
  valuation: number;
  targetRound: string;
  isActivelyRaising: boolean;
  keyMetricsHighlights: string[];

  // Stripe Verification
  stripeConnected: boolean;
  verificationStatus: VerificationStatus;
  verificationProofDate?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  roleTarget: 'founder' | 'investor' | 'all';
  priceMonthly: number;
  priceAnnual: number;
  tagline: string;
  popular?: boolean;
  badgeText?: string;
  features: string[];
  isActive?: boolean;
  limits: {
    canPitchAllInvestors: boolean;
    canViewRawFinancials: boolean;
    canAccessDiligenceRoom: boolean;
    hasVerifiedStripeBadge: boolean;
    aiDealMemoAudit: boolean;
    directFounderMessaging: boolean;
    exportDiligenceData: boolean;
    customDomainPitchDeck?: boolean;
    syndicateCoInvestAccess?: boolean;
  };
}

export interface SubscriberRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  userAvatar?: string;
  companyName: string;
  planId: string;
  planName: string;
  billingCycle: 'monthly' | 'annual';
  amount: number;
  status: 'active' | 'past_due' | 'trialing' | 'canceled';
  startDate: string;
  renewsAt: string;
  paymentMethod: string;
}

