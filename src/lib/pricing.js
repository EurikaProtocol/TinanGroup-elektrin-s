import { VAT_RATE } from '../config.js';

const formatter = new Intl.NumberFormat('lt-LT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
});

export function formatEUR(value) {
  return Number.isFinite(value) ? formatter.format(value) : 'Kaina pagal užklausą';
}

// Customer prices are imported as source values. Never derive a selling price from a cost.
export function priceInfo(item) {
  const valid = Number.isFinite(item?.priceInclVat)
    && item.priceInclVat >= 0
    && /^\d{4}-\d{2}-\d{2}$/.test(item.priceVerifiedOn || '');
  return {
    quoteOnly: !valid,
    sellingVat: valid ? item.priceInclVat : null,
    sellingExVat: valid && Number.isFinite(item.priceExVat) ? item.priceExVat : null,
    verifiedOn: valid ? item.priceVerifiedOn : null,
    vatRate: VAT_RATE,
  };
}
