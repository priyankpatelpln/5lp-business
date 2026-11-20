import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/business.dart';
import '../models/report.dart';
import '../providers/business_provider.dart';

class ReportDialogWidget extends StatefulWidget {
  final Business business;

  const ReportDialogWidget({Key? key, required this.business}) : super(key: key);

  @override
  State<ReportDialogWidget> createState() => _ReportDialogWidgetState();
}

class _ReportDialogWidgetState extends State<ReportDialogWidget> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _detailsController = TextEditingController();
  String _selectedReason = 'Suspected Fraud / Scam';

  final List<String> _reasons = [
    'Suspected Fraud / Scam',
    'Incorrect Phone or Address',
    'Impersonation / Stolen Identity',
    'Closed or Non-Existent Business',
    'Other Inappropriate Content',
  ];

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      title: Row(
        children: const [
          Icon(Icons.report_problem, color: Colors.red),
          SizedBox(width: 8),
          Text('Report Business', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        ],
      ),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Reporting: ${widget.business.name}',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0A192F)),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Your Name',
                border: OutlineInputBorder(),
                isDense: true,
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(
                labelText: 'Your Email',
                border: OutlineInputBorder(),
                isDense: true,
              ),
            ),
            const SizedBox(height: 10),
            DropdownButtonFormField<String>(
              value: _selectedReason,
              decoration: const InputDecoration(
                labelText: 'Reason for report',
                border: OutlineInputBorder(),
                isDense: true,
              ),
              items: _reasons
                  .map((r) => DropdownMenuItem(value: r, child: Text(r, style: const TextStyle(fontSize: 12))))
                  .toList(),
              onChanged: (val) {
                if (val != null) setState(() => _selectedReason = val);
              },
            ),
            const SizedBox(height: 10),
            TextField(
              controller: _detailsController,
              maxLines: 3,
              decoration: const InputDecoration(
                labelText: 'Details / Evidence',
                border: OutlineInputBorder(),
                isDense: true,
              ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
          onPressed: () async {
            if (_emailController.text.isEmpty) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Please enter your email')),
              );
              return;
            }

            final report = BusinessReport(
              id: 'rep-${DateTime.now().millisecondsSinceEpoch}',
              businessId: widget.business.id,
              businessName: widget.business.name,
              reporterName: _nameController.text.isEmpty ? 'Anonymous' : _nameController.text,
              reporterEmail: _emailController.text,
              reason: _selectedReason,
              details: _detailsController.text,
              createdAt: DateTime.now(),
            );

            await Provider.of<BusinessProvider>(context, listen: false).reportBusiness(report);
            Navigator.pop(context);
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Report submitted to moderation team.')),
            );
          },
          child: const Text('Submit Report', style: TextStyle(color: Colors.white)),
        ),
      ],
    );
  }
}
