import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/business_provider.dart';
import '../providers/locale_provider.dart';
import '../providers/auth_provider.dart';
import '../l10n/app_translations.dart';
import '../widgets/business_card_widget.dart';
import 'explore_screen.dart';
import 'register_business_screen.dart';
import 'admin_screen.dart';
import 'favorites_screen.dart';
import 'login_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  IconData _getCategoryIcon(String icon) {
    switch (icon) {
      case 'laptop': return Icons.laptop_mac;
      case 'factory': return Icons.precision_manufacturing;
      case 'diamond': return Icons.diamond;
      case 'restaurant': return Icons.restaurant;
      case 'local_hospital': return Icons.local_hospital;
      case 'attach_money': return Icons.attach_money;
      case 'apartment': return Icons.apartment;
      case 'storefront': return Icons.storefront;
      default: return Icons.business;
    }
  }

  @override
  Widget build(BuildContext context) {
    final localeProvider = Provider.of<LocaleProvider>(context);
    final trans = AppTranslations(localeProvider.locale);
    final bizProvider = Provider.of<BusinessProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0A192F),
        elevation: 0,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: const Color(0xFF2563EB),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.business_center, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 8),
            RichText(
              text: const TextSpan(
                children: [
                  TextSpan(text: '5 LP ', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: Colors.white)),
                  TextSpan(text: 'BUSINESS', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: Color(0xFF3B82F6))),
                ],
              ),
            ),
          ],
        ),
        actions: [
          // Language Selector Dropdown
          DropdownButton<String>(
            value: localeProvider.locale.languageCode,
            dropdownColor: const Color(0xFF0A192F),
            underline: const SizedBox(),
            icon: const Icon(Icons.language, color: Colors.white70, size: 20),
            items: const [
              DropdownMenuItem(value: 'en', child: Text('EN', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold))),
              DropdownMenuItem(value: 'gu', child: Text('ગુજરાતી', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold))),
              DropdownMenuItem(value: 'hi', child: Text('हिंदी', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold))),
            ],
            onChanged: (val) {
              if (val != null) localeProvider.setLocale(Locale(val));
            },
          ),
          IconButton(
            icon: const Icon(Icons.favorite, color: Colors.roseAccent),
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const FavoritesScreen()));
            },
          ),
          if (authProvider.isAdmin)
            IconButton(
              icon: const Icon(Icons.shield, color: Colors.amber),
              title: 'Admin Panel',
              onPressed: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminScreen()));
              },
            ),
          IconButton(
            icon: const Icon(Icons.person, color: Colors.white),
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: bizProvider.refreshAll,
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Hero Banner
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: const BoxDecoration(
                  color: Color(0xFF0A192F),
                  borderRadius: BorderRadius.vertical(bottom: Radius.circular(24)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      trans.text('tagline'),
                      style: const TextStyle(color: Color(0xFF93C5FD), fontSize: 13, fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Discover Verified Global Enterprises',
                      style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w900),
                    ),
                    const SizedBox(height: 16),

                    // Search Trigger Bar
                    GestureDetector(
                      onTap: () {
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const ExploreScreen()));
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(14),
                          boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 10)],
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.search, color: Color(0xFF2563EB)),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                trans.text('searchHint'),
                                style: TextStyle(color: Colors.grey[500], fontSize: 13),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Industry Categories Horizontal List
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      trans.text('exploreCategories'),
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0A192F)),
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const ExploreScreen()));
                      },
                      child: const Text('View All', style: TextStyle(fontSize: 12, color: Color(0xFF2563EB))),
                    ),
                  ],
                ),
              ),

              SizedBox(
                height: 96,
                child: ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  scrollDirection: Axis.horizontal,
                  itemCount: bizProvider.categories.length,
                  itemBuilder: (ctx, i) {
                    final cat = bizProvider.categories[i];
                    return GestureDetector(
                      onTap: () {
                        bizProvider.filter(categoryId: cat.id);
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const ExploreScreen()));
                      },
                      child: Container(
                        width: 90,
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: Colors.grey[200]!),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            CircleAvatar(
                              backgroundColor: const Color(0xFFEFF6FF),
                              radius: 18,
                              child: Icon(_getCategoryIcon(cat.icon), color: const Color(0xFF2563EB), size: 18),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              cat.localizedName(localeProvider.locale.languageCode),
                              textAlign: TextAlign.center,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),

              const SizedBox(height: 16),

              // Free Business Registration CTA Banner
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 16),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF0A192F), Color(0xFF1E3A8A)],
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFF10B981),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: const Text('100% Free Listing', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                          ),
                          const SizedBox(height: 6),
                          const Text(
                            'Expand Your Business Worldwide',
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                          const SizedBox(height: 2),
                          const Text(
                            'Connect directly with verified buyers without broker commission.',
                            style: TextStyle(color: Colors.white70, fontSize: 11),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: const Color(0xFF0A192F),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      onPressed: () {
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterBusinessScreen()));
                      },
                      child: const Text('Register', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // Featured Businesses List
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Text(
                  trans.text('featuredBusinesses'),
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0A192F)),
                ),
              ),

              if (bizProvider.loading)
                const Center(child: Padding(padding: EdgeInsets.all(32), child: CircularProgressIndicator()))
              else
                ListView.builder(
                  physics: const NeverScrollableScrollPhysics(),
                  shrinkWrap: true,
                  itemCount: bizProvider.featuredBusinesses.length,
                  itemBuilder: (ctx, i) {
                    return BusinessCardWidget(business: bizProvider.featuredBusinesses[i]);
                  },
                ),

              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        selectedItemColor: const Color(0xFF2563EB),
        unselectedItemColor: Colors.grey,
        type: BottomNavigationBarType.fixed,
        onTap: (idx) {
          if (idx == 1) {
            Navigator.push(context, MaterialPageRoute(builder: (_) => const ExploreScreen()));
          } else if (idx == 2) {
            Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterBusinessScreen()));
          } else if (idx == 3) {
            Navigator.push(context, MaterialPageRoute(builder: (_) => const FavoritesScreen()));
          }
        },
        items: [
          BottomNavigationBarItem(icon: const Icon(Icons.home), label: trans.text('home')),
          BottomNavigationBarItem(icon: const Icon(Icons.search), label: trans.text('explore')),
          BottomNavigationBarItem(icon: const Icon(Icons.add_business), label: 'Register'),
          BottomNavigationBarItem(icon: const Icon(Icons.favorite), label: trans.text('favorites')),
        ],
      ),
    );
  }
}
