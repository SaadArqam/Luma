import type { RelevanceSignal, RelevanceScoringConfig, ContextEntity } from '../types';

export class RelevanceScorer {
  private static instance: RelevanceScorer;
  private config: RelevanceScoringConfig;

  private constructor() {
    this.config = {
      weights: {
        recently_updated: 0.8,
        upcoming_deadline: 0.9,
        active_goal: 0.85,
        frequent_interaction: 0.6,
        incomplete_task: 0.7,
        recent_capture: 0.75,
      },
      decayRates: {
        recently_updated: 0.1, // per day
        frequent_interaction: 0.05,
        recent_capture: 0.15,
      },
      thresholds: {
        high: 0.7,
        medium: 0.4,
        low: 0.2,
      },
    };
  }

  public static getInstance(): RelevanceScorer {
    if (!RelevanceScorer.instance) {
      RelevanceScorer.instance = new RelevanceScorer();
    }
    return RelevanceScorer.instance;
  }

  public calculateRelevanceScore(signals: RelevanceSignal[]): number {
    if (signals.length === 0) return 0;

    let totalScore = 0;
    const now = new Date();

    for (const signal of signals) {
      let signalScore = signal.score;

      // Apply time-based decay for temporal signals
      if (signal.timestamp && this.config.decayRates[signal.type]) {
        const daysSince = (now.getTime() - signal.timestamp.getTime()) / (1000 * 60 * 60 * 24);
        const decayRate = this.config.decayRates[signal.type];
        signalScore = signalScore * Math.max(0, 1 - (daysSince * decayRate));
      }

      // Apply weight
      const weight = this.config.weights[signal.type] || 0.5;
      totalScore += signalScore * weight;
    }

    // Normalize to 0-1 range
    return Math.min(1, totalScore / signals.length);
  }

  public rankEntities(entities: ContextEntity[]): ContextEntity[] {
    return entities
      .map(entity => ({
        ...entity,
        relevanceScore: this.calculateRelevanceScore(entity.signals),
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  public filterByRelevance(entities: ContextEntity[], threshold: number): ContextEntity[] {
    return entities.filter(entity => entity.relevanceScore >= threshold);
  }

  public getRelevanceLevel(score: number): 'high' | 'medium' | 'low' {
    if (score >= this.config.thresholds.high) return 'high';
    if (score >= this.config.thresholds.medium) return 'medium';
    return 'low';
  }

  public updateConfig(config: Partial<RelevanceScoringConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      weights: { ...this.config.weights, ...config.weights },
      decayRates: { ...this.config.decayRates, ...config.decayRates },
      thresholds: { ...this.config.thresholds, ...config.thresholds },
    };
  }
}

export const relevanceScorer = RelevanceScorer.getInstance();
