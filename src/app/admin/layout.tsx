import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/admin/LogoutButton'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-sm font-light tracking-widest uppercase text-neutral-800">
            Admin
          </span>
          <div className="flex gap-6">
            <Link
              href="/admin/productos"
              className="text-sm text-neutral-500 hover:text-neutral-800 tracking-wide transition-colors"
            >
              Productos
            </Link>
            <Link
              href="/admin/categorias"
              className="text-sm text-neutral-500 hover:text-neutral-800 tracking-wide transition-colors"
            >
              Categorias
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-500 hover:text-neutral-800 tracking-wide transition-colors"
            >
              Ver catalogo
            </a>
          </div>
        </div>
        <LogoutButton />
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  )
}