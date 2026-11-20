import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/business_provider.dart';
import '../providers/locale_provider.dart';
import '../l10n/app_translations.dart';

class AdminScreen extends StatelessWidget {
  const AdminScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final trans = AppTranslations(Provider.of<LocaleProvider>(context).locale);
    final bizProvider = Provider.of<BusinessProvider>(context);

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: const Color(0xFFF8FAFC),
        appBar: AppBar(
          backgroundColor: const Color(0xFF0A192F),
          title: Text(trans.text('adminDashboard'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          bottom: TabBar(
            indicatorColor: const Color(0xFF3B82F6),
            tabs: [
              Tab(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(trans.text('pendingSubmissions')),
                    if (bizProvider.pendingBusinesses.isNotEmpty) ...[
                      const SizedBox(width: 6),
                      CircleAvatar(
                        radius: 9,
                        backgroundColor: Colors.amber,
                        child: Text(
                          '${bizProvider.pendingBusinesses.length}',
                          style: const TextStyle(fontSize: 10, color: Colors.black, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              Tab(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(trans.text('fakeReports')),
                    if (bizProvider.reports.isNotEmpty) ...[
                      const SizedBox(width: 6),
                      CircleAvatar(
                        radius: 9,
                        backgroundColor: Colors.red,
                        child: Text(
                          '${bizProvider.reports.length}',
                          style: const TextStyle(fontSize: 10, color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            // TAB 1: Pending Approvals
            bizProvider.pendingBusinesses.isEmpty
                ? const Center(child: Text('No pending submissions. All reviewed!', style: TextStyle(color: Colors.grey)))
                : ListView.builder(
                    padding: const EdgeInsets.all(12),
                    itemCount: bizProvider.pendingBusinesses.length,
                    itemBuilder: (ctx, i) {
                      final biz = bizProvider.pendingBusinesses[i];
                      return Card(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        margin: const EdgeInsets.only(bottom: 12),
                        child: Padding(
                          padding: const EdgeInsets.all(14),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(color: Colors.amber[100], borderRadius: BorderRadius.circular(6)),
                                    child: const Text('Pending Approval', style: TextStyle(color: Colors.brown, fontSize: 10, fontWeight: FontWeight.bold)),
                                  ),
                                  const Spacer(),
                                  Text(biz.city, style: const TextStyle(fontSize: 11, color: Colors.grey)),
                                ],
                              ),
                              const SizedBox(height: 6),
                              Text(biz.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                              if (biz.tagline != null) Text(biz.tagline!, style: TextStyle(fontSize: 12, color: Colors.grey[600])),
                              const SizedBox(height: 8),
                              Text(biz.description, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12)),
                              const SizedBox(height: 6),
                              Text('Contact: ${biz.phone} • ${biz.email}', style: const TextStyle(fontSize: 11, color: Colors.blueGrey)),
                              const SizedBox(height: 12),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                                  OutlinedButton(
                                    style: OutlinedButton.styleFrom(foregroundColor: Colors.red),
                                    onPressed: () {
                                      bizProvider.rejectBusiness(biz.id, 'Unverifiable contact details');
                                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Business rejected')));
                                    },
                                    child: Text(trans.text('reject')),
                                  ),
                                  const SizedBox(width: 8),
                                  ElevatedButton(
                                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981)),
                                    onPressed: () {
                                      bizProvider.approveBusiness(biz.id);
                                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Business approved and published!')));
                                    },
                                    child: Text(trans.text('approve'), style: const TextStyle(color: Colors.white)),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),

            // TAB 2: Fake Business Reports
            bizProvider.reports.isEmpty
                ? const Center(child: Text('No active fake business reports.', style: TextStyle(color: Colors.grey)))
                : ListView.builder(
                    padding: const EdgeInsets.all(12),
                    itemCount: bizProvider.reports.length,
                    itemBuilder: (ctx, i) {
                      final rep = bizProvider.reports[i];
                      return Card(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        margin: const EdgeInsets.only(bottom: 12),
                        child: Padding(
                          padding: const EdgeInsets.all(14),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(color: Colors.red[100], borderRadius: BorderRadius.circular(6)),
                                    child: Text(rep.reason, style: const TextStyle(color: Colors.red, fontSize: 10, fontWeight: FontWeight.bold)),
                                  ),
                                  const Spacer(),
                                  Text(rep.status, style: const TextStyle(fontSize: 11, color: Colors.grey)),
                                ],
                              ),
                              const SizedBox(height: 6),
                              Text('Target: ${rep.businessName}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                              const SizedBox(height: 4),
                              Text('Reported by: ${rep.reporterName} (${rep.reporterEmail})', style: const TextStyle(fontSize: 12, color: Colors.black87)),
                              if (rep.details != null) ...[
                                const SizedBox(height: 6),
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(color: Colors.grey[100], borderRadius: BorderRadius.circular(8)),
                                  child: Text('Evidence: ${rep.details}', style: const TextStyle(fontSize: 11)),
                                ),
                              ],
                              const SizedBox(height: 12),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                                  TextButton(
                                    onPressed: () {
                                      bizProvider.dismissReport(rep.id);
                                    },
                                    child: Text(trans.text('dismiss')),
                                  ),
                                  const SizedBox(width: 8),
                                  ElevatedButton(
                                    style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                                    onPressed: () {
                                      bizProvider.rejectBusiness(rep.businessId, 'Deactivated due to report');
                                      bizProvider.dismissReport(rep.id);
                                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Business deactivated and removed.')));
                                    },
                                    child: const Text('Deactivate Business', style: TextStyle(color: Colors.white, fontSize: 11)),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ],
        ),
      ),
    );
  }
}
