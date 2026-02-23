'use client'

import { Category } from '@/lib/supabase/types'

export default function CategoryNav({
  categories,
  activeCategory,
  onSelect,
}: {
  categories: Category[]
  activeCategory: string | null
  onSelect: (id: string | null) => void
}) {
  return (
    <nav className="border-b border-neutral-100 px-8">
      <div className="max-w-7xl mx-auto flex items-center gap-0 overflow-x-auto">
        <button
          onClick={() => onSelect(null)}
          className={`px-5 py-4 text-xs tracking-widest uppercase transition-colors whitespace-nowrap border-b-2 ${
            activeCategory === null
              ? 'border-neutral-800 text-neutral-800'
              : 'border-transparent text-neutral-400 hover:text-neutral-800'
          }`}
        >
          Todos
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`px-5 py-4 text-xs tracking-widest uppercase transition-colors whitespace-nowrap border-b-2 ${
              activeCategory === cat.id
                ? 'border-neutral-800 text-neutral-800'
                : 'border-transparent text-neutral-400 hover:text-neutral-800'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </nav>
  )
}