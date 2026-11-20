import 'package:flutter_test/flutter_test.dart';
import 'package:five_lp_business/models/business.dart';
import 'package:five_lp_business/models/category.dart';

void main() {
  group('5 LP Business Mobile Models Test Suite', () {
    test('Business model serialization and status management', () {
      final biz = Business(
        id: 'test-1',
        name: 'Surat Diamond Consortium',
        slug: 'surat-diamond-consortium',
        description: 'World-Class Natural & CVD Precision Diamonds',
        categoryId: 'cat-3',
        countryCode: 'IN',
        countryName: 'India',
        state: 'Gujarat',
        city: 'Surat',
        address: 'Khajod',
        phone: '+91 261 245 8899',
        whatsapp: '+919825123456',
        email: 'sales@suratdiamonds.com',
        status: 'approved',
        isVerified: true,
        isFeatured: true,
        rating: 5.0,
        createdAt: DateTime.now(),
      );

      expect(biz.name, 'Surat Diamond Consortium');
      expect(biz.isVerified, true);
      expect(biz.status, 'approved');

      final json = biz.toJson();
      expect(json['phone'], '+91 261 245 8899');
      expect(json['whatsapp'], '+919825123456');

      final deserialized = Business.fromJson(json);
      expect(deserialized.name, biz.name);
      expect(deserialized.rating, 5.0);
    });

    test('Category localized names for EN, GU, HI', () {
      final cat = Category(
        id: 'cat-1',
        slug: 'tech',
        nameEn: 'Technology & IT',
        nameGu: 'ટેકનોલોજી અને સોફ્ટવેર',
        nameHi: 'प्रौद्योगिकी और आईटी',
        icon: 'laptop',
      );

      expect(cat.localizedName('en'), 'Technology & IT');
      expect(cat.localizedName('gu'), 'ટેકનોલોજી અને સોફ્ટવેર');
      expect(cat.localizedName('hi'), 'प्रौद्योगिकी और आईटी');
    });
  });
}
