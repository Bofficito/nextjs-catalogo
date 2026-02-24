# Catálogo Oficina

Full-stack product catalog with admin backoffice for managing and publishing secondhand items linked to MercadoLibre listings.

## Features

- **Public catalog** with category filtering, price sorting, and product modal with image gallery
- **Admin backoffice** protected by Supabase Auth with full CRUD for products and categories
- **MercadoLibre integration** — each product card links directly to its ML listing
- **WhatsApp inquiry** — predefined message with product name and price sent directly to the seller
- **Reserved badge** — mark products as reserved to disable the inquiry button
- **Image upload** via Supabase Storage or external URL
- **Responsive design** — mobile dropdown category menu, sticky modal action buttons on mobile
- **Real-time updates** — catalog always fetches fresh data with `revalidate = 0`

## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB%20%2B%20Storage-3ecf8e)

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Public catalog
│   ├── login/page.tsx            # Admin login
│   └── admin/
│       ├── layout.tsx            # Protected admin layout
│       ├── productos/            # Product CRUD
│       └── categorias/           # Category management
├── components/
│   ├── catalogo/
│   │   ├── CatalogoClient.tsx    # Catalog with filtering and sorting
│   │   ├── CategoryNav.tsx       # Category nav (tabs on desktop, dropdown on mobile)
│   │   ├── ProductCard.tsx       # Product card with image carousel
│   │   └── ProductModal.tsx      # Product detail modal
│   └── admin/
│       ├── ProductoForm.tsx      # Create/edit product form
│       ├── ProductosList.tsx     # Product table with inline toggles
│       ├── CategoriasList.tsx    # Category ABM
│       └── LogoutButton.tsx
└── lib/supabase/
    ├── client.ts                 # Browser client
    ├── server.ts                 # Server client + public client
    ├── middleware.ts             # Session refresh
    └── types.ts                  # Shared types
```

## Database

Tables are prefixed with `catalog_` to avoid conflicts with other projects sharing the same Supabase instance.

| Table | Description |
|---|---|
| `catalog_categories` | id, name, slug |
| `catalog_products` | id, title, description, price, ml_url, category_id, is_reserved, is_active, images[], condition |

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-user/catalogo-ml.git
cd catalogo-ml
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set up Supabase

Run the SQL migration in the Supabase SQL Editor:

```sql
CREATE TABLE catalog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE catalog_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2),
  ml_item_id TEXT,
  ml_url TEXT,
  category_id UUID REFERENCES catalog_categories(id) ON DELETE SET NULL,
  is_reserved BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  images TEXT[] DEFAULT '{}',
  condition TEXT CHECK (condition IN ('nuevo', 'usado')) DEFAULT 'usado',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

Create a public Storage bucket named `catalog-images`.

### 4. Run locally

```bash
npm run dev
```

### 5. Deploy to Vercel

Push to GitHub and import the repo in Vercel. Add the environment variables in **Settings → Environment Variables**.

In Supabase, go to **Authentication → URL Configuration** and add your Vercel domain to **Redirect URLs**.

## Routes

| Route | Description |
|---|---|
| `/` | Public product catalog |
| `/login` | Admin login |
| `/admin/productos` | Product management |
| `/admin/categorias` | Category management |