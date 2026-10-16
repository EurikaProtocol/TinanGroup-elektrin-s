import { priceInfo } from './pricing.js';

export const isCommercial = (item) => Number(item?.powerKw) >= 30;

export function matches(item, filters = {}) {
  const price = priceInfo(item).sellingVat;
  const text = [item.name, item.manufacturer, item.model].filter(Boolean).join(' ').toLocaleLowerCase('lt');
  return (!filters.search || text.includes(filters.search.toLocaleLowerCase('lt')))
    && (!filters.category || item.category === filters.category)
    && (!filters.manufacturer || item.manufacturer === filters.manufacturer)
    && (!filters.type || item.type === filters.type)
    && (!filters.power || Number(item.powerKw) === Number(filters.power))
    && (filters.maxPrice == null || (price !== null && price <= Number(filters.maxPrice)));
}
