import type { UserData } from '../types';

export interface QuoteLineItem {
  label: string;
  description: string;
  hours: number;
  amount: number;
}

export interface QuoteResult {
  lineItems: QuoteLineItem[];
  total: number;
  totalHours: number;
}

/** Parse a numeric string field, returning 0 if missing/invalid */
function n(val: string | undefined): number {
  const parsed = parseInt(val ?? '0', 10);
  return isNaN(parsed) ? 0 : parsed;
}

/** Parse markets string into count */
function marketCount(markets: string | undefined): number {
  if (!markets) return 1;
  return markets.split(',').map(s => s.trim()).filter(Boolean).length || 1;
}

export function calculateQuote(userData: UserData): QuoteResult {
  const models       = Math.max(1, n(userData.unique_models_count));
  const variants     = Math.max(1, n(userData.unique_variants_count));
  const trimLevels   = Math.max(1, n(userData.trim_levels));
  const colors       = Math.max(1, n(userData.exterior_colors));
  const interiorOpts = Math.max(1, n(userData.interior_options));
  const wheelTypes   = Math.max(1, n(userData.wheel_types));
  const markets      = marketCount(userData.markets);

  // ── Complexity multiplier ────────────────────────────────
  const complexity = {
    Low:    1.0,
    Medium: 1.35,
    High:   1.75,
  }[userData.customization_level] ?? 1.2;

  // ── CAD availability discount/surcharge ──────────────────
  const noCad = userData.cad_provided?.toLowerCase() === 'no';

  // ── Model Engineering ────────────────────────────────────
  let engHours = 0;
  // Base geometry + LOD per model
  engHours += models * 120;
  // Variant diff work
  engHours += variants * 18;
  // Trim logic
  engHours += trimLevels * 8;
  // Color materials
  engHours += colors * 3;
  // Interior setups
  engHours += interiorOpts * 12;
  // Wheel types
  engHours += wheelTypes * 6;

  // Extra modeling
  if (userData.exterior_modeling_needed === 'Yes') engHours += 80;
  if (userData.interior_soft_parts_needed === 'Yes') engHours += 60;
  if (userData.scanning_needed === 'Yes') engHours += 40;
  if (noCad) engHours = Math.round(engHours * 1.3); // 30% more effort without CAD

  engHours = Math.round(engHours * complexity);
  const engRate = 42; // $/hr
  const engAmount = engHours * engRate;

  // ── Virtual Twin Sync ────────────────────────────────────
  let syncHours = 60;
  syncHours += models * 20;
  syncHours += variants * 8;
  syncHours += markets * 12;

  const updateMult = {
    'Annually':     1.0,
    'Every 2 years': 0.8,
    'Bi-Annually':  1.3,
    'Quarterly':    1.6,
    'Continuously': 2.0,
  }[userData.update_frequency] ?? 1.0;

  if (userData.reference_data_provided === 'No') syncHours += 20;
  if (userData.cad_shape_reference_provided === 'No') syncHours += 16;
  if (userData.material_samples_provided === 'No') syncHours += 12;
  if (userData.texture_samples_provided === 'No') syncHours += 10;

  syncHours = Math.round(syncHours * updateMult);
  const syncRate = 46; // $/hr
  const syncAmount = syncHours * syncRate;

  // ── Cloud Compute ─────────────────────────────────────────
  let cloudHours = 40;
  cloudHours += models * 8;
  cloudHours += markets * 4;
  if (markets > 3) cloudHours += (markets - 3) * 6; // Multi-region premium

  const cloudRate = 55; // $/hr  (infra + ops)
  const cloudAmount = cloudHours * cloudRate;

  const lineItems: QuoteLineItem[] = [
    {
      label:       'Model Engineering',
      description: 'Geometry cleanup, LOD generation & material assignment',
      hours:       engHours,
      amount:      engAmount,
    },
    {
      label:       'Virtual Twin Sync',
      description: 'Variant pipelines, configurator logic & real-time sync',
      hours:       syncHours,
      amount:      syncAmount,
    },
    {
      label:       'Cloud Compute',
      description: '3DEXPERIENCE hosting, CI/CD & multi-region monitoring',
      hours:       cloudHours,
      amount:      cloudAmount,
    },
  ];

  const total      = lineItems.reduce((s, l) => s + l.amount, 0);
  const totalHours = lineItems.reduce((s, l) => s + l.hours, 0);

  return { lineItems, total, totalHours };
}
