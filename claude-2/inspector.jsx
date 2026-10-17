/* Right-hand inspector. Four tabs: Info, Files, Contents (archive tree), Summary (AI). */

const { useState: useI } = React;

const InfoTab = ({ book }) => {
  const root = ROOTS.find(r => r.id === book.root);
  return (
    <>
      <div className="sect">
        <h3>Description<span className="rule" /></h3>
        <p className="blurb">{book.desc}</p>
      </div>
      <div className="sect">
        <h3>Tags<span className="rule" /></h3>
        <div className="keyw">
          {book.tags.map(id => <TagChip key={id} tag={tagById(id)} onRemove={() => {}} />)}
          <button className="chip"><Icon.plus s={10} /> Add tag</button>
        </div>
        <p style={{ margin: '7px 0 0', fontSize: 10.5, color: 'var(--text-3)', lineHeight: 1.45 }}>
          Written through to Finder tags on macOS and <code>user.xdg.tags</code> on Linux. Windows keeps them in
          Libri's own index only.
        </p>
      </div>
      <div className="sect">
        <h3>Details<span className="rule" /></h3>
        <dl className="meta-dl">
          <dt>System</dt><dd>{book.sys}</dd>
          <dt>Type</dt><dd>{book.kind}</dd>
          <dt>Format</dt><dd>{book.fmt}</dd>
          <dt>Pages</dt><dd>{book.pages}</dd>
          <dt>Size</dt><dd>{fmt.size(book.size)}</dd>
          <dt>Released</dt><dd>{fmt.date(book.released)}</dd>
          <dt>Added</dt><dd>{fmt.date(book.added)}</dd>
          <dt>Location</dt><dd>{root ? root.name : 'Not downloaded'}</dd>
        </dl>
      </div>
      <div className="sect">
        <h3>Opens with<span className="rule" /></h3>
        <div className="rowline">
          <span className="lbl">PDF files</span>
          <button className="btn sm">Preview ▾</button>
        </div>
        <p style={{ margin: '5px 0 0', fontSize: 10.5, color: 'var(--text-3)' }}>
          Per-extension overrides live in Settings → File Openers.
        </p>
      </div>
    </>
  );
};

const FilesTab = ({ book, onPeek }) => (
  <div className="sect">
    <h3>{book.files.length} file{book.files.length === 1 ? '' : 's'}<span className="rule" /></h3>
    {book.files.map(f => (
      <div className="filerow" key={f.n}>
        <span className="kind">{f.k}</span>
        <span className="fn" title={f.n}>{f.n}</span>
        <span className="fs">{fmt.size(f.s)}</span>
        {f.k === 'zip' && (
          <button className="btn sm ghost" onClick={() => onPeek(book)} title="Browse inside this archive">
            <Icon.archive s={12} />
          </button>
        )}
        <StateGlyph book={{ state: f.state, progress: book.progress }} size={14} />
      </div>
    ))}
    <div style={{ display: 'flex', gap: 7, marginTop: 11 }}>
      <button className="btn sm"><Icon.download s={12} /> Download selected...</button>
      <button className="btn sm ghost"><Icon.refresh s={12} /> Verify on disk</button>
    </div>
  </div>
);

/* Archive contents. The tree is lazily listed from the central directory - the real app
   reads entry headers only, never extracts the whole archive to look inside it. */
const ArchiveNode = ({ node, depth, onPeek }) => {
  const [open, setOpen] = useI(depth === 0);
  if (!node.d) {
    return (
      <div className="tnode" style={{ paddingLeft: 7 + depth * 15 }}>
        <span className="tw leaf"><Icon.chev s={10} /></span>
        <Icon.file s={13} />
        <span className="fn">{node.p}</span>
        <span className="fs">{fmt.size(node.s)}</span>
        <button className="peek" onClick={() => onPeek(node)} title="Preview without extracting"><Icon.eye s={13} /></button>
      </div>
    );
  }
  return (
    <>
      <div className="tnode" style={{ paddingLeft: 7 + depth * 15 }} onClick={() => setOpen(o => !o)}>
        <span className="tw" style={{ transform: open ? 'rotate(90deg)' : 'none' }}><Icon.chev s={10} /></span>
        <Icon.folder s={13} />
        <span className="fn">{node.p}</span>
        <span className="fs">{node.c.length} items</span>
      </div>
      {open && node.c.map(c => <ArchiveNode key={c.p} node={c} depth={depth + 1} onPeek={onPeek} />)}
    </>
  );
};

const ContentsTab = ({ book, onPeek }) => {
  const zip = book.files.find(f => f.k === 'zip');
  if (!book.entries) {
    return (
      <div className="sect">
        <div className="empty" style={{ padding: '34px 0' }}>
          <Icon.archive s={30} />
          <p>No archives in this title.</p>
          <small>This tab lists the inside of zip, 7z and rar files.</small>
        </div>
      </div>
    );
  }
  const count = book.entries.reduce((n, e) => n + (e.d ? e.c.length : 1), 0);
  return (
    <div className="sect">
      <h3>{zip ? zip.n : 'Archive'}<span className="rule" /><span style={{ fontWeight: 400 }}>{count} entries</span></h3>
      <div className="tree">
        {book.entries.map(e => <ArchiveNode key={e.p} node={e} depth={0} onPeek={onPeek} />)}
      </div>
      <div style={{ display: 'flex', gap: 7, marginTop: 12 }}>
        <button className="btn sm">Extract all...</button>
        <button className="btn sm ghost">Extract selected...</button>
      </div>
    </div>
  );
};

const SummaryTab = ({ book }) => {
  if (!book.summary) {
    return (
      <div className="sect">
        <h3>Summary<span className="rule" /></h3>
        <div className="sum-empty">
          <Icon.sparkle s={24} />
          <p>No summary yet. Libri can read this title's text and write a short description of what it
             covers, then cache it for search and for agent queries.</p>
          <button className="btn pri sm"><Icon.sparkle s={12} /> Generate summary</button>
          <div className="prov">
            <span className="pill">claude-sonnet-5</span>
            <span>· est. 4.8k tokens · runs on your own API key</span>
          </div>
        </div>
        <p style={{ margin: '11px 0 0', fontSize: 10.5, color: 'var(--text-3)', lineHeight: 1.5 }}>
          Opt-in per title, or batch a whole collection from its context menu. Nothing is sent anywhere
          until you ask.
        </p>
      </div>
    );
  }
  const s = book.summary;
  return (
    <>
      <div className="sect">
        <h3>Summary<span className="rule" /></h3>
        <p className="blurb">{s.text}</p>
        <div className="prov">
          <Icon.sparkle s={11} />
          <span className="pill">{s.model}</span>
          <span>· {fmt.date(s.when)} · {fmt.num(s.tokens)} tokens</span>
          <button className="btn sm ghost" style={{ marginLeft: 'auto' }}><Icon.refresh s={11} /> Redo</button>
        </div>
      </div>
      <div className="sect">
        <h3>Themes<span className="rule" /></h3>
        <div className="keyw">
          {s.keywords.map(k => <span className="chip" key={k}>{k}</span>)}
        </div>
        <p style={{ margin: '7px 0 0', fontSize: 10.5, color: 'var(--text-3)', lineHeight: 1.45 }}>
          Indexed for search, so "gothic horror" finds this title even though the phrase is not in its
          catalog metadata.
        </p>
      </div>
    </>
  );
};

const Inspector = ({ book, onClose, onDownload, onPeek }) => {
  const [tab, setTab] = useI('info');
  const archives = book.entries ? 1 : 0;
  const canRead = book.state === 'downloaded';
  return (
    <div className="inspector">
      <div className="insp-head">
        <div className={'thumb-lg' + (book.state === 'offloaded' ? ' offloaded' : '')}>
          <Cover book={book} scale={1.05} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h2>{book.title}</h2>
          <div className="pub">{book.pub}</div>
          <div className="pub" style={{ fontSize: 11, color: 'var(--text-3)' }}>{book.sys} · {book.kind}</div>
        </div>
        <button className="closeb" onClick={onClose} aria-label="Close"><Icon.close s={15} /></button>
      </div>

      <div className="insp-actions">
        <button className="btn pri" disabled={!canRead}
                title={canRead ? 'Open in the configured app' : 'Download first'}>
          <Icon.book s={13} /> Read
        </button>
        {book.state === 'offloaded'
          ? <button className="btn"><Icon.download s={13} /> Materialize</button>
          : <button className="btn" onClick={() => onDownload(book)}><Icon.download s={13} /> Download...</button>}
        <button className="btn ghost" title="More"><Icon.dots s={14} /></button>
      </div>

      <div className="tabs">
        <button aria-selected={tab === 'info'} onClick={() => setTab('info')}>Info</button>
        <button aria-selected={tab === 'files'} onClick={() => setTab('files')}>
          Files<span className="pip">{book.files.length}</span>
        </button>
        <button aria-selected={tab === 'contents'} onClick={() => setTab('contents')}>
          Contents{archives > 0 && <span className="pip">{archives}</span>}
        </button>
        <button aria-selected={tab === 'summary'} onClick={() => setTab('summary')}>
          <Icon.sparkle s={11} />Summary
        </button>
      </div>

      <div className="insp-body">
        {tab === 'info' && <InfoTab book={book} />}
        {tab === 'files' && <FilesTab book={book} onPeek={onPeek} />}
        {tab === 'contents' && <ContentsTab book={book} onPeek={onPeek} />}
        {tab === 'summary' && <SummaryTab book={book} />}
      </div>
    </div>
  );
};

window.Inspector = Inspector;
