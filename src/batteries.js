import './style.css';
import { mountLayout } from './lib/layout.js';
import { BATTERIES } from './data/products.js';
import { priceInfo, formatEUR } from './lib/pricing.js';
import { addToCart } from './lib/cart.js';
import { PRICE_NOTICE } from './config.js';

mountLayout('kaupikliai.html');
document.getElementById('price-notice').textContent = PRICE_NOTICE;
const grid = document.getElementById('battery-grid');
grid.innerHTML = BATTERIES.map((b) => {
  const p = priceInfo(b);
  return `<article class="card"><h3>${b.name}</h3>
    <p>${b.category === 'HV' ? 'Aukštos įtampos' : 'Žemos įtampos (~48 V)'} · ${b.capacityKwh} kWh</p>
    <p class="price">${p.quoteOnly ? 'Kaina pagal užklausą' : formatEUR(p.sellingVat)}</p>
    ${p.quoteOnly ? '' : `<p class="vat">Kaina su PVM, patikrinta ${p.verifiedOn}</p>`}
    <p class="muted">Gamintojas ir modelis nurodomi pasiūlyme pagal inverterio suderinamumą.</p>
    <button class="btn btn-primary" data-add="${b.id}">Į užklausos sąrašą</button></article>`;
}).join('');
grid.addEventListener('click', (e) => {
  const a = e.target.closest('[data-add]');
  if (!a) return;
  addToCart(a.dataset.add, BATTERIES.find((b) => b.id === a.dataset.add).name);
  a.textContent = 'Įtraukta ✓';
});
