// Centralised, editable product data.
// IMPORTANT: every price here is a DEMO placeholder (priceStatus: 'demo') until verified
// against real supplier quotes. `supplierPrice` = purchase price excl. VAT,
// customer price = supplierPrice * (1 + markup), then VAT is added (see lib/pricing.js).
// `quoteOnly: true` or `supplierPrice: null` => shown as "Pagal užklausą".
// `warranty: null` => not verified, not displayed as a fact.
// Specifications must be checked against the manufacturer datasheet before publishing
// (`specsVerified: false` is shown on the site as a notice).

export const PACKAGES = [
  {
    id: 'start-5',
    name: '5 kW START',
    badge: null,
    kw: 5,
    battery: 'Be kaupiklio (galima pridėti vėliau)',
    equipment: ['≈ 9–10 saulės modulių (≈ 5 kWp)', 'Vienfazis tinklo inverteris ~5 kW', 'Tvirtinimo sistema stogui', 'DC / AC apsaugos ir kabeliai'],
    services: ['Konsultacija ir projektas', 'Montavimas', 'Paleidimas ir derinimas'],
    supplierPrice: 4200,
    markup: 0.2,
    quoteOnly: false,
    priceStatus: 'demo',
  },
  {
    id: 'popular-10',
    name: '10 kW POPULIARUS',
    badge: 'Populiariausias',
    kw: 10,
    battery: 'Be kaupiklio (paruošta jungčiai)',
    equipment: ['≈ 18–20 saulės modulių (≈ 10 kWp)', 'Trifazis tinklo inverteris ~10 kW', 'Tvirtinimo sistema', 'DC / AC apsaugos ir kabeliai'],
    services: ['Konsultacija ir projektas', 'Montavimas', 'Paleidimas ir derinimas', 'Dokumentų pagalba'],
    supplierPrice: 7600,
    markup: 0.2,
    quoteOnly: false,
    priceStatus: 'demo',
  },
  {
    id: 'hybrid-10',
    name: '10 kW HYBRID',
    badge: 'Su kaupikliu',
    kw: 10,
    battery: 'Hibridinis inverteris + baterijų kaupiklis (talpa nustatoma pasiūlyme)',
    equipment: ['≈ 18–20 saulės modulių (≈ 10 kWp)', 'Trifazis hibridinis inverteris ~10 kW', 'Baterijų kaupiklis', 'Tvirtinimas, apsaugos, kabeliai'],
    services: ['Konsultacija ir projektas', 'Montavimas', 'Paleidimas ir derinimas', 'Dokumentų pagalba'],
    supplierPrice: 12500,
    markup: 0.2,
    quoteOnly: false,
    priceStatus: 'demo',
  },
  {
    id: 'pro-15',
    name: '15 kW PRO',
    badge: null,
    kw: 15,
    battery: 'Pasirenkamas kaupiklis',
    equipment: ['≈ 27–30 saulės modulių (≈ 15 kWp)', 'Trifazis inverteris ~15 kW', 'Sustiprinta tvirtinimo sistema', 'DC / AC apsaugos ir kabeliai'],
    services: ['Konsultacija ir projektas', 'Montavimas', 'Paleidimas ir derinimas', 'Stebėsena'],
    supplierPrice: 10900,
    markup: 0.2,
    quoteOnly: false,
    priceStatus: 'demo',
  },
  {
    id: 'business-20',
    name: '20+ kW BUSINESS',
    badge: 'Verslui',
    kw: 20,
    battery: 'Pagal poreikį',
    equipment: ['Sprendimas pagal objektą (20 kWp ir daugiau)', 'Komercinis trifazis inverteris', 'Tvirtinimas plokščiam / šlaitiniam stogui', 'Apsaugos, kabeliai, stebėsena'],
    services: ['Objekto vertinimas', 'Projektas', 'Montavimas', 'Paleidimas ir priežiūra'],
    supplierPrice: null,
    markup: 0.2,
    quoteOnly: true,
    priceStatus: 'quote',
  },
];

/**
 * Inverter catalogue. Models listed are real product lines, but specs below were NOT
 * re-verified against live datasheets during implementation (specsVerified: false):
 * confirm each row with the manufacturer datasheet before publishing.
 * Capabilities are per model – never assume they apply to the whole manufacturer.
 * batteryVoltage: 'LV' (~48 V) | 'HV' (high-voltage) | null (no battery)
 */
export const INVERTERS = [
  { id: 'solis-s5-gc10k', manufacturer: 'Solis', model: 'S5-GC10K', ratedKw: 10, phase: 3, type: 'grid', mppt: 'Tikrinama pagal duomenų lapą (2 MPPT)', battery: false, batteryVoltage: null, backup: false, warranty: null, datasheet: null, supplierPrice: 780, markup: 0.2, priceStatus: 'demo', specsVerified: false },
  { id: 'solis-s6-eh1p5k-l', manufacturer: 'Solis', model: 'S6-EH1P5K-L', ratedKw: 5, phase: 1, type: 'hybrid', mppt: 'Tikrinama pagal duomenų lapą (2 MPPT)', battery: true, batteryVoltage: 'LV', backup: true, warranty: null, datasheet: null, supplierPrice: 1050, markup: 0.2, priceStatus: 'demo', specsVerified: false },
  { id: 'goodwe-gw10k-et', manufacturer: 'GoodWe', model: 'GW10K-ET', ratedKw: 10, phase: 3, type: 'hybrid', mppt: 'Tikrinama pagal duomenų lapą (2 MPPT)', battery: true, batteryVoltage: 'HV', backup: true, warranty: null, datasheet: null, supplierPrice: 1900, markup: 0.2, priceStatus: 'demo', specsVerified: false },
  { id: 'goodwe-gw5048d-es', manufacturer: 'GoodWe', model: 'GW5048D-ES', ratedKw: 5, phase: 1, type: 'hybrid', mppt: 'Tikrinama pagal duomenų lapą (2 MPPT)', battery: true, batteryVoltage: 'LV', backup: true, warranty: null, datasheet: null, supplierPrice: 1250, markup: 0.2, priceStatus: 'demo', specsVerified: false },
  { id: 'foxess-h3-10-smart', manufacturer: 'FoxESS', model: 'H3-10.0-Smart', ratedKw: 10, phase: 3, type: 'hybrid', mppt: 'Tikrinama pagal duomenų lapą', battery: true, batteryVoltage: 'HV', backup: true, warranty: null, datasheet: null, supplierPrice: null, markup: 0.2, quoteOnly: true, priceStatus: 'quote', specsVerified: false },
  { id: 'sungrow-sg10rt', manufacturer: 'Sungrow', model: 'SG10RT', ratedKw: 10, phase: 3, type: 'grid', mppt: 'Tikrinama pagal duomenų lapą (2 MPPT)', battery: false, batteryVoltage: null, backup: false, warranty: null, datasheet: null, supplierPrice: 820, markup: 0.2, priceStatus: 'demo', specsVerified: false },
  { id: 'sungrow-sh10rt', manufacturer: 'Sungrow', model: 'SH10RT', ratedKw: 10, phase: 3, type: 'hybrid', mppt: 'Tikrinama pagal duomenų lapą', battery: true, batteryVoltage: 'HV', backup: true, warranty: null, datasheet: null, supplierPrice: 1850, markup: 0.2, priceStatus: 'demo', specsVerified: false },
  { id: 'huawei-sun2000-10ktl-m1', manufacturer: 'Huawei', model: 'SUN2000-10KTL-M1', ratedKw: 10, phase: 3, type: 'hybrid', mppt: 'Tikrinama pagal duomenų lapą', battery: true, batteryVoltage: 'HV', backup: false, warranty: null, datasheet: null, supplierPrice: null, markup: 0.2, quoteOnly: true, priceStatus: 'quote', specsVerified: false },
  { id: 'huawei-sun2000-5ktl-l1', manufacturer: 'Huawei', model: 'SUN2000-5KTL-L1', ratedKw: 5, phase: 1, type: 'hybrid', mppt: 'Tikrinama pagal duomenų lapą', battery: true, batteryVoltage: 'HV', backup: false, warranty: null, datasheet: null, supplierPrice: null, markup: 0.2, quoteOnly: true, priceStatus: 'quote', specsVerified: false },
  { id: 'fronius-primo-gen24-6-plus', manufacturer: 'Fronius', model: 'Primo GEN24 6.0 Plus', ratedKw: 6, phase: 1, type: 'hybrid', mppt: 'Tikrinama pagal duomenų lapą (2 MPPT)', battery: true, batteryVoltage: 'HV', backup: true, warranty: null, datasheet: null, supplierPrice: null, markup: 0.2, quoteOnly: true, priceStatus: 'quote', specsVerified: false },
  { id: 'fronius-symo-gen24-10-plus', manufacturer: 'Fronius', model: 'Symo GEN24 10.0 Plus', ratedKw: 10, phase: 3, type: 'hybrid', mppt: 'Tikrinama pagal duomenų lapą (2 MPPT)', battery: true, batteryVoltage: 'HV', backup: true, warranty: null, datasheet: null, supplierPrice: null, markup: 0.2, quoteOnly: true, priceStatus: 'quote', specsVerified: false },
  { id: 'solplanet-asw10k-lt-g2', manufacturer: 'Solplanet', model: 'ASW10K-LT-G2', ratedKw: 10, phase: 3, type: 'grid', mppt: 'Tikrinama pagal duomenų lapą', battery: false, batteryVoltage: null, backup: false, warranty: null, datasheet: null, supplierPrice: 760, markup: 0.2, priceStatus: 'demo', specsVerified: false },
  { id: 'deye-sun-5k-sg03lp1-eu', manufacturer: 'Deye', model: 'SUN-5K-SG03LP1-EU', ratedKw: 5, phase: 1, type: 'hybrid', mppt: 'Tikrinama pagal duomenų lapą (2 MPPT)', battery: true, batteryVoltage: 'LV', backup: true, warranty: null, datasheet: null, supplierPrice: 950, markup: 0.2, priceStatus: 'demo', specsVerified: false },
  { id: 'deye-sun-10k-sg04lp3-eu', manufacturer: 'Deye', model: 'SUN-10K-SG04LP3-EU', ratedKw: 10, phase: 3, type: 'hybrid', mppt: 'Tikrinama pagal duomenų lapą (2 MPPT)', battery: true, batteryVoltage: 'LV', backup: true, warranty: null, datasheet: null, supplierPrice: 1750, markup: 0.2, priceStatus: 'demo', specsVerified: false },
  { id: 'sma-sunny-boy-5-0', manufacturer: 'SMA', model: 'Sunny Boy 5.0 (SB5.0-1AV-41)', ratedKw: 5, phase: 1, type: 'grid', mppt: 'Tikrinama pagal duomenų lapą (2 MPPT)', battery: false, batteryVoltage: null, backup: false, warranty: null, datasheet: null, supplierPrice: null, markup: 0.2, quoteOnly: true, priceStatus: 'quote', specsVerified: false },
];

const PLACEHOLDER = { markup: 0.2, priceStatus: 'demo', specsVerified: false };

export const BATTERIES = [
  { id: 'bat-lv-5', name: 'Žemos įtampos (48 V) baterija, ~5 kWh', category: 'LV', capacityKwh: 5, supplierPrice: 1100, ...PLACEHOLDER },
  { id: 'bat-lv-10', name: 'Žemos įtampos (48 V) baterija, ~10 kWh', category: 'LV', capacityKwh: 10, supplierPrice: 2100, ...PLACEHOLDER },
  { id: 'bat-hv-10', name: 'Aukštos įtampos baterija, ~10 kWh', category: 'HV', capacityKwh: 10, supplierPrice: 3300, ...PLACEHOLDER },
  { id: 'bat-hv-15', name: 'Aukštos įtampos baterija, ~15 kWh', category: 'HV', capacityKwh: 15, supplierPrice: null, quoteOnly: true, ...PLACEHOLDER },
];

export const MODULES = [
  { id: 'mod-450', name: 'Saulės modulis ~450 W (mono, juodas rėmas)', powerW: 450, supplierPrice: 95, ...PLACEHOLDER },
  { id: 'mod-550', name: 'Saulės modulis ~550 W (mono)', powerW: 550, supplierPrice: 115, ...PLACEHOLDER },
];

export const MOUNTING = [
  { id: 'mnt-roof-tile', name: 'Tvirtinimo sistema čerpių stogui (už kW)', supplierPrice: 75, ...PLACEHOLDER },
  { id: 'mnt-roof-flat', name: 'Tvirtinimas plokščiam stogui (už kW)', supplierPrice: null, quoteOnly: true, ...PLACEHOLDER },
];

export const PROTECTION = [
  { id: 'prot-dc', name: 'DC apsaugų komplektas', supplierPrice: 160, ...PLACEHOLDER },
  { id: 'prot-ac', name: 'AC apsaugų komplektas', supplierPrice: 190, ...PLACEHOLDER },
];

export const CABLES = [
  { id: 'cab-solar-6', name: 'Saulės kabelis 6 mm² (už m)', supplierPrice: 1.4, ...PLACEHOLDER },
  { id: 'cab-mc4', name: 'MC4 jungčių pora', supplierPrice: 3, ...PLACEHOLDER },
];

export const EQUIPMENT_GROUPS = [
  { key: 'modules', title: 'Saulės moduliai', items: MODULES },
  { key: 'inverters', title: 'Inverteriai', items: INVERTERS.map((i) => ({ ...i, name: `${i.manufacturer} ${i.model}` })) },
  { key: 'batteries', title: 'Kaupikliai', items: BATTERIES },
  { key: 'mounting', title: 'Tvirtinimo konstrukcijos', items: MOUNTING },
  { key: 'protection', title: 'DC ir AC apsaugos', items: PROTECTION },
  { key: 'cables', title: 'Kabeliai ir priedai', items: CABLES },
];
