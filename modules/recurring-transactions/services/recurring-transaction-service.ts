import { createClient } from '@/lib/supabase-server';
import { RecurringTransaction, FrequencyType } from '../types';
import { addDays, addWeeks, addMonths, addYears, isBefore, isEqual, startOfToday } from 'date-fns';
import { lifeGraphService } from '@/modules/life-graph';
import { emitEvent } from '@/modules/rules';

export class RecurringTransactionService {
  private static instance: RecurringTransactionService;

  public static getInstance(): RecurringTransactionService {
    if (!RecurringTransactionService.instance) {
      RecurringTransactionService.instance = new RecurringTransactionService();
    }
    return RecurringTransactionService.instance;
  }

  public calculateNextDueDate(
    currentDueDate: string,
    frequency: FrequencyType,
    customDays?: number | null
  ): string {
    const date = new Date(currentDueDate);
    let nextDate: Date;

    switch (frequency) {
      case 'daily':
        nextDate = addDays(date, 1);
        break;
      case 'weekly':
        nextDate = addWeeks(date, 1);
        break;
      case 'monthly':
        nextDate = addMonths(date, 1);
        break;
      case 'yearly':
        nextDate = addYears(date, 1);
        break;
      case 'custom':
        if (!customDays) {
          throw new Error('customDays is required for custom frequency');
        }
        nextDate = addDays(date, customDays);
        break;
    }

    return nextDate.toISOString().split('T')[0];
  }

  public async generateTransactionsForUser(userId: string): Promise<void> {
    const supabase = await createClient();

    const { data: recurringTxs, error: fetchError } = await supabase
      .from('recurring_transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (fetchError) throw fetchError;

    for (const tx of recurringTxs) {
      await this.generateTransactionForRecurring(tx as RecurringTransaction);
    }
  }

  public async generateTransactionForRecurring(
    recurringTx: RecurringTransaction): Promise<void> {
    const today = startOfToday().toISOString().split('T')[0];

    if (recurringTx.end_date && isBefore(new Date(recurringTx.end_date), new Date(today))) {
      return;
    }

    if (isBefore(new Date(recurringTx.next_due_date), new Date(today)) || isEqual(new Date(recurringTx.next_due_date), new Date(today))) {
      await this.createTransaction(recurringTx);
      await this.updateNextDueDate(recurringTx);
    }
  }

  private async createTransaction(recurringTx: RecurringTransaction): Promise<void> {
    const supabase = await createClient();

    const tableName = recurringTx.type === 'expense' ? 'expenses' : 'balance_entries';
    
    // Create transaction
    const { data: transaction, error: createError } = await supabase
      .from(tableName)
      .insert({
        user_id: recurringTx.user_id,
        amount: recurringTx.amount,
        category_id: recurringTx.category_id,
        account_id: recurringTx.account_id,
        date: recurringTx.next_due_date,
        note: recurringTx.notes || recurringTx.name,
        recurring_transaction_id: recurringTx.id,
        type: recurringTx.type === 'expense' ? undefined : 'credit',
      })
      .select()
      .single();

    if (createError) throw createError;

    // Get category
    const { data: category } = await supabase
      .from('categories')
      .select('*')
      .eq('id', recurringTx.category_id)
      .eq('user_id', recurringTx.user_id)
      .single();

    // Create timeline event
    const { data: timelineEvent } = await supabase
      .from('timeline_events')
      .insert({
        user_id: recurringTx.user_id,
        timestamp: recurringTx.next_due_date,
        type: recurringTx.type === 'expense' ? 'expense' : 'income',
        title: recurringTx.name,
        description: `₹${recurringTx.amount.toLocaleString('en-IN')}`,
        source_module: 'finance',
        icon: category?.icon || (recurringTx.type === 'expense' ? 'credit-card' : 'wallet'),
        color: category?.color || 'bg-blue-500',
        metadata: { 
          [recurringTx.type === 'expense' ? 'expenseId' : 'balanceEntryId']: transaction.id,
          amount: recurringTx.amount,
        },
      })
      .select()
      .single();

    if (timelineEvent) {
      // Create life graph nodes and edges
      const node = await lifeGraphService.createNode(
        recurringTx.user_id,
        'transaction',
        transaction.id,
        { amount: recurringTx.amount, note: recurringTx.name, categoryId: recurringTx.category_id }
      );
      const timelineNode = await lifeGraphService.createNode(
        recurringTx.user_id,
        'timeline_event',
        timelineEvent.id,
        { type: timelineEvent.type, title: timelineEvent.title }
      );
      await lifeGraphService.createEdge(recurringTx.user_id, node.id, timelineNode.id, 'generated_by');
    }

    // Emit event for rules engine
    emitEvent(
      recurringTx.type === 'expense' ? 'transaction.created' : 'balance.entry.created',
      recurringTx.user_id,
      {
        id: transaction.id,
        amount: recurringTx.amount,
        note: recurringTx.name,
        date: recurringTx.next_due_date,
        categoryId: recurringTx.category_id,
        accountId: recurringTx.account_id,
        category
      }
    );
  }

  private async updateNextDueDate(recurringTx: RecurringTransaction): Promise<void> {
    const supabase = await createClient();
    const newNextDueDate = this.calculateNextDueDate(
      recurringTx.next_due_date, recurringTx.frequency, recurringTx.custom_days
    );
    const { error: updateError } = await supabase
      .from('recurring_transactions')
      .update({ next_due_date: newNextDueDate })
      .eq('id', recurringTx.id);

    if (updateError) throw updateError;
  }
}

export const recurringTransactionService = RecurringTransactionService.getInstance();
