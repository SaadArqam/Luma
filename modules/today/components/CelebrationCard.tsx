import { Celebration } from '../types';
import { Trophy, TrendingUp, Star, PiggyBank, Flame, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CelebrationCardProps {
  celebration: Celebration;
}

const iconMap = {
  'trophy': Trophy,
  'trending-up': TrendingUp,
  'star': Star,
  'piggy-bank': PiggyBank,
  'flame': Flame,
};

export function CelebrationCard({ celebration }: CelebrationCardProps) {
  const Icon = iconMap[celebration.icon as keyof typeof iconMap] || Sparkles;

  return (
    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 mb-3">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-green-500/20 rounded-lg">
          <Icon className="w-5 h-5 text-green-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-text mb-1">{celebration.title}</h3>
          <p className="text-sm text-muted-foreground">{celebration.message}</p>
        </div>
      </div>
    </div>
  );
}
