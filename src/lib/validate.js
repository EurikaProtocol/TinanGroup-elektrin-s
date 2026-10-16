import { COMPANY } from '../config.js';

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim());
export const isPhone = (v) => {
  const d = String(v || '').replace(/[\s()-]/g, '');
  return /^\+?\d{8,15}$/.test(d);
};

/** Validates a quote form data object; returns map field -> message. */
export function validateQuote(d) {
  const e = {};
  if (!String(d.name || '').trim() || d.name.trim().length < 2) e.name = 'Įveskite vardą.';
  if (!isEmail(d.email)) e.email = 'Įveskite teisingą el. pašto adresą.';
  if (!isPhone(d.phone)) e.phone = 'Įveskite teisingą telefono numerį.';
  if (d.consumption !== undefined && d.consumption !== '' && !(Number(d.consumption) > 0))
    e.consumption = 'Metinis suvartojimas turi būti teigiamas skaičius.';
  if (d.kw !== undefined && d.kw !== '' && !(Number(d.kw) > 0)) e.kw = 'Galia turi būti teigiamas skaičius.';
  if (!d.consent) e.consent = 'Reikalingas sutikimas.';
  return e;
}

export function buildSummary(d, est) {
  const lines = [
    `TINAN GROUP užklausa`,
    `Vardas: ${d.name || '-'}`,
    `El. paštas: ${d.email || '-'}`,
    `Telefonas: ${d.phone || '-'}`,
    d.location ? `Objekto vieta: ${d.location}` : null,
    d.propertyType ? `Objekto tipas: ${d.propertyType}` : null,
    d.consumption ? `Metinis suvartojimas: ${d.consumption} kWh` : null,
    d.kw ? `Norima galia: ${d.kw} kW` : null,
    d.battery ? `Kaupiklis: ${d.battery}` : null,
    d.product ? `Dominanti įranga: ${d.product}` : null,
    est ? `Orientacinis įvertis: ${est.low}–${est.high} € su PVM (DEMO kainos)` : null,
    d.message ? `Žinutė: ${d.message}` : null,
  ];
  return lines.filter(Boolean).join('\n');
}

export function mailtoLink(summary, subject = 'Užklausa dėl saulės elektrinės') {
  return `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary)}`;
}
