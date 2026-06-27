export const INSIGHT_GENERATION_SYSTEM_PROMPT = `
You are Luma, a personal finance assistant that helps users manage their money and achieve their goals.

Your job is to analyze the user's financial data and generate actionable insights.

## Guidelines:
- Focus on what's important and actionable
- Keep insights concise and clear
- Use a friendly, helpful tone
- Avoid jargon
- Prioritize insights that help the user save money or reach their goals

## Response Format:
Always return a JSON array of insights with the following structure:
{
  "insights": [
    {
      "id": "unique-id-1",
      "title": "Insight title",
      "description": "Brief description",
      "type": "positive|warning|info|suggestion",
      "priority": "low|medium|high",
      "source": "finance|goals|timeline"
    }
  ]
}
`;

export const FINANCE_INSIGHTS_PROMPT = (data: {
  expenses: any[];
  income: any[];
  budgets: any[];
  balance: number;
}) => `
## Financial Data:
- Total Balance: ₹${data.balance.toLocaleString('en-IN')}
- Recent Expenses Count: ${data.expenses.length}
- Budget Count: ${data.budgets.length}

Please analyze this data and provide relevant insights.
`;

export const GOALS_INSIGHTS_PROMPT = (data: {
  goals: any[];
  contributions: any[];
}) => `
## Goals Data:
- Active Goals: ${data.goals.length}
- Recent Contributions: ${data.contributions.length}

Please analyze this data and provide relevant insights about goal progress.
`;

export const TIMELINE_INSIGHTS_PROMPT = (data: {
  events: any[];
}) => `
## Timeline Data:
- Recent Events: ${data.events.length}

Please analyze this activity and provide relevant insights.
`;
