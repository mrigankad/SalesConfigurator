import React from 'react';

export interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string | React.ReactNode;
  timestamp: Date;
  /** If set, the chat renderer will render the matching interactive card instead of content */
  interactiveType?: InteractiveCardType;
}

export type InteractiveCardType =
  | 'lead_capture'
  | 'model_select'
  | 'complexity_select'
  | 'derivatives_select'
  | 'material_complexity_select'
  | 'data_quality_select'
  | 'capability_select'
  | 'cad_format_select' // New
  | 'segment_select'    // New
  | 'body_type_select'  // New
  | 'results';

export type ChatStep =
  | 'idle'
  | 'greeting'
  | 'lead_capture'
  | 'model_select'
  | 'cad_format_select' // New
  | 'segment_select'    // New
  | 'body_type_select'  // New
  | 'complexity_select'
  | 'derivatives_select'
  | 'material_complexity_select'
  | 'data_quality_select'
  | 'capability_select'
  | 'calculating'
  | 'results'
  | 'post_results';

export interface UserData {
  name: string;
  email: string;
  phone: string;
  model_type: string;
  // Automotive specifics from catalog
  cad_format?: string;
  model_name?: string;
  segment?: string;
  update_frequency?: string;
  body_type?: string;
  trim_levels?: string;
  wheel_types?: string;
  exterior_colors?: string;
  interior_options?: string;
  markets?: string;
  customization_level?: string;
  // Existing
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
