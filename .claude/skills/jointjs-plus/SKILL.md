---
name: jointjs-plus
description: Use when building, reviewing, or debugging diagrams with JointJS+ (`@joint/plus`) in this repo. Triggers on imports from `@joint/plus` / `@joint/core`, usage of `dia.Graph`, `dia.Paper`, `ui.*` components (Stencil, Halo, Inspector, PaperScroller, Navigator, Toolbar, FreeTransform, Snaplines, Selection, Clipboard, Keyboard, CommandManager), `shapes.*`, `layout.*` (TreeLayout, ForceDirected, StackLayout, DirectedGraph), `elementTools.*`, or `format.*` import/export. Also triggers on questions about integrating JointJS+ with React 19 in a Salesforce UI bundle, wiring the private `@joint:registry` via `.npmrc`, or adding a diagram recipe.
---

# JointJS+ in multiframework-recipes

## What's installed

- **Package:** `@joint/plus` 4.2.3 (pulls `@joint/core` ~4.2.4 transitively)
- **Declared in:** root `package.json` under `dependencies`
- **Registry:** `.npmrc` at repo root points `@joint` scope to `https://npm.jointjs.com` and authenticates via `JOINTJS_NPM_TOKEN` env var (`//npm.jointjs.com/:_authToken=${JOINTJS_NPM_TOKEN}`)
- **CSS:** `@joint/plus/joint-plus.css` — must be imported once at the app level or any page that uses JointJS+ UI components
- **Types:** shipped with the package (`joint-plus.d.ts`)

The root-level install is **unusual** for this repo. All React app deps normally live in `force-app/main/react-recipes/uiBundles/reactRecipes/package.json`. Before wiring JointJS+ into the React app, confirm with the user whether `@joint/plus` should stay at root or move into the React app's `package.json`. Vite resolves from the nearest `node_modules`, so the current placement will not be picked up by the React app build without hoisting or a second install.

## Import patterns

Named imports from the flat top-level namespace:

```ts
import { dia, shapes, ui, layout, elementTools, format } from '@joint/plus';
import '@joint/plus/joint-plus.css';
```

Avoid `import * as joint from '@joint/plus'` — it pulls the full namespace and blocks tree-shaking.

Common sub-namespaces and what lives where:

| Namespace        | Used for                                                                    |
| ---------------- | --------------------------------------------------------------------------- |
| `dia`            | `Graph`, `Paper`, `Cell`, `Element`, `Link` — the core diagram model/view   |
| `shapes`         | Built-in shape libraries: `standard`, `bpmn2`, `uml`, `erd`, `chart`, `app` |
| `ui`             | Widgets: `Stencil`, `Halo`, `Inspector`, `PaperScroller`, `Toolbar`, etc.   |
| `layout`         | `TreeLayout`, `DirectedGraph`, `ForceDirected`, `StackLayoutView`, `GridLayout` |
| `elementTools`   | Per-element tools (Remove, Connect, Boundary, custom tools)                 |
| `format`         | Import/export: `toPNG`, `toSVG`, `Print`, Raster, GEXF                      |
| `storage`        | `Storage.sessionStorage` / `Storage.localStorage` helpers                   |
| `alg`            | Algorithms (e.g., Priority Queue, QuadTree)                                 |
| `graphUtils`     | Graph traversal helpers                                                     |

## React 19 integration

JointJS+ is imperative and owns its DOM subtree. The React wrapper pattern:

```tsx
import { useEffect, useRef } from 'react';
import { dia, shapes } from '@joint/plus';
import '@joint/plus/joint-plus.css';

export default function BasicDiagram() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const graph = new dia.Graph({}, { cellNamespace: shapes });
    const paper = new dia.Paper({
      el: hostRef.current!,
      model: graph,
      width: 800,
      height: 600,
      cellViewNamespace: shapes,
      gridSize: 10,
      interactive: { linkMove: false },
    });

    const rect = new shapes.standard.Rectangle();
    rect.position(100, 100).resize(140, 60);
    rect.attr('label/text', 'Hello JointJS+');
    rect.addTo(graph);

    return () => {
      paper.remove();      // removes paper DOM + listeners
      graph.clear();       // drop cells so they don't leak
    };
  }, []);

  return <div ref={hostRef} style={{ width: 800, height: 600 }} />;
}
```

Key rules for React integration:

- **Never** put JointJS+ cells or views in React state. Keep them in refs or module-scoped vars inside the effect. Re-renders must not recreate the paper.
- **Always** clean up in the effect's return: `paper.remove()` + `graph.clear()`. Otherwise a route change leaves orphaned SVG and event listeners in the DOM.
- The host `<div>` needs explicit dimensions (px or flex with `minHeight`) — an empty div collapses to height 0 and the paper renders invisibly.
- UI widgets (`Halo`, `Inspector`, `Stencil`, `PaperScroller`) also need `.remove()` on cleanup and often render into separate host elements.
- Under React 19 Strict Mode (dev only), effects run twice. The cleanup + re-init above is idempotent and handles this correctly; do **not** add a "has been initialized" guard — that's a sign the cleanup is wrong.

## Paper sizing and scrolling

- Use `ui.PaperScroller` when the diagram exceeds the viewport; do not wrap the paper in a scrolling div yourself. `PaperScroller` owns the scroll container and coordinates with `Navigator`, `Halo`, and `Selection`.
- When using `PaperScroller`, construct the paper with no `el`, then pass the paper to the scroller: `new ui.PaperScroller({ paper, autoResizePaper: true })`.

## Recipe conventions (if adding a JointJS+ recipe)

This repo's recipes are optimized for reading — everything the recipe teaches must be inline (see `AGENT.md` §"Critical Rule: Recipe Code ≠ Production Code"). For JointJS+ recipes:

- Put the `dia.Graph` / `dia.Paper` setup **inline in the recipe file** under `src/recipes/<category>/`. Do not extract it to `src/lib/` or similar.
- Shape definitions specific to the lesson should be **inline**. A reusable shape library that multiple recipes need can go under `src/components/recipe/` — but only after the second recipe needs it.
- Comment **platform/JointJS+-specific** behavior: why `paper.remove()` matters, how `cellNamespace` resolves custom shapes, how events like `element:pointerclick` fire. Do **not** comment `useEffect` / `useRef` basics.
- The host `<div>` sizing is a trap — always note it in the file header or with an inline comment.
- Import JointJS+ CSS at the top of the recipe file (or a shared CSS file) — the recipe must render correctly in isolation without relying on another recipe having loaded the CSS.

## Salesforce UI bundle considerations

- The app is bundled by Vite and deployed as a UI bundle (`dist/` → Salesforce). JointJS+ is ~MB-scale; prefer **dynamic `import()`** for recipes that use it so the rest of the app doesn't pay the bytes:

  ```ts
  const { dia, shapes } = await import('@joint/plus');
  await import('@joint/plus/joint-plus.css');
  ```

- Salesforce CSP can block inline `<style>` and some SVG patterns. JointJS+ renders SVG (fine) and injects a handful of `<style>` tags for UI widgets — verify widget-heavy recipes in a real org, not just `npm run dev`.
- JointJS+ has no external CDN calls, so no new entries are needed in `cspTrustedSites`.

## Commands

- Install (root, where `@joint/plus` currently lives): `JOINTJS_NPM_TOKEN=<token> npm install`
- The token must be set in the shell env before `npm install` — the `.npmrc` does not read from `.env` files.
- If Vite can't resolve `@joint/plus` from inside the React app, either (a) run `npm install @joint/plus` inside `force-app/main/react-recipes/uiBundles/reactRecipes/`, or (b) configure Vite's `resolve.alias` to point at the root `node_modules`. Option (a) is cleaner.

## Adding a new category to the React app (non-obvious)

The navbar, home tiles, and search are **hardcoded arrays**, not driven by `routes.tsx` `handle.showInNavigation` metadata. To make a new category visible, update **four** places:

1. `src/routes.tsx` — register the route
2. `src/components/app/Navbar.tsx` — add to the `navItems` array
3. `src/pages/Home.tsx` — add to the `categories` array
4. `src/recipeRegistry.ts` — add one entry per recipe (drives home page counts and search)

Missing any of steps 2–4 will leave the page reachable by URL but invisible in the UI.

## When NOT to use this skill

- Pure React / Salesforce data recipes that don't render diagrams.
- Questions about `@salesforce/sdk-data`, GraphQL codegen, or SLDS styling — those are covered by `AGENT.md`.
