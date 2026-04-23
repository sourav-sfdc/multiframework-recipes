# CLAUDE.md

Project-specific guidance for Claude Code. For the full developer guide (architecture, recipes, conventions), read `AGENT.md` — this file points to it rather than duplicating it.

## What this repo is

A **Salesforce DX project** that hosts a **React 19 app** of sample recipes ("lwc-recipes for React"). The app is deployed as a Salesforce UI bundle. The intersection of Salesforce and a modern JS framework is the point; pure React or pure Salesforce material does not belong here.

## Two package.json files — know which is which

- **Root `package.json`** — SFDX / Prettier / Husky tooling only. `@joint/plus` currently lives here (see below).
- **`force-app/main/react-recipes/uiBundles/reactRecipes/package.json`** — the React app. Almost all dependency and build work happens here.

Read `AGENT.md` §"Project Structure" before making structural changes.

## JointJS+ is installed

- `@joint/plus` 4.2.3 is declared in the **root** `package.json`.
- Fetched from the private registry `https://npm.jointjs.com`; `.npmrc` authenticates via `JOINTJS_NPM_TOKEN` (env var — not committed). `npm install` will fail silently-ish without the token.
- **No JointJS+ code has been written into the app yet.** Installing it at the root means Vite inside the React app will not currently resolve it — the package needs to either be installed again in the React app's `package.json` or aliased in `vite.config.ts`. Confirm the preferred approach with the user before wiring it up.
- Detailed integration guidance (React 19 wrapper pattern, cleanup rules, `PaperScroller`, CSP, dynamic import for bundle size) is in the **`jointjs-plus` skill** at `.claude/skills/jointjs-plus/SKILL.md`. Invoke that skill when touching diagram code.

## Commands (cheat sheet)

The React app is the interesting target; from `force-app/main/react-recipes/uiBundles/reactRecipes/`:

```bash
npm run dev                # Vite dev server
npm run build              # tsc -b && vite build — must pass before finishing
npm run lint               # ESLint 9 flat config — must pass before finishing
npm test                   # Vitest
npm run graphql:schema     # Fetch schema from connected org
npm run graphql:codegen    # Regenerate TS types from .graphql files
```

Deploy (from repo root):

```bash
sf project deploy start --source-dir force-app/main/react-recipes/uiBundles/reactRecipes --target-org <alias>
```

## Before you touch code

- If the task is about data / GraphQL / SLDS / recipes: **`AGENT.md`** is the source of truth, especially §"Critical Rule: Recipe Code ≠ Production Code" (inline queries in recipes — do not extract to `src/api/`).
- If the task is about diagrams / `@joint/plus`: invoke the **`jointjs-plus`** skill.
- Recipe style lives in `.airules/RECIPE-STYLE-GUIDE.md`.

## Adding a new category page

Four places — missing any of them leaves the page reachable by URL but invisible:

1. `src/routes.tsx` — register the route
2. `src/components/app/Navbar.tsx` — add to `navItems`
3. `src/pages/Home.tsx` — add to `categories`
4. `src/recipeRegistry.ts` — one entry per recipe (drives home counts + search)

## House rules (quick reminders)

- Recipes must be **self-contained and readable top-to-bottom**. Inline the query/mutation/shape the recipe teaches — do not import it from `src/api/`.
- Explicit types over `Awaited<ReturnType<...>>` chains. `err instanceof Error`, never `(err as Error)`.
- One styling system per recipe (SLDS **or** Tailwind/shadcn, not both).
- Every "hello" recipe must involve the Salesforce platform. If it would work identically in a plain React tutorial, it doesn't belong here.

## What Claude should NOT do without asking

- Don't move `@joint/plus` between `package.json` files — confirm placement first.
- Don't commit `schema.graphql` (it's generated per-org) or any secrets related to `JOINTJS_NPM_TOKEN`.
- Don't create CLAUDE.md files in subdirectories without reason — `AGENT.md` is the comprehensive guide and this file is the pointer.
