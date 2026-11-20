'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Grid, 
  MapPin, 
  SlidersHorizontal, 
  RotateCcw, 
  Building2, 
  Star,
  Eye,
  Clock
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getBusinesses } from '../../lib/supabase';
import { Business } from '../../types';
import BusinessCard from '../../components/BusinessCard';
import { DEMO_CATEGORIES, DEMO_SUBCATEGORIES, DEMO_COUNTRIES, INITIAL_DEMO_BUSINESSES } from '../../lib/demoData';

function DirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();

  const [businesses, setBusinesses] = useState<Business[]>(() => INITIAL_DEMO_BUSINESSES.filter(b => b.status === 'approved'));
  const [loading, setLoading] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters State
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [subcategory, setSubcategory] = useState(searchParams.get('subcategory') || '');
  const [country, setCountry] = useState(searchParams.get('country') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'highest_rated');

  // Load and apply search/filter
  useEffect(() => {
    async function fetchList() {
      setLoading(true);
      const all = await getBusinesses({
        status: 'approved',
        category_id: category || undefined,
        country_code: country || undefined,
        query: query || undefined
      });

      let filtered = [...all];

      // Subcategory filter
      if (subcategory) {
        filtered = filtered.filter(b => b.subcategory_id === subcategory);
      }

      // City filter
      if (city.trim()) {
        const cLower = city.trim().toLowerCase();
        filtered = filtered.filter(b => b.city.toLowerCase().includes(cLower));
      }

      // Sort
      if (sortBy === 'highest_rated') {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'most_viewed') {
        filtered.sort((a, b) => b.view_count - a.view_count);
      } else if (sortBy === 'newest') {
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      setBusinesses(filtered);
      setLoading(false);
    }

    fetchList();
  }, [category, subcategory, country, city, query, sortBy]);

  const handleResetFilters = () => {
    setQuery('');
    setCategory('');
    setSubcategory('');
    setCountry('');
    setCity('');
    setSortBy('highest_rated');
    router.push('/directory');
  };

  const getCategoryName = (c: typeof DEMO_CATEGORIES[0]) => {
    if (language === 'gu') return c.name_gu;
    if (language === 'hi') return c.name_hi;
    return c.name_en;
  };

  const filteredSubcategories = category 
    ? DEMO_SUBCATEGORIES.filter(s => s.parent_id === category)
    : DEMO_SUBCATEGORIES;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Directory Page Header */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-brand-900 rounded-2xl p-6 sm:p-10 text-white shadow-lg">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-300">
            Global Search & Discovery
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Explore Verified Global Enterprises
          </h1>
          <p className="text-sm text-slate-300">
            Search thousands of manufacturers, suppliers, tech innovators, and trade networks with verified direct contact details.
          </p>
        </div>

        {/* Instant Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2 max-w-2xl">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-white text-slate-900 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none shadow-inner"
            />
          </div>
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center justify-center space-x-2 bg-navy-800 text-white px-4 py-3 rounded-xl font-semibold text-sm border border-navy-700"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-400" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-600" />
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider">{t('filterTitle')}</h2>
            </div>
            <button
              onClick={handleResetFilters}
              title={t('resetFilters')}
              className="text-xs text-slate-500 hover:text-brand-600 flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">{t('categoryLabel')}</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubcategory('');
              }}
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
            >
              <option value="">{t('allCategories')}</option>
              {DEMO_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {getCategoryName(c)}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Filter */}
          {filteredSubcategories.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">{t('subcategoryLabel')}</label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
              >
                <option value="">{t('allSubcategories')}</option>
                {filteredSubcategories.map((s) => (
                  <option key={s.id} value={s.id}>
                    {getCategoryName(s)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Country Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">{t('countryLabel')}</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
            >
              <option value="">{t('allCountries')}</option>
              {DEMO_COUNTRIES.map((ct) => (
                <option key={ct.code} value={ct.code}>
                  {ct.name} ({ct.dial_code})
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">{t('cityLabel')}</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Surat, Dubai, San Jose..."
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Sort By Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700">{t('sortBy')}</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
            >
              <option value="highest_rated">{t('sortHighestRated')}</option>
              <option value="most_viewed">{t('sortMostViewed')}</option>
              <option value="newest">{t('sortNewest')}</option>
            </select>
          </div>
        </aside>

        {/* Right Results Grid */}
        <div className="lg:col-span-3 space-y-4">
          {/* Results Summary Bar */}
          <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-800">
              {businesses.length} {t('resultsFound')}
            </span>

            <div className="flex items-center space-x-2">
              {(query || category || country || city) && (
                <button
                  onClick={handleResetFilters}
                  className="text-brand-600 hover:text-brand-800 font-bold underline"
                >
                  {t('resetFilters')}
                </button>
              )}
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-slate-200/60 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : businesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((biz) => (
                <BusinessCard key={biz.id} business={biz} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t('noResults')}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {t('noResultsHint')}
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow transition"
              >
                {t('resetFilters')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading Business Directory...</div>}>
      <DirectoryContent />
    </Suspense>
  );
}
