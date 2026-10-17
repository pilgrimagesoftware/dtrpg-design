# dtrpg-design

Design assets for the DriveThruRPG desktop app (Libri): app icons and HTML/JS UI prototypes. No build
system, package manager, or test suite - everything runs directly in a browser.

## Contents

- `app-icons/` - Libri app icon in each platform format (`.svg` source, `.png`, `.icns`, `.ico`)
- `claude-1/` - UI prototype for the Libri library view, the design the shipped app was built from
- `claude-2/` - proposed v2 design: multi-root storage, tags, archive browsing, summaries, agent/MCP
  settings, and an insights view. Use the screen switcher above the window frame to move between screens.

## Running a prototype

Prototypes load React, ReactDOM, and Babel standalone from `unpkg.com` and transpile JSX in the browser
at load time. Serve the directory statically and open the HTML file:

```bash
cd claude-1 && python3 -m http.server 8000
# then open http://localhost:8000/Libri.html
```

See `AGENTS.md` for prototype architecture and conventions.
