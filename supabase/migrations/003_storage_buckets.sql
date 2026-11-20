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
