'use client';

import { useState, useEffect } from 'react';
import { BriefSection, DailyBrief } from '../types';
import { WidgetContainer } from '@/components/ui/widget-container';
import { Button } from '@/components/ui/button';
import { RefreshCw, Sparkles } from 'lucide-react';

interface BriefSectionProps {
  section: BriefSection;
}

function BriefSectionComponent({ section }: BriefSectionProps) {
  return (
    <div className="mb-4 last:mb-0">
      {section.title && (
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">
          {section.title}
        </h3>
      )}
      <p className="text-text leading-relaxed">{section.content}</p>
    </div>
  );
}

interface DailyBriefCardProps {
  className?: string;
}

export function DailyBriefCard({ className }: DailyBriefCardProps) {
  const [brief, setBrief] = useState<DailyBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBrief = async (forceRefresh = false) => {
    try {
      const url = forceRefresh ? '/api/daily-brief?refresh=true' : '/api/daily-brief';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch brief');
      const data = await response.json();
      setBrief(data);
    } catch (error) {
      console.error('Error fetching daily brief:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBrief();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBrief(true);
  };

  if (loading) {
    return (
      <WidgetContainer title="Daily Brief" className={className}>
        <div className="space-y-3">
          <div className="h-6 w-3/4 bg-card border border-border rounded animate-pulse" />
          <div className="h-4 w-full bg-card border border-border rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-card border border-border rounded animate-pulse" />
        </div>
      </WidgetContainer>
    );
  }

  return (
    <WidgetContainer
      title="Daily Brief"
      icon={<Sparkles className="w-5 h-5 text-accent" />}
      action={
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
          />
        </Button>
      }
      className={className}
    >
      {brief?.isCached && (
        <p className="text-xs text-muted-foreground mb-4">
          Updated {new Date(brief.generatedAt).toLocaleTimeString()}
        </p>
      )}
      <div className="space-y-4">
        {brief?.sections.map((section, index) => (
          <BriefSectionComponent key={index} section={section} />
        ))}
      </div>
    </WidgetContainer>
  );
}
