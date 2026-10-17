/* Settings window. Four pages carry the new goals: Storage (multi-root), Appearance
   (data-driven themes), Agent (MCP), Native Integration (per-OS capabilities). */

const { useState: useSe } = React;

const THEME_DEFS = [
  { id: 'parchment', name: 'Parchment', origin: 'built-in', bg: '#FAF7F0', surface: '#F2ECDF', text: '#26211A', accent: '#A8622F' },
  { id: 'slate', name: 'Slate', origin: 'built-in', bg: '#FAFBFC', surface: '#EEF1F4', text: '#1B2530', accent: '#A8622F' },
  { id: 'sage', name: 'Sage', origin: 'built-in', bg: '#F8F9F4', surface: '#EDF0E7', text: '#23271F', accent: '#A8622F' },
  { id: 'ink', name: 'Ink', origin: 'built-in', bg: '#16130D', surface: '#211D15', text: '#ECE4D3', accent: '#D99A5B' },
  { id: 'moss', name: 'Moss', origin: 'built-in', bg: '#12150F', surface: '#1D2218', text: '#E4E9D8', accent: '#C9CE7E' },
  { id: 'rosewood', name: 'Rosewood', origin: 'built-in', bg: '#1A1214', surface: '#261B1F', text: '#EFE0E2', accent: '#E0959E' },
  { id: 'custom-1', name: 'Dracula Night', origin: 'imported', bg: '#282A36', surface: '#343746', text: '#F8F8F2', accent: '#BD93F9' },
];

const SetNav = ({ page, setPage }) => {
  const items = [
    ['account', 'Account', <Icon.book s={14} />],
    ['appearance', 'Appearance', <Icon.palette s={14} />],
    ['storage', 'Storage', <Icon.drive s={14} />],
    ['openers', 'File Openers', <Icon.external s={14} />],
    ['native', 'Native Integration', <Icon.tag s={14} />],
    ['agent', 'Agent & MCP', <Icon.robot s={14} />],
    ['advanced', 'Advanced', <Icon.gear s={14} />],
  ];
  return (
    <div className="set-nav">
      {items.map(([id, label, ico]) => (
        <SideRow key={id} icon={ico} label={label} active={page === id} onClick={() => setPage(id)} />
      ))}
    </div>
  );
};

const ThemeCard = ({ t, active, onPick }) => (
  <button className="theme-card" aria-pressed={active} onClick={() => onPick(t.id)}>
    <div className="theme-prev" style={{ background: t.bg }}>
      <div className="tp-bar" style={{ background: t.surface }}>
        <i style={{ background: '#EC6A5E' }} /><i style={{ background: '#F4BF4F' }} /><i style={{ background: '#61C554' }} />
      </div>
      <div className="tp-main">
        <div className="tp-side" style={{ background: t.surface }} />
        <div className="tp-rows">
          <i style={{ background: t.accent, width: '58%' }} />
          <i style={{ background: t.text, opacity: 0.72, width: '82%' }} />
          <i style={{ background: t.text, opacity: 0.48, width: '68%' }} />
          <i style={{ background: t.text, opacity: 0.32, width: '76%' }} />
        </div>
      </div>
    </div>
    <div className="tc-foot">
      <span className="nm">{t.name}</span>
      {t.origin !== 'built-in' && <span className="tag">{t.origin}</span>}
      {active && <Icon.check s={13} />}
    </div>
  </button>
);

const AppearancePage = ({ theme, setTheme }) => (
  <div className="set-pane">
    <h1>Appearance</h1>
    <p className="lead">
      Themes are plain TOML files. Libri ships six, reads any others it finds in your themes folder,
      and reloads them without a restart.
    </p>

    <div className="sect">
      <h3>Themes<span className="rule" /></h3>
      <div className="theme-gal">
        {THEME_DEFS.map(t => <ThemeCard key={t.id} t={t} active={theme === t.id} onPick={setTheme} />)}
      </div>
      <div style={{ display: 'flex', gap: 7, marginTop: 13 }}>
        <button className="btn sm"><Icon.plus s={12} /> Duplicate &amp; edit</button>
        <button className="btn sm">Import...</button>
        <button className="btn sm ghost">Reveal themes folder</button>
        <button className="btn sm ghost"><Icon.refresh s={12} /> Reload</button>
      </div>
    </div>

    <div className="sect">
      <h3>Theme file<span className="rule" /></h3>
      <pre className="code">{`# ~/.config/libri/themes/dracula-night.toml
[meta]
name    = "Dracula Night"
author  = "you"
variant = "dark"

[color]
bg        = "#282A36"   # window background
surface   = "#343746"   # sidebar, toolbar, inspector
text      = "#F8F8F2"
text-2    = "#BFC0CB"
line      = "#3C3F51"
accent    = "#BD93F9"
accent-on = "#282A36"

[color.state]        # semantic, never themed away
ok = "#50FA7B"
warn = "#FFB86C"
error = "#FF5555"

[font]
body  = "Inter"
serif = "Spectral"
mono  = "IBM Plex Mono"`}</pre>
      <p style={{ margin: '7px 0 0', fontSize: 11, color: 'var(--text-3)', lineHeight: 1.5 }}>
        Unknown keys are ignored and missing keys fall back to the built-in light or dark base, so a theme
        written for an older version still loads.
      </p>
    </div>

    <div className="sect">
      <h3>Typography &amp; density<span className="rule" /></h3>
      <div className="fieldset">
        {[['Body font', 'Interface text', 'Inter'], ['Serif font', 'Titles and headings', 'Spectral'],
          ['Monospace', 'Paths, IDs, file names', 'IBM Plex Mono']].map(([n, h, v]) => (
          <div className="field" key={n}>
            <div className="tx"><div className="nm">{n}</div><div className="hint">{h}</div></div>
            <div className="ctl"><button className="btn sm">{v} ▾</button></div>
          </div>
        ))}
        <div className="field">
          <div className="tx"><div className="nm">Text size</div><div className="hint">Scales the whole interface</div></div>
          <div className="ctl">
            <button className="btn sm">−</button>
            <span style={{ margin: '0 9px', fontVariantNumeric: 'tabular-nums' }}>100%</span>
            <button className="btn sm">+</button>
          </div>
        </div>
        <div className="field">
          <div className="tx">
            <div className="nm">Density</div>
            <div className="hint">Row height and cover size. Can be overridden per view.</div>
          </div>
          <div className="ctl">
            <div className="chips">
              <button className="chip" aria-pressed>comfortable</button>
              <button className="chip">compact</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StoragePage = () => (
  <div className="set-pane">
    <h1>Storage</h1>
    <p className="lead">
      Add as many locations as you like. Placement rules decide where a download goes so you are not asked
      every time.
    </p>

    <div className="sect">
      <h3>Locations<span className="rule" /></h3>
      {ROOTS.map(r => {
        const pct = r.used / r.total;
        const mine = CATALOG.filter(b => b.root === r.id).length;
        return (
          <div className="dest" key={r.id} style={{ cursor: 'default' }}>
            <Icon.drive s={18} />
            <span style={{ minWidth: 0 }}>
              <span className="nm" style={{ display: 'block' }}>
                {r.name}
                {r.kind === 'cloud' && <span className="kind" style={{ marginLeft: 6 }}>cloud</span>}
                {r.kind === 'external' && <span className="kind" style={{ marginLeft: 6 }}>external</span>}
              </span>
              <span className="pth">{r.path}</span>
              <span className="free" style={{ display: 'block', marginTop: 2 }}>{mine} titles here</span>
            </span>
            <span className="rt">
              <span className="free">{fmt.size(r.total - r.used)} free of {fmt.size(r.total)}</span>
              <span className="cap lg"><i className={pct > 0.9 ? 'full' : pct > 0.75 ? 'hot' : ''} style={{ width: pct * 100 + '%' }} /></span>
            </span>
            <button className="btn sm ghost" style={{ marginLeft: 8 }}><Icon.dots s={13} /></button>
          </div>
        );
      })}
      <button className="btn sm" style={{ marginTop: 5 }}><Icon.plus s={12} /> Add location...</button>
    </div>

    <div className="sect">
      <h3>Placement rules<span className="rule" /></h3>
      <div className="fieldset">
        <div className="field">
          <div className="tx"><div className="nm">Default location</div>
            <div className="hint">Used when no rule matches</div></div>
          <div className="ctl"><button className="btn sm">Local Library ▾</button></div>
        </div>
        <div className="field">
          <div className="tx"><div className="nm">Paizo → Archive Vault</div>
            <div className="hint">Publisher rule · 1 title moved on next sync</div></div>
          <div className="ctl"><button className="btn sm ghost"><Icon.trash s={13} /></button></div>
        </div>
        <div className="field">
          <div className="tx"><div className="nm">"Thursday Game" → Local Library</div>
            <div className="hint">Collection rule · keeps the active game on fast local disk</div></div>
          <div className="ctl"><button className="btn sm ghost"><Icon.trash s={13} /></button></div>
        </div>
        <div className="field">
          <div className="tx"><div className="nm">Larger than 250 MB → Archive Vault</div>
            <div className="hint">Size rule</div></div>
          <div className="ctl"><button className="btn sm ghost"><Icon.trash s={13} /></button></div>
        </div>
      </div>
      <button className="btn sm"><Icon.plus s={12} /> Add rule...</button>
    </div>

    <div className="sect">
      <h3>Behavior<span className="rule" /></h3>
      <div className="fieldset">
        {[['Check free space before downloading', 'Refuse rather than fill a disk', true],
          ['Mirror collections as folders of symlinks', 'Browse collections in Finder or Explorer', true],
          ['Move files when a placement rule changes', 'Otherwise only new downloads follow the rule', false],
          ['Keep a manifest file in each location', 'Lets Libri recover its index if the database is lost', true]].map(([n, h, on]) => (
          <div className="field" key={n}>
            <div className="tx"><div className="nm">{n}</div><div className="hint">{h}</div></div>
            <div className="ctl"><button className="toggle" aria-pressed={on || undefined} /></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const NativePage = () => (
  <div className="set-pane">
    <h1>Native Integration</h1>
    <p className="lead">
      Libri keeps its own index as the source of truth and projects what it can into the operating
      system. Anything the platform cannot do is hidden rather than faked.
    </p>

    <div className="sect">
      <h3>What each platform supports<span className="rule" /></h3>
      <table className="caps-tbl">
        <thead><tr><th>Capability</th><th className="c">macOS</th><th className="c">Windows</th><th className="c">Linux</th></tr></thead>
        <tbody>
          {[['Tags written to the file system', 'yes', 'no', 'yes'],
            ['Cloud placeholder awareness', 'yes', 'yes', 'no'],
            ['Materialize an offloaded file', 'yes', 'yes', 'no'],
            ['Reveal in file manager', 'yes', 'yes', 'yes'],
            ['Open with a chosen app', 'yes', 'yes', 'yes'],
            ['File manager comment field', 'yes', 'no', 'no'],
            ['Thumbnail / Quick Look provider', 'yes', 'partial', 'partial'],
            ['Exclude from backup', 'yes', 'partial', 'no']].map(r => (
            <tr key={r[0]}>
              <td>{r[0]}</td>
              {r.slice(1).map((v, i) => (
                <td className="c" key={i}>
                  <span className={v === 'yes' ? 'yes' : v === 'partial' ? 'partial' : 'no'}>
                    {v === 'yes' ? '●' : v === 'partial' ? '◐' : '○'}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ margin: '9px 0 0', fontSize: 11, color: 'var(--text-3)', lineHeight: 1.5 }}>
        Running on macOS 26.1 - the middle and right columns are shown for reference.
      </p>
    </div>

    <div className="sect">
      <h3>Tags<span className="rule" /></h3>
      <div className="fieldset">
        {[['Write Libri tags to Finder tags', 'Tags appear in Finder and Spotlight', true],
          ['Read Finder tags back into Libri', 'Tags you add in Finder show up here', true],
          ['Reconcile on launch', 'Resolves anything changed while Libri was closed', true]].map(([n, h, on]) => (
          <div className="field" key={n}>
            <div className="tx"><div className="nm">{n}</div><div className="hint">{h}</div></div>
            <div className="ctl"><button className="toggle" aria-pressed={on || undefined} /></div>
          </div>
        ))}
      </div>
    </div>

    <div className="sect">
      <h3>Cloud placeholders<span className="rule" /></h3>
      <div className="fieldset">
        <div className="field">
          <div className="tx"><div className="nm">Treat placeholders as present</div>
            <div className="hint">An offloaded file counts as downloaded, shown with a dashed cloud</div></div>
          <div className="ctl"><button className="toggle" aria-pressed /></div>
        </div>
        <div className="field">
          <div className="tx"><div className="nm">Materialize before opening</div>
            <div className="hint">Pull the file down first instead of letting the reader stall</div></div>
          <div className="ctl"><button className="toggle" aria-pressed /></div>
        </div>
        <div className="field">
          <div className="tx"><div className="nm">Warn before an agent materializes files</div>
            <div className="hint">A bulk agent request could pull gigabytes over a metered link</div></div>
          <div className="ctl"><button className="toggle" aria-pressed /></div>
        </div>
      </div>
    </div>
  </div>
);

const TOOLS = [
  ['search_library', 'read', 'Full-text and faceted search', 'low'],
  ['get_item', 'read', 'Metadata and file list for one title', 'low'],
  ['list_collections', 'read', 'Collections and their contents', 'low'],
  ['get_item_summary', 'read', 'Cached summary; generates only if allowed', 'low'],
  ['get_library_stats', 'read', 'The same aggregates as Insights', 'low'],
  ['list_archive_entries', 'read', 'What is inside an archive', 'low'],
  ['create_collection', 'write', 'Make a manual or smart collection', 'med'],
  ['add_to_collection', 'write', 'Add or remove titles', 'med'],
  ['set_tags', 'write', 'Change tags on a title', 'med'],
  ['download_item', 'download', 'Fetch files to a storage root', 'high'],
  ['generate_summary', 'download', 'Calls your model provider and spends tokens', 'high'],
];

const AgentPage = () => {
  const [on, setOn] = useSe(true);
  const [scopes, setScopes] = useSe({ read: true, write: true, download: false });
  const allowed = TOOLS.filter(t => scopes[t[1]]).length;
  return (
    <div className="set-pane">
      <h1>Agent &amp; MCP</h1>
      <p className="lead">
        Libri can expose your library to agent tools over the Model Context Protocol. It is off until you
        turn it on, read-only until you widen it, and every call is logged.
      </p>

      <div className="sect">
        <div className="fieldset">
          <div className="field">
            <div className="tx">
              <div className="nm">Enable the MCP server</div>
              <div className="hint">
                {on ? <>Running · stdio and <code>127.0.0.1:7421</code> · {allowed} of {TOOLS.length} tools exposed</> : 'Not running'}
              </div>
            </div>
            <div className="ctl"><button className="toggle" aria-pressed={on || undefined} onClick={() => setOn(o => !o)} /></div>
          </div>
          <div className="field">
            <div className="tx"><div className="nm">Transport</div>
              <div className="hint">stdio for desktop agents; the local socket for anything else</div></div>
            <div className="ctl"><button className="btn sm">stdio + loopback ▾</button></div>
          </div>
          <div className="field">
            <div className="tx"><div className="nm">Bind address</div>
              <div className="hint">Loopback only. There is no option to expose this to a network.</div></div>
            <div className="ctl"><code style={{ fontSize: 11 }}>127.0.0.1:7421</code></div>
          </div>
        </div>
      </div>

      <div className="sect">
        <h3>Permission scopes<span className="rule" /></h3>
        {[['read', 'Read the library', 'Search, metadata, collections, stats, archive listings. Nothing changes and nothing is spent.', 'low'],
          ['write', 'Change the library', 'Create collections, add and remove titles, set tags. Reversible, but it edits your data.', 'med'],
          ['download', 'Download and spend', 'Fetch files and call your model provider. Uses bandwidth, disk, and money.', 'high']].map(([k, n, h, risk]) => (
          <div className="scope-row" key={k}>
            <div className="tx">
              <div className="nm">{n}<span className={'risk ' + risk}>{risk}</span></div>
              <div className="hint">{h}</div>
            </div>
            <button className="toggle" aria-pressed={scopes[k] || undefined}
                    onClick={() => setScopes(s => ({ ...s, [k]: !s[k] }))} />
          </div>
        ))}
      </div>

      <div className="sect">
        <h3>Tools<span className="rule" /></h3>
        <table className="caps-tbl">
          <thead><tr><th>Tool</th><th>Scope</th><th>What it does</th><th className="c">On</th></tr></thead>
          <tbody>
            {TOOLS.map(([name, scope, desc, risk]) => (
              <tr key={name} style={{ opacity: scopes[scope] ? 1 : 0.42 }}>
                <td><code style={{ fontSize: 11 }}>{name}</code></td>
                <td><span className={'risk ' + risk}>{scope}</span></td>
                <td style={{ color: 'var(--text-2)' }}>{desc}</td>
                <td className="c">{scopes[scope] ? <span className="yes">●</span> : <span className="no">○</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sect">
        <h3>Connect an agent<span className="rule" /></h3>
        <pre className="code">{`{
  "mcpServers": {
    "libri": {
      "command": "libri-mcp",
      "args": ["--scopes", "read,write"]
    }
  }
}`}</pre>
        <div style={{ display: 'flex', gap: 7, marginTop: 9 }}>
          <button className="btn sm">Copy config</button>
          <button className="btn sm ghost">Rotate token</button>
        </div>
      </div>

      <div className="sect">
        <h3>Recent activity<span className="rule" />
          <button className="btn sm ghost">Open full log</button>
        </h3>
        <div className="audit">
          {AUDIT.map((a, i) => (
            <div className="ar" key={i}>
              <span className="ts">{a.ts}</span>
              <span className="tool">{a.tool}</span>
              <span className="dsc">{a.dsc}</span>
              <span className={'risk ' + (a.scope === 'read' ? 'low' : a.scope === 'write' ? 'med' : 'high')}>{a.scope}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sect">
        <h3>Summaries<span className="rule" /></h3>
        <div className="fieldset">
          <div className="field">
            <div className="tx"><div className="nm">Provider</div>
              <div className="hint">Your key, stored in the system keychain. A local model works too.</div></div>
            <div className="ctl"><button className="btn sm">Anthropic ▾</button></div>
          </div>
          <div className="field">
            <div className="tx"><div className="nm">Model</div><div className="hint">Used for new summaries</div></div>
            <div className="ctl"><button className="btn sm">claude-sonnet-5 ▾</button></div>
          </div>
          <div className="field">
            <div className="tx"><div className="nm">Monthly token ceiling</div>
              <div className="hint">Summarizing stops when this is reached · 18.4k of 500k used</div></div>
            <div className="ctl"><button className="btn sm">500,000 ▾</button></div>
          </div>
          <div className="field">
            <div className="tx"><div className="nm">Summarize automatically on download</div>
              <div className="hint">Off by default - every summary costs tokens</div></div>
            <div className="ctl"><button className="toggle" /></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsWindow = ({ chrome, theme, setTheme, page, setPage }) => (
  <div className="window" style={{ height: 862 }}>
    <TitleBar chrome={chrome} title="Settings" />
    <div className="set-body">
      <SetNav page={page} setPage={setPage} />
      {page === 'appearance' && <AppearancePage theme={theme} setTheme={setTheme} />}
      {page === 'storage' && <StoragePage />}
      {page === 'native' && <NativePage />}
      {page === 'agent' && <AgentPage />}
      {!['appearance', 'storage', 'native', 'agent'].includes(page) && (
        <div className="set-pane">
          <h1>{page[0].toUpperCase() + page.slice(1)}</h1>
          <p className="lead">
            This page exists in the app today and is unchanged by this design. Pick Appearance, Storage,
            Native Integration, or Agent &amp; MCP to see what is new.
          </p>
        </div>
      )}
    </div>
  </div>
);

window.SettingsWindow = SettingsWindow;
