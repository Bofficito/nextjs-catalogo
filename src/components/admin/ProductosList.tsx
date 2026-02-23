'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Product, Category } from '@/lib/supabase/types'
import Link from 'next/link'

export default function ProductosList({
  initialProducts,
  categories,
}: {
  initialProducts: Product[]
  categories: Category[]
}) {
  const [products, setProducts] = useState(initialProducts)
  const supabase = createClient()

  async function toggleReserved(product: Product) {
    const { error } = await supabase
      .from('catalog_products')
      .update({ is_reserved: !product.is_reserved })
      .eq('id', product.id)

    if (!error) {
      setProducts(prev =>
        prev.map(p => p.id === product.id ? { ...p, is_reserved: !p.is_reserved } : p)
      )
    }
  }

  async function toggleActive(product: Product) {
    const { error } = await supabase
      .from('catalog_products')
      .update({ is_active: !product.is_active })
      .eq('id', product.id)

    if (!error) {
      setProducts(prev =>
        prev.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p)
      )
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este producto?')) return

    const { error } = await supabase
      .from('catalog_products')
      .delete()
      .eq('id', id)

    if (!error) {
      setProducts(prev => prev.filter(p => p.id !== id))
    }
  }

  const getCategoryName = (category_id: string | null) => {
    if (!category_id) return '—'
    return categories.find(c => c.id === category_id)?.name ?? '—'
  }

  return (
    <div className="overflow-x-auto">
      {products.length === 0 && (
        <p className="text-sm text-neutral-400 tracking-wide">No hay productos todavía.</p>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200">
            <th className="text-left py-3 pr-6 font-normal text-neutral-400 tracking-wide text-xs uppercase">Producto</th>
            <th className="text-left py-3 pr-6 font-normal text-neutral-400 tracking-wide text-xs uppercase">Categoría</th>
            <th className="text-left py-3 pr-6 font-normal text-neutral-400 tracking-wide text-xs uppercase">Precio</th>
            <th className="text-left py-3 pr-6 font-normal text-neutral-400 tracking-wide text-xs uppercase">Estado</th>
            <th className="text-left py-3 font-normal text-neutral-400 tracking-wide text-xs uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
              <td className="py-4 pr-6">
                <div className="flex items-center gap-3">
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-10 h-10 object-cover bg-neutral-100"
                    />
                  )}
                  <span className="text-neutral-800">{product.title}</span>
                </div>
              </td>
              <td className="py-4 pr-6 text-neutral-500">{getCategoryName(product.category_id)}</td>
              <td className="py-4 pr-6 text-neutral-800">
                {product.price ? `$${product.price.toLocaleString('es-AR')}` : '—'}
              </td>
              <td className="py-4 pr-6">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => toggleReserved(product)}
                    className={`text-xs tracking-wide transition-colors ${
                      product.is_reserved
                        ? 'text-amber-600 hover:text-neutral-400'
                        : 'text-neutral-400 hover:text-amber-600'
                    }`}
                  >
                    {product.is_reserved ? 'Reservado' : 'Disponible'}
                  </button>
                  <button
                    onClick={() => toggleActive(product)}
                    className={`text-xs tracking-wide transition-colors ${
                      product.is_active
                        ? 'text-green-600 hover:text-neutral-400'
                        : 'text-neutral-400 hover:text-green-600'
                    }`}
                  >
                    {product.is_active ? 'Visible' : 'Oculto'}
                  </button>
                </div>
              </td>
              <td className="py-4">
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/productos/${product.id}`}
                    className="text-xs text-neutral-400 hover:text-neutral-800 tracking-wide transition-colors"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-xs text-neutral-400 hover:text-red-500 tracking-wide transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}