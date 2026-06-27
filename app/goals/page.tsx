'use client';

import { useEffect, useState } from 'react';
import { PageHeader, PageTitle, PageDescription } from '@/components/ui/page-header';
import { GoalCard, AddGoalForm, EmptyGoalsState } from '@/modules/goals/components';
import { Goal } from '@/modules/goals/types';
import { createClient } from '@/lib/supabase';

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals');
      if (!response.ok) throw new Error('Failed to fetch goals');
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader>
          <PageTitle>Goals</PageTitle>
          <PageDescription>Track your financial goals and watch your progress grow</PageDescription>
        </PageHeader>
        <AddGoalForm onGoalAdded={fetchGoals} />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 bg-card border border-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <EmptyGoalsState onGoalAdded={fetchGoals} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
}
