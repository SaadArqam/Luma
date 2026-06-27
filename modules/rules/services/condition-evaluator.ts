import { Condition, Event } from '../types'

class ConditionEvaluator {
  evaluate(condition: Condition, event: Event): boolean {
    const value = this.getValueFromPath(condition.field, event.payload)
    return this.evaluateOperator(condition.operator, value, condition.value)
  }

  evaluateAll(conditions: Condition[], event: Event): boolean {
    if (conditions.length === 0) return true
    return conditions.every(condition => this.evaluate(condition, event))
  }

  private getValueFromPath(path: string, obj: any): any {
    return path.split('.').reduce((current, key) => {
      if (current === null || current === undefined) return undefined
      return current[key]
    }, obj)
  }

  private evaluateOperator(operator: Condition['operator'], value: any, target: any): boolean {
    switch (operator) {
      case 'equals':
        return value === target
      case 'notEquals':
        return value !== target
      case 'greaterThan':
        return value > target
      case 'lessThan':
        return value < target
      case 'greaterThanOrEqual':
        return value >= target
      case 'lessThanOrEqual':
        return value <= target
      case 'contains':
        return String(value).includes(String(target))
      case 'notContains':
        return !String(value).includes(String(target))
      case 'in':
        return Array.isArray(target) && target.includes(value)
      case 'notIn':
        return Array.isArray(target) && !target.includes(value)
      case 'startsWith':
        return String(value).startsWith(String(target))
      case 'endsWith':
        return String(value).endsWith(String(target))
      default:
        return false
    }
  }
}

export const conditionEvaluator = new ConditionEvaluator()
