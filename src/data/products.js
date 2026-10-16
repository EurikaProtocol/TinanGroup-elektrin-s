// Approved, customer-facing catalogue data only.
// Add only approved customer-facing fields from the customer price list.
// Price, warranty, stock, specifications, images and datasheets are shown only with verification dates.
// Never add supplier costs or internal analysis.
export const CATALOGUE = [];

export const CATEGORIES = [
  { id: 'modules', name: 'Saulės moduliai', page: 'moduliai.html' },
  { id: 'inverters', name: 'Inverteriai', page: 'inverteriai.html' },
  { id: 'batteries', name: 'Baterijos ir energijos kaupimas', page: 'kaupikliai.html' },
  { id: 'mounting', name: 'Montavimo konstrukcijos', page: 'konstrukcijos.html' },
  { id: 'electrical', name: 'Kabeliai, apsaugos ir elektros medžiagos', page: 'elektros-medziagos.html' },
  { id: 'packages', name: 'Saulės elektrinių komplektai', page: 'komplektai.html' },
  { id: 'services', name: 'Paslaugos ir montavimas', page: 'paslaugos.html' },
];

export function findItem(id) {
  return CATALOGUE.find((item) => item.id === id) || null;
}

export function displayPrice(item) {
  return item && Number.isFinite(item.priceInclVat) && item.priceInclVat >= 0
    ? item.priceInclVat
    : null;
}
