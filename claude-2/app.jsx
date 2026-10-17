/* Root component. Owns all state and composes the screens. The screen switcher above the
   window is prototype scaffolding, not part of the design. */

const { useState: useA, useEffect } = React;

const SCREENS = [
  { id: 'library', label: 'Library · list',
    note: 'Default view. New here: the <b>omnibox</b> with removable filter tokens, a <b>facet rail</b> whose counts come from the same query as the list, a <b>Where</b> column naming the storage root, inline <b>tags</b>, and a dashed-cloud glyph for OS <b>placeholders</b> (Blades in the Dark, DCC, The One Ring).' },
  { id: 'grid', label: 'Library · covers',
    note: 'Same data, cover-forward. Presentation is saved <b>per view</b>, so a collection can be a grid while All Titles stays a dense list - the Tweaks panel from the first prototype promoted into a real View Options popover.' },
  { id: 'inspector', label: 'Inspector · contents',
    note: 'The <b>Contents</b> tab lists the inside of an archive from its central directory and previews a single entry without extracting anything. Goal 9, widened past the current zip-only popover.' },
  { id: 'summary', label: 'Inspector · summary',
    note: 'The <b>Summary</b> tab. Opt-in per title, cached, provenance shown (model, date, tokens), and the extracted themes feed the search index so "gothic horror" finds a title that never says it.' },
  { id: 'download', label: 'Download sheet',
    note: 'Goal 5. Pick <b>which files</b> (partial downloads) and <b>which location</b>, with the space check run against the chosen root. Optionally turn the choice into a standing placement rule.' },
  { id: 'smart', label: 'Smart collection',
    note: 'A smart collection is a <b>saved query</b> in the same predicate language as the omnibox, so "search then save" and "build a rule" converge. Live match count; optional symlink mirror on disk.' },
  { id: 'upgrade', label: 'Upgrade a collection',
    note: 'Manual collections already <b>are</b> DriveThruRPG collections, synced live, no separate local model. "Upgrade" seeds a smart collection whose first rule is <b>collection: Thursday Game</b> - the server membership becomes one predicate among others, so the DTRPG list keeps syncing untouched while everything added on top stays local.' },
  { id: 'insights', label: 'Insights',
    note: 'Goal 12. Aggregates from the local index, so it works offline. Inline SVG only - no chart dependency.' },
  { id: 'empty', label: 'Empty state',
    note: 'No matches. The recovery offered is to clear a token or save the search, not a dead end.' },
  { id: 'loading', label: 'Loading state',
    note: 'Row-shaped skeletons while the first page resolves, so the layout does not jump when data lands.' },
  { id: 'settings-appearance', label: 'Settings · Appearance',
    note: 'Goal 7. Themes become <b>data</b> - TOML files read from a themes folder, hot-reloaded, importable - instead of a closed Rust enum. Semantic state colors stay fixed so a theme cannot make an error look fine.' },
  { id: 'settings-storage', label: 'Settings · Storage',
    note: 'Goal 5. Many roots, each with capacity, plus <b>placement rules</b> by publisher, collection, or size so downloads route themselves.' },
  { id: 'settings-native', label: 'Settings · Native',
    note: 'Goal 6. A capability matrix drives the UI: Libri hides what the platform cannot do rather than faking it. Tags project to Finder and xattrs; the index stays the source of truth.' },
  { id: 'settings-agent', label: 'Settings · Agent & MCP',
    note: 'Goal 10. Off by default, loopback only, three <b>scopes</b> graded by consequence, per-tool visibility, and an audit log. Read is free; download spends bandwidth and money.' },
  { id: 'win', label: 'Windows / Linux chrome',
    note: 'Goal 1. Same layout, platform-appropriate chrome: caption buttons right, in-window menu bar (macOS uses the system bar), Ctrl instead of Cmd.' },
];

const DEFAULT_OPTS = {
  density: 'comfortable',
  coverStyle: 'classic',
  groupBy: 'none',
  cols: { pub: true, sys: true, pages: true, size: true, added: true, loc: true, tags: false },
};

const App = () => {
  const [screen, setScreen] = useA('library');
  const [theme, setTheme] = useA('parchment');
  const [opts, setOpts] = useA(DEFAULT_OPTS);
  const [layout, setLayout] = useA('list');
  const [view, setView] = useA({ id: 'all', label: 'All Titles' });
  const [selected, setSelected] = useA(CATALOG[0]);
  const [tokens, setTokens] = useA([]);
  const [text, setText] = useA('');
  const [facetsOpen, setFacetsOpen] = useA(false);
  const [selMode, setSelMode] = useA(false);
  const [sheet, setSheet] = useA(null);
  const [peek, setPeek] = useA(null);
  const [settingsPage, setSettingsPage] = useA('appearance');
  const [dropTargetId, setDropTargetId] = useA(null);

  /* Preset each screen so the switcher lands on something worth looking at. */
  useEffect(() => {
    setSheet(null); setPeek(null);
    if (screen === 'library') { setLayout('list'); setFacetsOpen(true); setSelected(CATALOG[0]); setTokens([]); }
    if (screen === 'grid') { setLayout('grid'); setFacetsOpen(true); setSelected(null); setOpts(o => ({ ...o, groupBy: 'publisher' })); }
    if (screen === 'inspector') { setLayout('list'); setFacetsOpen(false); setSelected(CATALOG[0]); }
    if (screen === 'summary') { setLayout('list'); setFacetsOpen(false); setSelected(CATALOG[2]); }
    if (screen === 'download') { setLayout('list'); setFacetsOpen(false); setSelected(CATALOG[0]); setSheet({ kind: 'dl', books: [CATALOG[0]] }); }
    if (screen === 'smart') { setSheet({ kind: 'smart', seed: COLLECTIONS[4] }); }
    if (screen === 'upgrade') { setFacetsOpen(false); setSelected(null); setSheet({ kind: 'smart', seed: {
      name: 'Thursday Game - Refined', rules: [{ f: 'collection', o: 'is', v: 'Thursday Game' }, { f: 'tag', o: 'not', v: 'Running' }],
    } }); }
    if (screen === 'insights') { setView({ id: 'insights', label: 'Insights' }); }
    if (screen === 'empty') { setTokens([{ f: 'system', v: 'Traveller' }, { f: 'tag', v: 'Running' }]); setFacetsOpen(true); setSelected(null); }
    if (screen === 'loading') { setFacetsOpen(true); setSelected(null); }
    if (screen === 'win') { setLayout('thumbs'); setFacetsOpen(false); setSelected(CATALOG[3]); }
    if (screen !== 'insights' && view.id === 'insights') setView({ id: 'all', label: 'All Titles' });
    if (screen !== 'grid') setOpts(o => ({ ...o, groupBy: 'none' }));
  }, [screen]);

  useEffect(() => {
    const r = document.documentElement;
    r.dataset.theme = theme;
    r.dataset.density = opts.density;
    r.dataset.coverStyle = opts.coverStyle;
    r.dataset.chrome = screen === 'win' ? 'win' : 'mac';
  }, [theme, opts.density, opts.coverStyle, screen]);

  /* Filtering stands in for the FTS + facet query the real app runs in SQL. */
  const books = React.useMemo(() => {
    if (screen === 'empty') return [];
    let out = CATALOG;
    if (view.id === 'local') out = out.filter(b => b.state === 'downloaded');
    if (view.id === 'cloud') out = out.filter(b => b.state === 'cloud');
    if (view.id === 'attn') out = out.filter(b => b.state === 'failed');
    if (view.id === 'recent') out = out.slice(0, 8);
    if (view.id.startsWith('pub:')) out = out.filter(b => b.pub === view.id.slice(4));
    if (view.id.startsWith('tag:')) out = out.filter(b => b.tags.includes(view.id.slice(4)));
    tokens.forEach(t => {
      if (t.f === 'state') out = out.filter(b => b.state === t.v);
      if (t.f === 'system') out = out.filter(b => b.sys === t.v);
      if (t.f === 'kind') out = out.filter(b => b.kind === t.v);
      if (t.f === 'root') out = out.filter(b => b.root === t.v);
      if (t.f === 'tag') out = out.filter(b => b.tags.includes(t.v));
      if (t.f === 'publisher') out = out.filter(b => b.pub === t.v);
    });
    if (text.trim()) {
      const q = text.toLowerCase();
      out = out.filter(b => (b.title + ' ' + b.pub + ' ' + b.sys + ' ' + b.desc).toLowerCase().includes(q));
    }
    return out;
  }, [view, tokens, text, screen]);

  const current = SCREENS.find(s => s.id === screen);
  const isSettings = screen.startsWith('settings-');
  const chrome = screen === 'win' ? 'win' : 'mac';

  useEffect(() => {
    if (isSettings) setSettingsPage(screen.replace('settings-', ''));
  }, [screen]);

  return (
    <div className="desktop">
      <div className="screen-switch">
        {SCREENS.map(s => (
          <button key={s.id} aria-pressed={screen === s.id} onClick={() => setScreen(s.id)}>{s.label}</button>
        ))}
      </div>
      <div className="screen-note" dangerouslySetInnerHTML={{ __html: current.note }} />

      {isSettings ? (
        <SettingsWindow chrome={chrome} theme={theme} setTheme={setTheme}
                        page={settingsPage} setPage={setSettingsPage} />
      ) : (
        <div className="window" style={{ position: 'relative' }}>
          <TitleBar chrome={chrome} title="Libri - All Titles" />
          <div className="body">
            <Sidebar view={view} setView={setView} dropTargetId={dropTargetId}
                     onNewCollection={() => setSheet({ kind: 'smart', seed: null })}
                     onEditSmart={c => setSheet({ kind: 'smart', seed: c })}
                     onUpgradeSmart={c => setSheet({ kind: 'smart', seed: {
                       name: c.name + ' - Refined',
                       rules: [{ f: 'collection', o: 'is', v: c.name }],
                     } })} />
            <div className="main">
              {view.id === 'insights' ? (
                <>
                  <div className="toolbar">
                    <div className="view-title">Insights<em>{CATALOG.length} titles analyzed</em></div>
                    <div style={{ flex: 1 }} />
                    <button className="tb-btn"><Icon.refresh s={14} />Recompute</button>
                    <button className="tb-btn"><Icon.external s={14} />Export CSV</button>
                  </div>
                  <Insights />
                </>
              ) : (
                <>
                  <Toolbar view={view} count={books.length} opts={opts} setOpts={setOpts}
                           layout={layout} setLayout={setLayout} tokens={tokens} setTokens={setTokens}
                           text={text} setText={setText} facetsOpen={facetsOpen} setFacetsOpen={setFacetsOpen}
                           selMode={selMode} setSelMode={setSelMode} />
                  <div className="content-split">
                    {facetsOpen && <FacetRail tokens={tokens} setTokens={setTokens} />}
                    <Catalog books={books} layout={layout} opts={opts} selected={selected}
                             loading={screen === 'loading'}
                             onSelect={setSelected}
                             onDragStart={() => setDropTargetId('c1')} />
                    {selected && (
                      <Inspector book={selected} onClose={() => setSelected(null)}
                                 onDownload={b => setSheet({ kind: 'dl', books: [b] })}
                                 onPeek={n => setPeek(n.p ? n : { p: n.files?.[0]?.n || 'archive.zip', s: 4.2 })} />
                    )}
                  </div>
                </>
              )}
              <StatusBar count={books.length} agentOn
                         onActivity={() => {}} onAgent={() => setScreen('settings-agent')} />
            </div>
          </div>

          {sheet?.kind === 'dl' && <DownloadSheet books={sheet.books} onClose={() => setSheet(null)} />}
          {sheet?.kind === 'smart' && <SmartCollectionSheet seed={sheet.seed} onClose={() => setSheet(null)} />}
          {peek && <PeekSheet node={peek} onClose={() => setPeek(null)} />}
        </div>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
