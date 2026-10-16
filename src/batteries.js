import './style.css';
import { mountLayout } from './lib/layout.js';
import { BATTERIES } from './data/products.js';
import { priceInfo, formatEUR } from './lib/pricing.js';
import { PRICE_NOTICE } from './config.js';

mountLayout('kaupikliai.html');
document.getElementById('price-notice').textContent = PRICE_NOTICE;
document.getElementById('battery-grid').innerHTML = BATTERIES.map((b) => {
  const p = priceInfo(b);
  return `<article class="card"><h3>${b.name}</h3>
    <p>${b.category === 'HV' ? 'Aukštos įtampos' : 'Žemos įtampos (~48 V)'} · ${b.capacityKwh} kWh</p>
    <p class="price">${p.quoteOnly ? 'Pagal užklausą' : formatEUR(p.sellingVat)}</p>
    <p class="vat">${p.quoteOnly ? '' : 'Kaina su PVM'}</p>${!p.quoteOnly ? '<p class="demo-tag">DEMO kaina</p>' : ''}
    <a class="btn btn-primary" href="kontaktai.html?product=${encodeURIComponent(b.name)}#pasiulymas">Prašyti pasiūlymo</a></article>`;
}).join('');
