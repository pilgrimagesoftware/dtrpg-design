# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

This repo holds design assets for the DriveThruRPG desktop app (Libri): app icons and standalone HTML/JS UI
prototypes. It has no build system, package manager, or test suite - everything runs directly in a browser.
It is a leaf design repo, separate from the `dtrpg` code meta-repo (see `../CLAUDE.md` / `../AGENTS.md` for
that project's submodule structure and conventions).

## Running a prototype

Prototypes load React, ReactDOM, and Babel standalone from `unpkg.com` and transpile JSX in the browser
at load time - there is no build step. To view one, open its `.html` file directly in a browser or serve
the directory statically:

```bash
cd claude-1 && python3 -m http.server 8000
# then open http://localhost:8000/Libri.html
```

Every prototype uses classic scripts, not ES modules, so all files share one global scope. A top-level
`const` with the same name in two files is a redeclaration error that kills the whole page, and the error
surfaces only in the browser console. When adding a file, give its locals distinct names (the existing
files alias hooks per file, e.g. `useS`, `useI`, `useSh`) and load it after anything it depends on.

## Architecture: `claude-1/` prototype ("Libri")

A single-page mock of the Libri library UI, split into plain `<script type="text/babel">` files loaded in
a fixed order from `Libri.html` (order matters - later files depend on components/hooks
defined earlier, there are no ES modules):

1. `data.js` - static catalog data (`CATALOG`) and format helpers (`fmt`), plain JS (not JSX).
2. `tweaks-panel.jsx` - `useTweaks` hook and the floating "Tweaks" debug panel used to live-edit theme,
   density, and typography without touching code.
3. `icons.jsx` - inline SVG icon components.
4. `covers.jsx` - book cover rendering (cover styles: classic/modern/minimal).
5. `catalog.jsx` - grid/list rendering of book entries, grouping and sorting.
6. `detail.jsx` - detail/inspector pane for a selected book.
7. `chrome.jsx` - window chrome: `AppWindow`, `Sidebar`, `Toolbar`.
8. `app.jsx` - root `App` component: owns all state (filters, search, layout, tweaks) and composes the
   components above. Persists view state and per-book download-status overrides to `localStorage` under
   the `folio:view` and `folio:status` keys.

Theming works by setting `data-theme`, `data-density`, `data-cover-style` attributes and `--accent-h` /
`--serif` CSS custom properties on `<html>`; `styles.css` reads those to switch appearance. New themes,
densities, or cover styles must be wired in three places: the `TWEAK_DEFAULTS`/chip arrays in `app.jsx`,
the `data-*` attribute consumer in `styles.css`, and any component that branches on the tweak value (e.g.
`covers.jsx` for cover style).

Since prototypes are throwaway design exploration, prefer editing in place over introducing a build
toolchain unless asked.

## Architecture: `claude-2/` prototype ("Libri v2")

The proposed target design, covering capabilities `claude-1` does not model: multi-root storage, tags,
archive browsing, AI summaries, agent/MCP settings, and an insights view. Treat `claude-1` as a record of
the design the shipped app was built from, and `claude-2` as the proposal it is measured against.

Load order from `Libri.html`: `data.js`, `icons.jsx`, `covers.jsx`, `library.jsx`, `inspector.jsx`,
`sheets.jsx`, `insights.jsx`, `shell.jsx`, `settings.jsx`, `app.jsx`. `settings.jsx` reuses `TitleBar` and
`SideRow` from `shell.jsx`, which is why it loads after it.

`app.jsx` owns all state and drives a screen switcher rendered above the window frame. That switcher is
prototype scaffolding, not a design element - each entry presets state (layout, filters, open sheet) so a
given screen lands on something worth looking at, via the `SCREENS` array and the effect keyed on
`screen`. State is deliberately not persisted to `localStorage`, unlike `claude-1`.

Theming matches `claude-1`: `data-theme`, `data-density`, `data-cover-style` and `data-chrome` attributes
on `<html>`, read by `styles.css`. Two additions worth knowing:

- Status colors (`--ok`, `--warn`, `--err`, `--cloud`) sit outside the theme blocks on purpose, so a theme
  cannot make a failed download look healthy. Keep new semantic colors there rather than per-theme.
- `data-chrome="win"` restyles the title bar for Windows and Linux (caption buttons right, in-window menu
  bar) using the same markup as macOS. Add platform chrome differences there rather than branching in JSX.

Aggregates for the insights view live in `AGG` in `data.js` and stand in for SQL the real app would run.
Charts are hand-rolled inline SVG; there is no chart dependency to add.

There is no automated check in this repo, but the parse and global-collision hazards are mechanical. To
verify a change without adding a package manager, fetch Babel standalone to a temp dir and transpile each
`.jsx` with it, and scan for top-level declarations that appear in more than one file.

## App icons

`app-icons/` holds the generated Libri app icon in each platform format (`.svg` source, `.png`, `.icns`,
`.ico`). Regenerate all formats from the `.svg` source if it changes - do not hand-edit the binary formats.
