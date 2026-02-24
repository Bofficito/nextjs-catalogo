import { createPublicClient } from '@/lib/supabase/server'
import CatalogoClient from '@/components/catalogo/CatalogoClient'

export const revalidate = 0

export default async function HomePage() {
  const supabase = await createPublicClient()

  const { data: products } = await supabase
    .from('catalog_products')
    .select('*, catalog_categories(id, name, slug)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const { data: categories } = await supabase
    .from('catalog_categories')
    .select('*')
    .order('name')

  return <CatalogoClient products={products ?? []} categories={categories ?? []} />
}