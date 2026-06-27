import { createClient } from '@/lib/supabase-server'
import { Rule, Event } from '../types'
import { eventBus } from './event-bus'
import { conditionEvaluator } from './condition-evaluator'
import { actionExecutor } from './action-executor'
import { v4 as uuidv4 } from 'uuid'

class RulesEngine {
  constructor() {
    this.initializeEventBus()
  }

  private initializeEventBus(): void {
    eventBus.onAll(async (event) => {
      await this.processEvent(event)
    })
  }

  async processEvent(event: Event): Promise<void> {
    try {
      const rules = await this.fetchApplicableRules(event)
      
      for (const rule of rules) {
        try {
          await this.executeRule(rule, event)
        } catch (error) {
          console.error(`Failed to execute rule ${rule.id}:`, error)
          await this.logRuleExecution(rule.id, event.id, false, error instanceof Error ? error.message : 'Unknown error')
        }
      }
    } catch (error) {
      console.error('Failed to process event:', error)
    }
  }

  private async fetchApplicableRules(event: Event): Promise<Rule[]> {
    const supabase = await createClient()
    
    const { data: rules } = await supabase
      .from('rules')
      .select('*')
      .eq('user_id', event.userId)
      .eq('enabled', true)
    
    if (!rules) return []

    return rules
      .map((dbRule: any) => this.transformDbRule(dbRule))
      .filter((rule) => this.ruleMatchesTrigger(rule, event))
  }

  private ruleMatchesTrigger(rule: Rule, event: Event): boolean {
    return rule.trigger.type === event.type
  }

  private async executeRule(rule: Rule, event: Event): Promise<void> {
    const conditionsMet = conditionEvaluator.evaluateAll(rule.conditions, event)
    
    if (conditionsMet) {
      await actionExecutor.executeAll(rule.actions, event)
      await this.logRuleExecution(rule.id, event.id, true)
    }
  }

  private async logRuleExecution(ruleId: string, eventId: string, success: boolean, error?: string): Promise<void> {
    const supabase = await createClient()

    await supabase.from('rule_execution_logs').insert({
      id: uuidv4(),
      rule_id: ruleId,
      user_id: event.userId,
      event_id: eventId,
      success,
      error,
      executed_at: new Date().toISOString()
    })
  }

  private transformDbRule(dbRule: any): Rule {
    return {
      id: dbRule.id,
      userId: dbRule.user_id,
      name: dbRule.name,
      trigger: dbRule.trigger,
      conditions: dbRule.conditions,
      actions: dbRule.actions,
      enabled: dbRule.enabled,
      createdAt: new Date(dbRule.created_at),
      updatedAt: new Date(dbRule.updated_at)
    }
  }

  async getRules(userId: string): Promise<Rule[]> {
    const supabase = await createClient()
    
    const { data: rules } = await supabase
      .from('rules')
      .select('*')
      .eq('user_id', userId)
    
    if (!rules) return []
    return rules.map((dbRule: any) => this.transformDbRule(dbRule))
  }

  async createRule(ruleData: Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>): Promise<Rule> {
    const supabase = await createClient()
    const id = uuidv4()
    const now = new Date().toISOString()

    const { data } = await supabase
      .from('rules')
      .insert({
        id,
        user_id: ruleData.userId,
        name: ruleData.name,
        trigger: ruleData.trigger,
        conditions: ruleData.conditions,
        actions: ruleData.actions,
        enabled: ruleData.enabled,
        created_at: now,
        updated_at: now
      })
      .select()
      .single()

    return this.transformDbRule(data)
  }

  async updateRule(id: string, updates: Partial<Omit<Rule, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Rule> {
    const supabase = await createClient()

    const { data } = await supabase
      .from('rules')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    return this.transformDbRule(data)
  }

  async deleteRule(id: string): Promise<void> {
    const supabase = await createClient()
    await supabase.from('rules').delete().eq('id', id)
  }
}

export const rulesEngine = new RulesEngine()
