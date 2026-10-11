export const OPENROUTER_API_KEY =
  (import.meta as any).env?.VITE_OPENROUTER_API_KEY ||
  (typeof window !== 'undefined' ? localStorage.getItem('VITE_OPENROUTER_API_KEY') || '' : '') ||
  '';

// Google's Gemini 2.5 Flash is highly cost-efficient, extremely fast, and has excellent function calling support.
export const LLM_MODEL = "google/gemini-2.5-flash"; 
