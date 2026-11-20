class Business {
  final String id;
  final String? ownerId;
  final String name;
  final String slug;
  final String? tagline;
  final String description;
  final String categoryId;
  final String? categoryName;
  final String? subcategoryId;
  final String countryCode;
  final String? countryName;
  final String state;
  final String city;
  final String address;
  final String? postalCode;
  final double? latitude;
  final double? longitude;
  final String phone;
  final String? whatsapp;
  final String email;
  final String? website;
  final String? logoUrl;
  final String? coverUrl;
  final List<String> galleryImages;
  String status; // 'pending', 'approved', 'rejected'
  bool isFeatured;
  bool isVerified;
  final String? rejectionReason;
  final int viewCount;
  final double rating;
  final int reviewCount;
  final DateTime createdAt;

  Business({
    required this.id,
    this.ownerId,
    required this.name,
    required this.slug,
    this.tagline,
    required this.description,
    required this.categoryId,
    this.categoryName,
    this.subcategoryId,
    required this.countryCode,
    this.countryName,
    required this.state,
    required this.city,
    required this.address,
    this.postalCode,
    this.latitude,
    this.longitude,
    required this.phone,
    this.whatsapp,
    required this.email,
    this.website,
    this.logoUrl,
    this.coverUrl,
    this.galleryImages = const [],
    this.status = 'pending',
    this.isFeatured = false,
    this.isVerified = false,
    this.rejectionReason,
    this.viewCount = 0,
    this.rating = 5.0,
    this.reviewCount = 0,
    required this.createdAt,
  });

  factory Business.fromJson(Map<String, dynamic> json) {
    return Business(
      id: json['id'] ?? '',
      ownerId: json['owner_id'],
      name: json['name'] ?? '',
      slug: json['slug'] ?? '',
      tagline: json['tagline'],
      description: json['description'] ?? '',
      categoryId: json['category_id'] ?? '',
      categoryName: json['category_name'],
      subcategoryId: json['subcategory_id'],
      countryCode: json['country_code'] ?? 'IN',
      countryName: json['country_name'],
      state: json['state'] ?? '',
      city: json['city'] ?? '',
      address: json['address'] ?? '',
      postalCode: json['postal_code'],
      latitude: json['latitude'] != null ? (json['latitude'] as num).toDouble() : null,
      longitude: json['longitude'] != null ? (json['longitude'] as num).toDouble() : null,
      phone: json['phone'] ?? '',
      whatsapp: json['whatsapp'],
      email: json['email'] ?? '',
      website: json['website'],
      logoUrl: json['logo_url'],
      coverUrl: json['cover_url'],
      galleryImages: json['gallery_images'] != null
          ? List<String>.from(json['gallery_images'])
          : [],
      status: json['status'] ?? 'pending',
      isFeatured: json['is_featured'] ?? false,
      isVerified: json['is_verified'] ?? false,
      rejectionReason: json['rejection_reason'],
      viewCount: json['view_count'] ?? 0,
      rating: json['rating'] != null ? (json['rating'] as num).toDouble() : 5.0,
      reviewCount: json['review_count'] ?? 0,
      createdAt: json['created_at'] != null 
          ? DateTime.parse(json['created_at']) 
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'owner_id': ownerId,
      'name': name,
      'slug': slug,
      'tagline': tagline,
      'description': description,
      'category_id': categoryId,
      'category_name': categoryName,
      'subcategory_id': subcategoryId,
      'country_code': countryCode,
      'country_name': countryName,
      'state': state,
      'city': city,
      'address': address,
      'postal_code': postalCode,
      'latitude': latitude,
      'longitude': longitude,
      'phone': phone,
      'whatsapp': whatsapp,
      'email': email,
      'website': website,
      'logo_url': logoUrl,
      'cover_url': coverUrl,
      'gallery_images': galleryImages,
      'status': status,
      'is_featured': isFeatured,
      'is_verified': isVerified,
      'rejection_reason': rejectionReason,
      'view_count': viewCount,
      'rating': rating,
      'review_count': reviewCount,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
