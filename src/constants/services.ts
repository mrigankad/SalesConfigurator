import type { ServiceItem } from '../types';

export const SERVICES: ServiceItem[] = [
  {
    title: 'Factory Virtual Twin as a Service',
    description: 'Transform your manufacturing operations with smarter and safer factories.',
    image: '/card_bg.png',
  },
  {
    title: 'Commercial Virtual Twin as a Service',
    description: 'Elevate your digital presence with top-tier 3D experiences for your customers.',
    image: '/card_bg.png',
  },
  {
    title: 'BioPharma Virtual Twin as a Service',
    description: 'Accelerate tech transfer and boost productivity with expert-managed virtual twins for biopharma manufacturing.',
    image: '/card_bg.png',
  },
];

export const MODEL_TYPES = ['NEW', 'FL', 'MYC', 'SE', 'DRV', 'BT'] as const;

export const COMPLEXITY_LEVELS = [
  { value: 'Simple', color: 'bg-emerald-500', label: 'Low risk, straightforward scope' },
  { value: 'Medium', color: 'bg-amber-500', label: 'Moderate effort, some unknowns' },
  { value: 'Complex', color: 'bg-rose-500', label: 'High effort, significant risk factors' },
] as const;

export const MATERIAL_COMPLEXITY = [
  { value: 'Basic', label: 'Standard materials & textures' },
  { value: 'Advanced', label: 'Custom PBR materials, multi-layer' },
  { value: 'Photoreal', label: 'High-fidelity scan-based shaders' },
] as const;

export const DATA_QUALITY = [
  { value: 'CAD Only', label: 'Raw engineering data provided' },
  { value: 'Refined', label: 'Cleaned, non-manifold geometry' },
  { value: 'Ready', label: 'Optimized VRED/Catia assets' },
] as const;

export const CLIENT_CAPABILITY = [
  { value: 'Assisted', label: 'Full DS support required' },
  { value: 'Collaborative', label: 'Hybrid team execution' },
  { value: 'Self-Service', label: 'DS oversight only' },
] as const;

export const CAD_FORMATS = ['CATIA', 'STEP', 'JT', 'Parasolid', 'Other'] as const;

export const CAR_SEGMENTS = ['Mini', 'Small', 'Midsize', 'Large', 'Very Large', 'Luxury'] as const;

export const BODY_TYPES = ['Single Body', 'Dual Body', 'Triple Body'] as const;

export const DERIVATIVE_OPTIONS = ['1', '2', '3', '4+'] as const;

export const INITIAL_USER_DATA = {
  name: '',
  email: '',
  phone: '',
  model_type: '',
  cad_format: '',
  model_name: '',
  segment: '',
  update_frequency: '',
  body_type: '',
  trim_levels: '',
  wheel_types: '',
  exterior_colors: '',
  interior_options: '',
  markets: '',
  customization_level: '',
  complexity: '',
  derivatives: '1',
  material_complexity: '',
  data_quality: '',
  client_capability: '',
};
