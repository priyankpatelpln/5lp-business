'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  Search, 
  Heart, 
  PlusCircle, 
  ShieldCheck, 
  Menu, 
  X, 
  Globe, 
  User, 
  UserCheck, 
  LogOut 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { Language, UserRole } from '../types';

export default function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { user, isAdmin, logout, switchRole } = useAuth();
  const { favoriteCount } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/directory', label: t('directory') },
    { href: '/favorites', label: `${t('favorites')} (${favoriteCount})` },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Utility Bar: Quick Switcher & Global Network Notice */}
      <div className="bg-navy-900 text-white text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-200">
              5 LP Business Global Network: 10,000+ Verified Enterprises
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Quick Role Tester Switcher */}
            <div className="relative">
              <button 
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center space-x-1.5 text-blue-200 hover:text-white bg-navy-800 px-2.5 py-0.5 rounded border border-navy-700 transition"
                title="Switch active user role for testing"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                <span className="capitalize">Role: {user?.role || 'Guest'}</span>
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white text-slate-800 rounded-md shadow-xl border border-slate-200 py-1 z-50">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                    Switch Test Persona
                  </div>
                  {(['admin', 'business_owner', 'user'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 flex items-center justify-between ${
                        user?.role === r ? 'font-bold text-brand-600 bg-brand-50' : ''
                      }`}
                    >
                      <span className="capitalize">{r.replace('_', ' ')}</span>
                      {user?.role === r && <span className="text-brand-600">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Switcher Bar */}
            <div className="flex items-center space-x-1 bg-navy-800 p-0.5 rounded border border-navy-700">
              <Globe className="w-3 h-3 text-slate-400 ml-1" />
              {(['en', 'gu', 'hi'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition ${
                    language === lang 
                      ? 'bg-brand-600 text-white shadow-sm' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'gu' ? 'ગુજરાતી' : 'हिंदी'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Emblem */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-navy-900 via-brand-800 to-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-900/20 group-hover:scale-105 transition transform">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl font-black tracking-tight text-navy-900">5 LP</span>
                <span className="text-2xl font-black tracking-tight text-brand-600">BUSINESS</span>
              </div>
              <p className="text-[10px] tracking-widest text-slate-500 uppercase font-bold -mt-1">
                Global Business Directory
              </p>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    active
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-slate-700 hover:text-navy-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                href="/admin"
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center space-x-1.5 transition ${
                  pathname === '/admin'
                    ? 'text-amber-700 bg-amber-50'
                    : 'text-slate-700 hover:text-amber-700 hover:bg-amber-50/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>{t('adminDashboard')}</span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              </Link>
            )}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/register"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-brand-600 to-navy-800 hover:from-brand-700 hover:to-navy-900 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-brand-600/20 hover:shadow-lg transition transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('registerBusiness')}</span>
            </Link>

            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{user.full_name}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{user.role.replace('_', ' ')}</p>
                </div>
                <button
                  onClick={logout}
                  title={t('logout')}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center space-x-1.5 border border-slate-300 text-slate-700 hover:text-navy-900 hover:border-slate-400 px-3.5 py-2 rounded-lg text-sm font-semibold transition"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>{t('login')}</span>
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-navy-900 hover:bg-slate-100 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-semibold text-amber-700 bg-amber-50"
              >
                🛡️ {t('adminDashboard')}
              </Link>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center space-x-2 bg-brand-600 text-white py-3 rounded-lg font-bold text-center shadow"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{t('registerBusiness')}</span>
            </Link>
          </div>

          {user && (
            <div className="pt-2 flex items-center justify-between text-sm text-slate-600">
              <span>Signed in as <b className="text-slate-900">{user.full_name}</b></span>
              <button onClick={logout} className="text-red-600 font-semibold text-xs">
                {t('logout')}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
