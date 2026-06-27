import { GoalTemplate } from '../types';

export const GOAL_TEMPLATES: GoalTemplate[] = [
  {
    title: 'Emergency Fund',
    description: 'Build a financial safety net for unexpected expenses',
    icon: 'shield-check',
    color: 'bg-blue-500',
    defaultTargetAmount: 10000,
    defaultTargetDateMonths: 12,
  },
  {
    title: 'New Laptop',
    description: 'Save up for that new tech upgrade',
    icon: 'laptop',
    color: 'bg-purple-500',
    defaultTargetAmount: 1500,
    defaultTargetDateMonths: 6,
  },
  {
    title: 'Vacation',
    description: 'Plan your dream getaway',
    icon: 'plane',
    color: 'bg-green-500',
    defaultTargetAmount: 3000,
    defaultTargetDateMonths: 12,
  },
  {
    title: 'Vehicle',
    description: 'Save for a new car or bike',
    icon: 'car',
    color: 'bg-red-500',
    defaultTargetAmount: 20000,
    defaultTargetDateMonths: 24,
  },
  {
    title: 'Education',
    description: 'Invest in yourself and your future',
    icon: 'graduation-cap',
    color: 'bg-yellow-500',
    defaultTargetAmount: 5000,
    defaultTargetDateMonths: 18,
  },
  {
    title: 'Home',
    description: 'Save for a down payment or home improvements',
    icon: 'home',
    color: 'bg-orange-500',
    defaultTargetAmount: 50000,
    defaultTargetDateMonths: 36,
  },
  {
    title: 'Custom Goal',
    description: 'Create your own personal goal',
    icon: 'target',
    color: 'bg-gray-500',
  },
];
