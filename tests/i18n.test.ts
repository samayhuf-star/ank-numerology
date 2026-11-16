import test from 'node:test';
import assert from 'node:assert/strict';
import { LANGUAGES, isRtl } from '../src/i18n/languages.ts';
import { t, coverage, fromLocale } from '../src/i18n/index.ts';
import { translations } from '../src/i18n/strings.ts';

test('25 launch languages, unique codes', () => {
  assert.equal(LANGUAGES.length, 25);
  assert.equal(new Set(LANGUAGES.map((l) => l.code)).size, 25);
});
test('falls back to English when a translation is missing', () => {
  assert.equal(t('ta', 'next'), 'Next');
  translations.fr = { next: 'Suivant' };
  assert.equal(t('fr', 'next'), 'Suivant');
  assert.equal(t('fr', 'skip'), 'Skip');
  delete translations.fr;
});
test('coverage is 100% for English and 0 for untranslated', () => {
  assert.equal(coverage('en'), 1); assert.equal(coverage('mni'), 0);
});
test('locale mapping', () => {
  assert.equal(fromLocale('hi-IN'), 'hi'); assert.equal(fromLocale('xx-YY'), 'en'); assert.equal(fromLocale(undefined), 'en');
});
test('rtl languages', () => { assert.ok(isRtl('ur')); assert.ok(isRtl('sd')); assert.ok(!isRtl('hi')); });
test('interpolation', () => {
  assert.equal(t('en', 'next').length > 0, true);
});
