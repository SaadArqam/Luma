import { Event, EventType } from '../types'

type EventHandler<T = any> = (event: Event<T>) => Promise<void> | void

class EventBus {
  private handlers: Map<EventType, Set<EventHandler>> = new Map()
  private allHandlers: Set<EventHandler> = new Set()

  on<T = any>(eventType: EventType, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set())
    }
    this.handlers.get(eventType)!.add(handler)
    return () => this.off(eventType, handler)
  }

  onAll<T = any>(handler: EventHandler<T>): () => void {
    this.allHandlers.add(handler)
    return () => this.allHandlers.delete(handler)
  }

  off<T = any>(eventType: EventType, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(eventType)
    if (handlers) {
      handlers.delete(handler)
      if (handlers.size === 0) {
        this.handlers.delete(eventType)
      }
    }
  }

  async emit<T = any>(event: Event<T>): Promise<void> {
    const promises: Promise<void>[] = []

    const typeHandlers = this.handlers.get(event.type)
    if (typeHandlers) {
      for (const handler of typeHandlers) {
        const result = handler(event)
        if (result instanceof Promise) {
          promises.push(result)
        }
      }
    }

    for (const handler of this.allHandlers) {
      const result = handler(event)
      if (result instanceof Promise) {
        promises.push(result)
      }
    }

    await Promise.allSettled(promises)
  }
}

export const eventBus = new EventBus()
