import { VAT_RATE, DEFAULT_MARKUP } from '../config.js';

export function sellingPrice(supplierPrice, markup = DEFAULT_MARKUP) {
  if (supplierPrice == null || Number.isNaN(Number(supplierPrice))) return null;
  return Math.round(Number(supplierPrice) * (1 + markup) * 100) / 100;
}

export function withVat(priceExVat, vat = VAT_RATE) {
  if (priceExVat == null) return null;
  return Math.round(priceExVat * (1 + vat) * 100) / 100;
}

/** Returns {supplier, selling, sellingVat} or null prices for quote-only items. */
export function priceInfo(item) {
  if (!item || item.quoteOnly || item.supplierPrice == null) {
    return { supplier: null, selling: null, sellingVat: null, quoteOnly: true };
  }
  const selling = sellingPrice(item.supplierPrice, item.markup);
  return { supplier: item.supplierPrice, selling, sellingVat: withVat(selling), quoteOnly: false };
}

const fmt = new Intl.NumberFormat('lt-LT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
export function formatEUR(v) {
  return v == null ? 'Pagal užklausą' : fmt.format(v);
}

/** Indicative estimate. All inputs from ESTIMATOR_PRICES (demo, editable). */
export function estimate({ kw, batteryKwh = 0, hybrid = false }, p) {
  const k = Number(kw) || 0;
  const b = Number(batteryKwh) || 0;
  const inverterPerKw = p.inverterPerKw + (hybrid || b > 0 ? p.hybridInverterExtraPerKw : 0);
  const supplier =
    k * (p.modulesPerKw + inverterPerKw + p.mountingPerKw + p.cablesPerKw + p.installationPerKw) +
    (k > 0 ? p.protectionFlat : 0) +
    b * p.batteryPerKwh;
  const exVat = Math.round(supplier * (1 + p.markup));
  const incVat = Math.round(withVat(exVat));
  return {
    exVat,
    incVat,
    low: Math.round(incVat * 0.9),
    high: Math.round(incVat * 1.15),
    yearlyKwh: Math.round(k * p.yieldPerKwp),
  };
}

export function recommendKw(annualKwh, p) {
  const kwh = Number(annualKwh) || 0;
  return Math.max(0, Math.round((kwh / p.yieldPerKwp) * 2) / 2);
}
