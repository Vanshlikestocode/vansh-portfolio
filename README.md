# V — Portfolio

Personal site of Vansh Apurva Dave (V): AI Engineer × Product Builder × Full-Stack Developer.

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Motion · Lenis · Lucide.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (type-checks too)
npm run lint
```

## Editing content

Everything personal or project-related lives in `data/`. Components read from these
files, so adding or changing work never means touching layout code.

| File | What it holds |
| --- | --- |
| `data/site.ts` | Name, roles, contact links (GitHub, LinkedIn, email, résumé), education, certification. Set a link to `null` to hide its button. |
| `data/projects.ts` | Every project: status, category, filters, problem/solution, features (`done` / `building` / `planned`), technologies, metrics, disclaimers, architecture, links, preview type. `flagship: true` puts a project in the big stacked panels. |
| `data/lab.ts` | Smaller builds and experiments, Lab domain blurbs, and the dated build log. |
| `data/stack.ts` | Technologies, their groups and the hover descriptions. "Used in" and the connection lines are computed from project data. |
| `data/journey.ts` | Timeline steps. Leave a date out rather than guessing. |

### Add a project

1. Append an object to `projects` in `data/projects.ts`.
2. Pick a `preview` (`components/previews/`) — or add a new preview component and register it in
   `components/previews/Preview.tsx` and `components/work/ProjectGlyph.tsx`.
3. It appears in the index, the filters, the stack graph, the sitemap and at `/work/<slug>` automatically.

### Content rules this site follows

- No invented metrics, users, companies, awards or links. Numbers are product facts or results the
  project itself reported, with a `disclaimer` where the context matters (see SMG and churn).
- Demo visuals (SMG risk engine, AI-SRE incident, sales dashboard, etc.) are labelled as demo / sample
  data on screen.
- The GitHub section uses live public data (fetched at build time, revalidated daily) and shows an
  explicit "unavailable" state if GitHub can't be reached — never placeholder numbers.

## Configuration

| Env var | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, sitemap and Open Graph (e.g. `https://vansh.dev`). On Vercel the production URL is picked up automatically. |
| `GITHUB_TOKEN` | Optional. Authenticates GitHub API calls to avoid the anonymous rate limit during builds. |

## Structure

```
app/                 layout, page, /work/[slug], OG image, icons, robots, sitemap, manifest
components/
  layout/            Nav, SystemStatus, Footer, Boot screen, Providers
  effects/           Cursor, SmoothScroll (Lenis), Backdrop (grid + noise), EasterEggs
  hero/              Hero + NeuralField canvas
  sections/          Intro, Work, HowIBuild, Stack, Journey, GitHub, CurrentlyBuilding, About, Contact
  work/              FeaturedStack, ProjectIndex, cards, glyphs, modal, case-study detail, architecture
  previews/          One animated preview per project (QueueLess phone, SMG risk engine, …)
  stack/ lab/ ui/    Stack graph, Lab modules + modal, shared primitives
data/                All content (see above)
lib/                 hooks, tiny global store, GitHub fetcher, utils
```

## Motion, performance and accessibility

- Boot screen is pure CSS (~1.7 s), shown once per browser; returning and reduced-motion visitors skip it.
- Animations use transform/opacity. Canvas and looping CSS animations pause off-screen and in hidden tabs.
- The custom cursor, smooth scrolling, magnetic buttons and tilt only run on devices with a fine pointer.
- `prefers-reduced-motion` removes the choreography (Motion `reducedMotion="user"`, CSS overrides, static
  canvas frame, previews rest on their most informative frame).
- Keyboard: skip link, visible focus rings, focus-trapped modals that close with Esc or the back button.

## Easter eggs

There are a few. The console has a hint.

## Deploy

Any Next.js host works. On Vercel: import the repo, optionally set `NEXT_PUBLIC_SITE_URL` and
`GITHUB_TOKEN`, deploy.
