import 'package:flutter/material.dart';
import '../models/business.dart';
import '../models/category.dart';
import '../models/report.dart';
import '../services/supabase_service.dart';

class BusinessProvider extends ChangeNotifier {
  final SupabaseService _service = SupabaseService();

  List<Business> _businesses = [];
  List<Business> _featuredBusinesses = [];
  List<Business> _pendingBusinesses = [];
  List<Category> _categories = [];
  List<BusinessReport> _reports = [];
  final Set<String> _favoriteIds = {'biz-1'};

  bool _loading = false;
  String _searchQuery = '';
  String? _selectedCategory;
  String? _selectedCountry;

  List<Business> get businesses => _businesses;
  List<Business> get featuredBusinesses => _featuredBusinesses;
  List<Business> get pendingBusinesses => _pendingBusinesses;
  List<Category> get categories => _categories;
  List<BusinessReport> get reports => _reports;
  Set<String> get favoriteIds => _favoriteIds;
  bool get loading => _loading;

  BusinessProvider() {
    refreshAll();
  }

  Future<void> refreshAll() async {
    _loading = true;
    notifyListeners();

    _categories = await _service.getCategories();
    _businesses = await _service.getBusinesses(
      categoryId: _selectedCategory,
      countryCode: _selectedCountry,
      query: _searchQuery,
      status: 'approved',
    );
    _featuredBusinesses = _businesses.where((b) => b.isFeatured).toList();
    _pendingBusinesses = await _service.getBusinesses(status: 'pending');
    _reports = await _service.getReports();

    _loading = false;
    notifyListeners();
  }

  void filter({String? query, String? categoryId, String? countryCode}) {
    _searchQuery = query ?? _searchQuery;
    _selectedCategory = categoryId;
    _selectedCountry = countryCode;
    refreshAll();
  }

  void resetFilters() {
    _searchQuery = '';
    _selectedCategory = null;
    _selectedCountry = null;
    refreshAll();
  }

  bool isFavorite(String id) => _favoriteIds.contains(id);

  void toggleFavorite(String id) {
    if (_favoriteIds.contains(id)) {
      _favoriteIds.remove(id);
    } else {
      _favoriteIds.add(id);
    }
    notifyListeners();
  }

  List<Business> get favoriteBusinesses =>
      _businesses.where((b) => _favoriteIds.contains(b.id)).toList();

  Future<bool> registerNewBusiness(Business business) async {
    final success = await _service.registerBusiness(business);
    if (success) {
      _pendingBusinesses.insert(0, business);
      notifyListeners();
    }
    return success;
  }

  Future<void> approveBusiness(String id) async {
    await _service.updateStatus(id, 'approved');
    await refreshAll();
  }

  Future<void> rejectBusiness(String id, String reason) async {
    await _service.updateStatus(id, 'rejected', reason: reason);
    await refreshAll();
  }

  Future<void> reportBusiness(BusinessReport report) async {
    await _service.submitReport(report);
    _reports.insert(0, report);
    notifyListeners();
  }

  Future<void> dismissReport(String reportId) async {
    await _service.dismissReport(reportId);
    _reports.removeWhere((r) => r.id == reportId);
    notifyListeners();
  }
}
