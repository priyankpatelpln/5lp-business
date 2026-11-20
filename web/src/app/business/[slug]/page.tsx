'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Mail, 
  Globe, 
  Heart, 
  Share2, 
  ShieldCheck, 
  Star, 
  ExternalLink, 
  AlertTriangle, 
  Check, 
  Copy, 
  ArrowLeft,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { useFavorites } from '../../../context/FavoritesContext';
import { INITIAL_DEMO_BUSINESSES } from '../../../lib/demoData';
import { getBusinessBySlug, getBusinesses } from '../../../lib/supabase';
import { Business } from '../../../types/index';
import ShareModal from '../../../components/ShareModal';
import ReportModal from '../../../components/ReportModal';
import BusinessCard from '../../../components/BusinessCard';

export default function BusinessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();

  const slug = params?.slug as string;
  const initialBiz = INITIAL_DEMO_BUSINESSES.find(b => b.slug === slug) || null;
  const [business, setBusiness] = useState<Business | null>(initialBiz);
  const [similarBusinesses, setSimilarBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);

  // Modals
  const [shareOpen, setShareOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadDetail() {
      if (!slug) return;
      setLoading(true);
      const biz = await getBusinessBySlug(slug);
      setBusiness(biz);

      if (biz) {
        // Load related businesses
        const allInCat = await getBusinesses({ category_id: biz.category_id });
        setSimilarBusinesses(allInCat.filter(b => b.id !== biz.id).slice(0, 3));
      }
      setLoading(false);
    }
    loadDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500 font-medium">Loading Verified Business Profile...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <Building2 className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-2xl font-bold text-navy-900">Business Profile Not Found</h2>
        <p className="text-sm text-slate-500">The requested business may be undergoing administrative verification or has been removed.</p>
        <Link
          href="/directory"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-sm shadow hover:bg-brand-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Active Directory</span>
        </Link>
      </div>
    );
  }

  const favorite = isFavorite(business.id);
  const cleanWhatsApp = business.whatsapp?.replace(/[^0-9]/g, '') || '';
  const cleanPhone = business.phone?.replace(/[^0-9+]/g, '') || '';

  return (
    <div className="pb-20">
      {/* 1. HERO COVER BANNER */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full bg-navy-950 overflow-hidden">
        {business.cover_url ? (
          <img
            src={business.cover_url}
            alt={business.name}
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-navy-950 via-navy-900 to-brand-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-black/30" />

        {/* Back Link */}
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center space-x-2 bg-navy-900/80 hover:bg-navy-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md transition border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        {/* Quick Action Badges */}
        <div className="absolute top-6 right-4 sm:right-8 z-10 flex items-center space-x-2">
          <button
            onClick={() => toggleFavorite(business.id)}
            className={`p-2.5 rounded-xl backdrop-blur-md transition ${
              favorite ? 'bg-rose-500 text-white shadow-lg' : 'bg-white/80 hover:bg-white text-slate-800'
            }`}
            title={favorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => setShareOpen(true)}
            className="p-2.5 rounded-xl bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md transition"
            title={t('shareBusiness')}
          >
            <Share2 className="w-5 h-5" />
          </button>

          <button
            onClick={() => setReportOpen(true)}
            className="p-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white backdrop-blur-md transition"
            title={t('reportFake')}
          >
            <AlertTriangle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. PROFILE HEADER CARD (OVERLAPPING) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Logo */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-2 border-slate-200 shadow-md p-2 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {business.logo_url ? (
                  <img
                    src={business.logo_url}
                    alt={business.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-50 flex items-center justify-center text-brand-600 font-black text-3xl rounded-xl">
                    {business.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Title & Badges */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-md">
                    {business.category_name || 'Global Enterprise'}
                  </span>
                  {business.is_verified && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{t('verifiedBadge')}</span>
                    </span>
                  )}
                  {business.is_featured && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-amber-950">
                      ★ {t('featuredBadge')}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
                  {business.name}
                </h1>

                {business.tagline && (
                  <p className="text-sm font-medium text-slate-500">
                    {business.tagline}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{business.city}, {business.state}, {business.country_name || business.country_code}</span>
                  </div>

                  <div className="flex items-center space-x-1 text-amber-600 font-bold">
                    <Star className="w-4 h-4 fill-current text-amber-500" />
                    <span>{business.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({business.review_count} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="w-full md:w-auto flex flex-wrap items-center gap-3 pt-2 md:pt-0">
              {business.phone && (
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm shadow-md transition"
                >
                  <Phone className="w-4 h-4 text-brand-400" />
                  <span>{t('callNow')}</span>
                </a>
              )}

              {cleanWhatsApp && (
                <a
                  href={`https://wa.me/${cleanWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t('whatsappChat')}</span>
                </a>
              )}

              {business.website && (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition"
                >
                  <Globe className="w-4 h-4 text-slate-600" />
                  <span>Website</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT: OVERVIEW, GALLERY, LOCATION, CONTACT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Company Overview */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-navy-900 uppercase tracking-wider flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-brand-600" />
              <span>{t('overview')}</span>
            </h2>
            <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {business.description}
            </div>
          </div>

          {/* Photo Gallery */}
          {business.gallery_images && business.gallery_images.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-navy-900 uppercase tracking-wider flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-brand-600" />
                <span>{t('photoGallery')}</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {business.gallery_images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveGalleryIndex(idx)}
                    className="relative h-36 rounded-xl overflow-hidden bg-slate-100 cursor-pointer group"
                  >
                    <img
                      src={imgUrl}
                      alt={`${business.name} facility ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs">
                      Enlarge
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Business Location & Interactive Map Preview */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-navy-900 uppercase tracking-wider flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-brand-600" />
              <span>{t('businessLocation')}</span>
            </h2>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <p className="text-sm font-semibold text-slate-800">{business.address}</p>
              <p className="text-xs text-slate-600">
                {business.city}, {business.state} {business.postal_code && `- ${business.postal_code}`}, {business.country_name || business.country_code}
              </p>
              {business.latitude && business.longitude && (
                <p className="text-[11px] text-slate-400">
                  Coordinates: {business.latitude.toFixed(4)}° N, {business.longitude.toFixed(4)}° E
                </p>
              )}
            </div>

            {/* Google Maps link button */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name} ${business.address} ${business.city}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-xs font-bold text-brand-600 hover:text-brand-800 transition"
            >
              <span>Open in Google Maps Navigation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Report Fake Business Trigger Banner */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">Notice fraudulent or incorrect info?</h4>
                <p className="text-[11px] text-amber-700">Help protect the 5 LP Business verified network by reporting discrepancies.</p>
              </div>
            </div>
            <button
              onClick={() => setReportOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition flex-shrink-0"
            >
              {t('reportFake')}
            </button>
          </div>
        </div>

        {/* Right Column: Contact Card & Similar Listings */}
        <div className="space-y-8">
          {/* Direct Contact Summary Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
              {t('contactDetails')}
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Telephone</p>
                  <a href={`tel:${cleanPhone}`} className="font-semibold text-slate-800 hover:text-brand-600 transition">
                    {business.phone}
                  </a>
                </div>
              </div>

              {business.whatsapp && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium">WhatsApp</p>
                    <a
                      href={`https://wa.me/${cleanWhatsApp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-emerald-700 hover:underline"
                    >
                      {business.whatsapp}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Email Address</p>
                  <a href={`mailto:${business.email}`} className="font-semibold text-slate-800 hover:text-brand-600 transition break-all">
                    {business.email}
                  </a>
                </div>
              </div>

              {business.website && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium">Website</p>
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-brand-600 hover:underline break-all"
                    >
                      {business.website.replace('https://', '').replace('http://', '')}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>5 LP ID: {business.id.slice(0, 8)}</span>
              <span>Updated {new Date(business.updated_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Similar Businesses in this category */}
          {similarBusinesses.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
                {t('similarBusinesses')}
              </h3>
              <div className="space-y-4">
                {similarBusinesses.map((biz) => (
                  <BusinessCard key={biz.id} business={biz} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ShareModal
        business={business}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />

      <ReportModal
        business={business}
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
      />
    </div>
  );
}
