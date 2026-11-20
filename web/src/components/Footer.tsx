'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, Mail, Phone, MapPin, ShieldCheck, Globe, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl font-black tracking-tight text-white">5 LP</span>
                <span className="text-2xl font-black tracking-tight text-brand-400">BUSINESS</span>
              </div>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              5 LP Business is the next-generation global business directory empowering verified enterprises, manufacturers, tech innovators, and trade networks to connect without borders.
            </p>

            <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-navy-900 border border-emerald-900/50 rounded-lg p-2.5 max-w-sm">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Rigorous Anti-Fraud & Business Verification Standards</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore Network
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/directory" className="hover:text-white transition">
                  Browse All Businesses
                </Link>
              </li>
              <li>
                <Link href="/directory?country=IN" className="hover:text-white transition">
                  Businesses in India
                </Link>
              </li>
              <li>
                <Link href="/directory?country=US" className="hover:text-white transition">
                  Enterprises in United States
                </Link>
              </li>
              <li>
                <Link href="/directory?country=AE" className="hover:text-white transition">
                  UAE & Middle East Network
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:text-white transition">
                  Saved Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* For Businesses */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              For Business Owners
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/register" className="text-brand-400 font-semibold hover:text-brand-300 transition flex items-center space-x-1">
                  <span>Register Business Free</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Owner Sign In
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition">
                  Admin Verification Portal
                </Link>
              </li>
              <li>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-brand-900 text-brand-300 border border-brand-700 mt-2">
                  Zero Commission / 100% Free
                </span>
              </li>
            </ul>
          </div>

          {/* Direct Support */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Support & Inquiries
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2.5 text-slate-400">
                <Mail className="w-4 h-4 text-brand-400" />
                <span>support@5lpbusiness.com</span>
              </li>
              <li className="flex items-center space-x-2.5 text-slate-400">
                <Phone className="w-4 h-4 text-brand-400" />
                <span>+91 (0) 79 4001 8899</span>
              </li>
              <li className="flex items-center space-x-2.5 text-slate-400">
                <Globe className="w-4 h-4 text-brand-400" />
                <span>Multi-Region Cloud Infrastructure</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} 5 LP Business Directory Inc. All global rights reserved.</p>
          <div className="flex space-x-6">
            <span>English • ગુજરાતી • हिंदी</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Report Fraud</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
