'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Building2, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  ExternalLink,
  Trash2,
  Check,
  Star,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { 
  getAllBusinessesAdmin, 
  updateBusinessStatus, 
  toggleBusinessVerification,
  getBusinessReports, 
  dismissReport 
} from '../../lib/supabase';
import { Business, BusinessReport } from '../../types';

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const { user, isAdmin, switchRole } = useAuth();

  const [activeTab, setActiveTab] = useState<'pending' | 'reports' | 'all'>('pending');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [reports, setReports] = useState<BusinessReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const bizList = await getAllBusinessesAdmin();
    const repList = await getBusinessReports();
    setBusinesses(bizList);
    setReports(repList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleApprove = async (id: string, name: string) => {
    const ok = await updateBusinessStatus(id, 'approved');
    if (ok) {
      showNotification(`"${name}" has been approved and is now live in public directory!`);
      loadData();
    }
  };

  const handleReject = async (id: string, name: string) => {
    const reason = prompt(t('rejectionReasonPrompt'), 'Incomplete business documents or unverifiable contact phone.');
    if (reason) {
      const ok = await updateBusinessStatus(id, 'rejected', reason);
      if (ok) {
        showNotification(`"${name}" has been rejected with feedback.`);
        loadData();
      }
    }
  };

  const handleToggleVerified = async (id: string, current: boolean) => {
    await toggleBusinessVerification(id, !current);
    showNotification(`Verification status updated.`);
    loadData();
  };

  const handleDismissReport = async (repId: string) => {
    await dismissReport(repId);
    showNotification('Report dismissed.');
    loadData();
  };

  const pendingList = businesses.filter(b => b.status === 'pending');
  const activeReports = reports.filter(r => r.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Title & Quick Role Bar */}
      <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-navy-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>5 LP Business Compliance & Moderation Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{t('adminTitle')}</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('adminSubtitle')}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            title="Refresh Data"
            className="p-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-slate-300 border border-navy-700 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {!isAdmin && (
            <button
              onClick={() => switchRole('admin')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold text-xs transition"
            >
              Switch to Admin Mode
            </button>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {actionMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between animate-fade-in">
          <span>✓ {actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-emerald-600 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Submissions</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">{pendingList.length}</p>
          <span className="text-[11px] text-slate-400">Needs review & approval</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fake Business Reports</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-red-600 mt-2">{activeReports.length}</p>
          <span className="text-[11px] text-slate-400">Community flagged</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Businesses</span>
            <Building2 className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-navy-900 mt-2">{businesses.length}</p>
          <span className="text-[11px] text-slate-400">In directory database</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Security</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">Active</p>
          <span className="text-[11px] text-slate-400">Row Level Security (RLS)</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 px-4 text-sm font-bold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'pending'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>{t('pendingApprovalsTab')}</span>
          {pendingList.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
              {pendingList.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 px-4 text-sm font-bold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'reports'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>{t('fakeReportsTab')}</span>
          {activeReports.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800">
              {activeReports.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 px-4 text-sm font-bold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'all'
              ? 'border-navy-900 text-navy-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>{t('allListingsTab')}</span>
          <span className="text-xs text-slate-400">({businesses.length})</span>
        </button>
      </div>

      {/* TAB 1: PENDING APPROVALS */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Zero Pending Submissions</h3>
              <p className="text-xs text-slate-500">All registered businesses have been processed and reviewed.</p>
            </div>
          ) : (
            pendingList.map((biz) => (
              <div key={biz.id} className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                      {biz.logo_url ? (
                        <img src={biz.logo_url} alt={biz.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">
                          {biz.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          Awaiting Approval
                        </span>
                        <span className="text-xs text-slate-400">Submitted {new Date(biz.created_at).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-lg font-bold text-navy-900 mt-1">{biz.name}</h3>
                      <p className="text-xs text-slate-500">{biz.tagline}</p>
                      <p className="text-xs text-slate-600 mt-1">
                        📍 {biz.address}, {biz.city}, {biz.state}, {biz.country_name || biz.country_code}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 w-full md:w-auto">
                    <button
                      onClick={() => handleApprove(biz.id, biz.name)}
                      className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t('approveBtn')}</span>
                    </button>

                    <button
                      onClick={() => handleReject(biz.id, biz.name)}
                      className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 transition"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{t('rejectBtn')}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-700 space-y-2">
                  <p className="font-semibold text-slate-900">Submitted Company Description:</p>
                  <p className="leading-relaxed">{biz.description}</p>
                  <div className="flex flex-wrap gap-4 pt-2 text-[11px] text-slate-500 border-t border-slate-200">
                    <span>Phone: <b>{biz.phone}</b></span>
                    <span>WhatsApp: <b>{biz.whatsapp || 'N/A'}</b></span>
                    <span>Email: <b>{biz.email}</b></span>
                    {biz.website && (
                      <a href={biz.website} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                        Website Link ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: FAKE BUSINESS REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {activeReports.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
              <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Pending Reports</h3>
              <p className="text-xs text-slate-500">The verified business community has reported zero active discrepancies.</p>
            </div>
          ) : (
            activeReports.map((rep) => (
              <div key={rep.id} className="bg-white rounded-2xl border border-red-200 shadow-sm p-6 space-y-3">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded">
                      Flagged: {rep.reason}
                    </span>
                    <h3 className="text-base font-bold text-navy-900 mt-1">
                      Business: {rep.business_name || rep.business_id}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDismissReport(rep.id)}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition"
                    >
                      {t('dismissReport')}
                    </button>
                    <button
                      onClick={() => {
                        updateBusinessStatus(rep.business_id, 'rejected', 'Suspended due to verified community fraud report');
                        handleDismissReport(rep.id);
                        showNotification('Business suspended and removed from public search.');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition"
                    >
                      {t('deactivateBusiness')}
                    </button>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 text-slate-600">
                  <p>Reporter: <b>{rep.reporter_name}</b> ({rep.reporter_email})</p>
                  {rep.details && (
                    <p className="bg-red-50/50 p-3 rounded-lg border border-red-100 text-slate-700">
                      <b>Reporter Evidence:</b> {rep.details}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400">Reported at {new Date(rep.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: ALL BUSINESSES MANAGER */}
      {activeTab === 'all' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Business</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Verified</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {businesses.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{b.name}</div>
                      <div className="text-[11px] text-slate-400">{b.category_name}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {b.city}, {b.country_code}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        b.status === 'approved' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : b.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleVerified(b.id, b.is_verified)}
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          b.is_verified ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {b.is_verified ? '✓ Verified' : 'Mark Verified'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-amber-600">
                      ★ {b.rating.toFixed(1)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/business/${b.slug}`}
                        className="text-brand-600 hover:text-brand-800 font-bold underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
