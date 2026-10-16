import './style.css';
import { mountLayout } from './lib/layout.js';
import { INVERTERS } from './data/products.js';
import { priceInfo, formatEUR } from './lib/pricing.js';
import { matches } from './lib/filters.js';
import { PRICE_NOTICE, VAT_RATE } from './config.js';

mountLayout('inverteriai.html');

const $ = (id) => document.getElementById(id);
const list = $('inverter-list');
const manufacturers = [...new Set(INVERTERS.map((i) => i.manufacturer))].sort();
$('f-manufacturer').innerHTML += manufacturers.map((m) => `<option>${m}</option>`).join('');
const powers = [...new Set(INVERTERS.map((i) => i.ratedKw))].sort((a, b) => a - b);
$('f-power').innerHTML += powers.map((p) => `<option value="${p}">${p} kW</option>`).join('');
$('price-notice').textContent = PRICE_NOTICE;

const yn = (v) => (v ? 'Taip' : 'Ne');

function render() {
  const f = {
    manufacturer: $('f-manufacturer').value,
    power: $('f-power').value,
    phase: $('f-phase').value,
    type: $('f-type').value,
    battery: $('f-battery').value,
    voltage: $('f-voltage').value,
    maxPrice: $('f-price').value,
  };
  const items = INVERTERS.filter((i) => matches(i, f));
  $('result-count').textContent = `Rasta modelių: ${items.length}`;
  list.innerHTML = items.length
    ? items.map((i) => {
        const p = priceInfo(i);
        return `<article class="card inverter">
        <h3>${i.manufacturer} ${i.model}</h3>
        <dl>
          <dt>Nominali AC galia</dt><dd>${i.ratedKw} kW</dd>
          <dt>Fazės</dt><dd>${i.phase === 3 ? 'Trifazis' : 'Vienfazis'}</dd>
          <dt>Tipas</dt><dd>${i.type === 'hybrid' ? 'Hibridinis' : 'Tinklo (grid-tie)'}</dd>
          <dt>MPPT</dt><dd>${i.mppt}</dd>
          <dt>Baterijos</dt><dd>${i.battery ? `Suderinamas (${i.batteryVoltage === 'HV' ? 'aukštos įtampos' : 'žemos įtampos, ~48 V'})` : 'Nepritaikytas'}</dd>
          <dt>Atsarginis maitinimas</dt><dd>${yn(i.backup)}</dd>
          <dt>Garantija</dt><dd>${i.warranty ? i.warranty : 'Nepatikrinta'}</dd>
          <dt>Duomenų lapas</dt><dd>${i.datasheet ? `<a href="${i.datasheet}" rel="noopener" target="_blank">Atidaryti</a>` : 'Nėra nuorodos'}</dd>
          <dt>Tiekėjo kaina</dt><dd>${p.quoteOnly ? 'Nepateikta' : formatEUR(p.supplier) + ' be PVM (vidinė)'}</dd>
          <dt>Pardavimo kaina</dt><dd>${p.quoteOnly ? 'Pagal užklausą' : formatEUR(p.selling) + ' be PVM'}</dd>
          <dt>Kaina su PVM ${Math.round(VAT_RATE * 100)}%</dt><dd><strong>${p.quoteOnly ? 'Pagal užklausą' : formatEUR(p.sellingVat)}</strong></dd>
        </dl>
        ${!p.quoteOnly && i.priceStatus === 'demo' ? '<p class="demo-tag">DEMO kaina</p>' : ''}
        ${i.specsVerified ? '' : '<p class="muted">Specifikacijas būtina patikrinti pagal gamintojo duomenų lapą.</p>'}
        <a class="btn btn-primary" href="kontaktai.html?product=${encodeURIComponent(i.manufacturer + ' ' + i.model)}#pasiulymas">Prašyti pasiūlymo</a>
      </article>`;
      }).join('')
    : '<p>Pagal pasirinktus filtrus modelių nerasta.</p>';
}

$('filters').addEventListener('input', render);
$('filters').addEventListener('reset', () => setTimeout(render));
render();
