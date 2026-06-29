import type { CaptureSource } from '../types';

export async function normalizeInput(content: string, source: CaptureSource): Promise<string> {
  switch (source) {
    case 'text':
      return normalizeText(content);
    case 'voice':
      // Voice transcription would happen here
      // For now, assume content is already transcribed
      return normalizeText(content);
    default:
      return normalizeText(content);
  }
}

function normalizeText(text: string): string {
  let normalized = text.trim();
  
  // Remove extra whitespace
  normalized = normalized.replace(/\s+/g, ' ');
  
  // Fix common transcription errors
  normalized = normalized.replace(/\bdollars?\b/gi, '$');
  normalized = normalized.replace(/\brupees?\b/gi, '₹');
  
  // Normalize numbers with currency symbols
  normalized = normalized.replace(/(\d+)\s*([₹$])/g, '$2$1');
  
  return normalized;
}
