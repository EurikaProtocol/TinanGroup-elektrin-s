// Lightweight consistency checks for product data and contact details.
import { readFileSync } from 'node:fs';
import { INVERTERS, PACKAGES } from '../src/data/products.js';
let bad = 0;
const fail = (m) => { console.error('LINT:', m); bad++; };
const ids = new Set();
for (const i of INVERTERS) {
  if (ids.has(i.id)) fail(`duplicate inverter id ${i.id}`);
  ids.add(i.id);
  if (!i.battery && i.batteryVoltage) fail(`${i.model}: batteryVoltage without battery`);
  if (i.battery && !i.batteryVoltage) fail(`${i.model}: battery without voltage`);
  if (i.supplierPrice == null && !i.quoteOnly) fail(`${i.model}: missing price must be quoteOnly`);
}
if (PACKAGES.length !== 5) fail('expected 5 packages');
for (const f of ['index.html', 'kontaktai.html']) {
  const t = readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
  if (!t.includes('info@tinangroup.com') && f === 'kontaktai.html') fail('email missing');
}
process.exit(bad ? 1 : 0);
