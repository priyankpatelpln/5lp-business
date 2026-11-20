'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Globe, 
  Heart, 
  Share2, 
  ShieldCheck, 
  Star, 
  ExternalLink 
} from 'lucide-react';
import { Business } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';
import ShareModal from './ShareModal';

interface BusinessCardProps {
  business: Business;
  featured?: boolean;
}

export default function BusinessCard({ business, featured = false }: BusinessCardProps) {
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [shareOpen, setShareOpen] = useState(false);
  const favorite = isFavorite(business.id);

  const cleanWhatsApp = business.whatsapp?.replace(/[^0-9]/g, '') || '';
  const cleanPhone = business.phone?.replace(/[^0-9+]/g, '') || '';

  return (
    <>
      <div 
        className={`group bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
          featured 
            ? 'border-brand-200 shadow-lg shadow-brand-500/5 hover:shadow-xl hover:border-brand-400' 
            : 'border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
        }`}
      >
        <div>
          {/* Header Cover & Quick Actions */}
          <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
            {business.cover_url ? (
              <img
                src={business.cover_url}
                alt={business.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-navy-900 to-brand-800 flex items-center justify-center">
                <Building2 className="w-12 h-12 text-white/40" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-black/20" />

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
              {business.is_verified && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('verifiedBadge')}</span>
                </span>
              )}
              {business.is_featured && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-amber-950 shadow-sm">
                  ★ {t('featuredBadge')}
                </span>
              )}
              {business.status === 'pending' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm">
                  ⏳ {t('pendingBadge')}
                </span>
              )}
            </div>

            {/* Favorite & Share Buttons */}
            <div className="absolute top-3 right-3 flex items-center space-x-1.5">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(business.id);
                }}
                title={favorite ? 'Remove Favorite' : 'Save Favorite'}
                className={`p-2 rounded-full backdrop-blur-md transition ${
                  favorite 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-white/80 hover:bg-white text-slate-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShareOpen(true);
                }}
                title={t('shareBusiness')}
                className="p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 backdrop-blur-md transition"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Floating Logo */}
            <div className="absolute -bottom-5 left-5 w-16 h-16 rounded-xl bg-white p-1 border-2 border-white shadow-md overflow-hidden">
              {business.logo_url ? (
                <img
                  src={business.logo_url}
                  alt={business.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-brand-50 flex items-center justify-center text-brand-600 font-black text-xl rounded-lg">
                  {business.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Content Body */}
          <div className="pt-7 px-5 pb-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                {business.category_name || 'Enterprise'}
              </span>
              
              <div className="flex items-center space-x-1 text-xs font-bold text-amber-600">
                <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                <span>{business.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({business.review_count})</span>
              </div>
            </div>

            <Link href={`/business/${business.slug}`}>
              <h3 className="text-lg font-bold text-navy-900 group-hover:text-brand-600 transition leading-snug line-clamp-1">
                {business.name}
              </h3>
            </Link>

            {business.tagline && (
              <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                {business.tagline}
              </p>
            )}

            <div className="flex items-center space-x-1 text-xs text-slate-500 mt-2.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{business.city}, {business.state}, {business.country_name || business.country_code}</span>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
              {business.description}
            </p>
          </div>
        </div>

        {/* Action Footer: Call, WhatsApp, Details */}
        <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            {business.phone && (
              <a
                href={`tel:${cleanPhone}`}
                title={`Call ${business.phone}`}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-navy-900 hover:text-brand-600 hover:border-brand-300 text-xs font-semibold shadow-sm transition"
              >
                <Phone className="w-3.5 h-3.5 text-brand-600" />
                <span>{t('callNow')}</span>
              </a>
            )}

            {cleanWhatsApp && (
              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold shadow-sm transition"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>

          <Link
            href={`/business/${business.slug}`}
            className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center space-x-1"
          >
            <span>View Profile</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <ShareModal
        business={business}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </>
  );
}
