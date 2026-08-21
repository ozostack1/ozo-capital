import React, { useState, useRef } from 'react';
import { 
  X, 
  ShieldCheck, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Trash2, 
  Eye, 
  Sliders, 
  Clock, 
  Bell, 
  Mail, 
  DollarSign, 
  Building, 
  User, 
  Globe, 
  Linkedin, 
  Check, 
  AlertCircle, 
  Sparkles, 
  HelpCircle, 
  Layers, 
  ToggleLeft, 
  ToggleRight,
  TrendingUp,
  FileCheck,
  FileBadge,
  Download,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  Investor, 
  StartupCategory, 
  StartupStage, 
  InvestorCredentialDocument, 
  InvestorPitchPreferences 
} from '../types';

interface InvestorProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  investorId?: string;
}

export const InvestorProfileSettingsModal: React.FC<InvestorProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  investorId
}) => {
  const { 
    investors, 
    currentUser, 
    updateInvestor, 
    addInvestorCredentialDocument, 
    deleteInvestorCredentialDocument, 
    showToast 
  } = useApp();

  const targetInvestor = investors.find(i => i.id === investorId) || 
    investors.find(i => i.id === currentUser.id || i.name.toLowerCase() === currentUser.name.toLowerCase()) || 
    investors[0];

  const [activeTab, setActiveTab] = useState<'credentials' | 'focus' | 'preferences'>('credentials');

  // Form State - Profile & Credentials
  const [name, setName] = useState(targetInvestor.name);
  const [title, setTitle] = useState(targetInvestor.title);
  const [firm, setFirm] = useState(targetInvestor.firm);
  const [email, setEmail] = useState(targetInvestor.email);
  const [bio, setBio] = useState(targetInvestor.bio);
  const [location, setLocation] = useState(targetInvestor.location);
  const [firmWebsite, setFirmWebsite] = useState(targetInvestor.firmWebsite || 'https://horizonvc.io');
  const [linkedin, setLinkedin] = useState(targetInvestor.linkedin || '');
  const [crunchbase, setCrunchbase] = useState(targetInvestor.crunchbase || '');
  const [fundAum, setFundAum] = useState(targetInvestor.fundAum || '$50,000,000');
  const [accreditationType, setAccreditationType] = useState<Investor['accreditationType']>(
    targetInvestor.accreditationType || 'institutional_fund'
  );

  // Form State - Focus & Mandate
  const [checkMin, setCheckMin] = useState<number>(targetInvestor.checkSizeMin || 250000);
  const [checkMax, setCheckMax] = useState<number>(targetInvestor.checkSizeMax || 1500000);
  const [targetSectors, setTargetSectors] = useState<StartupCategory[]>(targetInvestor.targetSectors || ['B2B SaaS', 'AI & Machine Learning']);
  const [targetStages, setTargetStages] = useState<StartupStage[]>(targetInvestor.targetStages || ['Seed', 'Pre-Seed']);
  const [preferredGeographies, setPreferredGeographies] = useState<string[]>(
    targetInvestor.preferredGeographies || ['North America', 'Europe', 'Global Remote']
  );
  const [minMrr, setMinMrr] = useState<number>(targetInvestor.minMrrToPitch || 20000);
  const [minGrowthMoM, setMinGrowthMoM] = useState<number>(targetInvestor.minGrowthRateMoM || 15);
  const [maxChurnRate, setMaxChurnRate] = useState<number>(targetInvestor.maxChurnRateMonthly || 3.5);
  const [customNicheTags, setCustomNicheTags] = useState<string>('Developer APIs, Vertical AI, Billing Infra');

  // Form State - Pitch Intake & Response Preferences
  const [acceptingPitches, setAcceptingPitches] = useState<boolean>(targetInvestor.acceptingPitches !== false);
  const [pitchInstructions, setPitchInstructions] = useState<string>(
    targetInvestor.pitchIntakeInstructions || 'We lead $500k-$1.5M Seed rounds. Startups must have verified Stripe MRR > $20k with >15% MoM expansion.'
  );
  const [responseSla, setResponseSla] = useState<InvestorPitchPreferences['responseSla']>(
    targetInvestor.pitchPreferences?.responseSla || '48_hours'
  );
  const [emailNotifications, setEmailNotifications] = useState<boolean>(
    targetInvestor.pitchPreferences?.emailNotifications ?? true
  );
  const [inAppAlerts, setInAppAlerts] = useState<boolean>(
    targetInvestor.pitchPreferences?.inAppAlerts ?? true
  );
  const [weeklyDigest, setWeeklyDigest] = useState<boolean>(
    targetInvestor.pitchPreferences?.weeklyDigest ?? true
  );
  const [smsGrowthAlerts, setSmsGrowthAlerts] = useState<boolean>(
    targetInvestor.pitchPreferences?.smsGrowthAlerts ?? true
  );
  const [requireVerifiedStripe, setRequireVerifiedStripe] = useState<boolean>(
    targetInvestor.pitchPreferences?.requireVerifiedStripe ?? true
  );
  const [requirePitchDeck, setRequirePitchDeck] = useState<boolean>(
    targetInvestor.pitchPreferences?.requirePitchDeck ?? true
  );
  const [requireCapTableAccess, setRequireCapTableAccess] = useState<boolean>(
    targetInvestor.pitchPreferences?.requireCapTableAccess ?? true
  );
  const [autoDeclineBelowMrr, setAutoDeclineBelowMrr] = useState<boolean>(
    targetInvestor.pitchPreferences?.autoDeclineBelowMrr ?? false
  );
  const [autoReplyMessage, setAutoReplyMessage] = useState<string>(
    targetInvestor.pitchPreferences?.autoReplyMessage || 
    'Thank you for pitching our fund. We review all verified Stripe metric decks weekly. If there is a fit with our Seed mandate, we will reach out within 48 hours.'
  );

  // Document Upload State
  const [uploadDocTitle, setUploadDocTitle] = useState('');
  const [uploadDocType, setUploadDocType] = useState<InvestorCredentialDocument['documentType']>('cpa_letter');
  const [uploadIssuer, setUploadIssuer] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<InvestorCredentialDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const allCategories: StartupCategory[] = [
    'AI & Machine Learning',
    'B2B SaaS',
    'FinTech & Payments',
    'DevTools & Infra',
    'Security & Privacy',
    'HealthTech',
    'E-Commerce & Retail',
    'Productivity & Work'
  ];

  const allStages: StartupStage[] = [
    'Bootstrapped',
    'Pre-Seed',
    'Seed',
    'Series A',
    'Series B',
    'Profitable'
  ];

  const allGeographies = [
    'North America',
    'Europe',
    'United Kingdom',
    'Asia-Pacific',
    'Latin America',
    'Global Remote'
  ];

  const toggleSector = (sector: StartupCategory) => {
    if (targetSectors.includes(sector)) {
      setTargetSectors(targetSectors.filter(s => s !== sector));
    } else {
      setTargetSectors([...targetSectors, sector]);
    }
  };

  const toggleStage = (stage: StartupStage) => {
    if (targetStages.includes(stage)) {
      setTargetStages(targetStages.filter(s => s !== stage));
    } else {
      setTargetStages([...targetStages, stage]);
    }
  };

  const toggleGeography = (geo: string) => {
    if (preferredGeographies.includes(geo)) {
      setPreferredGeographies(preferredGeographies.filter(g => g !== geo));
    } else {
      setPreferredGeographies([...preferredGeographies, geo]);
    }
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    setTimeout(() => {
      const docTitle = uploadDocTitle.trim() || file.name.replace(/\.[^/.]+$/, '');
      const fileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

      addInvestorCredentialDocument(targetInvestor.id, {
        title: docTitle,
        documentType: uploadDocType,
        fileName: file.name,
        fileSize: fileSize === '0.0 MB' ? '820 KB' : fileSize,
        status: 'verified',
        issuerOrAuthority: uploadIssuer.trim() || 'Accreditation Compliance Reviewer',
        verificationNotes: 'Accreditation verification confirmed with verified audit stamp.'
      });

      setIsUploading(false);
      setUploadDocTitle('');
      setUploadIssuer('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 600);
  };

  const handleQuickAddPredefinedDoc = (docType: InvestorCredentialDocument['documentType'], titleText: string, fileName: string, issuer: string) => {
    addInvestorCredentialDocument(targetInvestor.id, {
      title: titleText,
      documentType: docType,
      fileName,
      fileSize: '1.4 MB',
      status: 'verified',
      issuerOrAuthority: issuer,
      verificationNotes: 'Audited and verified by TrustMRR Institutional Compliance.'
    });
  };

  const handleSaveAll = () => {
    const updatedPreferences: InvestorPitchPreferences = {
      responseSla,
      emailNotifications,
      inAppAlerts,
      weeklyDigest,
      smsGrowthAlerts,
      requireVerifiedStripe,
      requirePitchDeck,
      requireCapTableAccess,
      autoDeclineBelowMrr,
      autoReplyMessage
    };

    updateInvestor(targetInvestor.id, {
      name,
      title,
      firm,
      email,
      bio,
      location,
      firmWebsite,
      linkedin,
      crunchbase,
      fundAum,
      accreditationType,
      isAccredited: true,
      accreditationStatus: 'verified',
      checkSizeMin: checkMin,
      checkSizeMax: checkMax,
      targetSectors,
      targetStages,
      preferredGeographies,
      minMrrToPitch: minMrr,
      minGrowthRateMoM: minGrowthMoM,
      maxChurnRateMonthly: maxChurnRate,
      acceptingPitches,
      pitchIntakeInstructions: pitchInstructions,
      pitchPreferences: updatedPreferences
    });

    showToast('Investor Profile, Mandate & Pitch Preferences Saved Successfully!');
    onClose();
  };

  const currentDocs = targetInvestor.credentialsDocuments || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[88vh]">
        
        {/* Modal Header - Deep Navy */}
        <div className="bg-[#0A1128] border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between shrink-0 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#162038] border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-mono">Investor Profile & Mandate</h2>
                <span className="flex items-center space-x-1 text-slate-950 bg-amber-400 px-2 py-0.2 rounded-full text-[10px] font-extrabold font-mono">
                  <CheckCircle2 className="w-3 h-3 text-slate-950" />
                  <span>SEC Verified</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Manage professional credentials, check parameters, target sectors, and pitch response rules.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#162038] text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab('credentials')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'credentials'
                ? 'border-[#0A1128] text-[#0A1128] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileBadge className="w-3.5 h-3.5 text-amber-600" />
            <span>Credentials & KYC</span>
            {currentDocs.length > 0 && (
              <span className="ml-1 text-[9px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 font-mono font-bold">
                {currentDocs.length} Docs
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('focus')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'focus'
                ? 'border-[#0A1128] text-[#0A1128] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-600" />
            <span>Investment Mandate</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'preferences'
                ? 'border-[#0A1128] text-[#0A1128] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-amber-600" />
            <span>Pitch Preferences</span>
            <span className={`w-2 h-2 rounded-full ${acceptingPitches ? 'bg-amber-500' : 'bg-slate-400'}`} />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">

          {/* TAB 1: PROFESSIONAL PROFILE & CREDENTIALS UPLOAD */}
          {activeTab === 'credentials' && (
            <div className="space-y-6">
              
              {/* Accreditation Status Banner */}
              <div className="bg-slate-100 border border-slate-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center space-x-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-[#101249] shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                      <span>Accredited Investor Verification Status: Active</span>
                      <span className="text-[10px] px-2 py-0.2 rounded bg-slate-200 text-slate-700 font-mono">VERIFIED</span>
                    </h4>
                    <p className="text-xs text-zinc-300 mt-0.5">
                      Your identity and SEC Rule 501 / FINRA credentials are confirmed. Founders see verified trust badges on your deal memos.
                    </p>
                  </div>
                </div>

                <div className="text-xs text-[#101249]/90 font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-300 self-start sm:self-auto">
                  Audit ID: SEC-7740-VC
                </div>
              </div>

              {/* Identity & Firm Profile Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1.5">Full Professional Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#101249]"
                    placeholder="e.g. Sarah Chen"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1.5">Investor Title / Role</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#101249]"
                    placeholder="e.g. General Partner"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1.5">Firm / Fund / Syndicate Name</label>
                  <input
                    type="text"
                    value={firm}
                    onChange={(e) => setFirm(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#101249]"
                    placeholder="e.g. Horizon Venture Capital"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1.5">Accreditation Category (SEC / FINRA)</label>
                  <select
                    value={accreditationType}
                    onChange={(e) => setAccreditationType(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#101249] cursor-pointer"
                  >
                    <option value="institutional_fund">Institutional VC Fund / Qualified Institutional Buyer (QIB)</option>
                    <option value="sec_rule_501">Individual Accredited Investor (SEC Rule 501 - $1M+ Net Worth)</option>
                    <option value="finra_licensed">FINRA Licensed Representative (Series 7, 65, or 82)</option>
                    <option value="family_office">Single/Multi Family Office Manager</option>
                    <option value="qualified_purchaser">Qualified Purchaser (Section 2(a)(51) - $5M+ Investable)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1.5">Direct Investor Contact Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#101249] font-mono"
                    placeholder="e.g. sarah@horizonvc.io"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1.5">Fund AUM / Deployed Capital</label>
                  <input
                    type="text"
                    value={fundAum}
                    onChange={(e) => setFundAum(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#101249] font-mono"
                    placeholder="e.g. $85,000,000"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1.5">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#101249]"
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1.5">Firm Website</label>
                  <input
                    type="url"
                    value={firmWebsite}
                    onChange={(e) => setFirmWebsite(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#101249] font-mono"
                    placeholder="https://horizonvc.io"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1.5">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#101249] font-mono"
                    placeholder="https://linkedin.com/in/sarahchen-vc"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1.5">Crunchbase / AngelList URL</label>
                  <input
                    type="url"
                    value={crunchbase}
                    onChange={(e) => setCrunchbase(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#101249] font-mono"
                    placeholder="https://crunchbase.com/person/sarah-chen"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 text-xs mb-1.5">Investment Track Record & Partner Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#101249] leading-relaxed font-sans"
                  placeholder="Share your prior portfolio investments, thesis, operator background, or value-add for SaaS founders..."
                />
              </div>

              {/* CREDENTIALS DOCUMENT UPLOAD SECTION */}
              <div className="border-t border-zinc-800 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
                      <Upload className="w-4 h-4 text-[#101249]" />
                      <span>Accredited Investor Documents & Certificates</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Upload CPA attestation letters, SEC Form D excerpts, FINRA CRD filings, or institutional LP mandate agreements.
                    </p>
                  </div>

                  <span className="text-xs text-zinc-400 font-mono">
                    {currentDocs.length} Verified Document{currentDocs.length === 1 ? '' : 's'}
                  </span>
                </div>

                {/* Upload Action Box */}
                <div className="bg-[#080B11] border border-dashed border-zinc-700 rounded-xl p-5 text-center space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Document Title</label>
                      <input
                        type="text"
                        value={uploadDocTitle}
                        onChange={(e) => setUploadDocTitle(e.target.value)}
                        placeholder="e.g. 2026 CPA Attestation"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#101249]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Document Type</label>
                      <select
                        value={uploadDocType}
                        onChange={(e) => setUploadDocType(e.target.value as any)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#101249] cursor-pointer"
                      >
                        <option value="cpa_letter">CPA / Attorney Verification Letter</option>
                        <option value="fund_lp_agreement">SEC Form D / Fund LP Mandate</option>
                        <option value="finra_license">FINRA Series 7/65/82 License Record</option>
                        <option value="tax_k1">Schedule K-1 / Entity Formation</option>
                        <option value="accreditation_cert">Third-Party Accreditation Certificate</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Issuer / Verification Body</label>
                      <input
                        type="text"
                        value={uploadIssuer}
                        onChange={(e) => setUploadIssuer(e.target.value)}
                        placeholder="e.g. KPMG LLP / FINRA CRD"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#101249]"
                      />
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleSimulatedFileUpload}
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  />

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2.5 bg-[#101249] hover:bg-[#101249] text-white rounded-lg text-xs font-bold flex items-center space-x-2 transition-colors cursor-pointer shadow disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isUploading ? 'Encrypting & Uploading...' : 'Select File to Upload'}</span>
                    </button>

                    <div className="flex items-center space-x-2 text-[11px] text-zinc-400">
                      <span>or quickly add preset:</span>
                      <button
                        type="button"
                        onClick={() => handleQuickAddPredefinedDoc('cpa_letter', 'PwC Accredited Investor Attestation 2026', 'PwC_Accreditation_Certificate_2026.pdf', 'PricewaterhouseCoopers LLP')}
                        className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-slate-700 rounded border border-zinc-700 transition-colors cursor-pointer"
                      >
                        + CPA Letter
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickAddPredefinedDoc('finra_license', 'FINRA Series 65 License Transcript', 'FINRA_CRD_Series_65_License.pdf', 'FINRA Central Registration Depository')}
                        className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-slate-700 rounded border border-zinc-700 transition-colors cursor-pointer"
                      >
                        + FINRA Series 65
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-500">
                    Supported formats: PDF, DOCX, PNG (Max 25MB). Encrypted with SOC2 Type II compliance standards.
                  </p>
                </div>

                {/* Uploaded Documents List */}
                <div className="space-y-2.5">
                  {currentDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start sm:items-center space-x-3">
                        <div className="p-2.5 bg-zinc-800 rounded-lg text-[#101249] border border-zinc-700">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white text-xs">{doc.title}</span>
                            <span className="text-[10px] px-2 py-0.2 rounded font-mono font-bold bg-slate-100 text-slate-700 border border-slate-300">
                              {doc.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            {doc.fileName} • {doc.fileSize} • Uploaded {doc.uploadedAt}
                            {doc.issuerOrAuthority && ` • Issuer: ${doc.issuerOrAuthority}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer border border-zinc-700"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#101249]" />
                          <span>View</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteInvestorCredentialDocument(targetInvestor.id, doc.id)}
                          className="p-1.5 bg-slate-50 hover:bg-slate-200 text-slate-500 rounded-lg text-xs transition-colors cursor-pointer border border-slate-300"
                          title="Remove document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {currentDocs.length === 0 && (
                    <div className="p-6 text-center text-xs text-zinc-500 border border-zinc-800 rounded-xl">
                      No credential documents uploaded yet. Upload your proof above to obtain the gold accredited badge.
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: INVESTMENT FOCUS & SECTORS */}
          {activeTab === 'focus' && (
            <div className="space-y-6 text-xs">
              
              {/* Check Size Configuration */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-[#101249]" />
                      <span>Check Size Mandate ($)</span>
                    </h3>
                    <p className="text-zinc-400 text-xs mt-0.5">Define minimum and maximum ticket size per round investment.</p>
                  </div>
                  <span className="text-[#101249] font-mono font-bold text-sm">
                    ${(checkMin / 1000).toFixed(0)}k – ${(checkMax / 1000).toFixed(0)}k
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Minimum Check Size ($)</label>
                    <input
                      type="number"
                      value={checkMin}
                      onChange={(e) => setCheckMin(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Maximum Check Size ($)</label>
                    <input
                      type="number"
                      value={checkMax}
                      onChange={(e) => setCheckMax(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-slate-300"
                    />
                  </div>
                </div>

                {/* Quick Check Size Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <span className="text-zinc-500">Quick presets:</span>
                  <button
                    type="button"
                    onClick={() => { setCheckMin(25000); setCheckMax(150000); }}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 transition-colors cursor-pointer"
                  >
                    Angel ($25k–$150k)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCheckMin(250000); setCheckMax(1500000); }}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 transition-colors cursor-pointer"
                  >
                    Seed Lead ($250k–$1.5M)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCheckMin(1000000); setCheckMax(5000000); }}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 transition-colors cursor-pointer"
                  >
                    Series A ($1M–$5M)
                  </button>
                </div>
              </div>

              {/* Sectors Multi-Select */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-bold text-white text-sm">Target Investment Sectors (e.g. Fintech, SaaS)</label>
                    <p className="text-zinc-400 text-xs">Founders in selected verticals will be matched to your thesis.</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setTargetSectors(allCategories)}
                      className="text-[11px] text-[#101249] hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-zinc-600">|</span>
                    <button
                      type="button"
                      onClick={() => setTargetSectors([])}
                      className="text-[11px] text-zinc-400 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {allCategories.map((sec) => {
                    const isSelected = targetSectors.includes(sec);
                    return (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => toggleSector(sec)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-sky-950/50 border-[#101249]/50 text-white font-semibold shadow-sm'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800/60'
                        }`}
                      >
                        <span className="truncate">{sec}</span>
                        {isSelected ? <Check className="w-4 h-4 text-[#101249] shrink-0" /> : <Plus className="w-4 h-4 text-zinc-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Niche Focus Keywords */}
              <div>
                <label className="block font-semibold text-zinc-300 mb-1.5">Custom Niche Keywords & Themes</label>
                <input
                  type="text"
                  value={customNicheTags}
                  onChange={(e) => setCustomNicheTags(e.target.value)}
                  placeholder="e.g. Developer APIs, Vertical AI, Billing Infra, Identity Verification"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#101249] font-sans"
                />
              </div>

              {/* Target Stages */}
              <div className="space-y-3">
                <label className="block font-bold text-white text-sm">Target Company Stages</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {allStages.map((stage) => {
                    const isSelected = targetStages.includes(stage);
                    return (
                      <button
                        key={stage}
                        type="button"
                        onClick={() => toggleStage(stage)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-slate-100 border-slate-300 text-white font-semibold shadow-sm'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800/60'
                        }`}
                      >
                        <span>{stage}</span>
                        {isSelected ? <Check className="w-4 h-4 text-[#101249] shrink-0" /> : <Plus className="w-4 h-4 text-zinc-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Geographies */}
              <div className="space-y-3">
                <label className="block font-bold text-white text-sm">Preferred Geographies</label>
                <div className="flex flex-wrap gap-2">
                  {allGeographies.map((geo) => {
                    const isSelected = preferredGeographies.includes(geo);
                    return (
                      <button
                        key={geo}
                        type="button"
                        onClick={() => toggleGeography(geo)}
                        className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 ${
                          isSelected
                            ? 'bg-slate-100 border-slate-300 text-slate-600'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                        }`}
                      >
                        <span>{geo}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#101249]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Financial Gating Criteria */}
              <div className="border-t border-zinc-800 pt-5 space-y-4">
                <h3 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-[#101249]" />
                  <span>Stripe-Verified Financial Thresholds</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Minimum Verified MRR ($/mo)</label>
                    <input
                      type="number"
                      value={minMrr}
                      onChange={(e) => setMinMrr(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-[#101249]"
                    />
                    <span className="text-[11px] text-zinc-500 mt-0.5 block">e.g. $20,000 / month</span>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Minimum MoM Growth (%)</label>
                    <input
                      type="number"
                      value={minGrowthMoM}
                      onChange={(e) => setMinGrowthMoM(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-[#101249]"
                    />
                    <span className="text-[11px] text-zinc-500 mt-0.5 block">e.g. 15% expansion / month</span>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Max Allowable Churn (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={maxChurnRate}
                      onChange={(e) => setMaxChurnRate(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-[#101249]"
                    />
                    <span className="text-[11px] text-zinc-500 mt-0.5 block">e.g. Max 3.5% monthly churn</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: PITCH RESPONSE PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-6 text-xs">
              
              {/* Pitch Intake Master Toggle Card */}
              <div className={`p-4.5 rounded-xl border flex items-center justify-between transition-colors ${
                acceptingPitches 
                  ? 'bg-slate-100 border-slate-300' 
                  : 'bg-zinc-900 border-zinc-800'
              }`}>
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">Accept Inbound Pitches on TrustMRR</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                      acceptingPitches ? 'bg-slate-100 text-slate-700' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {acceptingPitches ? 'ACTIVE & VISIBLE' : 'PAUSED & HIDDEN'}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-xs">
                    {acceptingPitches 
                      ? 'Founders can see your partner profile in the Investor Directory and submit deal memos matching your check size.' 
                      : 'Your profile is temporarily hidden from the Pitch Directory. Existing deals in pipeline remain active.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setAcceptingPitches(!acceptingPitches)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                    acceptingPitches 
                      ? 'bg-[#101249] text-white hover:bg-[#101249]' 
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                  }`}
                >
                  {acceptingPitches ? <ToggleRight className="w-5 h-5 text-slate-600" /> : <ToggleLeft className="w-5 h-5 text-zinc-400" />}
                  <span>{acceptingPitches ? 'Open to Pitches' : 'Intake Paused'}</span>
                </button>
              </div>

              {/* Response SLA Commitment */}
              <div className="space-y-3">
                <label className="block font-bold text-white text-sm">Expected Pitch Response SLA (Turnaround Time)</label>
                <p className="text-zinc-400 text-xs">Displayed as a responsiveness commitment on your partner profile card.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: '24_hours', label: '24–48 Hours Turnaround', desc: 'Fast response commitment. Highest founder engagement.', badge: 'Fast Responder' },
                    { id: '48_hours', label: 'Within 48 Hours', desc: 'Standard VC review cycle for qualified deals.' },
                    { id: '1_week', label: 'Weekly Batch Review', desc: 'Review inbound decks every Monday with partners.' },
                    { id: 'batch_review', label: 'Selective Review Only', desc: 'Only reply to opportunities moving to partner meeting.' }
                  ].map((sla) => (
                    <button
                      key={sla.id}
                      type="button"
                      onClick={() => setResponseSla(sla.id as any)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        responseSla === sla.id
                          ? 'bg-sky-950/50 border-[#101249]/50 text-white font-semibold shadow-sm'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{sla.label}</span>
                        {sla.badge && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono">
                            {sla.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">{sla.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pitch Intake Memo Instructions for Founders */}
              <div>
                <label className="block font-bold text-white text-sm mb-1">Founder Pitch Instructions & Intake Guidelines</label>
                <p className="text-zinc-400 text-xs mb-2">Shown to founders directly in the pitch modal before they draft their memo.</p>
                <textarea
                  rows={3}
                  value={pitchInstructions}
                  onChange={(e) => setPitchInstructions(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#101249] leading-relaxed font-sans"
                  placeholder="e.g. We lead $500k-$1.5M rounds. Please ensure Stripe ledger is verified and include cap table dilution expectations."
                />
              </div>

              {/* Notification Channel Preferences */}
              <div className="border-t border-zinc-800 pt-4 space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-[#101249]" />
                  <span>Notification Channels & Alerts</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-semibold text-white block">Instant Pitch Email Alerts</span>
                      <span className="text-[11px] text-zinc-400">Receive deal memos to {email} immediately</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="w-4 h-4 accent-sky-500 cursor-pointer"
                    />
                  </label>

                  <label className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-semibold text-white block">In-App Push Alerts</span>
                      <span className="text-[11px] text-zinc-400">Real-time alerts when founders reply or share Cap Tables</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={inAppAlerts}
                      onChange={(e) => setInAppAlerts(e.target.checked)}
                      className="w-4 h-4 accent-sky-500 cursor-pointer"
                    />
                  </label>

                  <label className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-semibold text-white block">Weekly Deal-Flow Digest</span>
                      <span className="text-[11px] text-zinc-400">Monday summary of top-growing startups in your sectors</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={weeklyDigest}
                      onChange={(e) => setWeeklyDigest(e.target.checked)}
                      className="w-4 h-4 accent-sky-500 cursor-pointer"
                    />
                  </label>

                  <label className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-semibold text-white block">SMS Breakout Growth Alerts</span>
                      <span className="text-[11px] text-zinc-400">Urgent SMS alert for deals with &gt;30% MoM verified growth</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={smsGrowthAlerts}
                      onChange={(e) => setSmsGrowthAlerts(e.target.checked)}
                      className="w-4 h-4 accent-sky-500 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Automated Quality Gates */}
              <div className="border-t border-zinc-800 pt-4 space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#101249]" />
                  <span>Quality Gates & Gating Rules</span>
                </h4>

                <div className="space-y-2">
                  <label className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3 flex items-center justify-between cursor-pointer">
                    <span className="text-zinc-200">Require Live Stripe Verification before allowing pitch submission</span>
                    <input
                      type="checkbox"
                      checked={requireVerifiedStripe}
                      onChange={(e) => setRequireVerifiedStripe(e.target.checked)}
                      className="w-4 h-4 accent-[#101249] cursor-pointer"
                    />
                  </label>

                  <label className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3 flex items-center justify-between cursor-pointer">
                    <span className="text-zinc-200">Require Pitch Deck Attachment (PDF / Slides link)</span>
                    <input
                      type="checkbox"
                      checked={requirePitchDeck}
                      onChange={(e) => setRequirePitchDeck(e.target.checked)}
                      className="w-4 h-4 accent-[#101249] cursor-pointer"
                    />
                  </label>

                  <label className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3 flex items-center justify-between cursor-pointer">
                    <span className="text-zinc-200">Require Cap Table Diligence Room Access</span>
                    <input
                      type="checkbox"
                      checked={requireCapTableAccess}
                      onChange={(e) => setRequireCapTableAccess(e.target.checked)}
                      className="w-4 h-4 accent-[#101249] cursor-pointer"
                    />
                  </label>

                  <label className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3 flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-zinc-200 block">Auto-Decline Pitches below Minimum MRR</span>
                      <span className="text-[11px] text-zinc-500">Automatically send fit notice if verified MRR is below ${(minMrr/1000).toFixed(0)}k</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoDeclineBelowMrr}
                      onChange={(e) => setAutoDeclineBelowMrr(e.target.checked)}
                      className="w-4 h-4 accent-[#101249] cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Automated Founder Receipt Message */}
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Founder Auto-Reply Receipt Message</label>
                <textarea
                  rows={2}
                  value={autoReplyMessage}
                  onChange={(e) => setAutoReplyMessage(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#101249] leading-relaxed font-sans"
                  placeholder="Automated confirmation message sent to founder upon submission..."
                />
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="border-t border-zinc-800 bg-[#080B11] p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="text-xs text-zinc-400">
            Changes are saved to your public investor partner record.
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-5 py-2 bg-[#101249] hover:bg-[#101249] text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Investor Profile & Preferences</span>
            </button>
          </div>
        </div>

      </div>

      {/* Document Preview Lightbox Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-white border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#101249]" />
                <h3 className="font-bold text-white text-sm">{previewDoc.title}</h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#080B11] border border-zinc-800 rounded-xl p-5 text-center space-y-3">
              <FileBadge className="w-12 h-12 text-[#101249] mx-auto" />
              <div>
                <p className="font-bold text-white text-xs">{previewDoc.fileName}</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Size: {previewDoc.fileSize} • Uploaded on {previewDoc.uploadedAt}
                </p>
              </div>

              <div className="p-3 bg-slate-100 border border-slate-300 rounded-lg text-left text-xs space-y-1">
                <div className="flex items-center justify-between text-[#101249] font-bold text-[11px]">
                  <span>Accreditation Verification Status: VERIFIED</span>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <p className="text-zinc-300 text-[11px]">
                  Issuer: <span className="text-white font-medium">{previewDoc.issuerOrAuthority || 'TrustMRR Institutional Compliance'}</span>
                </p>
                <p className="text-zinc-400 text-[10px]">
                  {previewDoc.verificationNotes || 'Accreditation certified under SEC Rule 501 / FINRA Series 65 audit standards.'}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  showToast(`Downloaded ${previewDoc.fileName}`);
                  setPreviewDoc(null);
                }}
                className="px-4 py-2 bg-[#101249] hover:bg-[#101249] text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Document</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
