import './style.css';
import { mountLayout } from './lib/layout.js';
import { INVERTERS, MANUFACTURERS, invName } from './data/products.js';
import { priceInfo, formatEUR } from './lib/pricing.js';
import { matches, isCommercial } from './lib/filters.js';
import { addToCart } from './lib/cart.js';
import { PRICE_NOTICE, SPEC_NOTICE, VAT_RATE } from './config.js';

mountLayout('inverteriai.html');

const $ = (id) => document.getElementById(id);
const manufacturers = [...new Set(INVERTERS.map((i) => i.manufacturer))].sort();
$('f-manufacturer').innerHTML += manufacturers.map((m) => `<option>${m}</option>`).join('');
const powers = [...new Set(INVERTERS.map((i) => i.ratedKw))].sort((a, b) => a - b);
$('f-power').innerHTML += powers.map((p) => `<option value="${p}">${p} kW</option>`).join('');
$('price-notice').textContent = PRICE_NOTICE;
$('spec-notice').textContent = SPEC_NOTICE;

const NA = 'Nepatvirtinta';
const yn = (v) => (v === null || v === undefined ? NA : v ? 'Taip' : 'Ne');
const batt = (i) => (i.battery === null ? NA : i.battery ? `Suderinamas (${i.batteryVoltage === 'HV' ? 'aukštos įtampos' : i.batteryVoltage === 'LV' ? 'žemos įtampos, ~48 V' : 'įtampa nepatvirtinta'})` : 'Nepritaikytas');
const priceCell = (i) => {
  const p = priceInfo(i);
  return p.quoteOnly
    ? 'Kaina pagal užklausą'
    : `<strong>${formatEUR(p.sellingVat)}</strong> su ${Math.round(VAT_RATE * 100)}% PVM <small>(kaina patikrinta ${p.verifiedOn})</small>`;
};
const datasheetCell = (i) =>
  i.datasheet
    ? `<a href="${i.datasheet}" rel="noopener" target="_blank">Oficialus duomenų lapas</a>`
    : `Tiesioginė nuoroda nepatvirtinta – <a href="${MANUFACTURERS[i.manufacturer]}" rel="noopener" target="_blank">gamintojo svetainė</a>`;

const rows = (i) => [
  ['Gamintojas', i.manufacturer],
  ['Modelis', i.model],
  ['Tipas', i.type === 'hybrid' ? 'Hibridinis' : 'Tinklo (grid-tied)'],
  ['Segmentas', isCommercial(i) ? 'Komercinis' : 'Namams'],
  ['Nominali AC galia', `${i.ratedKw} kW`],
  ['Fazės', i.phase === 3 ? 'Trifazis' : 'Vienfazis'],
  ['MPPT skaičius', i.mppt ?? NA],
  ['Baterijos', batt(i)],
  ['Atsarginis maitinimas', yn(i.backup)],
  ['Garantija', i.warranty ?? NA],
  ['Duomenų lapas', datasheetCell(i)],
  ['Kaina', priceCell(i)],
];

const compare = new Set();
const dialog = $('dialog');
const openDialog = (html) => {
  $('dialog-body').innerHTML = html;
  if (dialog.showModal) dialog.showModal(); else dialog.setAttribute('open', '');
};
$('dialog-close').addEventListener('click', () => (dialog.close ? dialog.close() : dialog.removeAttribute('open')));

function render() {
  const f = {
    manufacturer: $('f-manufacturer').value, power: $('f-power').value, phase: $('f-phase').value,
    type: $('f-type').value, segment: $('f-segment').value, battery: $('f-battery').value,
    voltage: $('f-voltage').value, maxPrice: $('f-price').value,
  };
  const items = INVERTERS.filter((i) => matches(i, f));
  $('result-count').textContent = `Rasta modelių: ${items.length}`;
  $('inverter-list').innerHTML = items.length
    ? items.map((i) => `<article class="card inverter">
        <h3>${invName(i)}</h3>
        <dl>${rows(i).slice(2).map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
        <label class="check"><input type="checkbox" data-compare="${i.id}"${compare.has(i.id) ? ' checked' : ''}> Palyginti</label>
        <div class="row"><button class="btn btn-outline" data-details="${i.id}">Išsamiau</button>
        <button class="btn btn-primary" data-add="${i.id}">Į užklausos sąrašą</button></div>
      </article>`).join('')
    : '<p>Pagal pasirinktus filtrus modelių nerasta.</p>';
  updateBar();
}

function updateBar() {
  $('compare-bar').hidden = compare.size === 0;
  $('compare-text').textContent = `Pasirinkta palyginimui: ${compare.size} (iki 4)`;
  $('compare-open').disabled = compare.size < 2;
}

$('inverter-list').addEventListener('click', (e) => {
  const d = e.target.closest('[data-details]');
  const a = e.target.closest('[data-add]');
  if (d) {
    const i = INVERTERS.find((x) => x.id === d.dataset.details);
    openDialog(`<h2 id="dialog-title">${invName(i)}</h2><dl>${rows(i).map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
      <p class="muted">${SPEC_NOTICE}</p>`);
  }
  if (a) {
    const i = INVERTERS.find((x) => x.id === a.dataset.add);
    addToCart(i.id, `Inverteris ${invName(i)}`);
    a.textContent = 'Įtraukta ✓';
  }
});
$('inverter-list').addEventListener('change', (e) => {
  const id = e.target.dataset.compare;
  if (!id) return;
  if (e.target.checked) {
    if (compare.size >= 4) { e.target.checked = false; return; }
    compare.add(id);
  } else compare.delete(id);
  updateBar();
});
$('compare-clear').addEventListener('click', () => { compare.clear(); render(); });
$('compare-open').addEventListener('click', () => {
  const sel = INVERTERS.filter((i) => compare.has(i.id));
  const labels = rows(sel[0]).map(([k]) => k);
  openDialog(`<h2 id="dialog-title">Modelių palyginimas</h2><div class="table-wrap"><table>
    <thead><tr><th></th>${sel.map((i) => `<th>${invName(i)}</th>`).join('')}</tr></thead>
    <tbody>${labels.map((l, n) => `<tr><th scope="row">${l}</th>${sel.map((i) => `<td>${rows(i)[n][1]}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
});

$('filters').addEventListener('input', render);
$('filters').addEventListener('reset', () => setTimeout(render));
render();
