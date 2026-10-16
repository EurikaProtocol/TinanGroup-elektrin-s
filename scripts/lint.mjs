import { readFileSync, existsSync } from 'node:fs';
import { CATALOGUE, CATEGORIES } from '../src/data/products.js';

let errors = 0;
const fail = (message) => { console.error(`LINT: ${message}`); errors += 1; };
const ids = new Set();
const forbiddenFields = /supplier|purchase|cost|profit|margin|pelno|savikain/i;
for (const [index, item] of CATALOGUE.entries()) {
  if (!item.id || ids.has(item.id)) fail(`product ${index}: missing or duplicate id`);
  ids.add(item.id);
  if (!item.name || !item.category) fail(`product ${item.id}: name and category are required`);
  if (!CATEGORIES.some((category) => category.id === item.category)) fail(`product ${item.id}: unknown category`);
  for (const field of Object.keys(item)) {
    if (forbiddenFields.test(field)) fail(`product ${item.id}: internal field "${field}" is not allowed`);
  }
  if (item.priceInclVat != null && (!Number.isFinite(item.priceInclVat) || item.priceInclVat < 0 || !item.priceVerifiedOn)) {
    fail(`product ${item.id}: customer price must be non-negative and include a verification date`);
  }
  if (item.priceExVat != null && (!Number.isFinite(item.priceExVat) || item.priceExVat < 0 || !item.priceVerifiedOn)) {
    fail(`product ${item.id}: business price must be non-negative and include a verification date`);
  }
  for (const [value, verifiedOn, label] of [
    [item.warranty, item.warrantyVerifiedOn, 'warranty'],
    [item.stockStatus, item.stockVerifiedOn, 'stock'],
    [item.datasheet, item.datasheetVerifiedOn, 'datasheet'],
    [item.image, item.imageVerifiedOn, 'image'],
    [item.specs, item.specsVerifiedOn, 'specifications'],
  ]) {
    if (value != null && !verifiedOn) fail(`product ${item.id}: ${label} needs a verification date`);
  }
}

for (const page of [
  'index.html', 'moduliai.html', 'inverteriai.html', 'kaupikliai.html', 'konstrukcijos.html',
  'elektros-medziagos.html', 'komplektai.html', 'kainorastis.html', 'paslaugos.html',
  'apie.html', 'kontaktai.html', 'pasiulymas.html',
]) {
  if (!existsSync(new URL(`../${page}`, import.meta.url))) fail(`page missing: ${page}`);
}
for (const asset of ['public/CNAME', 'public/robots.txt', 'public/sitemap.xml']) {
  if (!existsSync(new URL(`../${asset}`, import.meta.url))) fail(`SEO/hosting asset missing: ${asset}`);
}

if (errors) process.exitCode = 1;
else console.log(`Catalogue and route checks passed (${CATALOGUE.length} verified products).`);
