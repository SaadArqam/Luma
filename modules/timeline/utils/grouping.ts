import { TimelineItem, TimelineGroup, TimelineGroupLabel } from '../types';
import { 
  startOfDay, 
  startOfWeek, 
  startOfMonth, 
  isToday, 
  isYesterday, 
  differenceInDays,
  format,
  subWeeks,
  isSameMonth,
  isBefore 
} from 'date-fns';

const MONTH_NAMES: TimelineGroupLabel[] = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function groupTimelineItems(items: TimelineItem[]): TimelineGroup[] {
  const now = new Date();
  const today = startOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const lastWeekStart = subWeeks(weekStart, 1);
  const monthStart = startOfMonth(now);

  // Initialize groups
  const groups: Map<TimelineGroupLabel, TimelineItem[]> = new Map([
    ['Today', []],
    ['Yesterday', []],
    ['This Week', []],
    ['Last Week', []],
    ['Earlier', []],
  ]);

  // Add current month if not today/yesterday/this week
  const currentMonth = format(now, 'MMMM') as TimelineGroupLabel;
  if (!groups.has(currentMonth)) {
    groups.set(currentMonth, []);
  }

  items.forEach(item => {
    const eventDate = startOfDay(item.timestamp);

    if (isToday(eventDate)) {
      groups.get('Today')!.push(item);
    } else if (isYesterday(eventDate)) {
      groups.get('Yesterday')!.push(item);
    } else if (eventDate >= weekStart && !isToday(eventDate) && !isYesterday(eventDate)) {
      groups.get('This Week')!.push(item);
    } else if (eventDate >= lastWeekStart && eventDate < weekStart) {
      groups.get('Last Week')!.push(item);
    } else if (isSameMonth(eventDate, now)) {
      groups.get(currentMonth)!.push(item);
    } else {
      // Group by month for older items
      const monthName = format(eventDate, 'MMMM') as TimelineGroupLabel;
      if (!groups.has(monthName)) {
        groups.set(monthName, []);
      }
      groups.get(monthName)!.push(item);
    }
  });

  // Convert map to array and sort groups chronologically
  const sortedGroups: TimelineGroup[] = [];
  
  // Add groups in specific order
  const groupOrder: TimelineGroupLabel[] = [
    'Today',
    'Yesterday',
    'This Week',
    'Last Week',
  ];

  // Add ordered groups
  groupOrder.forEach(label => {
    const items = groups.get(label);
    if (items && items.length > 0) {
      sortedGroups.push({
        label,
        items: sortItemsDesc(items),
      });
    }
  });

  // Add month groups (current month first, then previous months)
  const currentMonthItems = groups.get(currentMonth);
  if (currentMonthItems && currentMonthItems.length > 0) {
    sortedGroups.push({
      label: currentMonth,
      items: sortItemsDesc(currentMonthItems),
    });
  }

  // Add other month groups in reverse chronological order
  MONTH_NAMES.reverse().forEach(monthName => {
    if (monthName !== currentMonth) {
      const items = groups.get(monthName);
      if (items && items.length > 0) {
        sortedGroups.push({
          label: monthName,
          items: sortItemsDesc(items),
        });
      }
    }
  });

  // Add "Earlier" group if any items remain
  const earlierItems = groups.get('Earlier');
  if (earlierItems && earlierItems.length > 0) {
    sortedGroups.push({
      label: 'Earlier',
      items: sortItemsDesc(earlierItems),
    });
  }

  return sortedGroups;
}

function sortItemsDesc(items: TimelineItem[]): TimelineItem[] {
  return items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function getGroupDateRange(label: TimelineGroupLabel): { start: Date; end: Date } | undefined {
  const now = new Date();
  const today = startOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);

  switch (label) {
    case 'Today':
      return { start: today, end: now };
    case 'Yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return { start: yesterday, end: today };
    case 'This Week':
      return { start: weekStart, end: now };
    case 'Last Week':
      const lastWeekStart = subWeeks(weekStart, 1);
      return { start: lastWeekStart, end: weekStart };
    default:
      // For months, return the start and end of that month
      const monthIndex = MONTH_NAMES.indexOf(label);
      if (monthIndex !== -1) {
        const year = now.getFullYear();
        const monthStart = new Date(year, monthIndex, 1);
        const monthEnd = new Date(year, monthIndex + 1, 0);
        return { start: monthStart, end: monthEnd };
      }
      return undefined;
  }
}
