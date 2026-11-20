import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:share_plus/share_plus.dart';
import '../models/business.dart';
import '../providers/business_provider.dart';
import '../providers/locale_provider.dart';
import '../l10n/app_translations.dart';
import '../widgets/report_dialog_widget.dart';

class BusinessDetailScreen extends StatelessWidget {
  final Business business;

  const BusinessDetailScreen({Key? key, required this.business}) : super(key: key);

  void _callPhone(String phone) async {
    final uri = Uri.parse('tel:${phone.replaceAll(RegExp(r'[^0-9+]'), '')}');
    if (await canLaunchUrl(uri)) await launchUrl(uri);
  }

  void _openWhatsApp(String? wa) async {
    if (wa == null || wa.isEmpty) return;
    final clean = wa.replaceAll(RegExp(r'[^0-9]'), '');
    final uri = Uri.parse('https://wa.me/$clean');
    if (await canLaunchUrl(uri)) await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  void _sendEmail(String email) async {
    final uri = Uri.parse('mailto:$email');
    if (await canLaunchUrl(uri)) await launchUrl(uri);
  }

  void _openWebsite(String? url) async {
    if (url == null || url.isEmpty) return;
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    final trans = AppTranslations(Provider.of<LocaleProvider>(context).locale);
    final bizProvider = Provider.of<BusinessProvider>(context);
    final isFav = bizProvider.isFavorite(business.id);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: CustomScrollView(
        slivers: [
          // Collapsible Cover SliverAppBar
          SliverAppBar(
            expandedHeight: 220,
            pinned: true,
            backgroundColor: const Color(0xFF0A192F),
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  business.coverUrl != null
                      ? Image.network(
                          business.coverUrl!,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => const ColoredBox(color: Color(0xFF0A192F)),
                        )
                      : const ColoredBox(color: Color(0xFF0A192F)),
                  const DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Colors.black54, Colors.transparent, Colors.black87],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            actions: [
              IconButton(
                icon: Icon(isFav ? Icons.favorite : Icons.favorite_border, color: isFav ? Colors.red : Colors.white),
                onPressed: () => bizProvider.toggleFavorite(business.id),
              ),
              IconButton(
                icon: const Icon(Icons.share, color: Colors.white),
                onPressed: () {
                  Share.share('Check out ${business.name} on 5 LP Business: https://5lpbusiness.com/business/${business.slug}');
                },
              ),
              IconButton(
                icon: const Icon(Icons.flag_outlined, color: Colors.white),
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (_) => ReportDialogWidget(business: business),
                  );
                },
              ),
            ],
          ),

          // Business Details Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title & Badges
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 64,
                        height: 64,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: Colors.grey[300]!),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(14),
                          child: business.logoUrl != null
                              ? Image.network(business.logoUrl!, fit: BoxFit.cover)
                              : Center(child: Text(business.name.substring(0, 1), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 24, color: Color(0xFF2563EB)))),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              business.name,
                              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0A192F)),
                            ),
                            if (business.tagline != null) ...[
                              const SizedBox(height: 2),
                              Text(business.tagline!, style: TextStyle(fontSize: 12, color: Colors.grey[600])),
                            ],
                            const SizedBox(height: 6),
                            Row(
                              children: [
                                if (business.isVerified) ...[
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(color: const Color(0xFF10B981), borderRadius: BorderRadius.circular(8)),
                                    child: const Text('Verified', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                                  ),
                                  const SizedBox(width: 6),
                                ],
                                const Icon(Icons.star, color: Colors.amber, size: 14),
                                const SizedBox(width: 2),
                                Text(business.rating.toStringAsFixed(1), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                                const SizedBox(width: 2),
                                Text('(${business.reviewCount})', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),

                  // Direct Action Buttons Row: Call, WhatsApp, Email, Web
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF0A192F),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          onPressed: () => _callPhone(business.phone),
                          icon: const Icon(Icons.phone, size: 16, color: Colors.white),
                          label: Text(trans.text('call'), style: const TextStyle(fontSize: 12, color: Colors.white)),
                        ),
                      ),
                      const SizedBox(width: 8),
                      if (business.whatsapp != null)
                        Expanded(
                          child: ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF10B981),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            onPressed: () => _openWhatsApp(business.whatsapp),
                            icon: const Icon(Icons.chat, size: 16, color: Colors.white),
                            label: Text(trans.text('whatsapp'), style: const TextStyle(fontSize: 12, color: Colors.white)),
                          ),
                        ),
                    ],
                  ),

                  const SizedBox(height: 8),

                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          onPressed: () => _sendEmail(business.email),
                          icon: const Icon(Icons.email_outlined, size: 16),
                          label: Text(trans.text('email'), style: const TextStyle(fontSize: 12)),
                        ),
                      ),
                      if (business.website != null) ...[
                        const SizedBox(width: 8),
                        Expanded(
                          child: OutlinedButton.icon(
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            onPressed: () => _openWebsite(business.website),
                            icon: const Icon(Icons.public, size: 16),
                            label: Text(trans.text('website'), style: const TextStyle(fontSize: 12)),
                          ),
                        ),
                      ],
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Company Overview
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.grey[200]!)),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(trans.text('description'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0A192F))),
                        const SizedBox(height: 8),
                        Text(business.description, style: TextStyle(fontSize: 13, color: Colors.grey[800], height: 1.5)),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Location Details Card
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.grey[200]!)),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(trans.text('location'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0A192F))),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const Icon(Icons.pin_drop, size: 18, color: Color(0xFF2563EB)),
                            const SizedBox(width: 6),
                            Expanded(child: Text(business.address, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600))),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text('${business.city}, ${business.state} - ${business.postalCode ?? ""}, ${business.countryName ?? business.countryCode}', style: TextStyle(fontSize: 12, color: Colors.grey[600])),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Report Fraud CTA
                  Center(
                    child: TextButton.icon(
                      onPressed: () {
                        showDialog(context: context, builder: (_) => ReportDialogWidget(business: business));
                      },
                      icon: const Icon(Icons.report_problem, size: 14, color: Colors.red),
                      label: Text(trans.text('reportFake'), style: const TextStyle(color: Colors.red, fontSize: 12)),
                    ),
                  ),

                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
