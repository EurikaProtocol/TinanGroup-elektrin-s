import './style.css';
import { mountLayout } from './lib/layout.js';
import { ESTIMATOR_PRICES, PRICE_NOTICE } from './config.js';
import { estimate, recommendKw, formatEUR } from './lib/pricing.js';
import { bindQuoteForm } from './lib/quoteForm.js';

mountLayout('kontaktai.html');
const form = document.getElementById('quote-form');
const out = document.getElementById('estimate');
document.getElementById('price-notice').textContent = PRICE_NOTICE;

const q = new URLSearchParams(location.search);
for (const [param, field] of [['consumption', 'consumption'], ['kw', 'kw'], ['battery', 'battery'], ['property', 'propertyType'], ['product', 'product']]) {
  if (q.get(param) && form.elements[field]) form.elements[field].value = q.get(param);
}

function current() {
  const kw = Number(form.elements.kw.value);
  const battery = form.elements.battery.value;
  const kwh = battery === 'taip' ? Number(form.elements.batteryKwh.value) || 0 : 0;
  return { kw, batteryKwh: kwh, hybrid: battery === 'taip' };
}

export function getEstimate() {
  const c = current();
  return c.kw > 0 ? estimate(c, ESTIMATOR_PRICES) : null;
}

function update() {
  const c = current();
  const cons = Number(form.elements.consumption.value);
  form.querySelector('[data-battery-size]').hidden = form.elements.battery.value !== 'taip';
  let html = '';
  if (cons > 0) html += `<p>Pagal suvartojimą rekomenduojama apie <strong>${recommendKw(cons, ESTIMATOR_PRICES)} kWp</strong>.</p>`;
  const e = getEstimate();
  if (e) {
    html += `<p class="big">${formatEUR(e.low)} – ${formatEUR(e.high)} <small>su PVM</small></p>
      <p>Vidutinė kaina: ${formatEUR(e.incVat)} su PVM (${formatEUR(e.exVat)} be PVM). Apytikslė metinė gamyba: ${e.yearlyKwh} kWh.</p>
      <p class="muted">Tai orientacinis įvertis pagal DEMO kainas. Galutinė kaina priklauso nuo stogo būklės, įrangos suderinamumo, montavimo sudėtingumo, pristatymo ir patikrinto tiekėjų prieinamumo.</p>`;
  } else html += '<p class="muted">Įveskite norimą galią (kW), kad pamatytumėte orientacinį įvertį.</p>';
  out.innerHTML = html;
}
form.addEventListener('input', update);
update();
bindQuoteForm(form, { getEstimate });
