'use client'

import { useState } from 'react'
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
  const [open, setOpen] = useState(false)

  const activeName = activeCategory
    ? categories.find(c => c.id === activeCategory)?.name
    : 'Filtrar por categoría'

  function handleSelect(id: string | null) {
    onSelect(id)
    setOpen(false)
  }

  return (
    <nav className="border-b border-neutral-100">

      {/* Desktop — tabs horizontales */}
      <div className="hidden md:flex max-w-7xl mx-auto px-8">
        <button
          onClick={() => handleSelect(null)}
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
            onClick={() => handleSelect(cat.id)}
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

      {/* Mobile — dropdown */}
      <div className="md:hidden px-4 py-3 relative">
        <button
          onClick={() => setOpen(prev => !prev)}
          className="w-full flex items-center justify-between py-2 border-b border-neutral-300 text-sm text-neutral-800 tracking-wide"
        >
          <span className="text-xs tracking-widest uppercase">{activeName}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute left-4 right-4 top-full mt-1 bg-white border border-neutral-200 shadow-sm z-10">
            <button
              onClick={() => handleSelect(null)}
              className={`w-full text-left px-4 py-3 text-xs tracking-widest uppercase transition-colors ${
                activeCategory === null
                  ? 'text-neutral-800 bg-neutral-50'
                  : 'text-neutral-400 hover:text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className={`w-full text-left px-4 py-3 text-xs tracking-widest uppercase transition-colors border-t border-neutral-100 ${
                  activeCategory === cat.id
                    ? 'text-neutral-800 bg-neutral-50'
                    : 'text-neutral-400 hover:text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

    </nav>
  )
}