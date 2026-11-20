import { createClient } from '@supabase/supabase-js';
import { Business, BusinessReport, Category, Country } from '../types';
import { DEMO_CATEGORIES, DEMO_COUNTRIES, INITIAL_DEMO_BUSINESSES, INITIAL_DEMO_REPORTS } from './demoData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if valid credentials are provided
export const isConfigured = 
  Boolean(supabaseUrl) && 
  Boolean(supabaseAnonKey) && 
  !supabaseUrl.includes('sample-5lp-business') &&
  !supabaseAnonKey.includes('dummy-anon-key');

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local In-Memory / LocalStorage State Store for Demo & Offline Testing
const STORAGE_KEY_BIZ = '5lp_businesses_store';
const STORAGE_KEY_REPORTS = '5lp_reports_store';

function getStoredBusinesses(): Business[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_BUSINESSES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BIZ);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_BIZ, JSON.stringify(INITIAL_DEMO_BUSINESSES));
      return INITIAL_DEMO_BUSINESSES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_BUSINESSES;
  }
}

function saveStoredBusinesses(businesses: Business[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_BIZ, JSON.stringify(businesses));
  } catch (e) {
    console.error('Failed to save businesses to storage', e);
  }
}

function getStoredReports(): BusinessReport[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_REPORTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REPORTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(INITIAL_DEMO_REPORTS));
      return INITIAL_DEMO_REPORTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_REPORTS;
  }
}

function saveStoredReports(reports: BusinessReport[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save reports to storage', e);
  }
}

/**
 * High-level business data access methods with Supabase and Demo Fallback
 */
export async function getBusinesses(filter?: {
  status?: string;
  category_id?: string;
  country_code?: string;
  query?: string;
}): Promise<Business[]> {
  if (isConfigured && supabase) {
    try {
      let query = supabase.from('businesses').select('*');
      if (filter?.status) {
        query = query.eq('status', filter.status);
      } else {
        query = query.eq('status', 'approved');
      }
      if (filter?.category_id) {
        query = query.eq('category_id', filter.category_id);
      }
      if (filter?.country_code) {
        query = query.eq('country_code', filter.country_code);
      }
      if (filter?.query) {
        query = query.ilike('name', `%${filter.query}%`);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Business[];
      }
    } catch (e) {
      console.warn('Supabase query failed, falling back to local dataset', e);
    }
  }

  // Fallback to local store
  let results = getStoredBusinesses();
  if (filter?.status) {
    results = results.filter(b => b.status === filter.status);
  } else {
    results = results.filter(b => b.status === 'approved');
  }
  if (filter?.category_id) {
    results = results.filter(b => b.category_id === filter.category_id);
  }
  if (filter?.country_code) {
    results = results.filter(b => b.country_code === filter.country_code);
  }
  if (filter?.query) {
    const q = filter.query.toLowerCase();
    results = results.filter(b => 
      b.name.toLowerCase().includes(q) ||
      (b.tagline && b.tagline.toLowerCase().includes(q)) ||
      b.city.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q)
    );
  }
  return results;
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) {
        return data as Business;
      }
    } catch (e) {
      console.warn('Supabase getBusinessBySlug failed, using local store', e);
    }
  }

  const list = getStoredBusinesses();
  return list.find(b => b.slug === slug) || null;
}

export async function createBusiness(biz: Omit<Business, 'id' | 'created_at' | 'updated_at' | 'status' | 'view_count' | 'rating' | 'review_count' | 'is_featured' | 'is_verified'>): Promise<{ success: boolean; data?: Business; error?: string }> {
  const newBusiness: Business = {
    ...biz,
    id: 'biz-' + Date.now(),
    status: 'pending',
    is_featured: false,
    is_verified: false,
    view_count: 1,
    rating: 5.0,
    review_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('businesses').insert([newBusiness]).select().single();
      if (!error && data) {
        return { success: true, data: data as Business };
      }
    } catch (e: any) {
      console.warn('Supabase insert failed, saving to local store', e);
    }
  }

  // Local fallback save
  const current = getStoredBusinesses();
  current.unshift(newBusiness);
  saveStoredBusinesses(current);
  return { success: true, data: newBusiness };
}

export async function updateBusinessStatus(id: string, status: 'approved' | 'rejected', reason?: string): Promise<boolean> {
  if (isConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ status, rejection_reason: reason || null, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase update status failed, updating local store', e);
    }
  }

  const list = getStoredBusinesses();
  const idx = list.findIndex(b => b.id === id);
  if (idx !== -1) {
    list[idx].status = status;
    if (reason) list[idx].rejection_reason = reason;
    list[idx].updated_at = new Date().toISOString();
    saveStoredBusinesses(list);
    return true;
  }
  return false;
}

export async function toggleBusinessVerification(id: string, verified: boolean): Promise<boolean> {
  const list = getStoredBusinesses();
  const idx = list.findIndex(b => b.id === id);
  if (idx !== -1) {
    list[idx].is_verified = verified;
    saveStoredBusinesses(list);
    return true;
  }
  return false;
}

export async function createBusinessReport(report: Omit<BusinessReport, 'id' | 'created_at' | 'status'>): Promise<boolean> {
  const newReport: BusinessReport = {
    ...report,
    id: 'rep-' + Date.now(),
    status: 'pending',
    created_at: new Date().toISOString()
  };

  if (isConfigured && supabase) {
    try {
      const { error } = await supabase.from('business_reports').insert([newReport]);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase report insert failed, saving locally', e);
    }
  }

  const reports = getStoredReports();
  reports.unshift(newReport);
  saveStoredReports(reports);
  return true;
}

export async function getBusinessReports(): Promise<BusinessReport[]> {
  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('business_reports').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as BusinessReport[];
    } catch (e) {
      console.warn('Supabase getReports failed, using local store', e);
    }
  }
  return getStoredReports();
}

export async function dismissReport(id: string): Promise<boolean> {
  const reports = getStoredReports();
  const idx = reports.findIndex(r => r.id === id);
  if (idx !== -1) {
    reports[idx].status = 'dismissed';
    saveStoredReports(reports);
    return true;
  }
  return false;
}

export async function getAllBusinessesAdmin(): Promise<Business[]> {
  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('businesses').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Business[];
    } catch (e) {
      console.warn('Supabase getAllBusinessesAdmin failed', e);
    }
  }
  return getStoredBusinesses();
}
