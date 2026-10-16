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

- Visi produktai: `src/data/products.js`; PVM, antkainis, skaičiuoklės prielaidos: `src/config.js`.
- Kaina klientui rodoma tik jei nurodyta `supplierPrice` **ir** `priceVerifiedOn` (patikrinimo data, YYYY-MM-DD); kitaip rodoma „Kaina pagal užklausą“.
  Pardavimo kaina = pirkimo × (1 + `markup`) + PVM. Tiekėjo pirkimo kaina viešai nerodoma.
- `null` specifikacijos laukas rodomas kaip „Nepatvirtinta“. Duomenų lapo nuorodą (`datasheet`) įrašykite tik patikrinę oficialiame gamintojo šaltinyje;
  kol jos nėra, rodoma nuoroda į gamintojo svetainę.
- Šiuo metu **jokia kaina nepatikrinta**, nė vienas duomenų lapas nesusietas, garantijos neįrašytos. Modelių sąrašas ir techniniai laukai surašyti be internetinio patikrinimo
  (SAJ ir SolarEdge modelių kodai bei dalis laukų – ypač neužtikrinti) ir **prieš publikuojant būtina patikrinti** pagal oficialius duomenų lapus.

## Užklausų formos

Svetainė neturi el. pašto siuntimo backend'o. Forma validuojama, sugeneruoja užklausos santrauką (su pasirinktais produktais ir kiekiais, sąrašas saugomas tik naršyklės localStorage) ir `mailto:` nuorodą
(info@tinangroup.com). Svetainė aiškiai nurodo, kad užklausa automatiškai nesiunčiama.

## GitHub Pages diegimas

1. Repository → Settings → Pages → Source: **GitHub Actions**.
2. Push į `main` paleidžia `.github/workflows/pages.yml` (lint, testai, build, deploy).
3. Domenas: `public/CNAME` nurodo `tinangroup.com`; DNS turi būti nukreiptas į GitHub Pages. Jei domenas nenaudojamas, pašalinkite CNAME – nuorodos reliatyvios ir veiks ir po `/repo/`.

Apribojimai: nėra serverio (nei formų siuntimo, nei duomenų bazės); `/inverteriai` be `.html` veikia Pages aplinkoje, o lokaliai naudokite `inverteriai.html`.
404 puslapis naudoja šakninius (`/`) kelius, nes GitHub Pages jį pateikia bet kuriame gylyje; kiti puslapiai – reliatyvūs.
Hero paveikslas yra SVG iliustracija – tikrą saulėlydžio nuotrauką (optimizuotą, su `alt`) reikia pridėti atskirai.
Sitemap/canonical naudoja `https://tinangroup.com`. TINAN AI agentas sąmoningai nepridėtas.
