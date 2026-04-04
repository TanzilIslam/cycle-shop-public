# Public Frontend — CLAUDE.md

Nuxt 3 public-facing storefront for the cycle shop. Displays products, handles customer enquiries, and supports SEO. Part of the `store` app within the multi-app `cms` Supabase project.

## Tech Stack

| Tool | Version | Role |
|---|---|---|
| Nuxt | 3.16.1 | SSR framework |
| Vue | 3.5.13 | UI framework |
| @nuxtjs/supabase | 1.6.2 | Supabase module (auto-imports composables) |
| PrimeVue | 4.3.2 | Unstyled UI component library |
| Tailwind CSS | 4.0.15 | Utility-first styling (via Vite plugin) |
| tailwindcss-primeui | 0.6.1 | PrimeVue + Tailwind design tokens bridge |
| Chart.js | 4.4.8 | Charts/analytics widgets |
| npm | — | Package manager |

## Project Structure

```
app.vue                    # Root — wraps all pages with <NuxtLayout><NuxtPage />
nuxt.config.ts             # Nuxt config: modules, vite plugins, supabase options
assets/css/main.css        # Global CSS: Tailwind + PrimeUI imports + CSS variables
plugins/primevue.js        # PrimeVue init (unstyled: true, ToastService, StyleClass)
layouts/
  default.vue              # Shared layout: AppTopbar + slot + AppFooter + Toast
pages/
  index.vue                # Home: cycles listing with search/filter/sort
  login.vue                # Login stub
  cycle/[slug].vue         # Cycle detail: gallery, specs, enquiry form
components/
  AppTopbar.vue            # Top nav: dark mode toggle, theme settings
  AppFooter.vue            # Footer with social links
  AppConfig.vue            # Theme/color picker panel
  CycleGridCard.vue        # Product card (grid view)
  CycleListCard.vue        # Product card (list view)
  dashboard/               # Dashboard widgets (stats, activity, trends)
composables/
  use-layout.ts            # Theme state: primary color, surface color, dark mode toggle
utils/
  db.ts                    # DB table name constants
volt/                      # Custom component library — styled PrimeVue wrappers
server/                    # Prepared for server routes (empty)
```

## Path Aliases

- `@/` → project root (standard Nuxt)
- `@/volt/*` → `./volt/*.vue` (tsconfig paths)
- `~/` → project root (Nuxt convention, e.g. `~/assets/css/main.css`)

## Environment Variables

Set via `@nuxtjs/supabase` module — required in `.env` (not committed):
```
SUPABASE_URL=https://crqpqaxhdzvqnmzwbrkt.supabase.co
SUPABASE_KEY=<anon key>
```
Note: unlike the admin app (Vite), the Nuxt module uses `SUPABASE_URL` / `SUPABASE_KEY` (no `VITE_` prefix).

## Database Tables

Constants in `utils/db.ts`. Same table names as the admin app:

| Constant | Table Name |
|---|---|
| `CYCLE_TABLE` | `cycle_shop_cycles` |
| `BRAND_TABLE` | `cycle_shop_brand` |
| `CATEGORY_TABLE` | `cycle_shop_categories` |
| `CYCLE_SPECIFICATION_TABLE` | `cycle_shop_cycle_specs` |
| `SPECIFICATION_SECTION_TABLE` | `cycle_shop_spec_sections` |
| `SPECIFICATION_KEY_TABLE` | `cycle_shop_specs_keys` |
| `ENQUIRY_TABLE` | `cycle_shop_inquiries` |
| `SHOP_TABLE` | `cycle_shop_shops` |
| `PRODUCT_TABLE` | `cycle_shop_products` |

Always import from `utils/db.ts` — never hardcode table name strings.

## Supabase Usage

```typescript
import { useSupabaseClient } from '#imports'
const supabase = useSupabaseClient()
```

- `@nuxtjs/supabase` auto-imports `useSupabaseClient`, `useSupabaseUser`, etc. via `#imports`
- Auth redirects disabled (`supabase: { redirect: false }`) — handle redirects manually
- No auth enforcement in current pages — login page is a stub
- DB ops: SELECT (cycles, brands, categories, specs), INSERT (enquiries), UPDATE (view counts)
- JOIN syntax: `supabase.from(CYCLE_TABLE).select('*, cycle_shop_brand(*), cycle_shop_categories(*)')`

## Routing (File-System Based)

| File | Route | Notes |
|---|---|---|
| `pages/index.vue` | `/` | Cycles listing with filters |
| `pages/login.vue` | `/login` | Auth stub |
| `pages/cycle/[slug].vue` | `/cycle/:slug` | Product detail page |

All pages use `layouts/default.vue` automatically via `app.vue`.

## Component Library: `volt/`

18 custom components that wrap PrimeVue in unstyled mode with Tailwind styling via PassThrough (PT):
`Button`, `SecondaryButton`, `InputText`, `Textarea`, `Select`, `SelectButton`, `Tabs`, `Tab`, `TabList`, `TabPanels`, `TabPanel`, `Accordion`, `AccordionPanel`, `AccordionHeader`, `AccordionContent`, `Breadcrumb`, `DataTable`, `Tag`, `Toast`

- Always prefer volt components over raw PrimeVue imports
- Extend via PT props — do not modify volt source for one-off styling
- `volt/utils.ts` exports `ptViewMerge` for merging PT class strings

## Styling Conventions

- **Tailwind 4** — no `tailwind.config.js`; configuration is CSS-first via `assets/css/main.css`
- **Dark mode** — toggled by adding/removing `.p-dark` class on `<html>`; use `dark:` Tailwind variants
- **CSS variables** — all theme colors (`--p-primary-*`, `--p-surface-*`) are defined in `main.css` `:root`
- **`.card` utility class** — defined in `main.css`; use for panel/card containers
- Theme switching at runtime via `use-layout.ts` composable (18 primary + 8 surface palettes)

## Data Fetching Pattern

Pages use `<script setup>` with top-level `await` — Nuxt handles SSR automatically:

```typescript
const supabase = useSupabaseClient()
const { data } = await supabase.from(CYCLE_TABLE).select('*')
```

Current filtering (index page) is client-side — data fetched once, filtered reactively. For larger datasets, move filtering to server-side Supabase queries.

## Dev Commands

```bash
npm run dev         # start dev server
npm run build       # production build (SSR)
npm run generate    # static site generation
npm run preview     # preview production build
```

## Key Architectural Decisions

- PrimeVue runs in `unstyled: true` mode — all styling owned by Tailwind via PT
- No Pinia — theme state in composable, page state is local `ref`/`reactive`
- Each page directly calls `useSupabaseClient()` — no centralized service/store layer
- SSR-compatible by default (Nuxt 3); avoid `window`/`document` outside `onMounted`
- `supabase: { redirect: false }` — auth flow is fully manual, no automatic redirects
