# TinanGroup-elektrin-s
Oficiali TINAN GROUP svetainė – saulės elektrinės, inverteriai, baterijos, elektros įranga ir konkurencingi kainų pasiūlymai Lietuvos rinkai. Įrangos katalogas, produktų palyginimas ir individualių pasiūlymų užklausos.

## Technologijos

Statinė svetainė: Vite (multi-page) + vanilla JS, be serverio dalies ir be AI API.
Puslapiai: `/` (pradžia), `/inverteriai`, `/kaupikliai`, `/kontaktai` (užklausa + kainos skaičiuoklė).

```
npm install
npm run dev     # kūrimas
npm run lint    # duomenų nuoseklumo patikra
npm test        # vienetiniai testai (kainos, validacija, filtrai)
npm run build   # produkcinis build į dist/
```

## Duomenys ir kainos

- Visi produktai: `src/data/products.js`; kainų konstantos (PVM, antkainis, skaičiuoklės kainos): `src/config.js`.
- Tiekėjo pirkimo kaina (`supplierPrice`) atskirta nuo pardavimo kainos: `pardavimo = pirkimo × (1 + markup)`, tada pridedamas PVM.
- `quoteOnly: true` arba `supplierPrice: null` rodoma kaip „Pagal užklausą“.
- **Visos kainos yra DEMO** ir pažymėtos svetainėje, kol nepatikrintos su tiekėjais. Inverterių specifikacijos
  (`specsVerified: false`) taip pat turi būti patikrintos pagal gamintojų duomenų lapus; duomenų lapų nuorodos ir garantijos neįrašytos, nes nepatikrintos.

## Užklausų formos

Svetainė neturi el. pašto siuntimo backend'o. Forma validuojama, sugeneruoja užklausos santrauką ir `mailto:` nuorodą
(info@tinangroup.com). Svetainė aiškiai nurodo, kad užklausa automatiškai nesiunčiama.

## GitHub Pages diegimas

1. Repository → Settings → Pages → Source: **GitHub Actions**.
2. Push į `main` paleidžia `.github/workflows/pages.yml` (lint, testai, build, deploy).
3. Domenas: `public/CNAME` nurodo `tinangroup.com`; DNS turi būti nukreiptas į GitHub Pages. Jei domenas nenaudojamas, pašalinkite CNAME – nuorodos reliatyvios ir veiks ir po `/repo/`.

Apribojimai: nėra serverio (nei formų siuntimo, nei duomenų bazės); `/inverteriai` be `.html` veikia Pages aplinkoje, o lokaliai naudokite `inverteriai.html`.
Hero paveikslas yra SVG iliustracija – tikrą saulėlydžio nuotrauką (optimizuotą, su `alt`) reikia pridėti atskirai.
Sitemap/canonical naudoja `https://tinangroup.com`. TINAN AI agentas sąmoningai nepridėtas.
