import { describe, it, expect } from 'vitest';
import { sellingPrice, withVat, priceInfo, estimate, recommendKw } from '../src/lib/pricing.js';
import { validateQuote, buildSummary, mailtoLink } from '../src/lib/validate.js';
import { matches } from '../src/lib/filters.js';
import { INVERTERS } from '../src/data/products.js';
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
  it('price filter excludes quote-only', () => {
    expect(INVERTERS.filter((i) => matches(i, { maxPrice: '100000' })).every((i) => !i.quoteOnly)).toBe(true);
  });
});
