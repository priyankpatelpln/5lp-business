export type Language = 'en' | 'gu' | 'hi';

export type UserRole = 'user' | 'business_owner' | 'admin';

export type BusinessStatus = 'pending' | 'approved' | 'rejected';

export type ReportStatus = 'pending' | 'investigated' | 'dismissed';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name_en: string;
  name_gu: string;
  name_hi: string;
  icon: string;
  parent_id?: string | null;
  sort_order?: number;
}

export interface Country {
  code: string;
  name: string;
  dial_code: string;
}

export interface Business {
  id: string;
  owner_id?: string | null;
  name: string;
  slug: string;
  tagline?: string;
  description: string;
  category_id: string;
  category_name?: string;
  subcategory_id?: string | null;
  subcategory_name?: string;
  country_code: string;
  country_name?: string;
  state: string;
  city: string;
  address: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  whatsapp?: string;
  email: string;
  website?: string;
  logo_url?: string;
  cover_url?: string;
  gallery_images?: string[];
  status: BusinessStatus;
  is_featured: boolean;
  is_verified: boolean;
  rejection_reason?: string | null;
  view_count: number;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessReport {
  id: string;
  business_id: string;
  business_name?: string;
  reporter_name: string;
  reporter_email: string;
  reason: string;
  details?: string;
  status: ReportStatus;
  admin_notes?: string;
  created_at: string;
}
