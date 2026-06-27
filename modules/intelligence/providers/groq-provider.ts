import Groq from 'groq-sdk';
import type {
  LLMProvider,
  ProviderMessage,
  ProviderChatOptions,
  ProviderChatResponse,
} from '../types';

export class GroqProvider implements LLMProvider {
  private client: Groq;
  private defaultModel: string;

  constructor(apiKey?: string, defaultModel: string = 'llama-3.1-8b-instant') {
    this.client = new Groq({
      apiKey: apiKey || process.env.GROQ_API_KEY,
      dangerouslyAllowBrowser: true,
    });
    this.defaultModel = defaultModel;
  }

  async chat(
    messages: ProviderMessage[],
    options?: ProviderChatOptions
  ): Promise<ProviderChatResponse> {
    const response = await this.client.chat.completions.create({
      model: options?.model || this.defaultModel,
      messages: messages as any,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1024,
      top_p: options?.topP ?? 1,
      stop: options?.stop,
    });

    return {
      id: response.id,
      content: response.choices[0]?.message?.content || '',
      model: response.model,
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      },
    };
  }
}
