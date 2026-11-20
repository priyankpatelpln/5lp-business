import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/business_provider.dart';
import '../providers/locale_provider.dart';
import '../l10n/app_translations.dart';
import '../widgets/business_card_widget.dart';

class FavoritesScreen extends StatelessWidget {
  const FavoritesScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final trans = AppTranslations(Provider.of<LocaleProvider>(context).locale);
    final bizProvider = Provider.of<BusinessProvider>(context);
    final favs = bizProvider.favoriteBusinesses;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0A192F),
        title: Text(trans.text('favorites'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
      ),
      body: favs.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(Icons.favorite_border, size: 56, color: Colors.grey),
                  SizedBox(height: 12),
                  Text('No saved businesses yet.', style: TextStyle(color: Colors.grey, fontSize: 14)),
                  SizedBox(height: 4),
                  Text('Tap the heart icon on any enterprise to access them here.', style: TextStyle(color: Colors.black45, fontSize: 11)),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 8),
              itemCount: favs.length,
              itemBuilder: (ctx, i) {
                return BusinessCardWidget(business: favs[i]);
              },
            ),
    );
  }
}
