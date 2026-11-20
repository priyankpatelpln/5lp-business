'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Business } from '../types';
import { createBusinessReport } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';

interface ReportModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportModal({ business, isOpen, onClose }: ReportModalProps) {
  const { t } = useLanguage();
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [reason, setReason] = useState(t('reportReasonOption1'));
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterEmail || !reason) return;

    setIsSubmitting(true);
    await createBusinessReport({
      business_id: business.id,
      business_name: business.name,
      reporter_name: reporterName || 'Anonymous Community Member',
      reporter_email: reporterEmail,
      reason,
      details: details.trim() || undefined,
    });
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-red-600">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-lg font-bold text-navy-900">{t('reportTitle')}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Report Successfully Submitted</h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              {t('reportSubmittedMsg')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
              <span>
                You are reporting: <b>{business.name}</b>. All reports are immediately flagged in the 5 LP Business Admin Panel for legal review.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('reporterName')}</label>
              <input
                type="text"
                required
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Full Name"
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('reporterEmail')}</label>
              <input
                type="email"
                required
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('reportReason')}</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none bg-white"
              >
                <option value={t('reportReasonOption1')}>{t('reportReasonOption1')}</option>
                <option value={t('reportReasonOption2')}>{t('reportReasonOption2')}</option>
                <option value={t('reportReasonOption3')}>{t('reportReasonOption3')}</option>
                <option value={t('reportReasonOption4')}>{t('reportReasonOption4')}</option>
                <option value={t('reportReasonOption5')}>{t('reportReasonOption5')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('reportDetails')}</label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide relevant evidence, incorrect contact links, or suspicious behavior..."
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                {t('close')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition shadow disabled:opacity-50"
              >
                {isSubmitting ? t('loading') : t('submitReport')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
