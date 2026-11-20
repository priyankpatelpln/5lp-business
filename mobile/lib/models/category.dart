class Category {
  final String id;
  final String slug;
  final String nameEn;
  final String nameGu;
  final String nameHi;
  final String icon;
  final String? parentId;
  final int sortOrder;

  Category({
    required this.id,
    required this.slug,
    required this.nameEn,
    required this.nameGu,
    required this.nameHi,
    required this.icon,
    this.parentId,
    this.sortOrder = 0,
  });

  String localizedName(String langCode) {
    if (langCode == 'gu') return nameGu;
    if (langCode == 'hi') return nameHi;
    return nameEn;
  }

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] ?? '',
      slug: json['slug'] ?? '',
      nameEn: json['name_en'] ?? '',
      nameGu: json['name_gu'] ?? '',
      nameHi: json['name_hi'] ?? '',
      icon: json['icon'] ?? 'business',
      parentId: json['parent_id'],
      sortOrder: json['sort_order'] ?? 0,
    );
  }
}
