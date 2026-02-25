'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Product } from '@/lib/supabase/types'
import ProductModal from './ProductModal'

export default function ProductCard({ product }: { product: Product }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [mounted, setMounted] = useState(false)
  const images = product.images?.filter(Boolean) ?? []

  useEffect(() => {
    setMounted(true)
  }, [])

  function prev(e: React.MouseEvent) {
    e.stopPropagation()
    setCurrentImage(i => (i === 0 ? images.length - 1 : i - 1))
  }

  function next(e: React.MouseEvent) {
    e.stopPropagation()
    setCurrentImage(i => (i === images.length - 1 ? 0 : i + 1))
  }
  
  return (
    <div className="group flex flex-col cursor-pointer" onClick={e => { e.stopPropagation(); setShowModal(true) }}>

      {/* Imagen */}
      <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden mb-4">
        {images.length > 0 ? (
          <img
            src={images[currentImage]}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xs text-neutral-300 tracking-wide">Sin imagen</span>
          </div>
        )}

        {/* Badge reservado */}
        {product.is_reserved && (
          <div className="absolute top-3 left-3 bg-white px-3 py-1">
            <span className="text-xs tracking-widest uppercase text-neutral-600">Reservado</span>
          </div>
        )}

        {/* Flechas — solo si hay más de una imagen */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 hover:bg-white flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 hover:bg-white flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Puntos */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setCurrentImage(i) }}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === currentImage ? 'bg-neutral-800' : 'bg-neutral-400'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1">
        <h2 className="text-sm text-neutral-800 leading-snug mb-2 line-clamp-2">
          {product.title}
        </h2>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-800">
            {product.price
              ? `$${product.price.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
              : 'Consultar'}
          </span>

          {product.ml_url && !product.is_reserved && (
            <a
              href={product.ml_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-widest uppercase text-neutral-400 hover:text-neutral-800 transition-colors border-b border-neutral-200 hover:border-neutral-800 pb-0.5"
            >
              Ver en ML
            </a>
          )}
        </div>
      </div>
      {mounted && showModal && createPortal(
        <ProductModal product={product} onClose={() => setShowModal(false)} />,
        document.body
      )}
    </div>
  )
}