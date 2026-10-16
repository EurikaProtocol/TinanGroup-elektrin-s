// Centralised, editable product data.
//
// PRICES: `supplierPrice` = purchase price excl. VAT (internal, never shown to customers).
// A price is shown to customers ONLY when `supplierPrice` is a number AND `priceVerifiedOn`
// (YYYY-MM-DD, date the price was last verified with the supplier) is set and `quoteOnly` is not true.
// Otherwise the site shows "Kaina pagal užklausą". Customer price = supplierPrice * (1 + markup) + VAT.
//
// SPECS: `null` means "not verified" and is displayed as "Nepatvirtinta". Never fill a field
// from memory – copy it from the official datasheet and add the link to `datasheet`.
// `officialSite` is the manufacturer's official website; `datasheet` is a direct datasheet URL.

export const MANUFACTURERS = {
  Solis: 'https://www.solisinverters.com/',
  FoxESS: 'https://www.fox-ess.com/',
  GoodWe: 'https://www.goodwe.com/',
  Huawei: 'https://solar.huawei.com/',
  Sungrow: 'https://www.sungrowpower.com/',
  Deye: 'https://www.deyeinverter.com/',
  Solplanet: 'https://www.solplanet.net/',
  Fronius: 'https://www.fronius.com/',
  SMA: 'https://www.sma.de/',
  SAJ: 'https://www.saj-electric.com/',
  SolarEdge: 'https://www.solaredge.com/',
};

const P = { markup: 0.2, supplierPrice: null, priceVerifiedOn: null };

export const PACKAGES = [
  { id: 'start-5', name: '5 kW START', badge: null, kw: 5, battery: 'Be kaupiklio (galima pridėti vėliau)',
    equipment: ['≈ 9–10 saulės modulių (≈ 5 kWp)', 'Vienfazis tinklo inverteris ~5 kW', 'Tvirtinimo sistema stogui', 'DC / AC apsaugos ir kabeliai'],
    services: ['Konsultacija ir projektas', 'Montavimas', 'Paleidimas ir derinimas'], ...P },
  { id: 'popular-10', name: '10 kW POPULIARUS', badge: 'Populiariausias', kw: 10, battery: 'Be kaupiklio (paruošta jungčiai)',
    equipment: ['≈ 18–20 saulės modulių (≈ 10 kWp)', 'Trifazis tinklo inverteris ~10 kW', 'Tvirtinimo sistema', 'DC / AC apsaugos ir kabeliai'],
    services: ['Konsultacija ir projektas', 'Montavimas', 'Paleidimas ir derinimas', 'Dokumentų pagalba'], ...P },
  { id: 'hybrid-10', name: '10 kW HYBRID', badge: 'Su kaupikliu', kw: 10, battery: 'Hibridinis inverteris + baterijų kaupiklis (talpa nustatoma pasiūlyme)',
    equipment: ['≈ 18–20 saulės modulių (≈ 10 kWp)', 'Trifazis hibridinis inverteris ~10 kW', 'Baterijų kaupiklis', 'Tvirtinimas, apsaugos, kabeliai'],
    services: ['Konsultacija ir projektas', 'Montavimas', 'Paleidimas ir derinimas', 'Dokumentų pagalba'], ...P },
  { id: 'pro-15', name: '15 kW PRO', badge: null, kw: 15, battery: 'Pasirenkamas kaupiklis',
    equipment: ['≈ 27–30 saulės modulių (≈ 15 kWp)', 'Trifazis inverteris ~15 kW', 'Sustiprinta tvirtinimo sistema', 'DC / AC apsaugos ir kabeliai'],
    services: ['Konsultacija ir projektas', 'Montavimas', 'Paleidimas ir derinimas', 'Stebėsena'], ...P },
  { id: 'business-20', name: '20+ kW BUSINESS', badge: 'Verslui', kw: 20, battery: 'Pagal poreikį',
    equipment: ['Sprendimas pagal objektą (20 kWp ir daugiau)', 'Komercinis trifazis inverteris', 'Tvirtinimas plokščiam / šlaitiniam stogui', 'Apsaugos, kabeliai, stebėsena'],
    services: ['Objekto vertinimas', 'Projektas', 'Montavimas', 'Paleidimas ir priežiūra'], ...P, quoteOnly: true },
];

/**
 * Inverters. type: 'grid' | 'hybrid'; phase: 1 | 3; ratedKw = nominal AC power from the model name;
 * mppt: number | null; battery: true | false | null; batteryVoltage: 'LV' | 'HV' | null;
 * backup: true | false | null; warranty: text | null; datasheet: URL | null.
 * `commercial` is derived from ratedKw >= 30 (see lib/filters.js).
 */
const inv = (manufacturer, model, ratedKw, phase, type, extra = {}) => ({
  id: `${manufacturer}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
  manufacturer, model, ratedKw, phase, type,
  mppt: null, battery: null, batteryVoltage: null, backup: null, warranty: null, datasheet: null,
  ...P, ...extra,
});

export const INVERTERS = [
  inv('Solis', 'S5-GC10K', 10, 3, 'grid', { mppt: 2, battery: false }),
  inv('Solis', 'S6-EH1P5K-L', 5, 1, 'hybrid', { mppt: 2, battery: true, batteryVoltage: 'LV' }),
  inv('FoxESS', 'H3-10.0-Smart', 10, 3, 'hybrid', { mppt: 2, battery: true, batteryVoltage: 'HV' }),
  inv('GoodWe', 'GW10K-ET', 10, 3, 'hybrid', { mppt: 2, battery: true, batteryVoltage: 'HV' }),
  inv('GoodWe', 'GW5048D-ES', 5, 1, 'hybrid', { mppt: 2, battery: true, batteryVoltage: 'LV' }),
  inv('Huawei', 'SUN2000-5KTL-L1', 5, 1, 'hybrid', { mppt: 2, battery: true, batteryVoltage: 'HV' }),
  inv('Huawei', 'SUN2000-10KTL-M1', 10, 3, 'hybrid', { mppt: 2, battery: true, batteryVoltage: 'HV' }),
  inv('Huawei', 'SUN2000-100KTL-M1', 100, 3, 'grid', { mppt: 10, battery: false }),
  inv('Sungrow', 'SG10RT', 10, 3, 'grid', { mppt: 2, battery: false }),
  inv('Sungrow', 'SH10RT', 10, 3, 'hybrid', { mppt: 2, battery: true, batteryVoltage: 'HV' }),
  inv('Sungrow', 'SG110CX', 110, 3, 'grid', { battery: false }),
  inv('Deye', 'SUN-5K-SG03LP1-EU', 5, 1, 'hybrid', { mppt: 2, battery: true, batteryVoltage: 'LV' }),
  inv('Deye', 'SUN-10K-SG04LP3-EU', 10, 3, 'hybrid', { mppt: 2, battery: true, batteryVoltage: 'LV' }),
  inv('Solplanet', 'ASW10K-LT-G2', 10, 3, 'grid', { battery: false }),
  inv('Fronius', 'Primo GEN24 6.0 Plus', 6, 1, 'hybrid', { mppt: 2, battery: true, batteryVoltage: 'HV' }),
  inv('Fronius', 'Symo GEN24 10.0 Plus', 10, 3, 'hybrid', { mppt: 2, battery: true, batteryVoltage: 'HV' }),
  inv('SMA', 'Sunny Boy 5.0 (SB5.0-1AV-41)', 5, 1, 'grid', { mppt: 2, battery: false }),
  inv('SAJ', 'R5-10K-T2', 10, 3, 'grid'),
  inv('SAJ', 'H2-5K-S2', 5, 1, 'hybrid'),
  inv('SolarEdge', 'SE5000H-RW000BNN4', 5, 1, 'grid'),
];

export const BATTERIES = [
  { id: 'bat-lv-5', name: 'Žemos įtampos (~48 V) baterija, ~5 kWh', category: 'LV', capacityKwh: 5, ...P },
  { id: 'bat-lv-10', name: 'Žemos įtampos (~48 V) baterija, ~10 kWh', category: 'LV', capacityKwh: 10, ...P },
  { id: 'bat-hv-10', name: 'Aukštos įtampos baterija, ~10 kWh', category: 'HV', capacityKwh: 10, ...P },
  { id: 'bat-hv-15', name: 'Aukštos įtampos baterija, ~15 kWh', category: 'HV', capacityKwh: 15, ...P },
];

export const MODULES = [
  { id: 'mod-450', name: 'Saulės modulis ~450 W', powerW: 450, ...P },
  { id: 'mod-550', name: 'Saulės modulis ~550 W', powerW: 550, ...P },
];
export const MOUNTING = [
  { id: 'mnt-roof-tile', name: 'Tvirtinimo sistema čerpių stogui (už kW)', ...P },
  { id: 'mnt-roof-flat', name: 'Tvirtinimas plokščiam stogui (už kW)', ...P },
];
export const PROTECTION = [
  { id: 'prot-dc', name: 'DC apsaugų komplektas', ...P },
  { id: 'prot-ac', name: 'AC apsaugų komplektas', ...P },
];
export const CABLES = [
  { id: 'cab-solar-6', name: 'Saulės kabelis 6 mm² (už m)', ...P },
  { id: 'cab-mc4', name: 'MC4 jungčių pora', ...P },
];

export const invName = (i) => `${i.manufacturer} ${i.model}`;

/** Every orderable item, for the quote list. */
export function findItem(id) {
  const all = [
    ...PACKAGES.map((p) => ({ id: p.id, name: `Paketas ${p.name}` })),
    ...INVERTERS.map((i) => ({ id: i.id, name: `Inverteris ${invName(i)}` })),
    ...BATTERIES.map((b) => ({ id: b.id, name: b.name })),
    ...MODULES, ...MOUNTING, ...PROTECTION, ...CABLES,
  ];
  return all.find((x) => x.id === id) || null;
}
