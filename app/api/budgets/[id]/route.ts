import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, amount, period, custom_start_date, custom_end_date, custom_days, rollover, category_ids } = await request.json();

    const { data: budget, error: budgetError } = await supabase
      .from('budgets')
      .update({
        name,
        amount,
        period,
        custom_start_date,
        custom_end_date,
        custom_days,
        rollover,
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (budgetError) throw budgetError;

    if (category_ids !== undefined) {
      // First delete existing associations
      await supabase
        .from('budget_categories')
        .delete()
        .eq('budget_id', params.id);

      // Then add new ones
      if (category_ids.length > 0) {
        const { error: joinError } = await supabase
          .from('budget_categories')
          .insert(
            category_ids.map((categoryId: string) => ({
              budget_id: params.id,
              category_id: categoryId,
            }))
          );

        if (joinError) throw joinError;
      }
    }

    return NextResponse.json(budget);
  } catch (error: any) {
    console.error('Error updating budget:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { error } = await supabase
      .from('budgets')
      .update({ archived: true })
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error archiving budget:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
