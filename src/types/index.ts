import React from 'react';

export interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string | React.ReactNode;
  timestamp: Date;
  /** If set, the chat renderer will render the matching interactive card instead of content */
  interactiveType?: InteractiveCardType;
}

// ART (Automotive Requirements Template) Flow Steps
export type InteractiveCardType =
  // STEP 0: Company Context
  | 'lead_capture'
  | 'company_context'
  | 'industry_select'
  | 'role_select'
  | 'worked_before'
  | 'previous_projects' // If Yes
  | 'how_heard' // If No
  | 'project_timeline'
  // STEP 1: Data Prep
  | 'cad_provision'
  | 'cad_format_select'
  | 'model_hierarchy'
  // STEP 2: Model Definition
  | 'unique_models_count'
  | 'model_name'
  | 'unique_variants_count'
  | 'segment_select'
  | 'update_frequency'
  | 'body_type_select'
  // STEP 3: Configuration Details
  | 'trim_levels'
  | 'wheel_types'
  | 'exterior_colors'
  | 'interior_options'
  | 'markets'
  | 'customization_level'
  // STEP 4: Modeling Related
  | 'exterior_modeling'
  | 'interior_soft_parts'
  | 'reference_data_provided'
  | 'cad_shape_reference'
  | 'scanning_needed'
  // STEP 5: Material Related
  | 'material_samples'
  | 'texture_samples'
  // Results
  | 'results';

// ART Flow Steps
export type ChatStep =
  | 'idle'
  | 'greeting'
  // STEP 0: Company Context
  | 'lead_capture'
  | 'company_context'
  | 'industry_select'
  | 'role_select'
  | 'worked_before'
  | 'previous_projects'
  | 'how_heard'
  | 'project_timeline'
  // STEP 1: Data Prep
  | 'cad_provision'
  | 'cad_format_select'
  | 'model_hierarchy'
  // STEP 2: Model Definition
  | 'unique_models_count'
  | 'model_name'
  | 'unique_variants_count'
  | 'segment_select'
  | 'update_frequency'
  | 'body_type_select'
  // STEP 3: Configuration Details
  | 'trim_levels'
  | 'wheel_types'
  | 'exterior_colors'
  | 'interior_options'
  | 'markets'
  | 'customization_level'
  // STEP 4: Modeling Related
  | 'exterior_modeling'
  | 'interior_soft_parts'
  | 'reference_data_provided'
  | 'cad_shape_reference'
  | 'scanning_needed'
  // STEP 5: Material Related
  | 'material_samples'
  | 'texture_samples'
  // Final
  | 'calculating'
  | 'results'
  | 'post_results';

// Extended UserData for ART questionnaire
export interface UserData {
  // STEP 0: Company Context
  name: string;
  email: string;
  phone: string;
  company_name: string;
  company_website: string;
  company_size: string;
  company_country: string;
  industry: string;
  role: string;
  worked_before: string;
  previous_projects: string;
  last_engagement: string;
  how_heard: string;
  project_goal: string;
  timeline: string;
  
  // STEP 1: Data Prep
  cad_provided: string;
  cad_format: string;
  model_hierarchy: string[];
  
  // STEP 2: Model Definition
  unique_models_count: string;
  model_name: string;
  unique_variants_count: string;
  segment: string;
  update_frequency: string;
  body_type: string;
  
  // STEP 3: Configuration Details
  trim_levels: string;
  wheel_types: string;
  exterior_colors: string;
  interior_options: string;
  markets: string;
  customization_level: string;
  
  // STEP 4: Modeling Related
  exterior_modeling_needed: string;
  interior_soft_parts_needed: string;
  reference_data_provided: string;
  cad_shape_reference_provided: string;
  scanning_needed: string;
  
  // STEP 5: Material Related
  material_samples_provided: string;
  texture_samples_provided: string;
  
  // Legacy fields (for compatibility)
  model_type: string;
  complexity: string;
  derivatives: string;
  material_complexity: string;
  data_quality: string;
  client_capability: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  image: string;
}
