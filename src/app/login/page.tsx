'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Credenciales incorrectas')
      setLoading(false)
      return
    }

    router.push('/admin/productos')
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="mb-10 text-center">
          <h1 className="text-2xl font-light tracking-widest uppercase text-neutral-800">
            Admin
          </h1>
          <p className="text-sm text-neutral-400 mt-2 tracking-wide">Panel de gestión</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-800 transition-colors"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-800 transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 tracking-wide">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 bg-neutral-800 text-white text-sm tracking-widest uppercase hover:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

      </div>
    </div>
  )
}