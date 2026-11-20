'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Mail, Lock, User, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole } from '../../types';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { login, signup, switchRole, user } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('business_owner');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (mode === 'signin') {
      await login(email);
    } else {
      await signup(fullName, email, selectedRole);
    }
    setIsSubmitting(false);
    router.push('/');
  };

  const handleQuickLogin = (role: UserRole) => {
    switchRole(role);
    if (role === 'admin') {
      router.push('/admin');
    } else if (role === 'business_owner') {
      router.push('/register');
    } else {
      router.push('/directory');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        {/* Emblem */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-navy-900 to-brand-600 flex items-center justify-center text-white mx-auto shadow-md">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-navy-900">
            {mode === 'signin' ? t('login') : t('signup')}
          </h1>
          <p className="text-xs text-slate-500">
            Access your 5 LP Business account, manage listings, or review verified submissions.
          </p>
        </div>

        {/* 1-Click Quick Persona Logins for instant evaluation */}
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 space-y-2">
          <p className="text-[10px] uppercase font-bold text-slate-400 text-center tracking-wider">
            Quick 1-Click Test Personas
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="px-2 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition flex items-center justify-center space-x-1"
            >
              <span>🛡️ Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('business_owner')}
              className="px-2 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs font-bold transition flex items-center justify-center space-x-1"
            >
              <span>🏢 Owner</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('user')}
              className="px-2 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition flex items-center justify-center space-x-1"
            >
              <span>👤 User</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Bhavesh Patel"
                  className="w-full text-sm border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full text-sm border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Type</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 text-slate-800 bg-white focus:outline-none focus:border-brand-500"
              >
                <option value="business_owner">Business Owner (Can list & manage businesses)</option>
                <option value="user">Regular User (Can save favorites & inquire)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-navy-900 hover:from-brand-700 hover:to-navy-950 text-white font-bold text-sm shadow transition"
          >
            {isSubmitting ? t('loading') : mode === 'signin' ? t('login') : t('signup')}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          {mode === 'signin' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-brand-600 font-bold hover:underline"
              >
                Register for Free
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-brand-600 font-bold hover:underline"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
