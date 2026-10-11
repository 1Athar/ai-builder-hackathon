export function getOpenRouterApiKey(): string {
  if (typeof window !== 'undefined') {
    const runtimeKey = (window as any).__RUNTIME_CONFIG__?.VITE_OPENROUTER_API_KEY;
    if (runtimeKey && runtimeKey !== '${VITE_OPENROUTER_API_KEY}' && runtimeKey.trim() !== '') {
      return runtimeKey.trim();
    }

    const storageKey = localStorage.getItem('VITE_OPENROUTER_API_KEY');
    if (storageKey && storageKey.trim() !== '') {
      return storageKey.trim();
    }
  }

  const envKey = (import.meta as any).env?.VITE_OPENROUTER_API_KEY;
  if (envKey && envKey.trim() !== '') {
    return envKey.trim();
  }

  return '';
}

export const OPENROUTER_API_KEY = getOpenRouterApiKey();

// Google's Gemini 2.5 Flash is highly cost-efficient, extremely fast, and has excellent function calling support.
export const LLM_MODEL = "google/gemini-2.5-flash"; 
