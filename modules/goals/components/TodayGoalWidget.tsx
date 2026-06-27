'use client';

import { Goal } from '../types';
import { GoalWidget } from './GoalWidget';
import { useRouter } from 'next/navigation';

interface TodayGoalWidgetProps {
  goals: Goal[];
}

export function TodayGoalWidget({ goals }: TodayGoalWidgetProps) {
  const router = useRouter();

  return (
    <GoalWidget
      goals={goals}
      onRefresh={() => router.refresh()}
      onGoalClick={() => router.push('/goals')}
    />
  );
}
