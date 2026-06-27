import type { LLMProvider, ProviderMessage } from '../types';

export abstract class BaseAgent {
  public readonly name: string;
  public readonly description: string;
  protected provider: LLMProvider;

  constructor(name: string, description: string, provider: LLMProvider) {
    this.name = name;
    this.description = description;
    this.provider = provider;
  }

  protected async generateResponse(
    systemPrompt: string,
    userPrompt: string
  ): Promise<string> {
    const messages: ProviderMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const response = await this.provider.chat(messages);
    return response.content;
  }
}
