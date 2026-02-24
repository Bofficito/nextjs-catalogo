'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Product, Category } from '@/lib/supabase/types'
import { useRouter } from 'next/navigation'

export default function ProductoForm({
  categories,
  product,
}: {
  categories: Category[]
  product?: Product
}) {
  const isEditing = !!product
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(product?.title ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(product?.price?.toString() ?? '')
  const [mlItemId, setMlItemId] = useState(product?.ml_item_id ?? '')
  const [mlUrl, setMlUrl] = useState(product?.ml_url ?? '')
  const [categoryId, setCategoryId] = useState(product?.category_id ?? '')
  const [isReserved, setIsReserved] = useState(product?.is_reserved ?? false)
  const [isActive, setIsActive] = useState(product?.is_active ?? true)
  const [images, setImages] = useState<string[]>(product?.images ?? ['', '', ''])
  const [syncing, setSyncing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [condition, setCondition] = useState<string>(product?.condition ?? 'usado')


  async function handleSync() {
    if (!mlItemId.trim()) return
    setSyncing(true)
    setError(null)

    try {
      const res = await fetch(`https://api.mercadolibre.com/items/${mlItemId.trim()}`)
      if (!res.ok) throw new Error()
      const data = await res.json()

      setTitle(data.title ?? title)
      setPrice(data.price?.toString() ?? price)
      setMlUrl(data.permalink ?? mlUrl)

      const mlImages = data.pictures?.slice(0, 3).map((p: { url: string }) => p.url) ?? []
      setImages([
        mlImages[0] ?? '',
        mlImages[1] ?? '',
        mlImages[2] ?? '',
      ])
    } catch {
      setError('No se pudo sincronizar. Verificá el Item ID.')
    }

    setSyncing(false)
  }

async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      price: price ? parseInt(price.replace(/\./g, '').replace(',', '.')) : null,
      ml_item_id: mlItemId.trim() || null,
      ml_url: mlUrl.trim() || null,
      category_id: categoryId || null,
      is_reserved: isReserved,
      is_active: isActive,
      images: images.filter(Boolean),
      condition,
    }

    const { error } = isEditing
      ? await supabase.from('catalog_products').update(payload).eq('id', product!.id)
      : await supabase.from('catalog_products').insert(payload)

    if (error) {
      setError('Error al guardar el producto')
      setLoading(false)
      return
    }

    router.push('/admin/productos')
    router.refresh()
  }

async function handleImageUpload(index: number, file: File) {
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const filename = `${Date.now()}-${index}.${ext}`

  console.log('Subiendo archivo:', filename)

  const { data, error } = await supabase.storage
    .from('catalog-images')
    .upload(filename, file, { upsert: true })

  console.log('Upload result:', { data, error })

  if (error || !data) return

  const { data: urlData } = supabase.storage
    .from('catalog-images')
    .getPublicUrl(data.path)

  console.log('Public URL:', urlData.publicUrl)

  const updated = [...images]
  updated[index] = urlData.publicUrl
  setImages(updated)
}

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">

      {/* Título */}
      <div>
        <label className="text-xs tracking-widest uppercase text-neutral-400 block mb-2">Título *</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-800 focus:outline-none focus:border-neutral-800 transition-colors"
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="text-xs tracking-widest uppercase text-neutral-400 block mb-2">Descripción</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={9}
          className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-800 focus:outline-none focus:border-neutral-800 transition-colors resize-none"
        />
      </div>

      {/* Precio y Categoría */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-xs tracking-widest uppercase text-neutral-400 block mb-2">Precio</label>
          <input
            type="text"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-800 focus:outline-none focus:border-neutral-800 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs tracking-widest uppercase text-neutral-400 block mb-2">Categoría</label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-800 focus:outline-none focus:border-neutral-800 transition-colors"
          >
            <option value="">Sin categoría</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs tracking-widest uppercase text-neutral-400 block mb-2">Estado</label>
        <select
          value={condition}
          onChange={e => setCondition(e.target.value)}
          className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-800 focus:outline-none focus:border-neutral-800 transition-colors"
        >
          <option value="usado">Usado</option>
          <option value="nuevo">Nuevo</option>
        </select>
      </div>

      {/* URL ML */}
      <div>
        <label className="text-xs tracking-widest uppercase text-neutral-400 block mb-2">URL MercadoLibre</label>
        <input
          type="url"
          value={mlUrl}
          onChange={e => setMlUrl(e.target.value)}
          className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-800 focus:outline-none focus:border-neutral-800 transition-colors"
        />
      </div>

      {/* Imágenes */}
      <div>
        <label className="text-xs tracking-widest uppercase text-neutral-400 block mb-3">
          Imágenes (hasta 3)
        </label>
        <div className="space-y-4">
          {images.map((img, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-xs text-neutral-400 w-4">{i + 1}</span>

              {/* Preview */}
              <div className="w-16 h-16 flex-shrink-0 bg-neutral-100 flex items-center justify-center overflow-hidden">
                {img ? (
                  <img src={img} alt="" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs text-neutral-300">—</span>
                )}
              </div>

              <div className="flex-1 space-y-2">
                {/* Upload */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="px-3 py-1.5 border border-neutral-300 text-xs tracking-widest uppercase text-neutral-500 hover:border-neutral-800 hover:text-neutral-800 transition-colors">
                    Subir archivo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(i, file)
                    }}
                  />
                </label>

                {/* O pegar URL */}
                <input
                  type="url"
                  value={img}
                  onChange={e => {
                    const updated = [...images]
                    updated[i] = e.target.value
                    setImages(updated)
                  }}
                  placeholder="O pegá una URL"
                  className="w-full border-b border-neutral-300 bg-transparent py-1.5 text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-800 transition-colors"
                />
              </div>

              {/* Eliminar */}
              {img && (
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...images]
                    updated[i] = ''
                    setImages(updated)
                  }}
                  className="text-xs text-neutral-400 hover:text-red-500 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="flex gap-8">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isReserved}
            onChange={e => setIsReserved(e.target.checked)}
            className="w-4 h-4 accent-neutral-800"
          />
          <span className="text-sm text-neutral-600 tracking-wide">Reservado</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={e => setIsActive(e.target.checked)}
            className="w-4 h-4 accent-neutral-800"
          />
          <span className="text-sm text-neutral-600 tracking-wide">Visible en el catálogo</span>
        </label>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Acciones */}
      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-neutral-800 text-white text-xs tracking-widest uppercase hover:bg-neutral-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/productos')}
          className="px-8 py-3 border border-neutral-300 text-neutral-600 text-xs tracking-widest uppercase hover:border-neutral-800 transition-colors"
        >
          Cancelar
        </button>
      </div>

    </form>
  )
}