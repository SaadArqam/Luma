import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: accounts, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('archived', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate current balance for each account
    const accountsWithBalances = await Promise.all(
      accounts.map(async (account) => {
        // Get all credits for the account
        const { data: credits } = await supabase
          .from('balance_entries')
          .select('amount')
          .eq('user_id', user.id)
          .eq('type', 'credit')
          .eq('account_id', account.id);

        // Get all debits for the account
        const { data: debits } = await supabase
          .from('balance_entries')
          .select('amount')
          .eq('user_id', user.id)
          .eq('type', 'debit')
          .eq('account_id', account.id);

        // Get all expenses for the account
        const { data: expenses } = await supabase
          .from('expenses')
          .select('amount')
          .eq('user_id', user.id)
          .eq('account_id', account.id);

        const totalCredits = credits?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
        const totalDebits = debits?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
        const totalExpenses = expenses?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
        const currentBalance = account.opening_balance + totalCredits - totalDebits - totalExpenses;

        return {
          ...account,
          current_balance: currentBalance,
        };
      })
    );

    return NextResponse.json(accountsWithBalances);
  } catch (error: any) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, type, icon, color, currency, opening_balance } = await request.json();

    const { data: account, error } = await supabase
      .from('accounts')
      .insert({
        user_id: user.id,
        name,
        type,
        icon,
        color,
        currency: currency || 'INR',
        opening_balance: opening_balance || 0,
      })
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json(account);
  } catch (error: any) {
    console.error('Error creating account:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
