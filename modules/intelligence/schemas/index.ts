import { z } from 'zod';

export const InsightSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['positive', 'warning', 'info', 'suggestion']),
  priority: z.enum(['low', 'medium', 'high']),
  source: z.enum(['finance', 'goals', 'timeline']),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.coerce.date(),
});

export const GenerateInsightsResponseSchema = z.object({
  insights: z.array(InsightSchema),
});

export type Insight = z.infer<typeof InsightSchema>;
export type GenerateInsightsResponse = z.infer<typeof GenerateInsightsResponseSchema>;
