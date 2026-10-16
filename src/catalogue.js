import './style.css';
import { CATALOGUE, CATEGORIES } from './data/products.js';
import { mountLayout } from './lib/layout.js';
import { addToCart } from './lib/cart.js';
import { formatEUR, priceInfo } from './lib/pricing.js';
import { PRICE_NOTICE } from './config.js';

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
const safeUrl = (value) => {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
};
const displayType = (value) => value === 'hybrid' ? 'Hibridinis' : value === 'grid' ? 'Tinklo inverteris' : value;

const main = document.querySelector('[data-catalogue]');
if (main) {
  const page = main.dataset.page || location.pathname.split('/').pop();
  mountLayout(page);
  const category = main.dataset.category || '';
  const title = main.dataset.title || 'Kainoraštis';
  const categoryProducts = () => CATALOGUE.filter((item) => !category || item.category === category);
  const products = categoryProducts();
  const priceNotice = document.querySelector('#price-notice');
  if (priceNotice) priceNotice.textContent = PRICE_NOTICE;

  const manufacturerSelect = document.querySelector('#f-manufacturer');
  if (manufacturerSelect) {
    const names = [...new Set(products.map((item) => item.manufacturer).filter(Boolean))].sort();
    manufacturerSelect.innerHTML = '<option value="">Visi gamintojai</option>'
      + names.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('');
  }
  const powerSelect = document.querySelector('#f-power');
  if (powerSelect) {
    const powers = [...new Set(products.map((item) => item.powerKw).filter(Number.isFinite))].sort((a, b) => a - b);
    powerSelect.innerHTML = '<option value="">Visos</option>'
      + powers.map((power) => `<option value="${power}">${power} kW</option>`).join('');
  }
  const categorySelect = document.querySelector('#f-category');
  if (categorySelect) {
    categorySelect.innerHTML = '<option value="">Visos kategorijos</option>'
      + CATEGORIES.filter((item) => item.id !== 'services')
        .map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join('');
  }

  const compared = new Set();
  const quote = (item) => {
    addToCart(item.id, item.name);
    document.querySelector(`[data-add="${CSS.escape(item.id)}"]`)?.replaceChildren('Įtraukta ✓');
  };
  const render = () => {
    const search = (document.querySelector('#f-search')?.value || '').trim().toLocaleLowerCase('lt');
    const filters = {
      manufacturer: manufacturerSelect?.value || '',
      category: categorySelect?.value || '',
      type: document.querySelector('#f-type')?.value || '',
      power: document.querySelector('#f-power')?.value || '',
      maxPrice: document.querySelector('#f-price')?.value === ''
        ? null : Number(document.querySelector('#f-price')?.value),
      sort: document.querySelector('#f-sort')?.value || 'name',
    };
    let visible = products.filter((item) => {
      const text = [item.name, item.manufacturer, item.model, item.category].join(' ').toLocaleLowerCase('lt');
      const p = priceInfo(item).sellingVat;
      return (!search || text.includes(search))
        && (!filters.manufacturer || item.manufacturer === filters.manufacturer)
        && (!filters.category || item.category === filters.category)
        && (!filters.type || item.type === filters.type)
        && (!filters.power || Number(item.powerKw) === Number(filters.power))
        && (filters.maxPrice === null || (p !== null && p <= filters.maxPrice));
    });
    visible.sort((a, b) => filters.sort === 'price'
      ? (priceInfo(a).sellingVat ?? Infinity) - (priceInfo(b).sellingVat ?? Infinity)
      : String(a.name || '').localeCompare(String(b.name || ''), 'lt'));
    const grid = document.querySelector('#catalogue-grid');
    document.querySelector('#result-count').textContent = `Rasta produktų: ${visible.length}`;
    grid.innerHTML = visible.length ? visible.map((item) => {
      const price = priceInfo(item);
      const img = item.imageVerifiedOn ? safeUrl(item.image) : '';
      const details = item.specsVerifiedOn
        ? Object.entries(item.specs || {}).filter(([, value]) => value !== null && value !== '')
          .map(([key, value]) => `<dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd>`).join('')
        : '';
      const sheet = item.datasheetVerifiedOn ? safeUrl(item.datasheet) : '';
      return `<article class="product-card">
        ${img ? `<img class="product-image" src="${escapeHtml(img)}" alt="${escapeHtml(item.imageAlt || item.name)}" loading="lazy">` : '<div class="product-image product-image-placeholder" aria-hidden="true"><span>TINAN GROUP</span></div>'}
        <div class="product-content">
          <p class="eyebrow">${escapeHtml(CATEGORIES.find((entry) => entry.id === item.category)?.name || title)}</p>
          <h2>${escapeHtml(item.name)}</h2>
          <p class="product-model">${escapeHtml([item.manufacturer, item.model].filter(Boolean).join(' · ') || 'Modelis pagal užklausą')}</p>
          <p class="product-price">${price.quoteOnly ? 'Kaina pagal užklausą' : `${formatEUR(price.sellingVat)} <span>su PVM</span>`}</p>
          ${price.sellingExVat !== null ? `<p class="muted">Be PVM: ${formatEUR(price.sellingExVat)}</p>` : ''}
          ${item.warranty && item.warrantyVerifiedOn ? `<p>Garantija: ${escapeHtml(item.warranty)}</p>` : ''}
          ${item.stockStatus && item.stockVerifiedOn && item.stockCurrent === true ? `<p>${escapeHtml(item.stockStatus)} <span class="muted">(tikrinta ${escapeHtml(item.stockVerifiedOn)})</span></p>` : ''}
          ${details ? `<details><summary>Techninė informacija</summary><dl>${details}</dl></details>` : ''}
          ${sheet ? `<a href="${escapeHtml(sheet)}" target="_blank" rel="noopener noreferrer">Duomenų lapas</a>` : ''}
          ${price.verifiedOn ? `<p class="muted">Kaina tikrinta: ${escapeHtml(price.verifiedOn)}</p>` : ''}
          <div class="product-actions">
            <label class="check"><input type="checkbox" data-compare="${escapeHtml(item.id)}"${compared.has(item.id) ? ' checked' : ''}> Palyginti</label>
            <button class="btn btn-primary" type="button" data-add="${escapeHtml(item.id)}">Į užklausos sąrašą</button>
          </div>
        </div>
      </article>`;
    }).join('') : products.length ? `<div class="empty-state"><span class="eyebrow">PAIEŠKA</span>
      <h2>Pagal pasirinktus kriterijus produktų nerasta</h2><p>Pakeiskite filtrus arba juos išvalykite.</p>
      <button class="btn btn-outline" type="reset" form="filters">Išvalyti filtrus</button></div>` : `<div class="empty-state"><span class="eyebrow">TINAN GROUP · ${escapeHtml(title)}</span>
      <h2>Šiuo metu kainoraščio duomenys nepasiekiami</h2>
      <p>Konkrečių prekių, kainų, likučių ir garantijų nenurodome, kol jų nepatvirtiname pagal klientų kainoraštį. Dėl individualaus pasiūlymo susisiekite su mumis.</p>
      <a class="btn btn-primary" href="kontaktai.html#pasiulymas">Pateikti užklausą</a></div>`;
    const bar = document.querySelector('#compare-bar');
    bar.hidden = compared.size === 0;
    document.querySelector('#compare-text').textContent = `Palyginimui pasirinkta: ${compared.size} (iki 4)`;
    document.querySelector('#compare-open').disabled = compared.size < 2;
  };

  document.querySelector('#filters')?.addEventListener('input', render);
  document.querySelector('#filters')?.addEventListener('change', render);
  document.querySelector('#filters')?.addEventListener('reset', () => setTimeout(render));
  document.querySelector('#catalogue-grid').addEventListener('click', (event) => {
    const button = event.target.closest('[data-add]');
    if (button) quote(CATALOGUE.find((item) => item.id === button.dataset.add));
  });
  document.querySelector('#catalogue-grid').addEventListener('change', (event) => {
    const id = event.target.dataset.compare;
    if (!id) return;
    if (event.target.checked && compared.size < 4) compared.add(id);
    else {
      event.target.checked = false;
      compared.delete(id);
    }
    render();
  });
  document.querySelector('#compare-clear').addEventListener('click', () => { compared.clear(); render(); });
  document.querySelector('#compare-open').addEventListener('click', () => {
    const items = CATALOGUE.filter((item) => compared.has(item.id));
    const dialog = document.querySelector('#dialog');
    document.querySelector('#dialog-body').innerHTML = `<h2 id="dialog-title">Produktų palyginimas</h2>
      <div class="table-wrap"><table><thead><tr><th>Informacija</th>${items.map((item) => `<th>${escapeHtml(item.name)}</th>`).join('')}</tr></thead>
      <tbody>${[['Gamintojas', (item) => item.manufacturer], ['Modelis', (item) => item.model],
        ['Kaina su PVM', (item) => formatEUR(priceInfo(item).sellingVat)],
        ['Garantija', (item) => item.warranty], ['Tipas', (item) => displayType(item.type)],
        ['Galia', (item) => item.powerKw ? `${item.powerKw} kW` : null]]
        .map(([label, value]) => `<tr><th scope="row">${label}</th>${items.map((item) => `<td>${escapeHtml(value(item) || 'Nepatvirtinta')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    dialog.showModal();
  });
  document.querySelector('#dialog-close').addEventListener('click', () => document.querySelector('#dialog').close());
  render();
}
