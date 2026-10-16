import { priceInfo } from './pricing.js';

export function matches(i, f) {
  const sell = priceInfo(i).sellingVat;
  return (
    (!f.manufacturer || i.manufacturer === f.manufacturer) &&
    (!f.power || i.ratedKw === Number(f.power)) &&
    (!f.phase || String(i.phase) === f.phase) &&
    (!f.type || i.type === f.type) &&
    (!f.battery || (f.battery === 'yes' ? i.battery : !i.battery)) &&
    (!f.voltage || i.batteryVoltage === f.voltage) &&
    (!f.maxPrice || (sell != null && sell <= Number(f.maxPrice)))
  );
}
