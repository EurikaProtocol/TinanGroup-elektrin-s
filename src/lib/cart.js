// Quote list ("užklausos sąrašas") persisted in localStorage. No data leaves the browser.
const KEY = 'tinan-quote-list';
const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
};
const write = (l) => {
  try { localStorage.setItem(KEY, JSON.stringify(l)); } catch { /* storage unavailable */ }
  window.dispatchEvent(new CustomEvent('cart-change'));
};
export const getCart = read;
export const cartCount = () => read().reduce((n, i) => n + i.qty, 0);
export function addToCart(id, name, qty = 1) {
  const l = read();
  const f = l.find((i) => i.id === id);
  if (f) f.qty = Math.min(999, f.qty + qty); else l.push({ id, name, qty });
  write(l);
}
export function setQty(id, qty) {
  const q = Math.floor(Number(qty));
  write(read().map((i) => (i.id === id ? { ...i, qty: q > 0 ? Math.min(q, 999) : 1 } : i)));
}
export const removeFromCart = (id) => write(read().filter((i) => i.id !== id));
export const clearCart = () => write([]);
