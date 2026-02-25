export type Category = {
  id: string
  name: string
  slug: string
  created_at: string
}

export type Product = {
  id: string
  title: string
  description: string | null
  price: number | null
  ml_item_id: string | null
  ml_url: string | null
  category_id: string | null
  is_reserved: boolean
  is_active: boolean
  images: string[]
  condition: 'nuevo' | 'usado' | null
  created_at: string
  updated_at: string
  catalog_categories?: Category
  stock: number | null
}