import './style.css';
import { mountLayout } from './lib/layout.js';
import { bindQuoteForm } from './lib/quoteForm.js';
import { getCart, setQty, removeFromCart, addToCart } from './lib/cart.js';
import { findItem } from './data/products.js';
import { formatEUR, priceInfo } from './lib/pricing.js';
import { PRICE_NOTICE } from './config.js';

mountLayout(location.pathname.split('/').pop() || 'kontaktai.html');
const form = document.querySelector('#quote-form');
document.querySelector('#price-notice').textContent = PRICE_NOTICE;

const params = new URLSearchParams(location.search);
const requestType = params.get('type');
if (requestType && form.elements.message) {
  form.elements.message.value = `Domina: ${requestType}. Prašau pateikti individualų pasiūlymą.`;
}
const addId = params.get('add');
if (addId) {
  const item = findItem(addId);
  if (item && !getCart().some((entry) => entry.id === addId)) addToCart(item.id, item.name);
}

const list = document.querySelector('#quote-list');
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
function renderList() {
  const items = getCart();
  let knownTotal = 0;
  let hasUnknown = false;
  list.innerHTML = items.length ? items.map((entry) => {
    const item = findItem(entry.id);
    const unit = item ? priceInfo(item).sellingVat : null;
    if (unit === null) hasUnknown = true;
    else knownTotal += unit * entry.qty;
    return `<li><span>${escapeHtml(entry.name)}</span><span class="quote-controls">
      <label class="sr">Kiekis<input type="number" min="1" max="999" value="${entry.qty}" data-qty="${escapeHtml(entry.id)}"></label>
      <span>${unit === null ? 'Kaina pagal užklausą' : formatEUR(unit * entry.qty)}</span>
      <button type="button" class="btn btn-outline" data-remove="${escapeHtml(entry.id)}" aria-label="Pašalinti ${escapeHtml(entry.name)}">Pašalinti</button></span></li>`;
  }).join('') : '<li>Sąrašas tuščias.</li>';
  const total = document.querySelector('#quote-total');
  total.textContent = items.length
    ? `${hasUnknown ? 'Patvirtintų kainų suma' : 'Orientacinė suma'}: ${formatEUR(knownTotal)}${hasUnknown ? ' · dalies prekių kaina pagal užklausą' : ''}`
    : '';
}
list.addEventListener('change', (event) => {
  if (event.target.dataset.qty) setQty(event.target.dataset.qty, event.target.value);
});
list.addEventListener('click', (event) => {
  const button = event.target.closest('[data-remove]');
  if (button) removeFromCart(button.dataset.remove);
});
window.addEventListener('cart-change', renderList);
renderList();
bindQuoteForm(form, {
  getItems: () => getCart().map((entry) => ({
    ...entry,
    priceInclVat: priceInfo(findItem(entry.id) || {}).sellingVat,
  })),
});
