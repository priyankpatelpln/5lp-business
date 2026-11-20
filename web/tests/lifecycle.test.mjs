import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  getBusinesses, 
  createBusiness, 
  updateBusinessStatus, 
  createBusinessReport, 
  getBusinessReports, 
  dismissReport 
} from '../src/lib/supabase.ts';

test('Integration Lifecycle: Free Business Registration -> Admin Review -> Approval', async () => {
  // 1. Submit Free Business Registration
  const testBiz = {
    name: 'Somnath Solar & Clean Energy Ltd',
    slug: 'somnath-solar-energy',
    tagline: 'Leading EPC provider for industrial rooftop solar',
    description: 'Providing commercial and industrial turnkey solar solutions across Gujarat and Western India with high-efficiency tier-1 panels.',
    category_id: 'cat-2',
    category_name: 'Manufacturing & Industrial',
    country_code: 'IN',
    country_name: 'India',
    state: 'Gujarat',
    city: 'Rajkot',
    address: 'Aji GIDC Industrial Estate',
    phone: '+91 281 238 9988',
    whatsapp: '+919825444333',
    email: 'contact@somnathsolar.demo',
    website: 'https://somnathsolar.demo',
    logo_url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=200&h=200&fit=crop',
    cover_url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=1200&h=400&fit=crop',
  };

  const regResult = await createBusiness(testBiz);
  assert.equal(regResult.success, true);
  assert.ok(regResult.data?.id);
  assert.equal(regResult.data.status, 'pending', 'Newly registered business must be pending approval');

  // 2. Admin Reviews and Approves Business
  const bizId = regResult.data.id;
  const approved = await updateBusinessStatus(bizId, 'approved');
  assert.equal(approved, true, 'Admin status update to approved should succeed');

  // 3. Verify it appears in approved business directory query
  const approvedList = await getBusinesses({ status: 'approved' });
  const found = approvedList.find(b => b.id === bizId);
  assert.ok(found, 'Approved business must now be present in active directory');
  assert.equal(found.status, 'approved');
  assert.equal(found.name, 'Somnath Solar & Clean Energy Ltd');
});

test('Integration Lifecycle: Report Fake Business -> Admin Investigation Queue', async () => {
  // 1. User reports a fraudulent listing
  const repOk = await createBusinessReport({
    business_id: 'biz-1',
    business_name: 'Apex Global Technologies',
    reporter_name: 'Kirit Shah',
    reporter_email: 'kirit.shah@example.com',
    reason: 'Suspected Fraud / Scam',
    details: 'Received an unsolicited phishing email claiming to be from this office.',
  });
  assert.equal(repOk, true, 'Report submission should succeed');

  // 2. Admin inspects the report queue
  const reports = await getBusinessReports();
  const latest = reports.find(r => r.reporter_email === 'kirit.shah@example.com');
  assert.ok(latest, 'Report should appear in the admin queue');
  assert.equal(latest.status, 'pending');

  // 3. Admin investigates and dismisses false report
  const dismissed = await dismissReport(latest.id);
  assert.equal(dismissed, true, 'Admin dismissal should succeed');
  const updatedReports = await getBusinessReports();
  const dismissedRep = updatedReports.find(r => r.id === latest.id);
  assert.equal(dismissedRep.status, 'dismissed');
});
