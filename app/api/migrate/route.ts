import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function POST() {
  try {
    // Identify the caller with the normal RLS-bound client…
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // …but do the claim with service-role. These rows have user_id IS NULL, so
    // no `auth.uid() = user_id` policy can ever match them and the claim would
    // silently update zero rows once RLS is on. The alternative — a policy
    // allowing any authenticated user to grab orphan rows — would let one user
    // claim another's legacy data, so keep the hole in one audited place.
    const admin = createAdminClient()

    const tables = [
      'expenses',
      'categories',
      'balance_entries',
      'recurring_expenses',
      'stipend_config',
    ]

    const results: Record<string, number> = {}

    for (const table of tables) {
      const { data, error } = await admin
        .from(table)
        .update({ user_id: user.id })
        .is('user_id', null)
        .select('id')

      if (error) {
        console.error(`Migration error for ${table}:`, error)
      } else {
        results[table] = data?.length ?? 0
      }
    }

    return NextResponse.json({ success: true, migrated: results })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
