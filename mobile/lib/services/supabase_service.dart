import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/business.dart';
import '../models/category.dart';
import '../models/report.dart';

class SupabaseService {
  static const String supabaseUrl = 'https://cjcqkapxobahdhyferxt.supabase.co';
  static const String supabaseAnonKey = 'sb_publishable_E1CvRtCWtxeiXZX0_ftJ_g_Dl72Znfo';

  static bool get isConfigured => true;

  SupabaseClient? _client;

  SupabaseService() {
    if (isConfigured) {
      try {
        _client = Supabase.instance.client;
      } catch (_) {}
    }
  }

  // Pre-loaded realistic global business repository
  final List<Business> _businesses = [
    Business(
      id: 'biz-1',
      name: 'Apex Global Technologies',
      slug: 'apex-global-technologies',
      tagline: 'Enterprise Cloud & AI Solutions',
      description: 'Apex Global Technologies is an ISO-certified enterprise software, mobile app, and artificial intelligence solutions provider. Delivering scalable cloud architectures, AI automation, and high-performance cross-platform mobile apps for Fortune 500 and SME clients worldwide.',
      categoryId: 'cat-1',
      categoryName: 'Technology & IT',
      countryCode: 'IN',
      countryName: 'India',
      state: 'Gujarat',
      city: 'Ahmedabad',
      address: 'Tower B, 8th Floor, Sindhu Bhavan Road, Bodakdev',
      postalCode: '380054',
      phone: '+91 79 4001 8899',
      whatsapp: '+919825012345',
      email: 'info@apexglobaltech.com',
      website: 'https://apexglobaltech.com',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
      coverUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop',
      galleryImages: [
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop'
      ],
      status: 'approved',
      isFeatured: true,
      isVerified: true,
      viewCount: 1420,
      rating: 4.9,
      reviewCount: 142,
      createdAt: DateTime.now().subtract(const Duration(days: 30)),
    ),
    Business(
      id: 'biz-2',
      name: 'Surat Diamond Consortium',
      slug: 'surat-diamond-consortium',
      tagline: 'World-Class Natural & CVD Precision Diamonds',
      description: 'Established in 1988, Surat Diamond Consortium is globally recognized for certified conflict-free polished natural diamonds and sustainable lab-grown gems. Exporting to Antwerp, Dubai, Hong Kong, and New York with complete GIA & IGI certifications.',
      categoryId: 'cat-3',
      categoryName: 'Gems & Jewelry',
      countryCode: 'IN',
      countryName: 'India',
      state: 'Gujarat',
      city: 'Surat',
      address: 'Surat Diamond Bourse (SDB), Core Tower 4, Khajod',
      postalCode: '395007',
      phone: '+91 261 245 8899',
      whatsapp: '+919825123456',
      email: 'sales@suratdiamonds.com',
      website: 'https://suratdiamondconsortium.com',
      logoUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop',
      coverUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&h=400&fit=crop',
      galleryImages: [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop'
      ],
      status: 'approved',
      isFeatured: true,
      isVerified: true,
      viewCount: 3620,
      rating: 5.0,
      reviewCount: 310,
      createdAt: DateTime.now().subtract(const Duration(days: 45)),
    ),
    Business(
      id: 'biz-3',
      name: 'Gujarat Organic Agro Exports',
      slug: 'gujarat-organic-agro-exports',
      tagline: 'Pure Cumin, Fennel & Spices Direct From Saurashtra',
      description: 'Direct farm-to-port export company dealing in premium quality organic cumin, coriander, psyllium husk (Isabgol), sesame seeds, and cold-pressed mustard oil. USDA Organic, APEDA, and Halal certified.',
      categoryId: 'cat-4',
      categoryName: 'Food & Agriculture',
      countryCode: 'IN',
      countryName: 'India',
      state: 'Gujarat',
      city: 'Rajkot',
      address: 'GIDC Industrial Estate, Phase 3, Metoda',
      postalCode: '360021',
      phone: '+91 281 278 1122',
      whatsapp: '+919825234567',
      email: 'export@gujaratagro.com',
      website: 'https://gujaratagroexports.in',
      logoUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&h=200&fit=crop',
      coverUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&h=400&fit=crop',
      status: 'approved',
      isFeatured: false,
      isVerified: true,
      viewCount: 910,
      rating: 4.8,
      reviewCount: 88,
      createdAt: DateTime.now().subtract(const Duration(days: 20)),
    ),
    Business(
      id: 'biz-4',
      name: 'Emirates Crown Real Estate',
      slug: 'emirates-crown-real-estate',
      tagline: 'Luxury Commercial & Residential Real Estate Advisory',
      description: 'Premier real estate consultancy specializing in high-yield commercial investments, luxury waterfront residences, and free-zone office setups across Dubai, Abu Dhabi, and Sharjah.',
      categoryId: 'cat-7',
      categoryName: 'Real Estate & Infrastructure',
      countryCode: 'AE',
      countryName: 'United Arab Emirates',
      state: 'Dubai',
      city: 'Dubai',
      address: 'Level 28, Downtown Business Bay Tower, Sheikh Zayed Road',
      postalCode: '00000',
      phone: '+971 4 332 9900',
      whatsapp: '+971501234567',
      email: 'contact@emiratescrown.ae',
      website: 'https://emiratescrown.ae',
      logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop',
      coverUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=400&fit=crop',
      status: 'approved',
      isFeatured: true,
      isVerified: true,
      viewCount: 2280,
      rating: 4.9,
      reviewCount: 175,
      createdAt: DateTime.now().subtract(const Duration(days: 15)),
    ),
    Business(
      id: 'biz-5',
      name: 'Silicon Valley Cloud Architects',
      slug: 'silicon-valley-cloud-architects',
      tagline: 'Enterprise Kubernetes, DevOps & Cybersecurity',
      description: 'Premier boutique engineering agency helping high-growth startups and mature enterprises automate infrastructure, migrate to multicloud, and maintain SOC2 / HIPAA compliance.',
      categoryId: 'cat-1',
      categoryName: 'Technology & IT',
      countryCode: 'US',
      countryName: 'United States',
      state: 'California',
      city: 'San Jose',
      address: '180 S 1st St, Suite 400',
      postalCode: '95113',
      phone: '+1 408 555 0199',
      whatsapp: '+14085550199',
      email: 'hello@svcloudarchitects.com',
      website: 'https://svcloudarchitects.com',
      logoUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&h=200&fit=crop',
      coverUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=400&fit=crop',
      status: 'approved',
      isFeatured: true,
      isVerified: true,
      viewCount: 1210,
      rating: 4.9,
      reviewCount: 94,
      createdAt: DateTime.now().subtract(const Duration(days: 12)),
    ),
    // DEMO PENDING BUSINESS (for testing Admin Approval)
    Business(
      id: 'biz-pending-1',
      name: '[DEMO] Metro Precision Machining Tools',
      slug: 'demo-metro-precision-machining',
      tagline: 'High-tolerance CNC milling and gears',
      description: 'Identified demo listing for admin approval verification. Displays in the Admin Panel pending approval queue.',
      categoryId: 'cat-2',
      categoryName: 'Manufacturing & Textiles',
      countryCode: 'IN',
      countryName: 'India',
      state: 'Maharashtra',
      city: 'Pune',
      address: 'Chakan Industrial Zone, MIDC Phase II',
      postalCode: '410501',
      phone: '+91 20 6711 0022',
      whatsapp: '+919825888888',
      email: 'contact@metromachining.demo',
      website: 'https://metromachining.demo',
      status: 'pending',
      isFeatured: false,
      isVerified: false,
      viewCount: 14,
      rating: 0.0,
      reviewCount: 0,
      createdAt: DateTime.now(),
    ),
  ];

  final List<Category> _categories = [
    Category(id: 'cat-1', slug: 'tech', nameEn: 'Technology & IT', nameGu: 'ટેકનોલોજી અને સોફ્ટવેર', nameHi: 'प्रौद्योगिकी और आईटी', icon: 'laptop', sortOrder: 1),
    Category(id: 'cat-2', slug: 'mfg', nameEn: 'Manufacturing & Textiles', nameGu: 'ઉત્પાદન અને કાપડ ઉદ્યોગ', nameHi: 'विनिर्माण और वस्त्र', icon: 'factory', sortOrder: 2),
    Category(id: 'cat-3', slug: 'gems', nameEn: 'Gems & Jewelry', nameGu: 'હીરા અને ઝવેરાત', nameHi: 'रत्न और आभूषण', icon: 'diamond', sortOrder: 3),
    Category(id: 'cat-4', slug: 'agro', nameEn: 'Food & Agriculture', nameGu: 'ખાદ્ય અને કૃષિ', nameHi: 'खाद्य और कृषि', icon: 'restaurant', sortOrder: 4),
    Category(id: 'cat-5', slug: 'health', nameEn: 'Healthcare & Medical', nameGu: 'આરોગ્ય અને તબીબી', nameHi: 'स्वास्थ्य और चिकित्सा', icon: 'local_hospital', sortOrder: 5),
    Category(id: 'cat-6', slug: 'finance', nameEn: 'Finance & Legal', nameGu: 'નાણાકીય અને કાનૂની', nameHi: 'वित्त और कानूनी', icon: 'attach_money', sortOrder: 6),
    Category(id: 'cat-7', slug: 'realty', nameEn: 'Real Estate & Infrastructure', nameGu: 'રિયલ એસ્ટેટ અને બાંધકામ', nameHi: 'रियल एस्टेट और निर्माण', icon: 'apartment', sortOrder: 7),
    Category(id: 'cat-8', slug: 'retail', nameEn: 'Retail & Wholesale', nameGu: 'છૂટક અને જથ્થાબંધ વેપાર', nameHi: 'खुदरा और थोक व्यापार', icon: 'storefront', sortOrder: 8),
  ];

  final List<BusinessReport> _reports = [
    BusinessReport(
      id: 'rep-1',
      businessId: 'biz-1',
      businessName: 'Apex Global Technologies',
      reporterName: 'Rajesh Patel',
      reporterEmail: 'rajesh.patel.demo@gmail.com',
      reason: 'Suspected Impersonation / Wrong Phone',
      details: 'Demo report for mobile admin inspection: phone number updated recently.',
      status: 'pending',
      createdAt: DateTime.now().subtract(const Duration(hours: 4)),
    )
  ];

  Future<List<Business>> getBusinesses({String? categoryId, String? countryCode, String? query, String? status = 'approved'}) async {
    // If Supabase is connected
    if (isConfigured && _client != null) {
      try {
        var q = _client!.from('businesses').select();
        if (status != null) q = q.eq('status', status);
        if (categoryId != null) q = q.eq('category_id', categoryId);
        if (countryCode != null) q = q.eq('country_code', countryCode);
        if (query != null && query.isNotEmpty) q = q.ilike('name', '%$query%');
        final data = await q;
        if (data is List && data.isNotEmpty) {
          return data.map((json) => Business.fromJson(json)).toList();
        }
      } catch (_) {}
    }

    // Local fallback
    var list = _businesses.toList();
    if (status != null) {
      list = list.where((b) => b.status == status).toList();
    }
    if (categoryId != null && categoryId.isNotEmpty) {
      list = list.where((b) => b.categoryId == categoryId).toList();
    }
    if (countryCode != null && countryCode.isNotEmpty) {
      list = list.where((b) => b.countryCode == countryCode).toList();
    }
    if (query != null && query.isNotEmpty) {
      final q = query.toLowerCase();
      list = list.where((b) =>
          b.name.toLowerCase().contains(q) ||
          b.city.toLowerCase().contains(q) ||
          (b.tagline != null && b.tagline!.toLowerCase().contains(q))).toList();
    }
    return list;
  }

  Future<List<Category>> getCategories() async {
    return _categories;
  }

  Future<bool> registerBusiness(Business business) async {
    _businesses.insert(0, business);
    return true;
  }

  Future<bool> updateStatus(String businessId, String newStatus, {String? reason}) async {
    final idx = _businesses.indexWhere((b) => b.id == businessId);
    if (idx != -1) {
      _businesses[idx].status = newStatus;
      return true;
    }
    return false;
  }

  Future<List<BusinessReport>> getReports() async {
    return _reports;
  }

  Future<bool> submitReport(BusinessReport report) async {
    _reports.insert(0, report);
    return true;
  }

  Future<bool> dismissReport(String reportId) async {
    final idx = _reports.indexWhere((r) => r.id == reportId);
    if (idx != -1) {
      _reports[idx].status = 'dismissed';
      return true;
    }
    return false;
  }
}
