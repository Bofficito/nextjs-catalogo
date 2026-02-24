'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/lib/supabase/types'

export default function ProductModal({
  product,
  onClose,
}: {
  product: Product
  onClose: () => void
}) {
  const [currentImage, setCurrentImage] = useState(0)
  const images = product.images?.filter(Boolean) ?? []

  const whatsappUrl = `https://wa.me/5491151652274?text=${encodeURIComponent(
    `Hola! Me interesa el producto: *${product.title}*${product.price
      ? ` ($${product.price.toLocaleString('es-AR', { maximumFractionDigits: 0 })})`
      : ''}. ¿Está disponible?`
  )}`

  function prev() {
    setCurrentImage(i => (i === 0 ? images.length - 1 : i - 1))
  }

  function next() {
    setCurrentImage(i => (i === images.length - 1 ? 0 : i + 1))
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-6xl max-h-[95vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto flex-1">
          <div className="flex flex-col md:flex-row">

            {/* Galería */}
            <div className="w-full md:w-1/2 flex-shrink-0">
              <div className="relative aspect-[4/3] bg-neutral-100">
                {images.length > 0 ? (
                  <img
                    src={images[currentImage]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs text-neutral-300 tracking-wide">Sin imagen</span>
                  </div>
                )}

                {/* Condición — arriba izquierda */}
                {product.condition && (
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs tracking-widest uppercase px-2 py-1 ${
                      product.condition === 'nuevo'
                        ? 'bg-neutral-800 text-white'
                        : 'bg-white/90 text-neutral-600'
                    }`}>
                      {product.condition}
                    </span>
                  </div>
                )}

                {/* Reservado */}
                {product.is_reserved && (
                  <div className="absolute top-10 left-3">
                    <span className="text-xs tracking-widest uppercase px-2 py-1 bg-amber-500 text-white">
                      Reservado
                    </span>
                  </div>
                )}

                {/* Cerrar — solo mobile */}
                <button
                  onClick={onClose}
                  className="md:hidden absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Título — bottom con gradiente — solo mobile */}
                <div className="md:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/100 to-transparent px-4 py-4">
                  <h2 className="text-white text-sm font-light leading-snug">
                    {product.title}
                  </h2>
                </div>

                {/* Flechas */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={next}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Miniaturas */}
              {images.length > 1 && (
                <div className="flex gap-2 p-3 bg-neutral-50 border-t border-neutral-100">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-14 h-14 flex-shrink-0 overflow-hidden border-2 transition-colors ${
                        i === currentImage ? 'border-neutral-800' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover bg-neutral-100" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 p-6">

              {/* Cerrar — solo desktop */}
              <div className="hidden md:flex justify-end mb-2">
                <button
                  onClick={onClose}
                  className="text-neutral-400 hover:text-neutral-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Categoría */}
              {product.catalog_categories && (
                <span className="text-xs tracking-widest uppercase text-neutral-400 mb-2">
                  {product.catalog_categories.name}
                </span>
              )}

              {/* Título — solo desktop */}
              <h2 className="hidden md:block text-lg font-light text-neutral-800 leading-snug mb-4">
                {product.title}
              </h2>

              {/* Precio */}
              <div className="mb-5">
                <span className="text-2xl font-light text-neutral-800">
                  {product.price
                    ? `$${product.price.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
                    : 'Consultar precio'}
                </span>
              </div>

              {/* Descripción */}
              {product.description && (
                <div className="mb-5">
                  <p className="text-xs tracking-widest uppercase text-neutral-400 mb-2">Descripción</p>
                  <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Botones desktop */}
              <div className="hidden md:flex flex-row gap-4 mt-auto pt-4 border-t border-neutral-100">
                {product.is_reserved ? (
                  <p className="text-sm text-amber-600 tracking-wide text-center py-2">
                    Este producto está reservado
                  </p>
                ) : (
                  <>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-neutral-800 text-white text-xs tracking-widest uppercase text-center hover:bg-neutral-700 transition-colors"
                    >
                      Consultar por WhatsApp
                    </a>
                    {product.ml_url && (
                      <a
                        href={product.ml_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 border border-neutral-300 text-neutral-600 text-xs tracking-widest uppercase text-center hover:border-neutral-800 hover:text-neutral-800 transition-colors"
                      >
                        Ver en MercadoLibre
                      </a>
                    )}
                  </>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Botones fijos al fondo — mobile. Inline en desktop */}
        <div className="md:hidden border-t border-neutral-100 p-4 flex flex-col gap-2 bg-white">
          {product.is_reserved ? (
            <p className="text-sm text-amber-600 tracking-wide text-center py-2">
              Este producto está reservado
            </p>
          ) : (
            <>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-neutral-800 text-white text-xs tracking-widest uppercase text-center hover:bg-neutral-700 transition-colors"
              >
                Consultar por WhatsApp
              </a>
              {product.ml_url && (
                <a
                  href={product.ml_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 border border-neutral-300 text-neutral-600 text-xs tracking-widest uppercase text-center hover:border-neutral-800 hover:text-neutral-800 transition-colors"
                >
                  Ver en MercadoLibre
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}