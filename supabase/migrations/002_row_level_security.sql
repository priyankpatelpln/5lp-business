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
