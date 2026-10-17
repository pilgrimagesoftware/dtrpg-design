/* Window chrome: title bar, sidebar, toolbar (omnibox + view options), status bar. */

const { useState } = React;

/* Title bar adapts to platform: macOS traffic lights left, Windows/Linux caption right
   with an in-window menu bar (macOS puts menus in the system bar instead). */
const TitleBar = ({ chrome, title }) => (
  <div className="titlebar">
    <div className="lights"><i /><i /><i /></div>
    {chrome === 'win' && (
      <div className="menubar">
        {['File', 'Edit', 'View', 'Library', 'Window', 'Help'].map(m => <span key={m}>{m}</span>)}
      </div>
    )}
    <div className="spacer" />
    <div className="wtitle">{title}</div>
    <div className="spacer" />
  </div>
);

const SideSection = ({ title, action, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="side-sect">
      <button className="side-head" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <span className="chev"><Icon.chevDown s={11} /></span>
        {title}
        {action && (
          <span className="act" role="button" title={action.title}
                onClick={e => { e.stopPropagation(); action.onClick && action.onClick(); }}>
            <Icon.plus s={13} />
          </span>
        )}
      </button>
      {open && children}
    </div>
  );
};

const SideRow = ({ icon, label, count, active, onClick, dot, dropTarget, synced, onUpgrade }) => (
  <button className={'side-row' + (dropTarget ? ' drop-target' : '')}
          aria-current={active ? 'true' : undefined} onClick={onClick}>
    {dot ? <i className="tagdot" style={{ background: dot }} /> : <span className="ico">{icon}</span>}
    <span className="lbl">{label}</span>
    {synced && <span className="syncdot" title="Synced with DriveThruRPG"><Icon.cloud s={11} /></span>}
    {count != null && <span className="cnt">{count}</span>}
    {onUpgrade && (
      <span className="rowact" role="button" title="Upgrade to smart collection"
            onClick={e => { e.stopPropagation(); onUpgrade(); }}>
        <Icon.sparkle s={12} />
      </span>
    )}
  </button>
);

const Sidebar = ({ view, setView, onNewCollection, onEditSmart, onUpgradeSmart, dropTargetId }) => {
  const pubs = AGG.byPublisher();
  const tagCounts = TAGS.map(t => [t, CATALOG.filter(b => b.tags.includes(t.id)).length]);
  return (
    <div className="sidebar">
      <div className="scroll">
        <SideSection title="Library">
          <SideRow icon={<Icon.book s={14} />} label="All Titles" count={CATALOG.length}
                   active={view.id === 'all'} onClick={() => setView({ id: 'all', label: 'All Titles' })} />
          <SideRow icon={<Icon.clock s={14} />} label="Recently Added" count={8}
                   active={view.id === 'recent'} onClick={() => setView({ id: 'recent', label: 'Recently Added' })} />
          <SideRow icon={<Icon.dot s={10} />} label="On This Device" count={AGG.downloaded()}
                   active={view.id === 'local'} onClick={() => setView({ id: 'local', label: 'On This Device' })} />
          <SideRow icon={<Icon.cloud s={14} />} label="In the Cloud" count={4}
                   active={view.id === 'cloud'} onClick={() => setView({ id: 'cloud', label: 'In the Cloud' })} />
          <SideRow icon={<Icon.warn s={14} />} label="Needs Attention" count={1}
                   active={view.id === 'attn'} onClick={() => setView({ id: 'attn', label: 'Needs Attention' })} />
        </SideSection>

        <SideSection title="Collections" action={{ title: 'New collection', onClick: onNewCollection }}>
          {COLLECTIONS.map(c => (
            <SideRow key={c.id}
                     icon={c.kind === 'smart' ? <Icon.smart s={14} /> : <Icon.folder s={14} />}
                     label={c.name} count={c.count}
                     synced={c.kind !== 'smart' && c.synced}
                     dropTarget={dropTargetId === c.id}
                     active={view.id === c.id}
                     onClick={() => (c.kind === 'smart' && view.id === c.id)
                       ? onEditSmart(c)
                       : setView({ id: c.id, label: c.name, smart: c.kind === 'smart' })}
                     onUpgrade={c.kind !== 'smart' ? () => onUpgradeSmart(c) : undefined} />
          ))}
        </SideSection>

        <SideSection title="Tags" defaultOpen>
          {tagCounts.map(([t, n]) => (
            <SideRow key={t.id} dot={t.color} label={t.name} count={n}
                     active={view.id === 'tag:' + t.id}
                     onClick={() => setView({ id: 'tag:' + t.id, label: t.name })} />
          ))}
        </SideSection>

        <SideSection title="Publishers" defaultOpen={false}>
          {pubs.map(([p, n]) => (
            <SideRow key={p} icon={<Icon.folder s={14} />} label={p} count={n}
                     active={view.id === 'pub:' + p}
                     onClick={() => setView({ id: 'pub:' + p, label: p })} />
          ))}
        </SideSection>

        <SideSection title="Analysis">
          <SideRow icon={<Icon.chart s={14} />} label="Insights"
                   active={view.id === 'insights'} onClick={() => setView({ id: 'insights', label: 'Insights' })} />
        </SideSection>
      </div>
      <div className="foot">
        <span>{fmt.num(CATALOG.length)} titles · {fmt.size(AGG.totalSize())}</span>
        <span>{fmt.num(AGG.totalPages())} pages across 3 locations</span>
      </div>
    </div>
  );
};

/* The omnibox renders committed filters as removable tokens, so a typed query like
   `publisher:Paizo` becomes a chip instead of staying raw text. */
const Omnibox = ({ tokens, setTokens, text, setText }) => (
  <div className="omnibox">
    <Icon.search s={14} />
    {tokens.map((t, i) => (
      <span className="tok" key={i}>
        <b>{t.f}:</b>{t.v}
        <button onClick={() => setTokens(tokens.filter((_, j) => j !== i))} aria-label="Remove filter">
          <Icon.close s={9} />
        </button>
      </span>
    ))}
    <input value={text} onChange={e => setText(e.target.value)}
           placeholder={tokens.length ? '' : 'Search titles, publishers, tags, file names...'} />
  </div>
);

const ViewOptionsPop = ({ opts, set, onClose }) => (
  <div className="pop" style={{ right: 14, top: 48 }} role="dialog" aria-label="View options">
    <div className="grp">
      <h4>Density</h4>
      <div className="chips">
        {['comfortable', 'compact'].map(d => (
          <button key={d} className="chip" aria-pressed={opts.density === d}
                  onClick={() => set({ density: d })}>{d}</button>
        ))}
      </div>
    </div>
    <div className="grp">
      <h4>Cover style</h4>
      <div className="chips">
        {['classic', 'modern', 'minimal'].map(c => (
          <button key={c} className="chip" aria-pressed={opts.coverStyle === c}
                  onClick={() => set({ coverStyle: c })}>{c}</button>
        ))}
      </div>
    </div>
    <div className="grp">
      <h4>Group by</h4>
      <div className="chips">
        {['none', 'publisher', 'system', 'tag'].map(g => (
          <button key={g} className="chip" aria-pressed={opts.groupBy === g}
                  onClick={() => set({ groupBy: g })}>{g}</button>
        ))}
      </div>
    </div>
    <div className="grp">
      <h4>Columns</h4>
      {[['pub', 'Publisher'], ['sys', 'System'], ['pages', 'Pages'], ['size', 'Size'], ['added', 'Added'], ['loc', 'Location'], ['tags', 'Tags']].map(([k, l]) => (
        <div className="rowline" key={k}>
          <span className="lbl">{l}</span>
          <button className="toggle" aria-pressed={opts.cols[k]}
                  onClick={() => set({ cols: { ...opts.cols, [k]: !opts.cols[k] } })} />
        </div>
      ))}
    </div>
    <div className="grp" style={{ display: 'flex', gap: 7 }}>
      <button className="btn sm" onClick={onClose}>Done</button>
      <button className="btn sm ghost">Set as default for all views</button>
    </div>
    <p style={{ margin: '9px 0 0', fontSize: 10.5, color: 'var(--text-3)', lineHeight: 1.45 }}>
      Saved per view. "Thursday Game" can be a cover grid while "All Titles" stays a dense list.
    </p>
  </div>
);

const Toolbar = ({ view, count, opts, setOpts, layout, setLayout, tokens, setTokens,
                   text, setText, facetsOpen, setFacetsOpen, selMode, setSelMode }) => {
  const [popOpen, setPopOpen] = useState(false);
  return (
    <div className="toolbar" style={{ position: 'relative' }}>
      <div className="view-title">{view.label}<em>{fmt.num(count)} titles</em></div>
      <Omnibox tokens={tokens} setTokens={setTokens} text={text} setText={setText} />
      <button className="tb-btn" aria-pressed={facetsOpen} onClick={() => setFacetsOpen(f => !f)}>
        <Icon.filter s={14} />Filters{tokens.length > 0 && <span className="badge">{tokens.length}</span>}
      </button>
      <button className="tb-btn"><Icon.sort s={14} />Sort</button>
      <button className="tb-btn" aria-pressed={popOpen} onClick={() => setPopOpen(o => !o)} title="View options">
        <Icon.sliders s={14} />
      </button>
      <button className="tb-btn" aria-pressed={selMode} onClick={() => setSelMode(s => !s)} title="Select multiple">
        <Icon.check s={14} />
      </button>
      <div className="seg">
        <button aria-pressed={layout === 'list'} onClick={() => setLayout('list')} title="List"><Icon.lList s={15} /></button>
        <button aria-pressed={layout === 'thumbs'} onClick={() => setLayout('thumbs')} title="List with covers"><Icon.lThumbs s={15} /></button>
        <button aria-pressed={layout === 'grid'} onClick={() => setLayout('grid')} title="Covers"><Icon.lGrid s={15} /></button>
      </div>
      {popOpen && <ViewOptionsPop opts={opts} set={p => setOpts({ ...opts, ...p })} onClose={() => setPopOpen(false)} />}
    </div>
  );
};

const StatusBar = ({ count, agentOn, onActivity, onAgent }) => (
  <div className="statusbar">
    <span>{fmt.num(count)} of {fmt.num(CATALOG.length)} titles</span>
    <span className="div" />
    <span>{fmt.size(AGG.totalSize())}</span>
    <span className="div" />
    {ROOTS.map(r => {
      const pct = r.used / r.total;
      return (
        <span className="rootpill" key={r.id} title={`${r.name} - ${fmt.size(r.total - r.used)} free`}>
          <Icon.drive s={12} />{r.name.split(' ')[0]}
          <span className="cap"><i className={pct > 0.9 ? 'full' : pct > 0.75 ? 'hot' : ''} style={{ width: pct * 100 + '%' }} /></span>
        </span>
      );
    })}
    <span className="spacer" />
    {agentOn && (
      <button className="sb-btn" onClick={onAgent} title="MCP server running - 3 tools exposed, read-only">
        <i className="agentdot" /><Icon.robot s={13} />Agent
      </button>
    )}
    <span className="div" />
    <button className="sb-btn" onClick={onActivity}><Icon.download s={13} />2 downloading</button>
    <span className="div" />
    <button className="sb-btn" title="Language"><Icon.external s={13} />EN</button>
  </div>
);

window.TitleBar = TitleBar;
window.Sidebar = Sidebar;
window.Toolbar = Toolbar;
window.StatusBar = StatusBar;
window.SideSection = SideSection;
window.SideRow = SideRow;
