import type { TimelineItem, TimelineItemType } from '../types';
import { CreditCard, Mic, BookOpen, Target, CheckCircle, Calendar, Heart, Sparkles, Bell, Flag, Trophy } from 'lucide-react';

// Icon mapping for timeline item types
const iconMap: Record<TimelineItemType, React.ComponentType<any>> = {
  'transaction': CreditCard,
  'capture': Mic,
  'journal-entry': BookOpen,
  'goal-progress': Target,
  'habit-completion': CheckCircle,
  'planner-event': Calendar,
  'health-record': Heart,
  'ai-insight': Sparkles,
  'reminder': Bell,
  'milestone': Flag,
  'achievement': Trophy,
};

// Color mapping for timeline item types
const colorMap: Record<TimelineItemType, string> = {
  'transaction': 'bg-blue-500',
  'capture': 'bg-purple-500',
  'journal-entry': 'bg-amber-500',
  'goal-progress': 'bg-green-500',
  'habit-completion': 'bg-emerald-500',
  'planner-event': 'bg-indigo-500',
  'health-record': 'bg-rose-500',
  'ai-insight': 'bg-violet-500',
  'reminder': 'bg-orange-500',
  'milestone': 'bg-cyan-500',
  'achievement': 'bg-yellow-500',
};

// Timeline Item Registry
export class TimelineItemRegistry {
  private static instance: TimelineItemRegistry;
  private customRenderers: Map<TimelineItemType, (item: TimelineItem) => React.ReactNode> = new Map();

  private constructor() {}

  static getInstance(): TimelineItemRegistry {
    if (!TimelineItemRegistry.instance) {
      TimelineItemRegistry.instance = new TimelineItemRegistry();
    }
    return TimelineItemRegistry.instance;
  }

  // Get icon for item type
  getIcon(type: TimelineItemType): React.ComponentType<any> {
    return iconMap[type] || CreditCard;
  }

  // Get color for item type
  getColor(type: TimelineItemType): string {
    return colorMap[type] || 'bg-gray-500';
  }

  // Register custom renderer for item type
  registerRenderer(type: TimelineItemType, renderer: (item: TimelineItem) => React.ReactNode): void {
    this.customRenderers.set(type, renderer);
  }

  // Get custom renderer for item type
  getRenderer(type: TimelineItemType): ((item: TimelineItem) => React.ReactNode) | undefined {
    return this.customRenderers.get(type);
  }

  // Check if custom renderer exists
  hasCustomRenderer(type: TimelineItemType): boolean {
    return this.customRenderers.has(type);
  }

  // Unregister custom renderer
  unregisterRenderer(type: TimelineItemType): void {
    this.customRenderers.delete(type);
  }

  // Get all registered item types
  getRegisteredTypes(): TimelineItemType[] {
    return Array.from(this.customRenderers.keys());
  }

  // Clear all custom renderers
  clearRenderers(): void {
    this.customRenderers.clear();
  }
}

// Export singleton instance
export const timelineItemRegistry = TimelineItemRegistry.getInstance();

// Helper function to get icon
export function getTimelineIcon(type: TimelineItemType): React.ComponentType<any> {
  return timelineItemRegistry.getIcon(type);
}

// Helper function to get color
export function getTimelineColor(type: TimelineItemType): string {
  return timelineItemRegistry.getColor(type);
}
