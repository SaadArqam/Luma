import type { z } from 'zod';

// Provider types
export interface ProviderMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ProviderChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stop?: string[];
}

export interface ProviderChatResponse {
  id: string;
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface LLMProvider {
  chat(
    messages: ProviderMessage[],
    options?: ProviderChatOptions
  ): Promise<ProviderChatResponse>;
}

// Insight types
export interface Insight {
  id: string;
  title: string;
  summary: string;
  type: 'positive' | 'warning' | 'info' | 'suggestion';
  priority: 'low' | 'medium' | 'high';
  category: 'spending' | 'budgets' | 'goals' | 'savings' | 'recurring';
  source: 'finance' | 'goals' | 'timeline';
  confidence: 'low' | 'medium' | 'high';
  suggestedActions?: string[];
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface GenerateInsightsResponse {
  insights: Insight[];
}
