import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/business.dart';
import '../providers/business_provider.dart';
import '../providers/locale_provider.dart';
import '../l10n/app_translations.dart';

class RegisterBusinessScreen extends StatefulWidget {
  const RegisterBusinessScreen({Key? key}) : super(key: key);

  @override
  State<RegisterBusinessScreen> createState() => _RegisterBusinessScreenState();
}

class _RegisterBusinessScreenState extends State<RegisterBusinessScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _taglineController = TextEditingController();
  final _cityController = TextEditingController();
  final _stateController = TextEditingController(text: 'Gujarat');
  final _addressController = TextEditingController();
  final _phoneController = TextEditingController();
  final _whatsappController = TextEditingController();
  final _emailController = TextEditingController();
  final _websiteController = TextEditingController();
  final _descriptionController = TextEditingController();

  String _selectedCategory = 'cat-1';
  String _selectedCountry = 'IN';
  bool _submitting = false;

  @override
  Widget build(BuildContext context) {
    final trans = AppTranslations(Provider.of<LocaleProvider>(context).locale);
    final bizProvider = Provider.of<BusinessProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0A192F),
        title: Text(trans.text('registerBusiness'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Free Registration Banner
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFEFF6FF),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFBFDBFE)),
                ),
                child: Row(
                  children: const [
                    Icon(Icons.verified_user, color: Color(0xFF2563EB)),
                    SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        '100% Free Listing • All submissions are verified by 5 LP Business administrators before going live.',
                        style: TextStyle(fontSize: 12, color: Color(0xFF1E3A8A)),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              TextFormField(
                controller: _nameController,
                decoration: InputDecoration(
                  labelText: '${trans.text("businessName")} *',
                  border: const OutlineInputBorder(),
                  isDense: true,
                ),
                validator: (val) => val == null || val.isEmpty ? 'Required' : null,
              ),

              const SizedBox(height: 12),

              TextFormField(
                controller: _taglineController,
                decoration: const InputDecoration(
                  labelText: 'Tagline / Slogan',
                  border: OutlineInputBorder(),
                  isDense: true,
                ),
              ),

              const SizedBox(height: 12),

              DropdownButtonFormField<String>(
                value: _selectedCategory,
                decoration: const InputDecoration(
                  labelText: 'Industry Category *',
                  border: OutlineInputBorder(),
                  isDense: true,
                ),
                items: bizProvider.categories.map((c) => DropdownMenuItem(
                  value: c.id,
                  child: Text(c.nameEn),
                )).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedCategory = val);
                },
              ),

              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _cityController,
                      decoration: InputDecoration(
                        labelText: '${trans.text("city")} *',
                        border: const OutlineInputBorder(),
                        isDense: true,
                      ),
                      validator: (val) => val == null || val.isEmpty ? 'Required' : null,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextFormField(
                      controller: _stateController,
                      decoration: InputDecoration(
                        labelText: '${trans.text("state")} *',
                        border: const OutlineInputBorder(),
                        isDense: true,
                      ),
                      validator: (val) => val == null || val.isEmpty ? 'Required' : null,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 12),

              TextFormField(
                controller: _addressController,
                decoration: InputDecoration(
                  labelText: '${trans.text("address")} *',
                  border: const OutlineInputBorder(),
                  isDense: true,
                ),
                validator: (val) => val == null || val.isEmpty ? 'Required' : null,
              ),

              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _phoneController,
                      keyboardType: TextInputType.phone,
                      decoration: InputDecoration(
                        labelText: '${trans.text("phone")} *',
                        border: const OutlineInputBorder(),
                        isDense: true,
                      ),
                      validator: (val) => val == null || val.isEmpty ? 'Required' : null,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextFormField(
                      controller: _whatsappController,
                      keyboardType: TextInputType.phone,
                      decoration: const InputDecoration(
                        labelText: 'WhatsApp Number',
                        border: OutlineInputBorder(),
                        isDense: true,
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 12),

              TextFormField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(
                  labelText: '${trans.text("email")} *',
                  border: const OutlineInputBorder(),
                  isDense: true,
                ),
                validator: (val) => val == null || val.isEmpty ? 'Required' : null,
              ),

              const SizedBox(height: 12),

              TextFormField(
                controller: _websiteController,
                keyboardType: TextInputType.url,
                decoration: const InputDecoration(
                  labelText: 'Website URL',
                  border: OutlineInputBorder(),
                  isDense: true,
                ),
              ),

              const SizedBox(height: 12),

              TextFormField(
                controller: _descriptionController,
                maxLines: 4,
                decoration: InputDecoration(
                  labelText: '${trans.text("description")} *',
                  border: const OutlineInputBorder(),
                ),
                validator: (val) => val == null || val.isEmpty ? 'Required' : null,
              ),

              const SizedBox(height: 20),

              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0A192F),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: _submitting ? null : () async {
                    if (!_formKey.currentState!.validate()) return;
                    setState(() => _submitting = true);

                    final newBiz = Business(
                      id: 'biz-${DateTime.now().millisecondsSinceEpoch}',
                      name: _nameController.text.trim(),
                      slug: _nameController.text.trim().toLowerCase().replaceAll(RegExp(r'[^a-z0-9]'), '-'),
                      tagline: _taglineController.text.trim().isEmpty ? null : _taglineController.text.trim(),
                      categoryId: _selectedCategory,
                      countryCode: _selectedCountry,
                      countryName: 'India',
                      state: _stateController.text.trim(),
                      city: _cityController.text.trim(),
                      address: _addressController.text.trim(),
                      phone: _phoneController.text.trim(),
                      whatsapp: _whatsappController.text.trim().isEmpty ? null : _whatsappController.text.trim(),
                      email: _emailController.text.trim(),
                      website: _websiteController.text.trim().isEmpty ? null : _websiteController.text.trim(),
                      description: _descriptionController.text.trim(),
                      status: 'pending',
                      createdAt: DateTime.now(),
                    );

                    await bizProvider.registerNewBusiness(newBiz);
                    setState(() => _submitting = false);

                    if (mounted) {
                      showDialog(
                        context: context,
                        builder: (_) => AlertDialog(
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                          title: const Text('Submitted for Approval!'),
                          content: const Text('Your free business profile has been submitted for moderation. Once verified, it will appear in global search.'),
                          actions: [
                            ElevatedButton(
                              onPressed: () {
                                Navigator.pop(context);
                                Navigator.pop(context);
                              },
                              child: const Text('Done'),
                            ),
                          ],
                        ),
                      );
                    }
                  },
                  child: _submitting
                      ? const CircularProgressIndicator(color: Colors.white)
                      : Text(trans.text('submit'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
