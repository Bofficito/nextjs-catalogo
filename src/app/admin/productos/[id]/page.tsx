import { createClient } from '@/lib/supabase/server'
import ProductoForm from '@/components/admin/ProductoForm'
import { notFound } from 'next/navigation'

export default async function EditarProductoPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('catalog_products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) notFound()

  const { data: categories } = await supabase
    .from('catalog_categories')
    .select('*')
    .order('name')

  return (
    <div>
      <h1 className="text-xl font-light tracking-widest uppercase text-neutral-800 mb-8">
        Editar Producto
      </h1>
      <ProductoForm categories={categories ?? []} product={product} />
    </div>
  )
}