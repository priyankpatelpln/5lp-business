import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0A192F),
        title: const Text('Account & Roles', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey[200]!),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Active User Profile', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
                  const SizedBox(height: 6),
                  Text(auth.userName, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0A192F))),
                  Text(auth.email, style: TextStyle(fontSize: 13, color: Colors.grey[600])),
                  const SizedBox(height: 6),
                  Chip(
                    backgroundColor: auth.isAdmin ? Colors.amber[100] : const Color(0xFFEFF6FF),
                    label: Text(
                      'Role: ${auth.role.name.toUpperCase()}',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: auth.isAdmin ? Colors.brown : const Color(0xFF1E40AF),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Text('Switch Demo Role for Testing:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 12),
            ListTile(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              tileColor: Colors.white,
              leading: const Icon(Icons.shield, color: Colors.amber),
              title: const Text('Administrator'),
              subtitle: const Text('Can review & approve/reject listings, investigate fake reports'),
              trailing: auth.role == UserRole.admin ? const Icon(Icons.check_circle, color: Colors.green) : null,
              onTap: () {
                auth.switchRole(UserRole.admin);
                Navigator.pop(context);
              },
            ),
            const SizedBox(height: 8),
            ListTile(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              tileColor: Colors.white,
              leading: const Icon(Icons.business_center, color: Color(0xFF2563EB)),
              title: const Text('Business Owner'),
              subtitle: const Text('Can register free commercial enterprise profiles'),
              trailing: auth.role == UserRole.businessOwner ? const Icon(Icons.check_circle, color: Colors.green) : null,
              onTap: () {
                auth.switchRole(UserRole.businessOwner);
                Navigator.pop(context);
              },
            ),
            const SizedBox(height: 8),
            ListTile(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              tileColor: Colors.white,
              leading: const Icon(Icons.person, color: Colors.grey),
              title: const Text('Regular User / Buyer'),
              subtitle: const Text('Can browse global directory, call, chat & save favorites'),
              trailing: auth.role == UserRole.user ? const Icon(Icons.check_circle, color: Colors.green) : null,
              onTap: () {
                auth.switchRole(UserRole.user);
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
    );
  }
}
