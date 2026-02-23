'use client'

import { useState } from 'react'
import { Product, Category } from '@/lib/supabase/types'
import ProductCard from './ProductCard'
import CategoryNav from './CategoryNav'

export default function CatalogoClient({
  products,
  categories,
}: {
  products: Product[]
  categories: Category[]
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = activeCategory
    ? products.filter(p => p.category_id === activeCategory)
    : products

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <header className="border-b border-neutral-200 px-8 py-6 flex items-center justify-between">
        <h1 className="text-xl font-light tracking-widest uppercase text-neutral-800">
          Catálogo Oficina
        </h1>
        <span className="text-xs text-neutral-400 tracking-wide">
          {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
        </span>
      </header>

      {/* Categorías */}
      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {/* Grilla */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {filtered.length === 0 ? (
          <p className="text-sm text-neutral-400 tracking-wide text-center py-20">
            No hay productos en esta categoría.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

    </div>
  )
}