# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

This repo holds design assets for the DriveThruRPG desktop app (Libri): app icons and standalone HTML/JS UI
prototypes. It has no build system, package manager, or test suite — everything runs directly in a browser.
It is a leaf design repo, separate from the `dtrpg` code meta-repo (see `../CLAUDE.md` / `../AGENTS.md` for
that project's submodule structure and conventions).

## Running a prototype

Prototypes under `claude-1/` load React, ReactDOM, and Babel standalone from `unpkg.com` and transpile JSX
in the browser at load time — there is no build step. To view one, open its `.html` file directly in a
browser or serve the directory statically:

```bash
cd claude-1 && python3 -m http.server 8000
# then open http://localhost:8000/Libri.html
```

## Architecture: `claude-1/` prototype ("Libri")

A single-page mock of the Libri library UI, split into plain `<script type="text/babel">` files loaded in
a fixed order from `Libri.html` (order matters — later files depend on components/hooks
defined earlier, there are no ES modules):

1. `data.js` — static catalog data (`CATALOG`) and format helpers (`fmt`), plain JS (not JSX).
2. `tweaks-panel.jsx` — `useTweaks` hook and the floating "Tweaks" debug panel used to live-edit theme,
   density, and typography without touching code.
3. `icons.jsx` — inline SVG icon components.
4. `covers.jsx` — book cover rendering (cover styles: classic/modern/minimal).
5. `catalog.jsx` — grid/list rendering of book entries, grouping and sorting.
6. `detail.jsx` — detail/inspector pane for a selected book.
7. `chrome.jsx` — window chrome: `AppWindow`, `Sidebar`, `Toolbar`.
8. `app.jsx` — root `App` component: owns all state (filters, search, layout, tweaks) and composes the
   components above. Persists view state and per-book download-status overrides to `localStorage` under
   the `folio:view` and `folio:status` keys.

Theming works by setting `data-theme`, `data-density`, `data-cover-style` attributes and `--accent-h` /
`--serif` CSS custom properties on `<html>`; `styles.css` reads those to switch appearance. New themes,
densities, or cover styles must be wired in three places: the `TWEAK_DEFAULTS`/chip arrays in `app.jsx`,
the `data-*` attribute consumer in `styles.css`, and any component that branches on the tweak value (e.g.
`covers.jsx` for cover style).

Since prototypes are throwaway design exploration, prefer editing in place over introducing a build
toolchain unless asked.

## App icons

`app-icons/` holds the generated Libri app icon in each platform format (`.svg` source, `.png`, `.icns`,
`.ico`). Regenerate all formats from the `.svg` source if it changes — do not hand-edit the binary formats.
