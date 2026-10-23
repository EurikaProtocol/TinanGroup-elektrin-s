// Indicative package recommendation. Not an engineering design; no prices are produced.
export const PACKAGES = [
  { id: 'start', name: '5 kW START', kw: 5 },
  { id: 'popular', name: '10 kW POPULAR', kw: 10 },
  { id: 'hybrid', name: '10 kW HYBRID', kw: 10 },
  { id: 'pro', name: '15 kW PRO', kw: 15 },
  { id: 'business', name: '20+ kW BUSINESS', kw: 20 },
];

export function recommend({ usage = 'mid', battery = false, site = 'home' } = {}) {
  let id;
  if (usage === 'low') id = 'start';
  else if (usage === 'mid') id = 'popular';
  else if (usage === 'high') id = 'pro';
  else id = 'business';
  if (battery && (id === 'start' || id === 'popular')) id = 'hybrid';
  if (site === 'business' && (usage === 'high' || usage === 'xl')) id = 'business';
  return PACKAGES.find((p) => p.id === id);
}
