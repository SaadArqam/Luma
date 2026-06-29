import { TimeOfDay } from '../types';

export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export function getGreeting(timeOfDay: TimeOfDay): string {
  const greetings: Record<TimeOfDay, string> = {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening'
  };
  return greetings[timeOfDay];
}

export function getDateMessage(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  };
  return now.toLocaleDateString('en-US', options);
}

export function getPriorityMessage(timeOfDay: TimeOfDay): string {
  const messages: Record<TimeOfDay, string> = {
    morning: "Let's start your day right. Here's what you need to know.",
    afternoon: "Midday check-in. Here's your financial snapshot.",
    evening: "End of day review. See how you did today."
  };
  return messages[timeOfDay];
}

export function getEmptyStateMessage(timeOfDay: TimeOfDay): string {
  const messages: Record<TimeOfDay, string> = {
    morning: "Start your day by adding your first expense or setting up a budget.",
    afternoon: "It's never too late to start tracking. Add your first transaction today.",
    evening: "Begin your financial journey by setting up your first goal."
  };
  return messages[timeOfDay];
}

export function getMessageGenerator() {
  return {
    getTimeOfDay,
    getGreeting,
    getDateMessage,
    getPriorityMessage,
    getEmptyStateMessage
  };
}
