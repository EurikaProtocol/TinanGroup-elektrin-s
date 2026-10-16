import { describe, it, expect } from 'vitest';
import { sellingPrice, withVat, priceInfo, estimate, recommendKw } from '../src/lib/pricing.js';
import { validateQuote, buildSummary, mailtoLink } from '../src/lib/validate.js';
import { matches } from '../src/lib/filters.js';
import { INVERTERS, BATTERIES, PACKAGES, findItem } from '../src/data/products.js';
import { readFileSync, existsSync } from 'node:fs';
import { ESTIMATOR_PRICES } from '../src/config.js';

describe('pricing', () => {
  it('applies markup and VAT', () => {
    expect(sellingPrice(1000, 0.2)).toBe(1200);
    expect(withVat(1000)).toBe(1210);
  });
  it('quote-only has no price', () => {
    expect(priceInfo({ quoteOnly: true, supplierPrice: 5 }).sellingVat).toBeNull();
    expect(priceInfo({ supplierPrice: null }).quoteOnly).toBe(true);
  });
  it('estimates and recommends', () => {
    expect(estimate({ kw: 0 }, ESTIMATOR_PRICES).incVat).toBe(0);
    expect(estimate({ kw: 10 }, ESTIMATOR_PRICES).incVat).toBeGreaterThan(0);
    expect(estimate({ kw: 10, batteryKwh: 10 }, ESTIMATOR_PRICES).incVat).toBeGreaterThan(estimate({ kw: 10 }, ESTIMATOR_PRICES).incVat);
    expect(recommendKw(9500, ESTIMATOR_PRICES)).toBe(10);
  });
});

describe('validation', () => {
  it('rejects bad input', () => {
    const e = validateQuote({ name: '', email: 'x', phone: '1', consent: false });
    expect(Object.keys(e)).toEqual(['name', 'email', 'phone', 'consent']);
  });
  it('accepts good input and builds mailto', () => {
    const d = { name: 'Jonas', email: 'a@b.lt', phone: '+37060000000', consent: true, kw: '10' };
    expect(validateQuote(d)).toEqual({});
    expect(mailtoLink(buildSummary(d))).toContain('mailto:info@tinangroup.com');
  });
});

describe('inverter filters', () => {
  it('filters by manufacturer, phase and battery voltage', () => {
    const r = INVERTERS.filter((i) => matches(i, { manufacturer: 'Deye', phase: '3', voltage: 'LV' }));
    expect(r.map((i) => i.model)).toEqual(['SUN-10K-SG04LP3-EU']);
  });
  it('price filter excludes items without verified price', () => {
    expect(INVERTERS.filter((i) => matches(i, { maxPrice: '100000' }))).toEqual([]);
    const it = { ...INVERTERS[0], supplierPrice: 1000, priceVerifiedOn: '2026-01-01' };
    expect(matches(it, { maxPrice: '2000' })).toBe(true);
    expect(matches(it, { maxPrice: '1000' })).toBe(false);
  });
  it('segments commercial inverters', () => {
    expect(INVERTERS.filter((i) => matches(i, { segment: 'commercial' })).every((i) => i.ratedKw >= 30)).toBe(true);
  });
  it('covers all required brands', () => {
    const m = new Set(INVERTERS.map((i) => i.manufacturer));
    for (const b of ['Solis','FoxESS','GoodWe','Huawei','Sungrow','Deye','Solplanet','Fronius','SMA','SAJ','SolarEdge']) expect(m.has(b)).toBe(true);
  });
});

describe('price verification', () => {
  it('requires verification date', () => {
    expect(priceInfo({ supplierPrice: 100, markup: 0.2 }).quoteOnly).toBe(true);
    const p = priceInfo({ supplierPrice: 100, markup: 0.2, priceVerifiedOn: '2026-01-01' });
    expect(p.quoteOnly).toBe(false);
    expect(p.sellingVat).toBe(145.2);
    expect(p.verifiedOn).toBe('2026-01-01');
  });
  it('no unverified price is shown in data', () => {
    for (const x of [...INVERTERS, ...BATTERIES, ...PACKAGES]) if (!x.priceVerifiedOn) expect(priceInfo(x).sellingVat).toBeNull();
  });
  it('finds quote-list items', () => {
    expect(findItem('start-5').name).toContain('5 kW START');
  });
});

describe('quote items', () => {
  it('requires items or message', () => {
    const base = { name: 'Jonas', email: 'a@b.lt', phone: '+37060000000', consent: true };
    expect(validateQuote({ ...base, items: [] }).items).toBeTruthy();
    expect(validateQuote({ ...base, items: [], message: 'Noriu pasiūlymo dėl 10 kW' }).items).toBeUndefined();
    expect(buildSummary({ ...base, items: [{ name: 'X', qty: 2 }] })).toContain('X × 2');
  });
});

describe('build output', () => {
  it.skipIf(!existsSync('dist/404.html'))('404 uses root-absolute paths', () => {
    const h = readFileSync('dist/404.html', 'utf8');
    expect(h).not.toMatch(/(src|href)="\.\//);
  });
});
