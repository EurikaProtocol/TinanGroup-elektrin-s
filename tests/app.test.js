import { describe, expect, it } from 'vitest';
import { formatEUR, priceInfo, isVerificationDate } from '../src/lib/pricing.js';
import { validateQuote, buildSummary, mailtoLink } from '../src/lib/validate.js';
import { matches } from '../src/lib/filters.js';
import { CATALOGUE, CATEGORIES, findItem } from '../src/data/products.js';
import { readFileSync, existsSync } from 'node:fs';
import { addToCart, getCart, cartCount, setQty, removeFromCart, clearCart } from '../src/lib/cart.js';

describe('customer catalogue prices', () => {
  it('uses exact approved selling prices and requires a verification date', () => {
    const product = { priceInclVat: 1234.56, priceExVat: 1020.3, priceVerifiedOn: '2026-10-01' };
    expect(priceInfo(product)).toMatchObject({
      quoteOnly: false,
      sellingVat: 1234.56,
      sellingExVat: 1020.3,
      verifiedOn: '2026-10-01',
    });
    expect(priceInfo({ ...product, priceVerifiedOn: null }).quoteOnly).toBe(true);
    expect(priceInfo({ ...product, priceInclVat: -1 }).quoteOnly).toBe(true);
    expect(isVerificationDate('2026-02-30')).toBe(false);
  });

  it('shows quote-only text when a price is absent and preserves cents', () => {
    expect(formatEUR(null)).toBe('Kaina pagal užklausą');
    expect(formatEUR(1234.56)).toContain('1 234,56');
  });

  it('contains only customer-facing product records', () => {
    expect(Array.isArray(CATALOGUE)).toBe(true);
    expect(CATALOGUE.every((item) => !Object.keys(item).some((key) => /supplier|cost|profit|margin|pelno/i.test(key)))).toBe(true);
    expect(CATEGORIES.map((category) => category.id)).toContain('inverters');
    expect(findItem('missing')).toBeNull();
  });
});

describe('catalogue filters', () => {
  const product = {
    id: 'example', name: 'Inverteris X', manufacturer: 'Gamintojas', model: 'X-10',
    category: 'inverters', type: 'hybrid', powerKw: 10,
    priceInclVat: 1452, priceVerifiedOn: '2026-10-01',
  };

  it('filters by text, category, manufacturer, inverter type, power and price', () => {
    expect(matches(product, { search: 'x-10', category: 'inverters', manufacturer: 'Gamintojas' })).toBe(true);
    expect(matches(product, { type: 'hybrid', power: '10', maxPrice: '1500' })).toBe(true);
    expect(matches(product, { maxPrice: '1000' })).toBe(false);
    expect(matches({ ...product, priceVerifiedOn: null }, { maxPrice: '2000' })).toBe(false);
  });
});

describe('quote validation and email fallback', () => {
  const data = { name: 'Jonas', email: 'a@b.lt', phone: '+37060000000', consent: true };

  it('rejects invalid contact data', () => {
    expect(Object.keys(validateQuote({ name: '', email: 'x', phone: '1', consent: false })))
      .toEqual(['name', 'email', 'phone', 'consent']);
  });

  it('accepts a quote request and prepares a truthful email link', () => {
    expect(validateQuote({ ...data, items: [] })).toHaveProperty('items');
    expect(validateQuote({ ...data, items: [], message: 'Noriu individualaus pasiūlymo' })).not.toHaveProperty('items');
    const summary = buildSummary({ ...data, items: [{ name: 'Modulis', qty: 2, priceInclVat: 100 }] });
    expect(summary).toContain('Modulis × 2 (100 € / vnt. su PVM)');
    expect(mailtoLink(summary)).toContain('mailto:info@tinangroup.com');
  });
});

describe('quote list', () => {
  it('adds products, updates quantities and removes items', () => {
    const storage = new Map();
    globalThis.localStorage = {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    };
    globalThis.window = { dispatchEvent: () => true };
    clearCart();
    addToCart('module-1', 'Modulis');
    addToCart('module-1', 'Modulis');
    expect(cartCount()).toBe(2);
    setQty('module-1', 3);
    expect(getCart()[0].qty).toBe(3);
    removeFromCart('module-1');
    expect(getCart()).toEqual([]);
    delete globalThis.localStorage;
    delete globalThis.window;
  });
});

describe('build output', () => {
  it.skipIf(!existsSync('dist/404.html'))('404 uses root-absolute paths', () => {
    const html = readFileSync('dist/404.html', 'utf8');
    expect(html).not.toMatch(/(src|href)="\.\//);
  });
});
