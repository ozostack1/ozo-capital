import React, { useState } from 'react';
import { 
  LifeBuoy, 
  X, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  FileText, 
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SupportTicket } from '../types';

export const SupportDeskModal: React.FC = () => {
  const {
    isSupportModalOpen,
    setIsSupportModalOpen,
    supportTickets,
    createSupportTicket,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'my_tickets' | 'create_ticket'>('my_tickets');

  // New Ticket Form State
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('stripe_verification');
  const [priority, setPriority] = useState<SupportTicket['priority']>('medium');
  const [message, setMessage] = useState('');

  if (!isSupportModalOpen) return null;

  // Filter strictly for the current logged-in user's own tickets!
  const myTickets = supportTickets.filter(t => {
    if (!currentUser) return false;
    const matchId = Boolean(t.userId && currentUser.id && t.userId === currentUser.id);
    const matchEmail = Boolean(t.userEmail && currentUser.email && t.userEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim());
    return matchId || matchEmail;
  });

  const handleSubmitNewTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    createSupportTicket({
      subject: subject.trim(),
      message: message.trim(),
      category,
      priority
    });

    setSubject('');
    setMessage('');
    setActiveTab('my_tickets');
  };

  const categoryLabels: Record<NonNullable<SupportTicket['category']>, string> = {
    stripe_verification: '⚡ Stripe MRR Verification',
    billing: '💳 Billing & Subscriptions',
    diligence_vault: '🔒 Diligence Vault & Cap Table',
    bug_report: '🛠️ Bug Report / Technical Issue',
    general: '💬 General Inquiry'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 text-[#0A1128] my-auto max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0A1128] border border-amber-400/50 flex items-center justify-center shadow-xs">
              <LifeBuoy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#0A1128] font-mono">Platform Help & Support Desk</h3>
              <p className="text-xs text-slate-500 font-medium">Direct support from TrustMRR compliance officers and technical specialists</p>
            </div>
          </div>

          <button
            onClick={() => setIsSupportModalOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-1">
          <button
            onClick={() => setActiveTab('my_tickets')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'my_tickets'
                ? 'bg-[#0A1128] text-white shadow-xs'
                : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>My Support Tickets ({myTickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('create_ticket')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'create_ticket'
                ? 'bg-[#0A1128] text-white shadow-xs'
                : 'bg-[#0A1128]/5 border border-slate-200 text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-amber-500" />
            <span>Submit New Ticket</span>
          </button>
        </div>

        {/* TAB 1: MY TICKETS LIST */}
        {activeTab === 'my_tickets' && (
          <div className="space-y-4">
            {myTickets.length > 0 ? (
              <div className="space-y-3.5">
                {myTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-amber-700">#{ticket.id}</span>
                          <h4 className="font-extrabold text-sm text-[#0A1128]">{ticket.subject}</h4>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{ticket.createdAt}</span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {ticket.category && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono">
                            {categoryLabels[ticket.category] || ticket.category}
                          </span>
                        )}

                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full font-mono ${
                          ticket.status === 'open' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                          ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                          'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                      {ticket.message}
                    </p>

                    {/* Admin Reply Box */}
                    {(ticket.adminReply || ticket.resolutionNotes) && (
                      <div className="bg-[#0A1128] text-white p-3.5 rounded-xl border border-amber-400/40 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-xs font-extrabold font-mono text-amber-400">Official Admin Response</span>
                          </div>
                          {ticket.repliedAt && (
                            <span className="text-[10px] text-slate-400 font-mono">{ticket.repliedAt}</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed font-normal">
                          {ticket.adminReply || ticket.resolutionNotes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-extrabold text-sm text-[#0A1128]">No support tickets submitted yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Have a question about Stripe MRR verification, cap table diligence, or subscription plans? Click below to submit a ticket.
                </p>
                <button
                  onClick={() => setActiveTab('create_ticket')}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold cursor-pointer transition-all shadow-xs"
                >
                  Submit First Support Ticket
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CREATE NEW TICKET */}
        {activeTab === 'create_ticket' && (
          <form onSubmit={handleSubmitNewTicket} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="stripe_verification">⚡ Stripe MRR Verification Help</option>
                  <option value="billing">💳 Billing & Subscriptions</option>
                  <option value="diligence_vault">🔒 Diligence Vault & Cap Table Access</option>
                  <option value="bug_report">🛠️ Bug Report / Technical Issue</option>
                  <option value="general">💬 General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="low">🟢 Low / Standard Inquiry</option>
                  <option value="medium">🟡 Medium / Priority Response</option>
                  <option value="high">🔴 High / Urgent Issue</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subject Line <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Issue connecting Stripe merchant account for $42k MRR verification"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0A1128] font-medium focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Message <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your question or issue in detail..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-[#0A1128] font-normal focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 flex items-center space-x-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Support tickets are assigned directly to TrustMRR compliance officers. Expected SLA: &lt;4 hours.</span>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('my_tickets')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold shadow-md shadow-amber-500/20 cursor-pointer flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5 text-slate-950" />
                <span>Submit Ticket</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
