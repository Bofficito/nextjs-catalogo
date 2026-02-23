import { createClient } from '@/lib/supabase/server'
import ProductoForm from '@/components/admin/ProductoForm'

export default async function NuevoProductoPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('catalog_categories')
    .select('*')
    .order('name')

  return (
    <div>
      <h1 className="text-xl font-light tracking-widest uppercase text-neutral-800 mb-8">
        Nuevo Producto
      </h1>
      <ProductoForm categories={categories ?? []} />
    </div>
  )
}