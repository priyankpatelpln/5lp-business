class BusinessReport {
  final String id;
  final String businessId;
  final String businessName;
  final String reporterName;
  final String reporterEmail;
  final String reason;
  final String? details;
  String status; // 'pending', 'investigated', 'dismissed'
  final DateTime createdAt;

  BusinessReport({
    required this.id,
    required this.businessId,
    required this.businessName,
    required this.reporterName,
    required this.reporterEmail,
    required this.reason,
    this.details,
    this.status = 'pending',
    required this.createdAt,
  });

  factory BusinessReport.fromJson(Map<String, dynamic> json) {
    return BusinessReport(
      id: json['id'] ?? '',
      businessId: json['business_id'] ?? '',
      businessName: json['business_name'] ?? 'Flagged Enterprise',
      reporterName: json['reporter_name'] ?? '',
      reporterEmail: json['reporter_email'] ?? '',
      reason: json['reason'] ?? '',
      details: json['details'],
      status: json['status'] ?? 'pending',
      createdAt: json['created_at'] != null 
          ? DateTime.parse(json['created_at']) 
          : DateTime.now(),
    );
  }
}
