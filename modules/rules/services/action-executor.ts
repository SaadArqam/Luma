import { createClient } from '@/lib/supabase-server'
import { Action, Event } from '../types'

type ActionHandler = (action: Action, event: Event) => Promise<void>

class ActionExecutor {
  private handlers: Map<string, ActionHandler> = new Map()

  constructor() {
    this.registerDefaultHandlers()
  }

  registerHandler(actionType: string, handler: ActionHandler): void {
    this.handlers.set(actionType, handler)
  }

  async execute(action: Action, event: Event): Promise<void> {
    const handler = this.handlers.get(action.type)
    if (!handler) {
      console.warn(`No handler registered for action type: ${action.type}`)
      return
    }
    await handler(action, event)
  }

  async executeAll(actions: Action[], event: Event): Promise<void> {
    for (const action of actions) {
      try {
        await this.execute(action, event)
      } catch (error) {
        console.error(`Failed to execute action ${action.type}:`, error)
      }
    }
  }

  private registerDefaultHandlers(): void {
    this.registerHandler('timeline.create', this.handleCreateTimelineEvent.bind(this))
    this.registerHandler('insights.refresh', this.handleRefreshInsights.bind(this))
  }

  private async handleCreateTimelineEvent(action: Action, event: Event): Promise<void> {
    const supabase = await createClient()
    
    const timelineEvent: any = {
      user_id: event.userId,
      timestamp: new Date().toISOString(),
      type: action.config.type || 'automation',
      source_module: action.config.sourceModule || 'rules',
      title: action.config.title || 'Automated Event',
      description: action.config.description,
      metadata: {
        ...action.config.metadata,
        eventId: event.id,
        eventType: event.type,
        eventPayload: event.payload
      }
    }

    await supabase.from('timeline_events').insert(timelineEvent)
  }

  private async handleRefreshInsights(action: Action, event: Event): Promise<void> {
    console.log('Refreshing insights for user:', event.userId)
  }
}

export const actionExecutor = new ActionExecutor()
