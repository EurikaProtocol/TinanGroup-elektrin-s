import { COMPANY } from '../config.js';
import { cartCount } from './cart.js';

const NAV = [
  ['index.html', 'Pradžia'],
  ['index.html#paketai', 'Saulės elektrinės'],
  ['kaupikliai.html', 'Kaupikliai'],
  ['inverteriai.html', 'Inverteriai'],
  ['index.html#paslaugos', 'Paslaugos'],
  ['index.html#apie', 'Apie mus'],
  ['kontaktai.html', 'Kontaktai'],
];

export const LOGO = `<span class="logo" aria-label="TINAN GROUP"><svg viewBox="0 0 40 40" width="36" height="36" role="img" aria-hidden="true"><circle cx="20" cy="20" r="8" fill="#F28C00"/><g stroke="#F28C00" stroke-width="2.5" stroke-linecap="round"><path d="M20 3v5M20 32v5M3 20h5M32 20h5M8 8l3.5 3.5M28.5 28.5L32 32M8 32l3.5-3.5M28.5 11.5L32 8"/></g></svg><span>TINAN <b>GROUP</b></span></span>`;

export function mountLayout(active, root = '') {
  const href = (h) => root + h;
  const header = document.getElementById('site-header');
  if (header) {
    header.className = 'site-header';
    header.innerHTML = `<div class="container header-inner">
      <a href="${href('index.html')}" class="logo-link">${LOGO}</a>
      <button class="nav-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Meniu">☰</button>
      <nav id="main-nav" class="main-nav" aria-label="Pagrindinė navigacija">
        ${NAV.map(([h, t]) => `<a href="${href(h)}"${h === active ? ' aria-current="page"' : ''}>${t}</a>`).join('')}
        <a class="cart-link" href="${href('kontaktai.html#pasiulymas')}">Užklausos sąrašas (<span data-cart-count>0</span>)</a>
        <a class="btn btn-primary nav-cta" href="${href('kontaktai.html#pasiulymas')}">Gauti pasiūlymą</a>
      </nav></div>`;
    const upd = () => header.querySelectorAll('[data-cart-count]').forEach((n) => (n.textContent = cartCount()));
    upd();
    window.addEventListener('cart-change', upd);
    window.addEventListener('storage', upd);
    const btn = header.querySelector('.nav-toggle');
    const nav = header.querySelector('#main-nav');
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  }
  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.className = 'site-footer';
    footer.innerHTML = `<div class="container footer-grid">
      <div>${LOGO}<p>Saulės elektrinės, inverteriai, kaupikliai ir įranga Lietuvos rinkai.</p></div>
      <div><h3>Nuorodos</h3><ul>${NAV.map(([h, t]) => `<li><a href="${href(h)}">${t}</a></li>`).join('')}</ul></div>
      <div><h3>Kontaktai</h3><p>${COMPANY.name}<br><a href="mailto:${COMPANY.email}">${COMPANY.email}</a><br><a href="tel:${COMPANY.phone}">${COMPANY.phoneDisplay}</a></p></div>
    </div><div class="container copyright">© ${new Date().getFullYear()} ${COMPANY.name}. Visos kainos – orientacinės; galutinė kaina nurodoma pasiūlyme.</div>`;
  }
}
