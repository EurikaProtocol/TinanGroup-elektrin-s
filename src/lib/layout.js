import { COMPANY } from '../config.js';
import { CATEGORIES } from '../data/products.js';
import { cartCount } from './cart.js';

const NAV = [
  ['index.html', 'Pradžia'],
  ...CATEGORIES.filter((item) => item.id !== 'services').map((item) => [item.page, item.name]),
  ['kainorastis.html', 'Kainoraštis'],
  ['paslaugos.html', 'Paslaugos ir montavimas'],
  ['apie.html', 'Apie mus'],
  ['pasiulymas.html', 'Individualus pasiūlymas'],
  ['kontaktai.html', 'Kontaktai'],
];

export const LOGO = '<span class="wordmark">TINAN <b>GROUP</b></span>';

export function mountLayout(active, root = '') {
  const header = document.getElementById('site-header');
  if (header) {
    header.className = 'site-header';
    header.innerHTML = `<div class="container header-top">
      <a href="${root}index.html" class="logo-link" aria-label="TINAN GROUP – pradžia">${LOGO}</a>
      <a class="header-phone" href="tel:${COMPANY.phone}">${COMPANY.phoneDisplay}</a>
      <button class="nav-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Atidaryti meniu">☰</button>
    </div><nav id="main-nav" class="main-nav container" aria-label="Pagrindinė navigacija">
      ${NAV.map(([href, title]) => `<a href="${root}${href}"${href === active ? ' aria-current="page"' : ''}>${title}</a>`).join('')}
      <a class="cart-link" href="${root}kontaktai.html#pasiulymas">Užklausos sąrašas (<span data-cart-count>0</span>)</a>
    </nav>`;
    const updateCount = () => header.querySelectorAll('[data-cart-count]').forEach((node) => {
      node.textContent = cartCount();
    });
    updateCount();
    window.addEventListener('cart-change', updateCount);
    window.addEventListener('storage', updateCount);
    const toggle = header.querySelector('.nav-toggle');
    toggle.addEventListener('click', () => {
      const open = header.querySelector('#main-nav').classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Uždaryti meniu' : 'Atidaryti meniu');
    });
  }
  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.className = 'site-footer';
    footer.innerHTML = `<div class="container footer-grid">
      <div>${LOGO}<p>Saulės energetikos įranga ir individualūs sprendimai Lietuvoje.</p></div>
      <div><h2>Informacija</h2><ul>${NAV.map(([href, title]) => `<li><a href="${root}${href}">${title}</a></li>`).join('')}</ul></div>
      <div><h2>Susisiekime</h2><p><a href="mailto:${COMPANY.email}">${COMPANY.email}</a><br><a href="tel:${COMPANY.phone}">${COMPANY.phoneDisplay}</a></p></div>
    </div><div class="container copyright">© ${new Date().getFullYear()} ${COMPANY.name}. Kainos orientacinės, galutinė pasiūlymo kaina tikslinama.</div>`;
  }
}
