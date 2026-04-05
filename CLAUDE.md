# Public Frontend — CLAUDE.md

Nuxt 3 public-facing storefront for a generic multi-tenant product store. Displays products, handles customer enquiries, and supports SEO. Part of the `store` app within the multi-app `cms` Supabase project.

## Tech Stack

| Tool | Version | Role |
|---|---|---|
| Nuxt | 3.16.1 | SSR framework |
| Vue | 3.5.13 | UI framework |
| @nuxtjs/supabase | 1.6.2 | Supabase module (auto-imports composables) |
| PrimeVue | 4.3.2 | Unstyled UI component library |
| Tailwind CSS | 4.0.15 | Utility-first styling (via Vite plugin) |
| tailwindcss-primeui | 0.6.1 | PrimeVue + Tailwind design tokens bridge |
| npm | — | Package manager |

## Project Structure

```
app.vue                    # Root — wraps all pages with <NuxtLayout><NuxtPage />
nuxt.config.ts             # Nuxt config: modules, runtimeConfig, supabase options
assets/css/main.css        # Global CSS: Tailwind + PrimeUI imports + CSS variables
plugins/primevue.js        # PrimeVue init (unstyled: true, ToastService, StyleClass)
layouts/
  default.vue              # Shared layout: AppTopbar + slot + AppFooter + Toast
pages/
  index.vue                # Home: product listing with search/filter/sort + shop info
  product/[slug].vue       # Product detail: gallery, specs, enquiry form + shop contact
components/
  AppTopbar.vue            # Top nav: dark mode toggle, theme settings
  AppFooter.vue            # Footer with social links
  AppConfig.vue            # Theme/color picker panel
  ProductGridCard.vue      # Product card (grid view)
  ProductListCard.vue      # Product card (list view)
composables/
  use-layout.ts            # Theme state: primary color, surface color, dark mode toggle
utils/
  db.ts                    # DB table name constants (all prefixed with store_)
  shopId.ts                # useShopId() composable — reads SHOP_ID from runtimeConfig
volt/                      # Custom component library — styled PrimeVue wrappers
server/                    # Prepared for server routes (empty)
```

## Path Aliases

- `@/` → project root (standard Nuxt)
- `@/volt/*` → `./volt/*.vue` (tsconfig paths)
- `~/` → project root (Nuxt convention, e.g. `~/assets/css/main.css`)

## Environment Variables

Required in `.env` (not committed):
```
SUPABASE_URL=https://crqpqaxhdzvqnmzwbrkt.supabase.co
SUPABASE_KEY=<anon key>
SHOP_ID=<uuid from store_users>
```
Note: unlike the admin app (Vite), the Nuxt module uses `SUPABASE_URL` / `SUPABASE_KEY` (no `VITE_` prefix). `SHOP_ID` is exposed via `runtimeConfig.public.shopId`.

## Database Tables

Constants in `utils/db.ts`. Same table names as the admin app:

| Constant | Table Name |
|---|---|
| `USER_TABLE` | `store_users` |
| `CATEGORY_TABLE` | `store_categories` |
| `PRODUCT_TABLE` | `store_products` |
| `PRODUCT_SPECIFICATION_TABLE` | `store_product_specs` |
| `SPECIFICATION_SECTION_TABLE` | `store_spec_sections` |
| `SPECIFICATION_KEY_TABLE` | `store_spec_keys` |
| `ENQUIRY_TABLE` | `store_enquiries` |

Always import from `utils/db.ts` — never hardcode table name strings.

## Multi-Tenant Design

- All queries are scoped by `SHOP_ID` env var (set per deployment)
- `useShopId()` composable reads `runtimeConfig.public.shopId` (SSR-safe)
- `store_users.id` is the tenant identifier; all tables filtered by `shop_id = SHOP_ID`
- No auth in public app — anon Supabase client only; RLS allows public SELECT

## Supabase Usage

```typescript
import { useSupabaseClient } from '#imports'
const supabase = useSupabaseClient()
```

- `@nuxtjs/supabase` auto-imports `useSupabaseClient` etc. via `#imports`
- Auth redirects disabled (`supabase: { redirect: false }`)
- No login page — public storefront only
- DB ops: SELECT (products, categories, specs, shop info), INSERT (enquiries)

## Routing (File-System Based)

| File | Route | Notes |
|---|---|---|
| `pages/index.vue` | `/` | Product listing with filters + shop info |
| `pages/product/[slug].vue` | `/product/:slug` | Product detail + enquiry form |

All pages use `layouts/default.vue` automatically via `app.vue`.

## SEO

Both pages implement full SEO via `useHead()`:
- `<title>`, `<meta name="description">`, `<link rel="canonical">`
- OpenGraph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`)
- Twitter Card tags
- JSON-LD structured data:
  - Home: `Organization` + `WebSite` schemas
  - Product detail: `Product` (with offers/availability/seller) + `BreadcrumbList` schemas
- `useRequestURL()` used for dynamic canonical/og:url — SSR-safe, no hardcoded domains

## Component Library: `volt/`

Custom components wrapping PrimeVue in unstyled mode with Tailwind styling via PassThrough (PT).
Always prefer volt components over raw PrimeVue imports.

## Styling Conventions

- **Tailwind 4** — no `tailwind.config.js`; configuration is CSS-first via `assets/css/main.css`
- **Dark mode** — toggled by adding/removing `.p-dark` class on `<html>`; use `dark:` Tailwind variants
- **CSS variables** — all theme colors (`--p-primary-*`, `--p-surface-*`) defined in `main.css` `:root`
- **`.card` utility class** — defined in `main.css`; use for panel/card containers

## Data Fetching Pattern

Pages use `<script setup>` with top-level `await` — Nuxt handles SSR automatically:

```typescript
const supabase = useSupabaseClient()
const shopId = useShopId()
const { data } = await supabase.from(PRODUCT_TABLE).select('*').eq('shop_id', shopId)
```

## Dev Commands

```bash
npm run dev         # start dev server
npm run build       # production build (SSR)
npm run generate    # static site generation
npm run preview     # preview production build
```

## Key Architectural Decisions

- No Pinia — theme state in composable, page state is local `ref`/`reactive`
- Each page directly calls `useSupabaseClient()` — no centralized service/store layer
- SSR-compatible by default (Nuxt 3); avoid `window`/`document` outside `onMounted`
- PrimeVue runs in `unstyled: true` mode — all styling owned by Tailwind via PT
- `supabase: { redirect: false }` — no automatic auth redirects
