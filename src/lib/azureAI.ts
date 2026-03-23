import type { UserData } from '../types';
import type { Message } from '../types';

const ENDPOINT   = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT as string;
const API_KEY    = import.meta.env.VITE_AZURE_OPENAI_KEY as string;
const DEPLOYMENT = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT ?? 'gpt-4o-mini';
const API_VER    = import.meta.env.VITE_AZURE_OPENAI_API_VERSION ?? '2024-12-01-preview';

// ── Step metadata — what each step expects ────────────────────────────────────
export const STEP_META: Record<string, {
  question: string;
  extractHint: string;
  type: 'number' | 'text' | 'yesno' | 'choice' | 'list' | 'none';
  choices?: string[];
}> = {
  lead_capture:              { question: 'name, email, and phone number', extractHint: '', type: 'none' },
  company_context:           { question: 'company name', extractHint: 'Extract the company name as a plain string.', type: 'text' },
  industry_select:           { question: 'industry (Automotive, Aerospace, etc.)', extractHint: 'Extract the industry.', type: 'choice', choices: ['Automotive', 'Aerospace', 'Industrial Equipment', 'Consumer Goods', 'Other'] },
  role_select:               { question: 'job role/title', extractHint: 'Extract their role.', type: 'text' },
  worked_before:             { question: 'whether they have worked with Dassault before (Yes/No)', extractHint: 'Answer yes or no.', type: 'yesno' },
  how_heard:                 { question: 'how they heard about Dassault', extractHint: 'Extract how they heard.', type: 'text' },
  project_timeline:          { question: 'project timeline', extractHint: 'Extract timeline like "3 months", "Q3 2025", "ASAP" etc.', type: 'text' },
  cad_provision:             { question: 'whether CAD files will be available (Yes/No)', extractHint: 'Answer yes or no.', type: 'yesno' },
  cad_format_select:         { question: 'CAD format (CATIA, SOLIDWORKS, Parasolid, etc.)', extractHint: 'Extract the CAD format name.', type: 'text' },
  model_hierarchy:           { question: 'model line-up hierarchy', extractHint: 'Extract as a comma-separated list.', type: 'list' },
  unique_models_count:       { question: 'number of unique car models', extractHint: 'Extract a number.', type: 'number' },
  model_name:                { question: 'name of the car model', extractHint: 'Extract the model name (e.g. "XUV 300", "Creta", "Nexon").', type: 'text' },
  unique_variants_count:     { question: 'number of variants/grades', extractHint: 'Extract a number.', type: 'number' },
  segment_select:            { question: 'vehicle segment (Hatchback, Sedan, SUV, etc.)', extractHint: 'Extract the segment.', type: 'text' },
  update_frequency:          { question: 'how often models are updated', extractHint: 'Extract frequency like "Annually", "Every 2 years", etc.', type: 'text' },
  body_type_select:          { question: 'body type of the car', extractHint: 'Extract body type.', type: 'text' },
  trim_levels:               { question: 'number of trim levels', extractHint: 'Extract a number.', type: 'number' },
  wheel_types:               { question: 'number of wheel types', extractHint: 'Extract a number.', type: 'number' },
  exterior_colors:           { question: 'number of exterior colors', extractHint: 'Extract a number.', type: 'number' },
  interior_options:          { question: 'number of interior options', extractHint: 'Extract a number.', type: 'number' },
  markets:                   { question: 'geographical markets', extractHint: 'Extract as comma-separated list of regions/countries.', type: 'list' },
  customization_level:       { question: 'customization level (Low, Medium, High)', extractHint: 'Extract the level.', type: 'choice', choices: ['Low', 'Medium', 'High'] },
  exterior_modeling:         { question: 'whether additional exterior modeling is needed (Yes/No)', extractHint: 'Answer yes or no.', type: 'yesno' },
  interior_soft_parts:       { question: 'whether interior soft parts modeling is needed (Yes/No)', extractHint: 'Answer yes or no.', type: 'yesno' },
  reference_data_provided:   { question: 'whether reference data will be provided (Yes/No)', extractHint: 'Answer yes or no.', type: 'yesno' },
  cad_shape_reference:       { question: 'whether CAD shape reference will be provided (Yes/No)', extractHint: 'Answer yes or no.', type: 'yesno' },
  scanning_needed:           { question: 'whether 3D scanning is needed (Yes/No)', extractHint: 'Answer yes or no.', type: 'yesno' },
  material_samples:          { question: 'whether physical material samples will be available (Yes/No)', extractHint: 'Answer yes or no.', type: 'yesno' },
  texture_samples:           { question: 'whether texture samples will be provided (Yes/No)', extractHint: 'Answer yes or no.', type: 'yesno' },
  results:                   { question: '', extractHint: '', type: 'none' },
  post_results:              { question: '', extractHint: '', type: 'none' },
};

// ── Context builder ───────────────────────────────────────────────────────────
function buildSystemPrompt(userData: UserData, currentStep: string): string {
  const collected = [
    userData.company_name        && `Company: ${userData.company_name}`,
    userData.industry            && `Industry: ${userData.industry}`,
    userData.role                && `Role: ${userData.role}`,
    userData.model_name          && `Model: ${userData.model_name}`,
    userData.segment             && `Segment: ${userData.segment}`,
    userData.trim_levels         && `Trim levels: ${userData.trim_levels}`,
    userData.exterior_colors     && `Colors: ${userData.exterior_colors}`,
    userData.markets             && `Markets: ${userData.markets}`,
    userData.timeline            && `Timeline: ${userData.timeline}`,
  ].filter(Boolean).join('\n');

  const meta = STEP_META[currentStep];
  const isQuestionnaire = meta && meta.type !== 'none';
  const isPostResults   = currentStep === 'results' || currentStep === 'post_results';

  const taskInstructions = isPostResults
    ? `The user has already received their quote. Answer their questions about the quote, pricing, Dassault offerings, or next steps. Be helpful and guide them to schedule a call.`
    : isQuestionnaire
    ? `You are currently collecting: "${meta.question}".

YOUR PRIMARY GOAL is to get the user to answer this specific question so the sales flow can continue.

Rules:
1. If the user's message contains a clear answer — extract it and respond with JSON.
2. If the user asks a tangential question — answer it briefly (1-2 sentences), then re-ask the current question.
3. If the user seems confused — clarify and re-ask.
4. Never skip the current question. Always steer back to it.
5. Be natural and conversational, not robotic.

${meta.extractHint}`
    : `Guide the conversation naturally.`;

  return `You are an expert AI sales advisor for Dassault Systèmes Virtual Twin as a Service.

## Current Task
${taskInstructions}

## Project Data Collected So Far
${collected || 'Nothing collected yet.'}

## Response Format
${isQuestionnaire && meta.type !== 'none'
  ? `You MUST respond with valid JSON only — no markdown, no extra text:
{
  "reply": "Your conversational response to the user",
  "extracted": "the extracted value, or null if you cannot determine the answer"
}

For yes/no questions: extracted should be "Yes" or "No" or null.
For numbers: extracted should be the numeric string (e.g. "3") or null.
For lists: extracted should be comma-separated values or null.
For text/choice: extracted should be the plain string value or null.`
  : `Respond with plain text only. 2-4 sentences max.`}`;
}

// ── LLM response types ────────────────────────────────────────────────────────
export interface LLMResponse {
  reply: string;
  extracted: string | null;
}

// ── Main function ─────────────────────────────────────────────────────────────
export async function askLLM(
  userMessage: string,
  conversationHistory: Message[],
  userData: UserData,
  currentStep: string,
): Promise<LLMResponse> {
  const url = `${ENDPOINT.replace(/\/$/, '')}/openai/deployments/${DEPLOYMENT}/chat/completions?api-version=${API_VER}`;

  const meta = STEP_META[currentStep];
  const expectsJson = meta && meta.type !== 'none'
    && currentStep !== 'results'
    && currentStep !== 'post_results';

  const recentMessages = conversationHistory
    .slice(-10)
    .filter(m => m.content && !m.interactiveType)
    .map(m => ({
      role: m.type === 'user' ? 'user' : 'assistant',
      content: m.content,
    }));

  const body: any = {
    messages: [
      { role: 'system', content: buildSystemPrompt(userData, currentStep) },
      ...recentMessages,
      { role: 'user', content: userMessage },
    ],
    max_tokens: 300,
    temperature: 0.5,
  };

  if (expectsJson) {
    body.response_format = { type: 'json_object' };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': API_KEY },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Azure OpenAI ${res.status}: ${err}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content?.trim() ?? '';

  if (expectsJson) {
    try {
      const parsed = JSON.parse(content);
      return {
        reply:     parsed.reply     ?? content,
        extracted: parsed.extracted ?? null,
      };
    } catch {
      // If JSON parse fails, treat whole response as reply
      return { reply: content, extracted: null };
    }
  }

  return { reply: content, extracted: null };
}
