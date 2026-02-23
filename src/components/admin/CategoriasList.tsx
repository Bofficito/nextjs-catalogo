'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Category } from '@/lib/supabase/types'

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function CategoriasList({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories)
  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('catalog_categories')
      .insert({ name: newName.trim(), slug: slugify(newName) })
      .select()
      .single()

    if (error) {
      setError('Error al crear la categoría')
    } else {
      setCategories(prev => [...prev, data])
      setNewName('')
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta categoría?')) return

    const { error } = await supabase
      .from('catalog_categories')
      .delete()
      .eq('id', id)

    if (!error) {
      setCategories(prev => prev.filter(c => c.id !== id))
    }
  }

  return (
    <div className="max-w-lg">
      {/* Formulario nueva categoría */}
      <form onSubmit={handleAdd} className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Nueva categoría"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          className="flex-1 border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-800 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-neutral-800 text-white text-xs tracking-widest uppercase hover:bg-neutral-700 transition-colors disabled:opacity-50"
        >
          Agregar
        </button>
      </form>

      {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

      {/* Lista */}
      <div className="space-y-1">
        {categories.length === 0 && (
          <p className="text-sm text-neutral-400 tracking-wide">No hay categorías todavía.</p>
        )}
        {categories.map(cat => (
          <div
            key={cat.id}
            className="flex items-center justify-between py-3 border-b border-neutral-100"
          >
            <div>
              <span className="text-sm text-neutral-800">{cat.name}</span>
              <span className="ml-3 text-xs text-neutral-400 tracking-wide">/{cat.slug}</span>
            </div>
            <button
              onClick={() => handleDelete(cat.id)}
              className="text-xs text-neutral-400 hover:text-red-500 tracking-wide transition-colors"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}