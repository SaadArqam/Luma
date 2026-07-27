import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { CategoryList } from '@/components/CategoryList'
import { AddCategoryForm } from '@/components/AddCategoryForm'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (!categories || categories.length === 0) {
    // Seeded per user. Without user_id these rows were created unowned, which
    // is how orphan rows got into the table in the first place.
    const defaultCategories = [
      { name: 'Food', icon: '🍔', user_id: user.id },
      { name: 'Travel', icon: '🚌', user_id: user.id },
      { name: 'Shopping', icon: '🛍️', user_id: user.id }
    ]

    await supabase.from('categories').insert(defaultCategories)

    const { data: newCategories } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    categories = newCategories
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="px-6 pt-6 pb-2">
        <h1 className="font-fraunces text-header-display text-luma-text">Categories</h1>
        <p className="text-body-muted-luma mt-2">Manage your expense categories</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        <div className="col-span-2 md:col-span-1">
          <AddCategoryForm />
        </div>
        
        <div className="col-span-2 space-y-4">
          <CategoryList initialCategories={categories || []} />
        </div>
      </div>
    </div>
  )
}
