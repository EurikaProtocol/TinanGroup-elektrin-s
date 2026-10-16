# TINAN GROUP

Statinė lietuviška TINAN GROUP svetainė: Vite + vanilla JavaScript, be serverio dalies. Klientų užklausos paruošiamos el. pašto programoje; klientas turi pats išsiųsti laišką.

## Paleidimas ir patikra

```sh
npm ci
npm run dev
npm run lint
npm test
npm run build
```

Sukurti HTML puslapiai apima pradžią, produktų kategorijas, kainoraštį, paslaugas, informaciją apie įmonę, kontaktus ir individualaus pasiūlymo užklausą. GitHub Pages įvesties puslapiai apibrėžti `vite.config.js`; domeno failas yra `public/CNAME`.

## Produktų katalogas ir kainos

Viešas, redaguojamas katalogas yra `src/data/products.js`. Į jį galima įtraukti tik kliento informacijai patvirtintus laukus: produkto ID, pavadinimą, kategoriją, gamintoją, modelį, kliento kainą su PVM (`priceInclVat`), kainą be PVM (`priceExVat`) ir kainos patikrinimo datą (`priceVerifiedOn`). Kaina pateikiama kaip tiesioginė šaltinio reikšmė, be perskaičiavimo. Nepatvirtinta arba neturinti datos kaina svetainėje rodoma kaip „Kaina pagal užklausą“.

Specifikacijos, garantija, likutis, produkto vaizdas ir duomenų lapas rodomi tik kartu su atitinkamu patikrinimo datos lauku. Likutį galima rodyti tik tada, kai `stockCurrent` aiškiai nustatytas į `true`. Kataloge negali būti tiekėjo kainų, savikainos, pelno ar vidinės finansinės analizės. Originalaus kliento kainoraščio ar vidinių skaičiuoklių nedėkite į `public/`.

**Katalogo duomenys dar neimportuoti:** užduotyje nurodytas `Tinan_Group_KLIENTU_KAINORASTIS_2026.xlsx` šiame darbo aplanke nebuvo pateiktas, todėl `CATALOGUE` kol kas tuščias. Kainoms ir produktų duomenims paskelbti reikia pateikti šaltinio failą, peržiūrėti tik klientams skirtus lapus ir patikrinti kiekvieną įrašą. Originalus TINAN GROUP logotipas taip pat nebuvo rastas šiame repozitorijoje; šiuo metu naudojamas tekstinis pavadinimas.

## Hostingas

GitHub Pages publikavimui įgalinkite „GitHub Actions“ kaip Pages šaltinį. Svetainė neturi backend, automatinio laiškų siuntimo, duomenų bazės ar AI API. `https://tinangroup.com` naudojamas canonical URL, sitemap ir CNAME; DNS ir domeno nustatymai nekeičiami projekte.
