import { TimeOfDay } from '../types';
import { getGreeting, getDateMessage, getPriorityMessage } from '../utils';
import { Sparkles } from 'lucide-react';

interface GreetingBannerProps {
  timeOfDay: TimeOfDay;
}

export function GreetingBanner({ timeOfDay }: GreetingBannerProps) {
  const greeting = getGreeting(timeOfDay);
  const dateMessage = getDateMessage();
  const priorityMessage = getPriorityMessage(timeOfDay);

  return (
    <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-2xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-accent/20 rounded-xl">
          <Sparkles className="w-6 h-6 text-accent" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-text mb-1">
            {greeting}!
          </h1>
          <p className="text-sm text-muted-foreground mb-2">{dateMessage}</p>
          <p className="text-text">{priorityMessage}</p>
        </div>
      </div>
    </div>
  );
}
