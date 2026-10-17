/* Facet rail + the three catalog layouts (list / thumbs / grid). */

const { useState: useS } = React;

/* Facets are counts the real app gets from SQL GROUP BY over the same WHERE clause
   as the current view, so every number reflects the filters already applied. */
const FacetRail = ({ tokens, setTokens }) => {
  const groups = [
    { key: 'state', title: 'Availability', rows: [
      ['downloaded', 'On this device', AGG.byState().find(s => s[0] === 'downloaded')?.[1] || 0],
      ['offloaded', 'Placeholder', AGG.byState().find(s => s[0] === 'offloaded')?.[1] || 0],
      ['cloud', 'Not downloaded', AGG.byState().find(s => s[0] === 'cloud')?.[1] || 0],
      ['failed', 'Failed', AGG.byState().find(s => s[0] === 'failed')?.[1] || 0],
    ] },
    { key: 'system', title: 'System', rows: AGG.bySystem().slice(0, 6).map(([v, n]) => [v, v, n]) },
    { key: 'kind', title: 'Type', rows: AGG.byKind().map(([v, n]) => [v, v, n]) },
    { key: 'root', title: 'Location', rows: ROOTS.map(r => [r.id, r.name, CATALOG.filter(b => b.root === r.id).length]) },
    { key: 'tag', title: 'Tag', rows: TAGS.map(t => [t.id, t.name, CATALOG.filter(b => b.tags.includes(t.id)).length]) },
  ];
  const has = (f, v) => tokens.some(t => t.f === f && t.v === v);
  const toggle = (f, v) => has(f, v)
    ? setTokens(tokens.filter(t => !(t.f === f && t.v === v)))
    : setTokens([...tokens, { f, v }]);
  const max = g => Math.max(...g.rows.map(r => r[2]), 1);

  return (
    <div className="facets">
      {groups.map(g => (
        <div className="facet-grp" key={g.key}>
          <h4>{g.title}</h4>
          {g.rows.map(([v, label, n]) => (
            <React.Fragment key={v}>
              <button className="facet-row" aria-pressed={has(g.key, v)} onClick={() => toggle(g.key, v)}>
                <span className="box">{has(g.key, v) && <Icon.check s={9} />}</span>
                <span className="lbl">{label}</span>
                <span className="cnt">{n}</span>
              </button>
              <div className="facet-bar" style={{ width: (n / max(g)) * 86 + '%', marginLeft: 25, marginBottom: 3 }} />
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

const LocCell = ({ book }) => {
  if (!book.root) return <span className="col w-loc" style={{ opacity: 0.45 }}>-</span>;
  const r = ROOTS.find(x => x.id === book.root);
  return <span className="col w-loc" title={r.path}>{r.name.split(' ')[0]}</span>;
};

const ListRow = ({ book, selected, onSelect, cols, withThumb, onDragStart }) => (
  <div className={'row' + (book.state === 'offloaded' ? ' offloaded' : '')}
       aria-selected={selected ? 'true' : undefined}
       onClick={() => onSelect(book)} draggable onDragStart={() => onDragStart(book)}>
    <div className="c-title">
      {withThumb && <div className="thumb"><Cover book={book} scale={0.52} /></div>}
      <div className="tx">
        <div className="nm">{book.title}</div>
        {withThumb && <div className="sub">{book.pub}</div>}
      </div>
      {cols.tags && book.tags.length > 0 && (
        <span className="tagchips">
          {book.tags.map(id => <TagChip key={id} tag={tagById(id)} />)}
        </span>
      )}
    </div>
    {cols.pub && !withThumb && <span className="col w-pub">{book.pub}</span>}
    {cols.sys && <span className="col w-sys">{book.sys}</span>}
    {cols.pages && <span className="col w-pages num">{book.pages}</span>}
    {cols.size && <span className="col w-size num">{fmt.size(book.size)}</span>}
    {cols.added && <span className="col w-added">{fmt.shortDate(book.added)}</span>}
    {cols.loc && <LocCell book={book} />}
    <span className="col w-stat"><StateGlyph book={book} /></span>
    <span className="w-act"><button className="act-btn" title="Open in default app"><Icon.external s={13} /></button></span>
    <span className="w-act"><button className="act-btn" title="More"><Icon.dots s={13} /></button></span>
  </div>
);

const GridCard = ({ book, selected, onSelect, onDragStart }) => (
  <div className={'card' + (book.state === 'offloaded' ? ' offloaded' : '')}
       aria-selected={selected ? 'true' : undefined}
       onClick={() => onSelect(book)} draggable onDragStart={() => onDragStart(book)}>
    <div className="shell">
      <Cover book={book} />
      {book.state !== 'downloaded' && <div className="corner"><StateGlyph book={book} size={13} /></div>}
    </div>
    <div className="meta">
      <div className="nm">{book.title}</div>
      <div className="sub">
        <span>{book.pub}</span>
        {book.tags.length > 0 && <i className="tagdot" style={{ background: tagById(book.tags[0]).color }} />}
      </div>
    </div>
  </div>
);

const ListHeader = ({ cols, withThumb }) => (
  <div className="lhead" style={{ height: 26 }}>
    <span className="c-title"><button>Title <Icon.chevDown s={10} /></button></span>
    {cols.pub && !withThumb && <span className="col w-pub"><button>Publisher</button></span>}
    {cols.sys && <span className="col w-sys"><button>System</button></span>}
    {cols.pages && <span className="col w-pages num"><button>Pages</button></span>}
    {cols.size && <span className="col w-size num"><button>Size</button></span>}
    {cols.added && <span className="col w-added"><button>Added</button></span>}
    {cols.loc && <span className="col w-loc"><button>Where</button></span>}
    <span className="col w-stat" />
    <span className="w-act" /><span className="w-act" />
  </div>
);

const Catalog = ({ books, layout, opts, selected, onSelect, onDragStart, loading }) => {
  if (loading) {
    return (
      <div className="catalog">
        {Array.from({ length: 9 }).map((_, i) => (
          <div className="row" key={i} style={{ gap: 10 }}>
            <div className="skel" style={{ width: 'var(--thumb-w)', aspectRatio: '5/7' }} />
            <div style={{ flex: 1 }}>
              <div className="skel" style={{ height: 11, width: 38 + (i * 7) % 42 + '%', marginBottom: 5 }} />
              <div className="skel" style={{ height: 9, width: 24 + (i * 5) % 20 + '%' }} />
            </div>
            <div className="skel" style={{ height: 10, width: 62 }} />
          </div>
        ))}
      </div>
    );
  }
  if (books.length === 0) {
    return (
      <div className="catalog">
        <div className="empty">
          <Icon.search s={34} />
          <p>No titles match these filters.</p>
          <small>Clear a filter token, or save this search as a smart collection.</small>
        </div>
      </div>
    );
  }

  const keyOf = b => opts.groupBy === 'publisher' ? b.pub
    : opts.groupBy === 'system' ? b.sys
    : opts.groupBy === 'tag' ? (b.tags[0] ? tagById(b.tags[0]).name : 'Untagged')
    : null;

  const groups = opts.groupBy === 'none'
    ? [[null, books]]
    : [...books.reduce((m, b) => {
        const k = keyOf(b);
        m.set(k, [...(m.get(k) || []), b]);
        return m;
      }, new Map())].sort((a, b) => a[0].localeCompare(b[0]));

  const withThumb = layout === 'thumbs';

  return (
    <div className="catalog">
      {layout !== 'grid' && opts.groupBy === 'none' && <ListHeader cols={opts.cols} withThumb={withThumb} />}
      {groups.map(([gname, items]) => (
        <React.Fragment key={gname || '_'}>
          {gname && (
            <div className="grp-head">
              {gname}<span className="rule" /><span className="cnt">{items.length}</span>
            </div>
          )}
          {layout === 'grid' ? (
            <div className="grid">
              {items.map(b => (
                <GridCard key={b.id} book={b} selected={selected?.id === b.id}
                          onSelect={onSelect} onDragStart={onDragStart} />
              ))}
            </div>
          ) : (
            items.map(b => (
              <ListRow key={b.id} book={b} selected={selected?.id === b.id} onSelect={onSelect}
                       cols={opts.cols} withThumb={withThumb} onDragStart={onDragStart} />
            ))
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

window.FacetRail = FacetRail;
window.Catalog = Catalog;
