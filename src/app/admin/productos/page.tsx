import { createClient } from '@/lib/supabase/server'
import ProductosList from '@/components/admin/ProductosList'
import Link from 'next/link'

export default async function ProductosPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('catalog_products')
    .select('*, catalog_categories(id, name)')
    .order('created_at', { ascending: false })

  const { data: categories } = await supabase
    .from('catalog_categories')
    .select('*')
    .order('name')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-light tracking-widest uppercase text-neutral-800">
          Productos
        </h1>
        <Link
          href="/admin/productos/nuevo"
          className="px-5 py-2 bg-neutral-800 text-white text-xs tracking-widest uppercase hover:bg-neutral-700 transition-colors"
        >
          Nuevo producto
        </Link>
      </div>
      <ProductosList initialProducts={products ?? []} categories={categories ?? []} />
    </div>
  )
}