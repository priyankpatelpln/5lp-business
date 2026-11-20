import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/business_provider.dart';
import '../providers/locale_provider.dart';
import '../l10n/app_translations.dart';
import '../widgets/business_card_widget.dart';

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({Key? key}) : super(key: key);

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  final _searchController = TextEditingController();
  String? _selectedCategory;
  String? _selectedCountry;

  final List<Map<String, String>> _countries = [
    {'code': 'IN', 'name': 'India'},
    {'code': 'US', 'name': 'USA'},
    {'code': 'AE', 'name': 'UAE (Dubai)'},
    {'code': 'GB', 'name': 'UK'},
    {'code': 'CA', 'name': 'Canada'},
    {'code': 'SG', 'name': 'Singapore'},
  ];

  @override
  Widget build(BuildContext context) {
    final locale = Provider.of<LocaleProvider>(context).locale;
    final trans = AppTranslations(locale);
    final bizProvider = Provider.of<BusinessProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0A192F),
        title: Text(trans.text('explore'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              _searchController.clear();
              setState(() {
                _selectedCategory = null;
                _selectedCountry = null;
              });
              bizProvider.resetFilters();
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Filter & Search Controls Header
          Container(
            padding: const EdgeInsets.all(12),
            color: Colors.white,
            child: Column(
              children: [
                // Keyword Field
                TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: trans.text('searchHint'),
                    prefixIcon: const Icon(Icons.search, color: Color(0xFF2563EB)),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear),
                            onPressed: () {
                              _searchController.clear();
                              bizProvider.filter(query: '');
                            },
                          )
                        : null,
                    filled: true,
                    fillColor: const Color(0xFFF1F5F9),
                    contentPadding: const EdgeInsets.symmetric(vertical: 10),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                  ),
                  onChanged: (val) {
                    bizProvider.filter(query: val);
                  },
                ),
                const SizedBox(height: 8),

                // Category & Country Filter Rows
                Row(
                  children: [
                    // Category Dropdown
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: DropdownButton<String>(
                          value: _selectedCategory,
                          isExpanded: true,
                          underline: const SizedBox(),
                          hint: Text(trans.text('allCategories'), style: const TextStyle(fontSize: 12)),
                          items: [
                            DropdownMenuItem(value: null, child: Text(trans.text('allCategories'), style: const TextStyle(fontSize: 12))),
                            ...bizProvider.categories.map((c) => DropdownMenuItem(
                                  value: c.id,
                                  child: Text(c.localizedName(locale.languageCode), style: const TextStyle(fontSize: 12)),
                                )),
                          ],
                          onChanged: (val) {
                            setState(() => _selectedCategory = val);
                            bizProvider.filter(categoryId: val);
                          },
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),

                    // Country Dropdown
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: DropdownButton<String>(
                          value: _selectedCountry,
                          isExpanded: true,
                          underline: const SizedBox(),
                          hint: Text(trans.text('allCountries'), style: const TextStyle(fontSize: 12)),
                          items: [
                            DropdownMenuItem(value: null, child: Text(trans.text('allCountries'), style: const TextStyle(fontSize: 12))),
                            ..._countries.map((ct) => DropdownMenuItem(
                                  value: ct['code'],
                                  child: Text(ct['name']!, style: const TextStyle(fontSize: 12)),
                                )),
                          ],
                          onChanged: (val) {
                            setState(() => _selectedCountry = val);
                            bizProvider.filter(countryCode: val);
                          },
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Results Count
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${bizProvider.businesses.length} businesses found',
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey),
                ),
              ],
            ),
          ),

          // Business List
          Expanded(
            child: bizProvider.loading
                ? const Center(child: CircularProgressIndicator())
                : bizProvider.businesses.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.search_off, size: 48, color: Colors.grey),
                            const SizedBox(height: 8),
                            const Text('No businesses found matching criteria', style: TextStyle(color: Colors.grey)),
                            TextButton(
                              onPressed: () {
                                _searchController.clear();
                                setState(() {
                                  _selectedCategory = null;
                                  _selectedCountry = null;
                                });
                                bizProvider.resetFilters();
                              },
                              child: const Text('Reset All Filters'),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        itemCount: bizProvider.businesses.length,
                        itemBuilder: (ctx, i) {
                          return BusinessCardWidget(business: bizProvider.businesses[i]);
                        },
                      ),
          ),
        ],
      ),
    );
  }
}
