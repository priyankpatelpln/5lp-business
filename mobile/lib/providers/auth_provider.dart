import 'package:flutter/material.dart';

enum UserRole { user, businessOwner, admin }

class AuthProvider extends ChangeNotifier {
  String? _userId = 'demo-admin-id';
  String _userName = 'Administrator';
  String _email = 'admin@5lpbusiness.com';
  UserRole _role = UserRole.admin;

  bool get isAuthenticated => _userId != null;
  bool get isAdmin => _role == UserRole.admin;
  bool get isOwner => _role == UserRole.businessOwner || _role == UserRole.admin;

  String? get userId => _userId;
  String get userName => _userName;
  String get email => _email;
  UserRole get role => _role;

  void switchRole(UserRole newRole) {
    _role = newRole;
    if (newRole == UserRole.admin) {
      _userName = 'Administrator';
      _email = 'admin@5lpbusiness.com';
    } else if (newRole == UserRole.businessOwner) {
      _userName = 'Bhavesh Patel';
      _email = 'bhavesh@apexglobaltech.com';
    } else {
      _userName = 'Priya Sharma';
      _email = 'priya@example.com';
    }
    notifyListeners();
  }

  void login(String email, UserRole role) {
    _userId = 'usr-${DateTime.now().millisecondsSinceEpoch}';
    _email = email;
    _role = role;
    _userName = email.split('@')[0];
    notifyListeners();
  }

  void logout() {
    _userId = null;
    notifyListeners();
  }
}
