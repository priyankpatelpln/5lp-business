-- 5 LP Business Database Schema
-- Migration 001: Initial Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom ENUM types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'business_owner', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE business_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('pending', 'investigated', 'dismissed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. User Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role user_role DEFAULT 'user'::user_role NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Categories & Subcategories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name_en TEXT NOT NULL,
    name_gu TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'Briefcase',
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Countries, States, Cities
CREATE TABLE IF NOT EXISTS public.countries (
    code VARCHAR(2) PRIMARY KEY,
    name TEXT NOT NULL,
    dial_code TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_code VARCHAR(2) NOT NULL REFERENCES public.countries(code) ON DELETE CASCADE,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state_id UUID NOT NULL REFERENCES public.states(id) ON DELETE CASCADE,
    name TEXT NOT NULL
);

-- 4. Businesses Table
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    subcategory_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    country_code VARCHAR(2) NOT NULL REFERENCES public.countries(code) ON DELETE RESTRICT,
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    postal_code TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT NOT NULL,
    website TEXT,
    logo_url TEXT,
    cover_url TEXT,
    gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    status business_status DEFAULT 'pending'::business_status NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    is_verified BOOLEAN DEFAULT false NOT NULL,
    rejection_reason TEXT,
    view_count INT DEFAULT 0 NOT NULL,
    rating NUMERIC(2,1) DEFAULT 5.0 NOT NULL,
    review_count INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Business Reports (Fake business reporting system)
CREATE TABLE IF NOT EXISTS public.business_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    reporter_name TEXT NOT NULL,
    reporter_email TEXT NOT NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status report_status DEFAULT 'pending'::report_status NOT NULL,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    resolved_at TIMESTAMPTZ
);

-- 6. User Favorites
CREATE TABLE IF NOT EXISTS public.favorites (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (user_id, business_id)
);

-- Indexes for lightning fast global search & filter performance
CREATE INDEX IF NOT EXISTS idx_businesses_status ON public.businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON public.businesses(category_id);
CREATE INDEX IF NOT EXISTS idx_businesses_subcategory ON public.businesses(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_businesses_country ON public.businesses(country_code);
CREATE INDEX IF NOT EXISTS idx_businesses_city ON public.businesses(city);
CREATE INDEX IF NOT EXISTS idx_businesses_owner ON public.businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_businesses_featured ON public.businesses(is_featured);

-- Full text search index on business name, tagline, description, city
CREATE INDEX IF NOT EXISTS idx_businesses_search ON public.businesses USING gin(
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(tagline, '') || ' ' || coalesce(description, '') || ' ' || coalesce(city, ''))
);

-- Trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_businesses_updated_at ON public.businesses;
CREATE TRIGGER set_businesses_updated_at
BEFORE UPDATE ON public.businesses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user profile auto-creation from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.email,
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user'::user_role)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- 5 LP Business Database Schema
-- Migration 002: Row Level Security (RLS) Policies

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current authenticated user is an Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

---------------------------------------------------------
-- 1. PROFILES POLICIES
---------------------------------------------------------
-- Anyone can view basic public profile info
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admins can update any profile (e.g. elevate roles)
CREATE POLICY "Admins can update any profile"
ON public.profiles FOR ALL
USING (public.is_admin());

---------------------------------------------------------
-- 2. CATEGORIES & LOCATIONS (PUBLIC READ, ADMIN WRITE)
---------------------------------------------------------
CREATE POLICY "Categories are readable by everyone"
ON public.categories FOR SELECT
USING (true);

CREATE POLICY "Categories can only be modified by admins"
ON public.categories FOR ALL
USING (public.is_admin());

CREATE POLICY "Countries are readable by everyone"
ON public.countries FOR SELECT
USING (true);

CREATE POLICY "States are readable by everyone"
ON public.states FOR SELECT
USING (true);

CREATE POLICY "Cities are readable by everyone"
ON public.cities FOR SELECT
USING (true);

---------------------------------------------------------
-- 3. BUSINESSES POLICIES
---------------------------------------------------------
-- Everyone can view approved businesses
CREATE POLICY "Approved businesses are viewable by everyone"
ON public.businesses FOR SELECT
USING (status = 'approved');

-- Business owners can view their own businesses regardless of status
CREATE POLICY "Owners can view own businesses"
ON public.businesses FOR SELECT
USING (auth.uid() = owner_id);

-- Admins can view all businesses (pending, rejected, approved)
CREATE POLICY "Admins can view all businesses"
ON public.businesses FOR SELECT
USING (public.is_admin());

-- Authenticated users can register/insert new businesses (status defaults to pending)
CREATE POLICY "Authenticated users can create businesses"
ON public.businesses FOR INSERT
WITH CHECK (
    auth.role() = 'authenticated' AND
    (auth.uid() = owner_id OR owner_id IS NULL)
);

-- Owners can edit their own business details
CREATE POLICY "Owners can update own business"
ON public.businesses FOR UPDATE
USING (auth.uid() = owner_id)
WITH CHECK (
    auth.uid() = owner_id AND
    -- Prevent non-admins from self-approving their business
    (status = 'pending' OR status = (SELECT status FROM public.businesses WHERE id = id))
);

-- Admins can update any business (approve, reject, feature, verify)
CREATE POLICY "Admins can update any business"
ON public.businesses FOR UPDATE
USING (public.is_admin());

-- Owners can delete their business, admins can delete any
CREATE POLICY "Owners can delete own business"
ON public.businesses FOR DELETE
USING (auth.uid() = owner_id OR public.is_admin());

---------------------------------------------------------
-- 4. BUSINESS REPORTS POLICIES
---------------------------------------------------------
-- Any user (even anonymous/guest) can report a fraudulent or fake business
CREATE POLICY "Anyone can report a business"
ON public.business_reports FOR INSERT
WITH CHECK (true);

-- Only admins can view, update, or dismiss reports
CREATE POLICY "Admins can manage business reports"
ON public.business_reports FOR ALL
USING (public.is_admin());

---------------------------------------------------------
-- 5. FAVORITES POLICIES
---------------------------------------------------------
-- Users can view their own favorites
CREATE POLICY "Users can view own favorites"
ON public.favorites FOR SELECT
USING (auth.uid() = user_id);

-- Users can add favorites
CREATE POLICY "Users can add favorites"
ON public.favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete own favorites"
ON public.favorites FOR DELETE
USING (auth.uid() = user_id);
-- 5 LP Business Database Schema
-- Migration 003: Storage Buckets & Policies

-- Create storage buckets for business media
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('business-logos', 'business-logos', true),
    ('business-covers', 'business-covers', true),
    ('business-gallery', 'business-gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for logos, covers, and gallery images
CREATE POLICY "Public Read Access for Business Logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-logos');

CREATE POLICY "Public Read Access for Business Covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-covers');

CREATE POLICY "Public Read Access for Business Gallery"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-gallery');

-- Authenticated upload access
CREATE POLICY "Authenticated users can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'business-logos');

CREATE POLICY "Authenticated users can upload covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'business-covers');

CREATE POLICY "Authenticated users can upload gallery images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'business-gallery');

-- Users can update and delete their uploaded objects
CREATE POLICY "Users can update own business images"
ON storage.objects FOR UPDATE
TO authenticated
USING (auth.uid() = owner);

CREATE POLICY "Users can delete own business images"
ON storage.objects FOR DELETE
TO authenticated
USING (auth.uid() = owner);
-- 5 LP Business Database Schema
-- Migration 004: Seed Data (Demo data clearly identified)

-- 1. Insert Countries
INSERT INTO public.countries (code, name, dial_code) VALUES
('IN', 'India', '+91'),
('US', 'United States', '+1'),
('GB', 'United Kingdom', '+44'),
('AE', 'United Arab Emirates', '+971'),
('CA', 'Canada', '+1'),
('AU', 'Australia', '+61'),
('SG', 'Singapore', '+65'),
('DE', 'Germany', '+49')
ON CONFLICT (code) DO NOTHING;

-- 2. Insert Primary Categories
INSERT INTO public.categories (id, slug, name_en, name_gu, name_hi, icon, sort_order) VALUES
('11111111-1111-1111-1111-111111111101', 'technology-software', 'Technology & IT', 'àªŸà«‡àª•àª¨à«‹àª²à«‹àªœà«€ àª…àª¨à«‡ àª¸à«‹àª«à«àªŸàªµà«‡àª°', 'à¤ªà¥à¤°à¥Œà¤¦à¥à¤¯à¥‹à¤—à¤¿à¤•à¥€ à¤”à¤° à¤†à¤ˆà¤Ÿà¥€', 'Laptop', 1),
('11111111-1111-1111-1111-111111111102', 'manufacturing-textiles', 'Manufacturing & Textiles', 'àª‰àª¤à«àªªàª¾àª¦àª¨ àª…àª¨à«‡ àª•àª¾àªªàª¡ àª‰àª¦à«àª¯à«‹àª—', 'à¤µà¤¿à¤¨à¤¿à¤°à¥à¤®à¤¾à¤£ à¤”à¤° à¤µà¤¸à¥à¤¤à¥à¤°', 'Factory', 2),
('11111111-1111-1111-1111-111111111103', 'gems-jewelry', 'Gems & Jewelry', 'àª¹à«€àª°àª¾ àª…àª¨à«‡ àªàªµà«‡àª°àª¾àª¤', 'à¤°à¤¤à¥à¤¨ à¤”à¤° à¤†à¤­à¥‚à¤·à¤£', 'Sparkles', 3),
('11111111-1111-1111-1111-111111111104', 'food-agriculture', 'Food & Agriculture', 'àª–àª¾àª¦à«àª¯ àª…àª¨à«‡ àª•à«ƒàª·àª¿', 'à¤–à¤¾à¤¦à¥à¤¯ à¤”à¤° à¤•à¥ƒà¤·à¤¿', 'Utensils', 4),
('11111111-1111-1111-1111-111111111105', 'healthcare-medical', 'Healthcare & Medical', 'àª†àª°à«‹àª—à«àª¯ àª…àª¨à«‡ àª¤àª¬à«€àª¬à«€', 'à¤¸à¥à¤µà¤¾à¤¸à¥à¤¥à¥à¤¯ à¤”à¤° à¤šà¤¿à¤•à¤¿à¤¤à¥à¤¸à¤¾', 'HeartPulse', 5),
('11111111-1111-1111-1111-111111111106', 'finance-legal', 'Finance & Legal Services', 'àª¨àª¾àª£àª¾àª•à«€àª¯ àª…àª¨à«‡ àª•àª¾àª¨à«‚àª¨à«€ àª¸à«‡àªµàª¾àª“', 'à¤µà¤¿à¤¤à¥à¤¤ à¤”à¤° à¤•à¤¾à¤¨à¥‚à¤¨à¥€ à¤¸à¥‡à¤µà¤¾à¤à¤‚', 'BadgeDollarSign', 6),
('11111111-1111-1111-1111-111111111107', 'real-estate-construction', 'Real Estate & Infrastructure', 'àª°àª¿àª¯àª² àªàª¸à«àªŸà«‡àªŸ àª…àª¨à«‡ àª¬àª¾àª‚àª§àª•àª¾àª®', 'à¤°à¤¿à¤¯à¤² à¤à¤¸à¥à¤Ÿà¥‡à¤Ÿ à¤”à¤° à¤¨à¤¿à¤°à¥à¤®à¤¾à¤£', 'Building2', 7),
('11111111-1111-1111-1111-111111111108', 'retail-wholesale', 'Retail & Wholesale', 'àª›à«‚àªŸàª• àª…àª¨à«‡ àªœàª¥à«àª¥àª¾àª¬àª‚àª§ àªµà«‡àªªàª¾àª°', 'à¤–à¥à¤¦à¤°à¤¾ à¤”à¤° à¤¥à¥‹à¤• à¤µà¥à¤¯à¤¾à¤ªà¤¾à¤°', 'Store', 8)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Subcategories
INSERT INTO public.categories (id, slug, name_en, name_gu, name_hi, icon, parent_id, sort_order) VALUES
('22222222-2222-2222-2222-222222222101', 'web-app-dev', 'Web & Mobile App Development', 'àªµà«‡àª¬ àª…àª¨à«‡ àª®à«‹àª¬àª¾àª‡àª² àªàªª àª¡à«‡àªµàª²àªªàª®à«‡àª¨à«àªŸ', 'à¤µà¥‡à¤¬ à¤”à¤° à¤®à¥‹à¤¬à¤¾à¤‡à¤² à¤à¤ª à¤µà¤¿à¤•à¤¾à¤¸', 'Code', '11111111-1111-1111-1111-111111111101', 1),
('22222222-2222-2222-2222-222222222102', 'cloud-ai-solutions', 'Cloud & AI Solutions', 'àª•à«àª²àª¾àª‰àª¡ àª…àª¨à«‡ AI àª¸à«‹àª²à«àª¯à«àª¶àª¨à«àª¸', 'à¤•à¥à¤²à¤¾à¤‰à¤¡ à¤”à¤° à¤à¤†à¤ˆ à¤¸à¤®à¤¾à¤§à¤¾à¤¨', 'Cloud', '11111111-1111-1111-1111-111111111101', 2),
('22222222-2222-2222-2222-222222222201', 'textile-garments', 'Textiles & Garments', 'àª•àª¾àªªàª¡ àª…àª¨à«‡ àª—àª¾àª°àª®à«‡àª¨à«àªŸà«àª¸', 'à¤•à¤ªà¤¡à¤¼à¤¾ à¤”à¤° à¤ªà¤°à¤¿à¤§à¤¾à¤¨', 'Shirt', '11111111-1111-1111-1111-111111111102', 1),
('22222222-2222-2222-2222-222222222202', 'diamond-processing', 'Diamond Cutting & Polishing', 'àª¡àª¾àª¯àª®àª‚àª¡ àª•àªŸà«€àª‚àª— àª…àª¨à«‡ àªªà«‹àª²àª¿àª¶àª¿àª‚àª—', 'à¤¹à¥€à¤°à¤¾ à¤¤à¤°à¤¾à¤¶à¤¨à¤¾ à¤”à¤° à¤ªà¥‰à¤²à¤¿à¤¶', 'Gem', '11111111-1111-1111-1111-111111111103', 1),
('22222222-2222-2222-2222-222222222203', 'gold-jewelry', 'Gold & Heritage Jewelry', 'àª¸à«‹àª¨àª¾ àª…àª¨à«‡ àª¹à«‡àª°àª¿àªŸà«‡àªœ àª˜àª°à«‡àª£àª¾àª‚', 'à¤¸à¥‹à¤¨à¥‡ à¤”à¤° à¤µà¤¿à¤°à¤¾à¤¸à¤¤ à¤•à¥‡ à¤†à¤­à¥‚à¤·à¤£', 'Crown', '11111111-1111-1111-1111-111111111103', 2),
('22222222-2222-2222-2222-222222222401', 'organic-spices', 'Organic Spices & Export', 'àª“àª°à«àª—à«‡àª¨àª¿àª• àª®àª¸àª¾àª²àª¾ àª…àª¨à«‡ àª¨àª¿àª•àª¾àª¸', 'à¤œà¥ˆà¤µà¤¿à¤• à¤®à¤¸à¤¾à¤²à¥‡ à¤”à¤° à¤¨à¤¿à¤°à¥à¤¯à¤¾à¤¤', 'Wheat', '11111111-1111-1111-1111-111111111104', 1),
('22222222-2222-2222-2222-222222222501', 'pharma-formulations', 'Pharmaceuticals & Health', 'àª«àª¾àª°à«àª®àª¾àª¸à«àª¯à«àªŸàª¿àª•àª²à«àª¸ àª…àª¨à«‡ àª¹à«‡àª²à«àª¥', 'à¤«à¤¾à¤°à¥à¤®à¤¾à¤¸à¥à¤¯à¥‚à¤Ÿà¤¿à¤•à¤²à¥à¤¸ à¤”à¤° à¤¸à¥à¤µà¤¾à¤¸à¥à¤¥à¥à¤¯', 'Pill', '11111111-1111-1111-1111-111111111105', 1),
('22222222-2222-2222-2222-222222222701', 'commercial-construction', 'Commercial & Industrial Projects', 'àª•à«‹àª®àª°à«àª¶àª¿àª¯àª² àª…àª¨à«‡ àª”àª¦à«àª¯à«‹àª—àª¿àª• àªªà«àª°à«‹àªœà«‡àª•à«àªŸà«àª¸', 'à¤µà¤¾à¤£à¤¿à¤œà¥à¤¯à¤¿à¤• à¤”à¤° à¤”à¤¦à¥à¤¯à¥‹à¤—à¤¿à¤• à¤ªà¤°à¤¿à¤¯à¥‹à¤œà¤¨à¤¾à¤à¤‚', 'HardHat', '11111111-1111-1111-1111-111111111107', 1)
ON CONFLICT (id) DO NOTHING;

-- 4. Demo Approved Global Businesses
INSERT INTO public.businesses (
    id, name, slug, tagline, description, category_id, subcategory_id,
    country_code, state, city, address, postal_code, latitude, longitude,
    phone, whatsapp, email, website, logo_url, cover_url, gallery_images,
    status, is_featured, is_verified, rating, review_count, view_count
) VALUES
(
    '33333333-3333-3333-3333-333333333001',
    'Apex Global Technologies',
    'apex-global-technologies',
    'Next-Gen Enterprise Cloud & AI Engineering',
    'Apex Global Technologies is an ISO-certified enterprise software, mobile app, and artificial intelligence solutions provider. Delivering scalable cloud architectures, AI automation, and high-performance cross-platform mobile apps for Fortune 500 and SME clients worldwide.',
    '11111111-1111-1111-1111-111111111101',
    '22222222-2222-2222-2222-222222222102',
    'IN', 'Gujarat', 'Ahmedabad',
    'Tower B, 8th Floor, Sindhu Bhavan Road, Bodakdev', '380054',
    23.0416, 72.5075,
    '+91 79 4001 8899', '+919825012345', 'info@apexglobaltech.com', 'https://apexglobaltech.com',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop',
    ARRAY[
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop'
    ],
    'approved', true, true, 4.9, 142, 1280
),
(
    '33333333-3333-3333-3333-333333333002',
    'Surat Diamond Consortium',
    'surat-diamond-consortium',
    'World-Class Natural & CVD Precision Diamonds',
    'Established in 1988, Surat Diamond Consortium is globally recognized for certified conflict-free polished natural diamonds and sustainable lab-grown gems. Exporting to Antwerp, Dubai, Hong Kong, and New York with complete GIA & IGI certifications.',
    '11111111-1111-1111-1111-111111111103',
    '22222222-2222-2222-2222-222222222202',
    'IN', 'Gujarat', 'Surat',
    'Surat Diamond Bourse (SDB), Core Tower 4, Khajod', '395007',
    21.1218, 72.7844,
    '+91 261 245 8899', '+919825123456', 'sales@suratdiamonds.com', 'https://suratdiamondconsortium.com',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&h=400&fit=crop',
    ARRAY[
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=600&fit=crop'
    ],
    'approved', true, true, 5.0, 310, 3420
),
(
    '33333333-3333-3333-3333-333333333003',
    'Gujarat Organic Agro Exports',
    'gujarat-organic-agro-exports',
    'Pure Cumin, Fennel & Spices Direct From Farms',
    'Direct farm-to-port export company dealing in premium quality organic cumin, coriander, psyllium husk (Isabgol), sesame seeds, and cold-pressed mustard oil. USDA Organic, APEDA, and Halal certified.',
    '11111111-1111-1111-1111-111111111104',
    '22222222-2222-2222-2222-222222222401',
    'IN', 'Gujarat', 'Rajkot',
    'GIDC Industrial Estate, Phase 3, Metoda', '360021',
    22.2598, 70.6726,
    '+91 281 278 1122', '+919825234567', 'export@gujaratagro.com', 'https://gujaratagroexports.in',
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&h=400&fit=crop',
    ARRAY[
        'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&h=600&fit=crop'
    ],
    'approved', false, true, 4.8, 88, 890
),
(
    '33333333-3333-3333-3333-333333333004',
    'Emirates Crown Real Estate & Infrastructure',
    'emirates-crown-real-estate',
    'Luxury Residential & Commercial Real Estate Advisory',
    'Premier real estate consultancy specializing in high-yield commercial investments, luxury waterfront residences, and free-zone office setups across Dubai, Abu Dhabi, and Sharjah.',
    '11111111-1111-1111-1111-111111111107',
    '22222222-2222-2222-2222-222222222701',
    'AE', 'Dubai', 'Dubai',
    'Level 28, Downtown Business Bay Tower, Sheikh Zayed Road', '00000',
    25.1856, 55.2728,
    '+971 4 332 9900', '+971501234567', 'contact@emiratescrown.ae', 'https://emiratescrown.ae',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=400&fit=crop',
    ARRAY[
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'
    ],
    'approved', true, true, 4.9, 175, 2150
),
(
    '33333333-3333-3333-3333-333333333005',
    'Thames Logistics & Global Cargo',
    'thames-logistics-global-cargo',
    'Integrated Air, Ocean & Overland Freight Forwarding',
    'Headquartered near London Heathrow, Thames Logistics provides complete customs clearance, bonded warehousing, and temperature-controlled air freight between the UK, Europe, India, and North America.',
    '11111111-1111-1111-1111-111111111108',
    '22222222-2222-2222-2222-222222222201',
    'GB', 'Greater London', 'London',
    'Cargo Terminal 4, Southern Perimeter Rd, Hounslow', 'TW6 3PF',
    51.4697, -0.4571,
    '+44 20 7946 0912', '+447700900123', 'operations@thamescargo.co.uk', 'https://thameslogistics.co.uk',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&h=400&fit=crop',
    ARRAY[
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop'
    ],
    'approved', false, true, 4.7, 64, 620
),
(
    '33333333-3333-3333-3333-333333333006',
    'Silicon Valley Cloud Architects',
    'silicon-valley-cloud-architects',
    'Enterprise Kubernetes, DevOps & Cybersecurity',
    'Premier boutique engineering agency helping high-growth startups and mature enterprises automate infrastructure, migrate to multicloud, and maintain SOC2 / HIPAA compliance.',
    '11111111-1111-1111-1111-111111111101',
    '22222222-2222-2222-2222-222222222102',
    'US', 'California', 'San Jose',
    '180 S 1st St, Suite 400', '95113',
    37.3382, -121.8863,
    '+1 408 555 0199', '+14085550199', 'hello@svcloudarchitects.com', 'https://svcloudarchitects.com',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=400&fit=crop',
    ARRAY[
        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop'
    ],
    'approved', true, true, 4.9, 94, 1140
),
(
    '33333333-3333-3333-3333-333333333007',
    'Vedic Health Pharma & Ayurveda',
    'vedic-health-pharma',
    'Herbal Therapeutics & GMP Certified Nutraceaticals',
    'Combining 5,000-year-old authentic Ayurvedic formulas with modern US-FDA compliant manufacturing. Leading manufacturer of standardized herbal extracts, immunity supplements, and organic personal care.',
    '11111111-1111-1111-1111-111111111105',
    '22222222-2222-2222-2222-222222222501',
    'IN', 'Gujarat', 'Vadodara',
    'Makarpura GIDC Estate, Plot 142', '390010',
    22.2536, 73.1955,
    '+91 265 264 4555', '+919825345678', 'contact@vedichealthpharma.in', 'https://vedichealthpharma.in',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&h=400&fit=crop',
    ARRAY[
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=600&fit=crop'
    ],
    'approved', false, true, 4.8, 52, 730
),
(
    -- Clearly identified DEMO pending approval listing for testing Admin Approval/Rejection System
    '33333333-3333-3333-3333-333333333099',
    'Demo Pending Enterprises (Awaiting Approval)',
    'demo-pending-enterprises',
    'Sample submission waiting for admin verification',
    'This is an identified demo listing created to demonstrate the Admin approval workflow. Once an administrator approves this listing in the Admin Dashboard, it appears in public search.',
    '11111111-1111-1111-1111-111111111102',
    '22222222-2222-2222-2222-222222222201',
    'IN', 'Maharashtra', 'Mumbai',
    'Bandra Kurla Complex, Commercial Unit 201', '400051',
    19.0657, 72.8687,
    '+91 22 2650 9988', '+919825999999', 'admin-demo@5lpbusiness.com', 'https://5lpbusiness.com',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop',
    ARRAY[]::TEXT[],
    'pending', false, false, 0.0, 0, 12
)
ON CONFLICT (id) DO NOTHING;

-- Demo Fake Business Report for Admin Queue Testing
INSERT INTO public.business_reports (
    id, business_id, reporter_name, reporter_email, reason, details, status
) VALUES (
    '44444444-4444-4444-4444-444444444001',
    '33333333-3333-3333-3333-333333333001',
    'Rajesh Patel',
    'rajesh.patel.demo@gmail.com',
    'Suspected Impersonation / Wrong Phone',
    'Identified demo report for admin queue verification: Reporter states phone number was updated recently.',
    'pending'
)
ON CONFLICT (id) DO NOTHING;
