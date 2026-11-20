'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Image as ImageIcon, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { createBusiness } from '../../lib/supabase';
import { DEMO_CATEGORIES, DEMO_SUBCATEGORIES, DEMO_COUNTRIES } from '../../lib/demoData';

export default function RegisterBusinessPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedSlug, setSubmittedSlug] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [categoryId, setCategoryId] = useState(DEMO_CATEGORIES[0].id);
  const [subcategoryId, setSubcategoryId] = useState('');

  const [countryCode, setCountryCode] = useState('IN');
  const [state, setState] = useState('Gujarat');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [website, setWebsite] = useState('');

  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !city || !phone || !email) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);
    const selectedCategory = DEMO_CATEGORIES.find(c => c.id === categoryId);
    const selectedSubcategory = DEMO_SUBCATEGORIES.find(s => s.id === subcategoryId);
    const selectedCountry = DEMO_COUNTRIES.find(c => c.code === countryCode);

    const res = await createBusiness({
      owner_id: user?.id || null,
      name,
      slug,
      tagline: tagline || undefined,
      description,
      category_id: categoryId,
      category_name: selectedCategory ? (language === 'gu' ? selectedCategory.name_gu : language === 'hi' ? selectedCategory.name_hi : selectedCategory.name_en) : 'Enterprise',
      subcategory_id: subcategoryId || null,
      subcategory_name: selectedSubcategory ? selectedSubcategory.name_en : undefined,
      country_code: countryCode,
      country_name: selectedCountry?.name || countryCode,
      state,
      city,
      address,
      postal_code: postalCode || undefined,
      phone,
      whatsapp: whatsapp || undefined,
      email,
      website: website || undefined,
      logo_url: logoUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop',
      cover_url: coverUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop',
      gallery_images: [
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop'
      ]
    });

    setIsSubmitting(false);
    if (res.success) {
      setSubmittedSlug(slug);
      setSuccess(true);
    }
  };

  const getCategoryName = (c: typeof DEMO_CATEGORIES[0]) => {
    if (language === 'gu') return c.name_gu;
    if (language === 'hi') return c.name_hi;
    return c.name_en;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {success ? (
        /* Success Screen */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-navy-900">
              {t('registrationSuccess')}
            </h1>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              {t('registrationSuccessMsg')}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Business Name:</span>
              <span className="font-bold text-slate-800">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-amber-600">Pending Admin Verification</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">City / Country:</span>
              <span className="font-bold text-slate-800">{city}, {countryCode}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/admin"
              className="px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm shadow transition"
            >
              Open Admin Approval Dashboard
            </Link>
            <Link
              href="/directory"
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition"
            >
              Back to Directory
            </Link>
          </div>
        </div>
      ) : (
        /* Registration Wizard */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-brand-900 p-8 sm:p-10 text-white">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-blue-200 text-xs font-semibold mb-3">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              <span>100% Free Listing • Zero Commission</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">{t('regTitle')}</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {t('regSubtitle')}
            </p>

            {/* Stepper indicator */}
            <div className="grid grid-cols-4 gap-2 mt-8">
              {[
                { num: 1, label: t('step1') },
                { num: 2, label: t('step2') },
                { num: 3, label: t('step3') },
                { num: 4, label: t('step4') },
              ].map((s) => (
                <div
                  key={s.num}
                  onClick={() => setStep(s.num)}
                  className={`cursor-pointer pb-2 border-b-2 text-xs transition ${
                    step === s.num
                      ? 'border-brand-400 text-white font-bold'
                      : step > s.num
                      ? 'border-emerald-400 text-emerald-300'
                      : 'border-white/20 text-white/50'
                  }`}
                >
                  <span className="block text-[10px] uppercase tracking-wider">Step {s.num}</span>
                  <span className="truncate block font-semibold">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Wizard Body */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
            {/* STEP 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-base font-bold text-navy-900 border-b pb-2">
                  1. Company Identity & Industry Classification
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('businessName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('businessNamePlaceholder')}
                    className="w-full text-sm border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('taglineLabel')}
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder={t('taglinePlaceholder')}
                    className="w-full text-sm border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('categoryLabel')} *
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => {
                        setCategoryId(e.target.value);
                        setSubcategoryId('');
                      }}
                      className="w-full text-sm border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 bg-white focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      {DEMO_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {getCategoryName(c)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('subcategoryLabel')}
                    </label>
                    <select
                      value={subcategoryId}
                      onChange={(e) => setSubcategoryId(e.target.value)}
                      className="w-full text-sm border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 bg-white focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      <option value="">None / General</option>
                      {DEMO_SUBCATEGORIES.filter(s => !s.parent_id || s.parent_id === categoryId).map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name_en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Location */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-base font-bold text-navy-900 border-b pb-2">
                  2. Physical Address & Geographic Location
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('countryLabel')} *
                    </label>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-full text-sm border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 bg-white focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      {DEMO_COUNTRIES.map((ct) => (
                        <option key={ct.code} value={ct.code}>
                          {ct.name} ({ct.dial_code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('stateLabel')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. Gujarat, California"
                      className="w-full text-sm border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('cityLabel')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Surat, Ahmedabad, Dubai"
                      className="w-full text-sm border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('addressLabel')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Plot / Office / Street address"
                    className="w-full text-sm border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('postalCodeLabel')}
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="PIN / Postal Code"
                    className="w-full sm:w-1/2 text-sm border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Contact Details */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-base font-bold text-navy-900 border-b pb-2">
                  3. Direct Customer & Buyer Contact Channels
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('phoneLabel')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 261 245 8899"
                      className="w-full text-sm border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('whatsappLabel')}
                    </label>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+919825123456"
                      className="w-full text-sm border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('emailLabel')} *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="info@yourcompany.com"
                      className="w-full text-sm border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('websiteLabel')}
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourcompany.com"
                      className="w-full text-sm border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Media & Overview */}
            {step === 4 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-base font-bold text-navy-900 border-b pb-2">
                  4. Company Overview & Visual Branding
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('descriptionLabel')} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('descriptionPlaceholder')}
                    className="w-full text-sm border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('logoUrlLabel')} (Optional)
                    </label>
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://.../logo.png"
                      className="w-full text-sm border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('coverUrlLabel')} (Optional)
                    </label>
                    <input
                      type="url"
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                      placeholder="https://.../cover.jpg"
                      className="w-full text-sm border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 flex items-start space-x-2.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                  <span>
                    Your business will be submitted to the 5 LP Business verification team with status <b>Pending Approval</b>. Admins review credentials to ensure zero scam listings.
                  </span>
                </div>
              </div>
            )}

            {/* Navigation Stepper Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 flex items-center space-x-2 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : <div />}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1 && !name) {
                      alert('Please provide your business name.');
                      return;
                    }
                    if (step === 2 && !city) {
                      alert('Please specify your city.');
                      return;
                    }
                    setStep(step + 1);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm flex items-center space-x-2 shadow transition"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm flex items-center space-x-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{isSubmitting ? t('loading') : t('submitRegistration')}</span>
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
