'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Building2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useFavorites } from '../../context/FavoritesContext';
import { getBusinesses } from '../../lib/supabase';
import { Business } from '../../types';
import BusinessCard from '../../components/BusinessCard';

export default function FavoritesPage() {
  const { t } = useLanguage();
  const { favorites } = useFavorites();
  const [favoriteBusinesses, setFavoriteBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavs() {
      setLoading(true);
      const all = await getBusinesses();
      const matched = all.filter(b => favorites.includes(b.id));
      setFavoriteBusinesses(matched);
      setLoading(false);
    }
    loadFavs();
  }, [favorites]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 flex items-center space-x-2">
            <Heart className="w-7 h-7 text-rose-500 fill-current" />
            <span>{t('favorites')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Your saved global businesses for instant re-access and direct contact.
          </p>
        </div>

        <Link
          href="/directory"
          className="inline-flex items-center space-x-2 text-xs font-bold text-brand-600 hover:text-brand-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse More Businesses</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-72 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : favoriteBusinesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteBusinesses.map((biz) => (
            <BusinessCard key={biz.id} business={biz} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-navy-900">No Saved Favorites Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any business card in the directory to pin them here for rapid calling and WhatsApp inquiries.
          </p>
          <Link
            href="/directory"
            className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow hover:bg-brand-700 transition"
          >
            Explore Business Directory
          </Link>
        </div>
      )}
    </div>
  );
}
