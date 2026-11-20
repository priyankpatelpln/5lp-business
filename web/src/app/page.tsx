'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Globe2, 
  Users, 
  MessageSquare, 
  Award,
  TrendingUp,
  Laptop,
  Factory,
  Utensils,
  HeartPulse,
  BadgeDollarSign,
  Store,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SearchBar from '../components/SearchBar';
import BusinessCard from '../components/BusinessCard';
import { DEMO_CATEGORIES } from '../lib/demoData';
import { getBusinesses } from '../lib/supabase';
import { Business } from '../types';

export default function HomePage() {
  const { language, t } = useLanguage();
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getBusinesses({ status: 'approved' });
      // pick featured or top rated
      const featured = data.filter(b => b.is_featured);
      setFeaturedBusinesses(featured.length > 0 ? featured.slice(0, 4) : data.slice(0, 4));
      setLoading(false);
    }
    loadData();
  }, []);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop': return <Laptop className="w-6 h-6" />;
      case 'Factory': return <Factory className="w-6 h-6" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6" />;
      case 'Utensils': return <Utensils className="w-6 h-6" />;
      case 'HeartPulse': return <HeartPulse className="w-6 h-6" />;
      case 'BadgeDollarSign': return <BadgeDollarSign className="w-6 h-6" />;
      case 'Building2': return <Building2 className="w-6 h-6" />;
      case 'Store': return <Store className="w-6 h-6" />;
      default: return <Building2 className="w-6 h-6" />;
    }
  };

  const getCategoryName = (c: typeof DEMO_CATEGORIES[0]) => {
    if (language === 'gu') return c.name_gu;
    if (language === 'hi') return c.name_hi;
    return c.name_en;
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white pt-16 pb-24 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle decorative glow elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-navy-800/90 border border-brand-500/30 text-blue-200 text-xs font-semibold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>5 LP Business • Global Verified Network • English / ગુજરાતી / हिंदी</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            {t('heroTitle')}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Hero Search Box */}
          <div className="pt-4 max-w-4xl mx-auto text-left">
            <SearchBar isHero />
          </div>

          {/* Popular Quick Search Tags */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400 font-medium">Popular:</span>
            {[
              { label: 'Surat Diamonds', href: '/directory?q=Diamond' },
              { label: 'Cloud & AI Tech', href: '/directory?q=Cloud' },
              { label: 'Organic Spices', href: '/directory?q=Spices' },
              { label: 'Dubai Real Estate', href: '/directory?country=AE' },
              { label: 'Ahmedabad IT', href: '/directory?city=Ahmedabad' },
            ].map((tag) => (
              <Link
                key={tag.label}
                href={tag.href}
                className="px-3 py-1 rounded-full bg-navy-800/70 hover:bg-brand-600 hover:text-white border border-navy-700 transition"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. STATS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="border-r border-slate-100 last:border-none">
            <div className="flex items-center justify-center space-x-1.5 text-brand-600 mb-1">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-2xl sm:text-3xl font-black text-navy-900">10,000+</span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Businesses</p>
          </div>

          <div className="border-r border-slate-100 last:border-none">
            <div className="flex items-center justify-center space-x-1.5 text-brand-600 mb-1">
              <Globe2 className="w-5 h-5" />
              <span className="text-2xl sm:text-3xl font-black text-navy-900">45+</span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Countries Active</p>
          </div>

          <div className="border-r border-slate-100 last:border-none">
            <div className="flex items-center justify-center space-x-1.5 text-brand-600 mb-1">
              <MessageSquare className="w-5 h-5" />
              <span className="text-2xl sm:text-3xl font-black text-navy-900">Direct</span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">WhatsApp & Calls</p>
          </div>

          <div>
            <div className="flex items-center justify-center space-x-1.5 text-emerald-600 mb-1">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-2xl sm:text-3xl font-black text-navy-900">100% Free</span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registration</p>
          </div>
        </div>
      </section>

      {/* 3. BROWSE BY CATEGORY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Industry Sectors
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">
              {t('exploreCategories')}
            </h2>
          </div>
          <Link
            href="/directory"
            className="inline-flex items-center space-x-1.5 text-sm font-bold text-brand-600 hover:text-brand-800 transition group"
          >
            <span>{t('viewAllBusinesses')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {DEMO_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/directory?category=${cat.id}`}
              className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-brand-500 hover:shadow-lg hover:-translate-y-1 transition duration-200 flex flex-col justify-between"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 group-hover:bg-brand-600 text-brand-600 group-hover:text-white flex items-center justify-center transition mb-4">
                {getCategoryIcon(cat.icon)}
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition">
                  {getCategoryName(cat)}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                  <span>Browse Directory</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED GLOBAL BUSINESSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Hand-Picked Leaders
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">
              {t('featuredBusinesses')}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {t('featuredSubtitle')}
            </p>
          </div>
          <Link
            href="/directory"
            className="inline-flex items-center space-x-1.5 text-sm font-bold text-brand-600 hover:text-brand-800 transition group"
          >
            <span>{t('viewAllBusinesses')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBusinesses.map((biz) => (
              <BusinessCard key={biz.id} business={biz} featured />
            ))}
          </div>
        )}
      </section>

      {/* 5. WHY CHOOSE 5 LP BUSINESS */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Trust & Credibility
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">
              {t('whyChooseUs')}
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Built specifically to eliminate middlemen, protect buyers from fraudulent companies, and empower genuine global enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                ✓
              </div>
              <h3 className="font-bold text-slate-900">{t('trustTitle1')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('trustDesc1')}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">{t('trustTitle2')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('trustDesc2')}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">{t('trustTitle3')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('trustDesc3')}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">{t('trustTitle4')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('trustDesc4')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION FOR FREE REGISTRATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-brand-900 p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-brand-600 text-white">
              Zero Listing Fees • Immediate Global Reach
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              {t('ctaTitle')}
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              {t('ctaSubtitle')}
            </p>
            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center space-x-2 bg-white text-navy-950 hover:bg-slate-100 px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
              >
                <span>{t('ctaButton')}</span>
                <ArrowRight className="w-4 h-4 text-brand-600" />
              </Link>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
            <Building2 className="w-96 h-96 text-white" />
          </div>
        </div>
      </section>
    </div>
  );
}
