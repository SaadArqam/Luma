import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('budgets')
      .select(`
        *,
        budget_categories (
          *,
          category:categories (*)
        )
      `)
      .eq('user_id', user.id)
      .eq('archived', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, amount, period, custom_start_date, custom_end_date, custom_days, rollover, category_ids } = await request.json();

    const { data: budget, error: budgetError } = await supabase
      .from('budgets')
      .insert({
        user_id: user.id,
        name,
        amount,
        period,
        custom_start_date,
        custom_end_date,
        custom_days,
        rollover,
      })
      .select()
      .single();

    if (budgetError) throw budgetError;

    if (category_ids && category_ids.length > 0) {
      const { error: joinError } = await supabase
        .from('budget_categories')
        .insert(
          category_ids.map((categoryId: string) => ({
            budget_id: budget.id,
            category_id: categoryId,
          }))
        );

      if (joinError) throw joinError;
    }

    return NextResponse.json(budget);
  } catch (error: any) {
    console.error('Error creating budget:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
