# Libri v2 screenshots

Screenshots of the live Rust/GPUI app, kept here so docs, store pages, and
release notes can reference them without bloating the code repositories.

## Naming convention

- `<view>.png` — a single-screen view.
- `<view>-1.png`, `<view>-2.png`, … — a view that is taller than one screen and
  is captured in vertical chunks, ordered top-to-bottom.

## Inventory

| File | Screen / sub-view | Notes |
|---|---|---|
| `download-sheet.png` | Download sheet | Partial-download + location selection. |
| `empty-state.png` | Empty state | No matches, recovery options visible. |
| `insights-1.png` | Insights (top) | Library-at-a-glance + top charts. |
| `insights-2.png` | Insights (bottom) | Disk usage + lower charts. |
| `inspector-contents.png` | Inspector · Contents | Archive central-directory preview. |
| `inspector-files-1.png` | Inspector · Files (top) | File list for the selected title. |
| `inspector-files-2.png` | Inspector · Files (bottom) | Continuation of the file list. |
| `inspector-info.png` | Inspector · Info | Metadata + tags panel. |
| `inspector-summary.png` | Inspector · Summary | AI summary tab. |
| `library-covers-1.png` | Library · covers (top) | Cover grid, grouped by publisher. |
| `library-covers-2.png` | Library · covers (bottom) | More cover rows. |
| `library-list.png` | Library · list | Full list view with inspector open. |
| `loading-state.png` | Loading state | Skeleton rows while first page resolves. |
| `settings-agent-1.png` | Settings · Agent & MCP (top) | Server enable + transport + permission scopes. |
| `settings-agent-2.png` | Settings · Agent & MCP (bottom) | Tools table. |
| `settings-appearance-1.png` | Settings · Appearance (top) | Theme picker. |
| `settings-appearance-2.png` | Settings · Appearance (bottom) | Theme TOML preview + typography/density. |
| `settings-native.png` | Settings · Native | Capability matrix + tag projection. |
| `settings-storage.png` | Settings · Storage | Multi-root storage + placement rules. |
| `smart-collection.png` | Smart collection sheet | Saved-query editor. |
| `upgrade-a-collection.png` | Upgrade a collection sheet | Seed a smart collection from a manual one. |
| `windows-linux-chrome.png` | Windows / Linux chrome | Platform-appropriate caption buttons + menu bar. |

## Coverage of the v2 prototype screen switcher

The prototype in `../app.jsx` defines 15 screens (`SCREENS`). All 15 have at
least one screenshot:

- `library` → `library-list.png`
- `grid` → `library-covers-1.png` + `library-covers-2.png`
- `inspector` → `inspector-contents.png`
- `summary` → `inspector-summary.png`
- `download` → `download-sheet.png`
- `smart` → `smart-collection.png`
- `upgrade` → `upgrade-a-collection.png`
- `insights` → `insights-1.png` + `insights-2.png`
- `empty` → `empty-state.png`
- `loading` → `loading-state.png`
- `settings-appearance` → `settings-appearance-1.png` + `settings-appearance-2.png`
- `settings-storage` → `settings-storage.png`
- `settings-native` → `settings-native.png`
- `settings-agent` → `settings-agent-1.png` + `settings-agent-2.png`
- `win` → `windows-linux-chrome.png`

## Gaps / possible additions

These are sub-views or states not currently represented. Add them only if a
doc or store page needs them; the set above is considered complete for the
main v2 design narrative.

- **Settings pages not captured**: `Account`, `File Openers`, `Advanced`.
  The settings sidebar shows them, but no dedicated screenshot exists yet.
- **Dark-theme variant**: every screenshot is in the default light theme
  (Parchment). A matching dark-theme set may be wanted for store/dark-mode
  docs.
- **Tag management dialog**: add/edit tag color, rename, delete — not
  represented.
- **Archive / file peek sheet**: the `PeekSheet` popup from `sheets.jsx` is
  not shown.
- **Context menus**: right-click/catalog cell menus are not captured.
- **List view second chunk**: `library-list.png` is already very tall; verify
  it shows the full view before adding a `library-list-2.png`.
