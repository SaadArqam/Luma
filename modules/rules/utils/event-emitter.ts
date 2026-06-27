import { v4 as uuidv4 } from 'uuid'
import { eventBus } from '../services/event-bus'
import { Event, EventType } from '../types'

export function emitEvent<T = any>(
  eventType: EventType,
  userId: string,
  payload: T
): Event<T> {
  const event: Event<T> = {
    id: uuidv4(),
    type: eventType,
    timestamp: new Date(),
    userId,
    payload
  }

  eventBus.emit(event)
  return event
}
