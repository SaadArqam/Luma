import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const json = await request.json()
    const name = String(json.name ?? '').trim()
    const icon = json.icon || '💰'

    if (!name) return NextResponse.json({ error: 'Category name is required' }, { status: 400 })

    const { data, error } = await supabase
      .from('categories')
      .insert({ name, icon, user_id: user.id })
      .select()
      .single()

    if (error) {
      // 23505 = unique violation. Say what the user can act on instead of
      // surfacing the raw constraint text, which used to reach the toast as
      // "duplicate key value violates unique constraint categories_name_key".
      if (error.code === '23505') {
        return NextResponse.json(
          { error: `You already have a category called "${name}".` },
          { status: 409 },
        )
      }
      throw error
    }
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
