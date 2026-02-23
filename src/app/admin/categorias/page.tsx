import { createClient } from '@/lib/supabase/server'
import CategoriasList from '@/components/admin/CategoriasList'

export default async function CategoriasPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('catalog_categories')
    .select('*')
    .order('name')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-light tracking-widest uppercase text-neutral-800">
          Categorías
        </h1>
      </div>
      <CategoriasList initialCategories={categories ?? []} />
    </div>
  )
}