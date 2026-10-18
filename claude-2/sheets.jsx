/* Modal sheets: download (partial + destination), smart collection editor, archive peek. */

const { useState: useSh } = React;

/* Goal 5 lives here: pick WHICH files (partial) and WHERE they land (multiple roots),
   with the space check done against the chosen root rather than one global path. */
const DownloadSheet = ({ books, onClose }) => {
  const multi = books.length > 1;
  const allFiles = books.flatMap(b => b.files.map(f => ({ ...f, book: b })));
  const [picked, setPicked] = useSh(() => new Set(allFiles.filter(f => f.state !== 'downloaded').map(f => f.book.id + '/' + f.n)));
  const [root, setRoot] = useSh('local');
  const [rule, setRule] = useSh(false);

  const key = f => f.book.id + '/' + f.n;
  const toggle = f => setPicked(p => {
    const n = new Set(p);
    n.has(key(f)) ? n.delete(key(f)) : n.add(key(f));
    return n;
  });
  const total = allFiles.filter(f => picked.has(key(f))).reduce((s, f) => s + f.s, 0);
  const target = ROOTS.find(r => r.id === root);
  const free = target.total - target.used;
  const tight = total > free * 0.9;

  return (
    <div className="scrim" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <header>
          <h2>Download {multi ? `${books.length} titles` : books[0].title}</h2>
          <p>Choose the files you want and where they should live.</p>
        </header>
        <div className="scroll">
          <div className="sect">
            <h3>Files<span className="rule" />
              <button className="btn sm ghost" onClick={() => setPicked(new Set(allFiles.map(key)))}>All</button>
              <button className="btn sm ghost" onClick={() => setPicked(new Set())}>None</button>
            </h3>
            {allFiles.map(f => (
              <div className="filerow" key={key(f)}>
                <button className="facet-row" style={{ width: 'auto', padding: 0 }}
                        aria-pressed={picked.has(key(f))} onClick={() => toggle(f)}>
                  <span className="box">{picked.has(key(f)) && <Icon.check s={9} />}</span>
                </button>
                <span className="kind">{f.k}</span>
                <span className="fn" title={f.n}>
                  {f.n}
                  {multi && <span style={{ color: 'var(--text-3)', fontSize: 11 }}> · {f.book.title}</span>}
                </span>
                <span className="fs">{fmt.size(f.s)}</span>
                {f.state === 'downloaded' && <span className="st ok" title="Already on disk"><Icon.check s={12} /></span>}
              </div>
            ))}
          </div>

          <div className="sect">
            <h3>Destination<span className="rule" /></h3>
            {ROOTS.map(r => {
              const pct = r.used / r.total;
              return (
                <button className="dest" key={r.id} aria-pressed={root === r.id} onClick={() => setRoot(r.id)}>
                  <Icon.drive s={17} />
                  <span style={{ minWidth: 0 }}>
                    <span className="nm" style={{ display: 'block' }}>{r.name}</span>
                    <span className="pth">{r.path}</span>
                  </span>
                  <span className="rt">
                    <span className="free">{fmt.size(r.total - r.used)} free</span>
                    <span className="cap lg"><i className={pct > 0.9 ? 'full' : pct > 0.75 ? 'hot' : ''} style={{ width: pct * 100 + '%' }} /></span>
                  </span>
                </button>
              );
            })}
            <div className="rowline" style={{ marginTop: 9 }}>
              <span className="lbl">Remember this choice for {multi ? 'these publishers' : books[0].pub}</span>
              <button className="toggle" aria-pressed={rule} onClick={() => setRule(r => !r)} />
            </div>
            {rule && (
              <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--text-3)', lineHeight: 1.45 }}>
                Adds a placement rule. Future downloads from {multi ? 'these publishers' : books[0].pub} go to
                {' '}{target.name} without asking.
              </p>
            )}
          </div>
        </div>
        <footer>
          <span className="note">
            {picked.size} file{picked.size === 1 ? '' : 's'} · {fmt.size(total)}
            {tight && <span style={{ color: 'var(--warn)' }}> · tight fit on {target.name}</span>}
          </span>
          <span className="spacer" />
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn pri" disabled={picked.size === 0} onClick={onClose}>
            <Icon.download s={13} /> Download
          </button>
        </footer>
      </div>
    </div>
  );
};

/* A smart collection is a saved query. Same predicate language as the omnibox tokens,
   so "search, then save" and "build a rule" end up in the same place. */
const FIELDS = ['title', 'publisher', 'system', 'type', 'tag', 'collection', 'size', 'pages', 'added', 'state', 'location'];
const OPS = { is: 'is', not: 'is not', has: 'contains', gt: 'is more than', lt: 'is less than' };

const SmartCollectionSheet = ({ seed, onClose }) => {
  const [name, setName] = useSh(seed?.name || 'Unread Adventures');
  const [match, setMatch] = useSh('all');
  const [rules, setRules] = useSh(seed?.rules || [{ f: 'type', o: 'is', v: 'Adventure' }, { f: 'tag', o: 'not', v: 'Running' }]);
  const upd = (i, k, v) => setRules(rules.map((r, j) => j === i ? { ...r, [k]: v } : r));

  return (
    <div className="scrim" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <header>
          <h2>{seed ? 'Edit' : 'New'} smart collection</h2>
          <p>Membership is recomputed whenever the library changes - nothing to maintain by hand.</p>
        </header>
        <div className="scroll">
          <div className="sect">
            <h3>Name<span className="rule" /></h3>
            <input className="sel grow" style={{ width: '100%', height: 30 }} value={name}
                   onChange={e => setName(e.target.value)} />
          </div>
          {rules.some(r => r.f === 'collection') && (
            <div className="sect" style={{ marginBottom: 7 }}>
              <div className="matchline">
                <Icon.cloud s={14} />
                <span>
                  Includes a DriveThruRPG collection - its membership keeps syncing from the server;
                  every other rule here is local only and does not change the collection itself.
                </span>
              </div>
            </div>
          )}
          <div className="sect">
            <h3>Rules<span className="rule" /></h3>
            <div className="rowline" style={{ marginBottom: 9 }}>
              <span className="lbl">Match</span>
              <select className="sel" value={match} onChange={e => setMatch(e.target.value)}>
                <option value="all">all of the following</option>
                <option value="any">any of the following</option>
              </select>
            </div>
            {rules.map((r, i) => (
              <div className="rule" key={i}>
                <select className="sel" value={r.f} onChange={e => upd(i, 'f', e.target.value)}>
                  {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <select className="sel" value={r.o} onChange={e => upd(i, 'o', e.target.value)}>
                  {Object.entries(OPS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                </select>
                <input className="sel grow" value={r.v} onChange={e => upd(i, 'v', e.target.value)} />
                <button className="del" onClick={() => setRules(rules.filter((_, j) => j !== i))}
                        aria-label="Remove rule"><Icon.close s={13} /></button>
              </div>
            ))}
            <button className="btn sm" onClick={() => setRules([...rules, { f: 'publisher', o: 'is', v: '' }])}>
              <Icon.plus s={11} /> Add rule
            </button>
            <div className="matchline">
              <Icon.smart s={14} />
              <span>Matches <b>17</b> of {CATALOG.length} titles right now</span>
              <span className="spacer" style={{ flex: 1 }} />
              <button className="btn sm ghost">Preview</button>
            </div>
          </div>
          <div className="sect">
            <h3>On match<span className="rule" /></h3>
            <div className="rowline">
              <span className="lbl">Download new matches automatically</span>
              <button className="toggle" aria-pressed={false} />
            </div>
            <div className="rowline">
              <span className="lbl">Mirror to a folder of symlinks on disk</span>
              <button className="toggle" aria-pressed />
            </div>
          </div>
        </div>
        <footer>
          <span className="note">Equivalent query: <code>type:Adventure -tag:Running</code></span>
          <span className="spacer" />
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn pri" onClick={onClose}>Save collection</button>
        </footer>
      </div>
    </div>
  );
};

const PeekSheet = ({ node, onClose }) => (
  <div className="scrim" onClick={onClose}>
    <div className="sheet" style={{ width: 'min(520px, 90%)' }} onClick={e => e.stopPropagation()}>
      <header>
        <h2>{node.p}</h2>
        <p>Previewed from inside the archive - nothing was extracted to disk.</p>
      </header>
      <div className="scroll" style={{ display: 'grid', placeItems: 'center', minHeight: 230 }}>
        <div style={{ textAlign: 'center', color: 'var(--text-3)' }}>
          <Icon.eye s={30} />
          <p style={{ fontFamily: 'var(--serif)', fontSize: 14, color: 'var(--text-2)', margin: '9px 0 3px' }}>
            {node.p.split('.').pop().toUpperCase()} preview
          </p>
          <small>{fmt.size(node.s)}</small>
        </div>
      </div>
      <footer>
        <span className="spacer" />
        <button className="btn" onClick={onClose}>Close</button>
        <button className="btn pri">Extract this file...</button>
      </footer>
    </div>
  </div>
);

window.DownloadSheet = DownloadSheet;
window.SmartCollectionSheet = SmartCollectionSheet;
window.PeekSheet = PeekSheet;
