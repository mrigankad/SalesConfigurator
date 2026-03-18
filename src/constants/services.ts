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

// Legacy constants (kept for compatibility)
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

export const CAR_SEGMENTS = ['Mini', 'Small', 'Midsize', 'Large', 'Very Large'] as const;

export const BODY_TYPES = ['Single Body', 'Dual Body', 'Triple Body'] as const;

export const DERIVATIVE_OPTIONS = ['1', '2', '3', '4+'] as const;

// ============================================
// ART Questionnaire Constants
// ============================================

// STEP 0: Company Context
export const INDUSTRIES = [
  { value: 'Automotive', label: 'Automotive' },
  { value: 'OEM', label: 'OEM' },
  { value: 'Supplier', label: 'Supplier' },
  { value: 'Other', label: 'Other' },
] as const;

export const ROLES = [
  { value: 'Sales', label: 'Sales' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Design', label: 'Design' },
  { value: 'Procurement', label: 'Procurement' },
  { value: 'Other', label: 'Other' },
] as const;

export const WORKED_BEFORE_OPTIONS = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
  { value: 'Not Sure', label: 'Not Sure' },
] as const;

export const HOW_HEARD_OPTIONS = [
  { value: 'Referral', label: 'Referral' },
  { value: 'Website', label: 'Website' },
  { value: 'Event', label: 'Event' },
  { value: 'Outreach', label: 'Outreach' },
  { value: 'Other', label: 'Other' },
] as const;

export const PROJECT_GOALS = [
  { value: 'Exploration', label: 'Exploration' },
  { value: 'RFQ', label: 'RFQ' },
  { value: 'Benchmarking', label: 'Benchmarking' },
  { value: 'Other', label: 'Other' },
] as const;

export const TIMELINE_OPTIONS = [
  { value: 'Urgent', label: 'Urgent' },
  { value: '1-3 months', label: '1–3 months' },
  { value: '3-6 months', label: '3–6 months' },
  { value: '6+ months', label: '6+ months' },
] as const;

// STEP 1: Data Prep
export const MODEL_HIERARCHY_OPTIONS = [
  { value: 'Model', label: 'Model' },
  { value: 'Variant', label: 'Variant / Grade' },
  { value: 'Drivetrain', label: 'Drivetrain' },
  { value: 'Trim', label: 'Trim' },
  { value: 'Other', label: 'Other Option' },
] as const;

// STEP 2: Model Definition
export const UPDATE_FREQUENCIES = [
  { value: 'Annually', label: 'Annually' },
  { value: 'Bi-annually', label: 'Bi-annually' },
  { value: 'Every 3 years', label: 'Every 3 years' },
  { value: 'Every 5 years', label: 'Every 5 years' },
  { value: 'Other', label: 'Other' },
] as const;

// STEP 3: Configuration Details
export const CUSTOMIZATION_LEVELS = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
] as const;

// Yes/No options for various questions
export const YES_NO_OPTIONS = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
] as const;

// Numeric options for counts
export const COUNT_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'] as const;

// ============================================
// Initial User Data Structure
// ============================================

export const INITIAL_USER_DATA = {
  // STEP 0: Company Context
  name: '',
  email: '',
  phone: '',
  company_name: '',
  company_website: '',
  company_size: '',
  company_country: '',
  industry: '',
  role: '',
  worked_before: '',
  previous_projects: '',
  last_engagement: '',
  how_heard: '',
  project_goal: '',
  timeline: '',
  
  // STEP 1: Data Prep
  cad_provided: '',
  cad_format: '',
  model_hierarchy: [],
  
  // STEP 2: Model Definition
  unique_models_count: '',
  model_name: '',
  unique_variants_count: '',
  segment: '',
  update_frequency: '',
  body_type: '',
  
  // STEP 3: Configuration Details
  trim_levels: '',
  wheel_types: '',
  exterior_colors: '',
  interior_options: '',
  markets: '',
  customization_level: '',
  
  // STEP 4: Modeling Related
  exterior_modeling_needed: '',
  interior_soft_parts_needed: '',
  reference_data_provided: '',
  cad_shape_reference_provided: '',
  scanning_needed: '',
  
  // STEP 5: Material Related
  material_samples_provided: '',
  texture_samples_provided: '',
  
  // Legacy fields (for compatibility)
  model_type: '',
  complexity: '',
  derivatives: '1',
  material_complexity: '',
  data_quality: '',
  client_capability: '',
};
