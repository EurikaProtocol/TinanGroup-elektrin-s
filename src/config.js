// Centralised, editable site configuration.
export const COMPANY = {
  name: 'TINAN GROUP',
  email: 'info@tinangroup.com',
  phone: '+37069685605',
  phoneDisplay: '+370 696 85605',
  domain: 'tinangroup.com',
};

// Lithuanian standard VAT rate (verify before publishing real prices).
export const VAT_RATE = 0.21;
// Default markup applied on supplier purchase price when a product has no own markup.
export const DEFAULT_MARKUP = 0.2;
export const PRICE_NOTICE =
  'Kaina rodoma tik patikrinus ją pas tiekėją (nurodoma patikrinimo data). Kitais atvejais – „Kaina pagal užklausą“.';
export const SPEC_NOTICE =
  'Techniniai duomenys pateikiami informaciniais tikslais. Prieš užsakant jie tikrinami pagal oficialų gamintojo duomenų lapą; nepatvirtinti laukai pažymėti „Nepatvirtinta“.';

// Skaičiuoklės prielaidos (EUR be PVM, redaguojamos). Tai NEPATVIRTINTOS tiekėjų kainos – tik orientaciniam įverčiui.
export const ESTIMATOR_PRICES = {
  modulesPerKw: 230,
  inverterPerKw: 160,
  mountingPerKw: 70,
  protectionFlat: 350,
  cablesPerKw: 45,
  installationPerKw: 140,
  batteryPerKwh: 330,
  hybridInverterExtraPerKw: 60,
  markup: DEFAULT_MARKUP,
  // annual yield assumption, kWh per installed kWp (indicative, Lithuania)
  yieldPerKwp: 950,
};
