import test from 'node:test';
import assert from 'node:assert/strict';
import { translations } from '../src/translations';
import { DEMO_CATEGORIES, DEMO_COUNTRIES, INITIAL_DEMO_BUSINESSES } from '../src/lib/demoData';

test('Translations integrity - EN, GU, HI have identical keys', () => {
  const enKeys = Object.keys(translations.en).sort();
  const guKeys = Object.keys(translations.gu).sort();
  const hiKeys = Object.keys(translations.hi).sort();

  assert.equal(guKeys.length, enKeys.length, 'Gujarati keys count should match English');
  assert.equal(hiKeys.length, enKeys.length, 'Hindi keys count should match English');

  for (const key of enKeys) {
    assert.ok(translations.gu[key], `Missing Gujarati key: ${key}`);
    assert.ok(translations.hi[key], `Missing Hindi key: ${key}`);
  }
});

test('Demo categories have multilingual names and icons', () => {
  assert.ok(DEMO_CATEGORIES.length >= 8, 'Must have at least 8 primary industry categories');
  for (const cat of DEMO_CATEGORIES) {
    assert.ok(cat.name_en, 'Category missing English name');
    assert.ok(cat.name_gu, 'Category missing Gujarati name');
    assert.ok(cat.name_hi, 'Category missing Hindi name');
    assert.ok(cat.icon, 'Category missing icon');
  }
});

test('Demo businesses have valid contacts and verified status', () => {
  assert.ok(INITIAL_DEMO_BUSINESSES.length > 0, 'Must have demo businesses');
  const approvedList = INITIAL_DEMO_BUSINESSES.filter(b => b.status === 'approved');
  assert.ok(approvedList.length >= 5, 'Should have multiple approved demo businesses');

  for (const b of approvedList) {
    assert.ok(b.name, 'Business must have name');
    assert.ok(b.slug, 'Business must have slug');
    assert.ok(b.phone, 'Business must have phone');
    assert.ok(b.city, 'Business must have city');
    assert.ok(b.country_code, 'Business must have country code');
  }

  // Ensure a pending listing exists for admin workflow verification
  const pending = INITIAL_DEMO_BUSINESSES.find(b => b.status === 'pending');
  assert.ok(pending, 'Must have a clearly identified pending listing for testing admin approval system');
});
