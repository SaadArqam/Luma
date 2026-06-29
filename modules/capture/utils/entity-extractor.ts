import type { ExtractedEntity, CaptureSource } from '../types';

export async function extractEntities(
  normalizedContent: string,
  source: CaptureSource
): Promise<ExtractedEntity[]> {
  const entities: ExtractedEntity[] = [];

  // Extract transactions (amount-based)
  const transactionEntities = extractTransactions(normalizedContent);
  entities.push(...transactionEntities);

  // Extract goals (target-based)
  const goalEntities = extractGoals(normalizedContent);
  entities.push(...goalEntities);

  // Extract tasks (action-based)
  const taskEntities = extractTasks(normalizedContent);
  entities.push(...taskEntities);

  return entities;
}

function extractTransactions(text: string): ExtractedEntity[] {
  const entities: ExtractedEntity[] = [];
  
  // Pattern for amounts with currency
  const amountPattern = /(?:spent|paid|cost|bought|billed)\s+(?:₹|\$)?(\d+(?:\.\d{2})?)/gi;
  const matches = [...text.matchAll(amountPattern)];
  
  matches.forEach((match, index) => {
    const amount = parseFloat(match[1]);
    if (amount > 0) {
      entities.push({
        id: `entity-${Date.now()}-${index}`,
        type: 'transaction',
        confidence: 0.8,
        data: {
          amount,
          note: text.substring(Math.max(0, match.index - 20), match.index + match[0].length + 20),
        },
        suggestedDestination: 'finance',
      });
    }
  });

  return entities;
}

function extractGoals(text: string): ExtractedEntity[] {
  const entities: ExtractedEntity[] = [];
  
  // Pattern for goals (save X for Y)
  const goalPattern = /(?:save|goal|target|want)\s+(?:₹|\$)?(\d+(?:\.\d{2})?)\s+(?:for|to)\s+(.+)/gi;
  const matches = [...text.matchAll(goalPattern)];
  
  matches.forEach((match, index) => {
    const amount = parseFloat(match[1]);
    const title = match[2].trim();
    
    if (amount > 0 && title) {
      entities.push({
        id: `entity-${Date.now()}-${index}`,
        type: 'goal',
        confidence: 0.7,
        data: {
          targetAmount: amount,
          title,
        },
        suggestedDestination: 'goals',
      });
    }
  });

  return entities;
}

function extractTasks(text: string): ExtractedEntity[] {
  const entities: ExtractedEntity[] = [];
  
  // Pattern for tasks (action verbs)
  const taskPattern = /(?:need to|have to|must|should)\s+(.+)/gi;
  const matches = [...text.matchAll(taskPattern)];
  
  matches.forEach((match, index) => {
    const task = match[1].trim();
    
    if (task.length > 5) {
      entities.push({
        id: `entity-${Date.now()}-${index}`,
        type: 'task',
        confidence: 0.6,
        data: {
          title: task,
        },
        suggestedDestination: 'tasks',
      });
    }
  });

  return entities;
}
