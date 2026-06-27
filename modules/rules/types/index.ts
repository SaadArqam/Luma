export type EventType = 
  | 'transaction.created'
  | 'transaction.updated'
  | 'transaction.deleted'
  | 'goal.contribution'
  | 'goal.created'
  | 'goal.updated'
  | 'goal.deleted'
  | 'account.created'
  | 'account.updated'
  | 'account.deleted'

export interface Event<T = any> {
  id: string
  type: EventType
  timestamp: Date
  userId: string
  payload: T
}

export type TriggerType = EventType | 'scheduled' | 'recurring'

export interface Trigger {
  type: TriggerType
  config?: Record<string, any>
}

export type ConditionOperator = 
  | 'equals'
  | 'notEquals'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'contains'
  | 'notContains'
  | 'in'
  | 'notIn'
  | 'startsWith'
  | 'endsWith'

export interface Condition {
  field: string
  operator: ConditionOperator
  value: any
}

export type ActionType = 
  | 'timeline.create'
  | 'insights.refresh'
  | 'notification.send'
  | 'automation.run'

export interface Action {
  type: ActionType
  config: Record<string, any>
}

export interface Rule {
  id: string
  userId: string
  name: string
  trigger: Trigger
  conditions: Condition[]
  actions: Action[]
  enabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface RuleExecutionLog {
  id: string
  ruleId: string
  userId: string
  eventId: string
  success: boolean
  error?: string
  executedAt: Date
}
