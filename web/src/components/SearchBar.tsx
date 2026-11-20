'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Grid, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DEMO_CATEGORIES, DEMO_COUNTRIES } from '../lib/demoData';

interface SearchBarProps {
  initialQuery?: string;
  initialCategory?: string;
  initialCountry?: string;
  initialCity?: string;
  isHero?: boolean;
}

export default function SearchBar({
  initialQuery = '',
  initialCategory = '',
  initialCountry = '',
  initialCity = '',
  isHero = false
}: SearchBarProps) {
  const router = useRouter();
  const { language, t } = useLanguage();

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [country, setCountry] = useState(initialCountry);
  const [city, setCity] = useState(initialCity);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (category) params.set('category', category);
    if (country) params.set('country', country);
    if (city.trim()) params.set('city', city.trim());

    router.push(`/directory?${params.toString()}`);
  };

  const getCategoryName = (c: typeof DEMO_CATEGORIES[0]) => {
    if (language === 'gu') return c.name_gu;
    if (language === 'hi') return c.name_hi;
    return c.name_en;
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`w-full rounded-2xl bg-white transition-all shadow-xl border border-slate-200/80 ${
        isHero ? 'p-3 md:p-4' : 'p-3'
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Keyword Search */}
        <div className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 focus-within:border-brand-500 focus-within:bg-white transition">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full text-sm bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 focus-within:border-brand-500 focus-within:bg-white transition">
          <Grid className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-sm bg-transparent text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="">{t('allCategories')}</option>
            {DEMO_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {getCategoryName(c)}
              </option>
            ))}
          </select>
        </div>

        {/* Country Dropdown */}
        <div className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 focus-within:border-brand-500 focus-within:bg-white transition">
          <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full text-sm bg-transparent text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="">{t('allCountries')}</option>
            {DEMO_COUNTRIES.map((ct) => (
              <option key={ct.code} value={ct.code}>
                {ct.name} ({ct.dial_code})
              </option>
            ))}
          </select>
        </div>

        {/* City Input & Submit Button */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t('allCities')}
            className="w-full text-sm bg-slate-50 border border-slate-200/80 px-3.5 py-2.5 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white transition"
          />

          <button
            type="submit"
            className="h-full px-5 py-2.5 bg-gradient-to-r from-brand-600 to-navy-900 hover:from-brand-700 hover:to-navy-950 text-white font-bold rounded-xl text-sm flex items-center justify-center space-x-1.5 shadow-md shadow-brand-600/20 transition flex-shrink-0"
          >
            <span>{t('searchButton')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
}
