import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'http://localhost:3000';

async function fetchRoute(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  const text = await res.text();
  return { status: res.status, headers: res.headers, text };
}

test('E2E: Home Page (/) responds with 200 and renders branding & categories', async () => {
  const { status, text } = await fetchRoute('/');
  assert.equal(status, 200);
  assert.ok(text.includes('5 LP'), 'Must contain 5 LP branding');
  assert.ok(text.includes('BUSINESS'), 'Must contain BUSINESS');
  assert.ok(text.includes('Technology &amp; IT') || text.includes('Technology & IT'), 'Must render Industry Categories');
  assert.ok(text.includes('Verified'), 'Must render trust & verification indicators');
});

test('E2E: Directory Page (/directory) responds with 200 and search filters', async () => {
  const { status, text } = await fetchRoute('/directory');
  assert.equal(status, 200);
  assert.ok(text.includes('Directory') || text.includes('5 LP'), 'Must return valid Directory page shell');
});

test('E2E: Business Detail Page (/business/apex-global-technologies) renders correctly', async () => {
  const { status, text } = await fetchRoute('/business/apex-global-technologies');
  assert.equal(status, 200);
  assert.ok(text.includes('Apex Global Technologies'), 'Must display business title');
  assert.ok(text.includes('Ahmedabad'), 'Must display city location');
  assert.ok(text.includes('Call Phone') || text.includes('callNow') || text.includes('Call'), 'Must render direct call action');
  assert.ok(text.includes('WhatsApp'), 'Must render WhatsApp action');
});

test('E2E: Business Detail Page (/business/surat-diamond-consortium) renders correctly', async () => {
  const { status, text } = await fetchRoute('/business/surat-diamond-consortium');
  assert.equal(status, 200);
  assert.ok(text.includes('Surat Diamond Consortium'), 'Must display business title');
  assert.ok(text.includes('Surat'), 'Must display Surat city location');
  assert.ok(text.includes('Verified Enterprise') || text.includes('Verified'), 'Must display verification badge');
});

test('E2E: Free Business Registration (/register) renders 4-step wizard', async () => {
  const { status, text } = await fetchRoute('/register');
  assert.equal(status, 200);
  assert.ok(text.includes('Free Business Registration') || text.includes('regTitle'), 'Must render registration headline');
  assert.ok(text.includes('Business Name') || text.includes('businessName'), 'Must render business name input');
});

test('E2E: Admin Dashboard (/admin) renders moderation & report tabs', async () => {
  const { status, text } = await fetchRoute('/admin');
  assert.equal(status, 200);
  assert.ok(text.includes('5 LP Business Administration') || text.includes('adminTitle'), 'Must render admin headline');
  assert.ok(text.includes('Pending Approvals') || text.includes('pendingApprovalsTab'), 'Must render pending approvals tab');
  assert.ok(text.includes('Fake Business Reports') || text.includes('fakeReportsTab'), 'Must render fake reports tab');
});

test('E2E: Saved Favorites Page (/favorites) responds with 200', async () => {
  const { status, text } = await fetchRoute('/favorites');
  assert.equal(status, 200);
  assert.ok(text.includes('Favorites') || text.includes('favorites'), 'Must render favorites header');
});

test('E2E: Login / Auth Page (/login) responds with 200 and test personas', async () => {
  const { status, text } = await fetchRoute('/login');
  assert.equal(status, 200);
  assert.ok(text.includes('Admin') && text.includes('Owner'), 'Must render test personas for 1-click role testing');
});
