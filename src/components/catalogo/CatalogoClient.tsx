'use client'

import { useState } from 'react'
import { Product, Category } from '@/lib/supabase/types'
import ProductCard from './ProductCard'
import CategoryNav from './CategoryNav'

type SortOrder = 'none' | 'asc' | 'desc'

export default function CatalogoClient({
  products,
  categories,
}: {
  products: Product[]
  categories: Category[]
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>('none')

  const filtered = activeCategory
    ? products.filter(p => p.category_id === activeCategory)
    : products

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'none') return 0
    const priceA = a.price ?? 0
    const priceB = b.price ?? 0
    return sortOrder === 'asc' ? priceA - priceB : priceB - priceA
  })

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <header className="border-b border-neutral-200 px-8 py-6 flex items-center justify-between">
        <h1 className="text-xl font-light tracking-widest uppercase text-neutral-800">
          Catálogo Oficina
        </h1>
        <span className="text-xs text-neutral-400 tracking-wide">
          {sorted.length} {sorted.length === 1 ? 'producto' : 'productos'}
        </span>
      </header>

      {/* Categorías + Ordenar */}
      <div className="flex items-center border-b border-neutral-100">
        <div className="flex-1">
          <CategoryNav
            categories={categories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>

        {/* Selector de orden — desktop */}
        <div className="hidden md:flex items-center gap-2 px-6 border-l border-neutral-100">
          <span className="text-xs text-neutral-400 tracking-widest uppercase whitespace-nowrap">Precio</span>
          <div className="flex">
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'none' : 'asc')}
              className={`px-3 py-1.5 text-xs tracking-widest uppercase transition-colors border ${
                sortOrder === 'asc'
                  ? 'border-neutral-800 text-neutral-800'
                  : 'border-neutral-200 text-neutral-400 hover:border-neutral-400'
              }`}
            >
              ↑ Menor
            </button>
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'none' : 'desc')}
              className={`px-3 py-1.5 text-xs tracking-widests uppercase transition-colors border border-l-0 ${
                sortOrder === 'desc'
                  ? 'border-neutral-800 text-neutral-800'
                  : 'border-neutral-200 text-neutral-400 hover:border-neutral-400'
              }`}
            >
              ↓ Mayor
            </button>
          </div>
        </div>
      </div>

      {/* Selector de orden — mobile */}
      <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
        <span className="text-xs text-neutral-400 tracking-widest uppercase">Precio</span>
        <button
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'none' : 'asc')}
          className={`px-3 py-1.5 text-xs tracking-widest uppercase transition-colors border ${
            sortOrder === 'asc'
              ? 'border-neutral-800 text-neutral-800'
              : 'border-neutral-200 text-neutral-400'
          }`}
        >
          ↑ Menor
        </button>
        <button
          onClick={() => setSortOrder(prev => prev === 'desc' ? 'none' : 'desc')}
          className={`px-3 py-1.5 text-xs tracking-widests uppercase transition-colors border ${
            sortOrder === 'desc'
              ? 'border-neutral-800 text-neutral-800'
              : 'border-neutral-200 text-neutral-400'
          }`}
        >
          ↓ Mayor
        </button>
      </div>

      {/* Grilla */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {sorted.length === 0 ? (
          <p className="text-sm text-neutral-400 tracking-wide text-center py-20">
            No hay productos en esta categoría.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sorted.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

    </div>
  )
}