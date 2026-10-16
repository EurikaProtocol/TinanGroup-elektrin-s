import './style.css';
import { mountLayout } from './lib/layout.js';
import { PACKAGES } from './data/products.js';
import { priceInfo, formatEUR } from './lib/pricing.js';
import { ESTIMATOR_PRICES, PRICE_NOTICE, VAT_RATE } from './config.js';
import { recommendKw } from './lib/pricing.js';

mountLayout('index.html');

const grid = document.getElementById('package-grid');
if (grid) {
  grid.innerHTML = PACKAGES.map((p) => {
    const info = priceInfo(p);
    return `<article class="card package${p.badge === 'Populiariausias' ? ' featured' : ''}">
      ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
      <h3>${p.name}</h3>
      <p class="price">${info.quoteOnly ? 'Kaina pagal užklausą' : formatEUR(info.sellingVat)}</p>
      <p class="vat">${info.quoteOnly ? 'Kaina skaičiuojama individualiai' : `Kaina su ${Math.round(VAT_RATE * 100)}% PVM, patikrinta ${info.verifiedOn}`}</p>
      
      <details><summary>Įranga ir paslaugos</summary>
        <h4>Įranga</h4><ul>${p.equipment.map((e) => `<li>${e}</li>`).join('')}</ul>
        <p><strong>Kaupiklis:</strong> ${p.battery}</p>
        <h4>Paslaugos</h4><ul>${p.services.map((e) => `<li>${e}</li>`).join('')}</ul>
      </details>
      <a class="btn btn-primary" href="kontaktai.html?add=${p.id}&kw=${p.kw}#pasiulymas">Gauti pasiūlymą</a>
    </article>`;
  }).join('');
}
const note = document.getElementById('price-notice');
if (note) note.textContent = PRICE_NOTICE;

const rec = document.getElementById('recommend-form');
if (rec) {
  rec.addEventListener('submit', (e) => {
    e.preventDefault();
    const consumption = Number(rec.elements.consumption.value);
    const out = document.getElementById('recommend-result');
    if (!(consumption > 0)) {
      out.innerHTML = '<p class="error" role="alert">Įveskite metinį elektros suvartojimą (kWh).</p>';
      return;
    }
    const property = rec.elements.property.value;
    const battery = rec.elements.battery.value;
    let kw = recommendKw(consumption, ESTIMATOR_PRICES);
    if (property === 'verslas') kw = Math.max(kw, 20);
    kw = Math.max(kw, 3);
    const pkg = PACKAGES.filter((p) => !p.quoteOnly || kw >= 20)
      .filter((p) => (battery === 'taip' ? p.id !== 'start-5' && p.id !== 'popular-10' : true))
      .sort((a, b) => Math.abs(a.kw - kw) - Math.abs(b.kw - kw))[0];
    out.innerHTML = `<div class="notice ok" role="status"><p>Orientacinė rekomendacija: apie <strong>${kw} kWp</strong>
      galios elektrinė${battery === 'taip' ? ' su kaupikliu' : ''}. Artimiausias paketas: <strong>${pkg ? pkg.name : '—'}</strong>.</p>
      <a class="btn btn-primary" href="kontaktai.html?consumption=${consumption}&kw=${kw}&battery=${battery}&property=${property}#pasiulymas">Tęsti į skaičiuoklę</a></div>`;
  });
}
