import { TimelineEvent, TimelineGroup } from '../types';
import { startOfDay, startOfWeek, startOfMonth, isToday, isYesterday, differenceInDays } from 'date-fns';

export function groupTimelineEvents(events: TimelineEvent[]): TimelineGroup[] {
  const now = new Date();
  const today = startOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);

  const groups: TimelineGroup[] = [
    { label: 'Today', events: [] },
    { label: 'Yesterday', events: [] },
    { label: 'Earlier This Week', events: [] },
    { label: 'Earlier This Month', events: [] }
  ];

  events.forEach(event => {
    const eventDate = startOfDay(event.timestamp);

    if (isToday(eventDate)) {
      groups[0].events.push(event);
    } else if (isYesterday(eventDate)) {
      groups[1].events.push(event);
    } else if (eventDate >= weekStart) {
      groups[2].events.push(event);
    } else if (eventDate >= monthStart) {
      groups[3].events.push(event);
    }
  });

  // Sort each group's events in descending order (newest first)
  groups.forEach(group => {
    group.events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  });

  // Filter out empty groups
  return groups.filter(group => group.events.length > 0);
}
