'use client';

import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Twitter, Linkedin, Share2 } from 'lucide-react';
import { Business } from '../types';

interface ShareModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ business, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const url = typeof window !== 'undefined' 
    ? `${window.location.origin}/business/${business.slug}`
    : `https://5lpbusiness.com/business/${business.slug}`;

  const shareText = `Check out ${business.name} on 5 LP Business Directory!`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: business.name,
          text: shareText,
          url: url,
        });
      } catch {
        // user cancelled
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-brand-600" />
            <h3 className="text-lg font-bold text-navy-900">Share Business</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div>
            <p className="text-sm font-semibold text-slate-800">{business.name}</p>
            <p className="text-xs text-slate-500 truncate">{business.tagline || business.city}</p>
          </div>

          {/* Social share options */}
          <div className="grid grid-cols-3 gap-3">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
            >
              <MessageSquare className="w-6 h-6 mb-1 text-emerald-600" />
              <span className="text-xs font-bold">WhatsApp</span>
            </a>

            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition"
            >
              <Twitter className="w-6 h-6 mb-1 text-sky-500" />
              <span className="text-xs font-bold">Twitter</span>
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
            >
              <Linkedin className="w-6 h-6 mb-1 text-blue-600" />
              <span className="text-xs font-bold">LinkedIn</span>
            </a>
          </div>

          {/* Link Copy Bar */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Direct Link</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={url}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-navy-900 hover:bg-navy-800 text-white'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Native mobile share if supported */}
          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              More System Share Options...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
