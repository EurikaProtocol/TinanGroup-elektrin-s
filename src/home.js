import './home.css';
import { recommend } from './lib/recommend.js';

const root = document.getElementById('recommender');
if (root) {
  const state = { usage: 'mid', battery: false, site: 'home' };
  const out = root.querySelector('[data-result]');
  const render = () => {
    const pkg = recommend(state);
    out.innerHTML = `Orientacinė rekomendacija: <strong>${pkg.name}</strong>. Galutinį dydį ir kainą nustatysime pagal jūsų projektą.`;
    const link = root.querySelector('[data-cta]');
    const note = `Rekomendacija: ${pkg.name}; sunaudojimas: ${state.usage}; baterija: ${state.battery ? 'taip' : 'ne'}; objektas: ${state.site}`;
    link.href = `kontaktai.html?pasiulymas=${encodeURIComponent(note)}#pasiulymas`;
  };
  root.querySelectorAll('[data-group]').forEach((group) => {
    group.addEventListener('click', (event) => {
      const btn = event.target.closest('button[data-value]');
      if (!btn) return;
      const key = group.dataset.group;
      const raw = btn.dataset.value;
      state[key] = key === 'battery' ? raw === 'yes' : raw;
      group.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      render();
    });
  });
  render();
}
