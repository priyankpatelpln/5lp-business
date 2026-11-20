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
('11111111-1111-1111-1111-111111111101', 'technology-software', 'Technology & IT', 'ટેકનોલોજી અને સોફ્ટવેર', 'प्रौद्योगिकी और आईटी', 'Laptop', 1),
('11111111-1111-1111-1111-111111111102', 'manufacturing-textiles', 'Manufacturing & Textiles', 'ઉત્પાદન અને કાપડ ઉદ્યોગ', 'विनिर्माण और वस्त्र', 'Factory', 2),
('11111111-1111-1111-1111-111111111103', 'gems-jewelry', 'Gems & Jewelry', 'હીરા અને ઝવેરાત', 'रत्न और आभूषण', 'Sparkles', 3),
('11111111-1111-1111-1111-111111111104', 'food-agriculture', 'Food & Agriculture', 'ખાદ્ય અને કૃષિ', 'खाद्य और कृषि', 'Utensils', 4),
('11111111-1111-1111-1111-111111111105', 'healthcare-medical', 'Healthcare & Medical', 'આરોગ્ય અને તબીબી', 'स्वास्थ्य और चिकित्सा', 'HeartPulse', 5),
('11111111-1111-1111-1111-111111111106', 'finance-legal', 'Finance & Legal Services', 'નાણાકીય અને કાનૂની સેવાઓ', 'वित्त और कानूनी सेवाएं', 'BadgeDollarSign', 6),
('11111111-1111-1111-1111-111111111107', 'real-estate-construction', 'Real Estate & Infrastructure', 'રિયલ એસ્ટેટ અને બાંધકામ', 'रियल एस्टेट और निर्माण', 'Building2', 7),
('11111111-1111-1111-1111-111111111108', 'retail-wholesale', 'Retail & Wholesale', 'છૂટક અને જથ્થાબંધ વેપાર', 'खुदरा और थोक व्यापार', 'Store', 8)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Subcategories
INSERT INTO public.categories (id, slug, name_en, name_gu, name_hi, icon, parent_id, sort_order) VALUES
('22222222-2222-2222-2222-222222222101', 'web-app-dev', 'Web & Mobile App Development', 'વેબ અને મોબાઇલ એપ ડેવલપમેન્ટ', 'वेब और मोबाइल ऐप विकास', 'Code', '11111111-1111-1111-1111-111111111101', 1),
('22222222-2222-2222-2222-222222222102', 'cloud-ai-solutions', 'Cloud & AI Solutions', 'ક્લાઉડ અને AI સોલ્યુશન્સ', 'क्लाउड और एआई समाधान', 'Cloud', '11111111-1111-1111-1111-111111111101', 2),
('22222222-2222-2222-2222-222222222201', 'textile-garments', 'Textiles & Garments', 'કાપડ અને ગારમેન્ટ્સ', 'कपड़ा और परिधान', 'Shirt', '11111111-1111-1111-1111-111111111102', 1),
('22222222-2222-2222-2222-222222222202', 'diamond-processing', 'Diamond Cutting & Polishing', 'ડાયમંડ કટીંગ અને પોલિશિંગ', 'हीरा तराशना और पॉलिश', 'Gem', '11111111-1111-1111-1111-111111111103', 1),
('22222222-2222-2222-2222-222222222203', 'gold-jewelry', 'Gold & Heritage Jewelry', 'સોના અને હેરિટેજ ઘરેણાં', 'सोने और विरासत के आभूषण', 'Crown', '11111111-1111-1111-1111-111111111103', 2),
('22222222-2222-2222-2222-222222222401', 'organic-spices', 'Organic Spices & Export', 'ઓર્ગેનિક મસાલા અને નિકાસ', 'जैविक मसाले और निर्यात', 'Wheat', '11111111-1111-1111-1111-111111111104', 1),
('22222222-2222-2222-2222-222222222501', 'pharma-formulations', 'Pharmaceuticals & Health', 'ફાર્માસ્યુટિકલ્સ અને હેલ્થ', 'फार्मास्यूटिकल्स और स्वास्थ्य', 'Pill', '11111111-1111-1111-1111-111111111105', 1),
('22222222-2222-2222-2222-222222222701', 'commercial-construction', 'Commercial & Industrial Projects', 'કોમર્શિયલ અને ઔદ્યોગિક પ્રોજેક્ટ્સ', 'वाणिज्यिक और औद्योगिक परियोजनाएं', 'HardHat', '11111111-1111-1111-1111-111111111107', 1)
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
