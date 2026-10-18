/* Insights view (goal 12). Every number here is an aggregate the real app gets from one
   SQL query over the library index - no chart library, just inline SVG. */

const SERIES = [
  'oklch(0.58 0.12 25)', 'oklch(0.60 0.10 250)', 'oklch(0.58 0.11 150)',
  'oklch(0.66 0.13 75)', 'oklch(0.56 0.10 300)', 'oklch(0.60 0.09 200)',
  'oklch(0.54 0.08 340)', 'oklch(0.62 0.10 120)',
];

const Kpi = ({ v, k, d }) => (
  <div className="kpi">
    <div className="v">{v}</div>
    <div className="k">{k}</div>
    {d && <div className="d">{d}</div>}
  </div>
);

const HBars = ({ rows, format = v => v }) => {
  const max = Math.max(...rows.map(r => r[1]), 1);
  return (
    <div className="hbars">
      {rows.map(([label, v], i) => (
        <div className="hbar" key={label}>
          <span className="lbl" title={label}>{label}</span>
          <span className="trk"><i style={{ width: (v / max) * 100 + '%', background: SERIES[i % SERIES.length] }} /></span>
          <span className="vl">{format(v)}</span>
        </div>
      ))}
    </div>
  );
};

const Donut = ({ rows, format = v => v }) => {
  const total = rows.reduce((s, r) => s + r[1], 0) || 1;
  const r = 36, circ = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="donut-wrap">
      <svg width="96" height="96" viewBox="0 0 96 96" style={{ flex: 'none', transform: 'rotate(-90deg)' }}>
        {rows.map(([label, v], i) => {
          const frac = v / total;
          const el = (
            <circle key={label} cx="48" cy="48" r={r} fill="none" strokeWidth="15"
                    stroke={SERIES[i % SERIES.length]}
                    strokeDasharray={`${circ * frac} ${circ * (1 - frac)}`}
                    strokeDashoffset={-circ * acc} />
          );
          acc += frac;
          return el;
        })}
      </svg>
      <div className="legend">
        {rows.map(([label, v], i) => (
          <div className="li" key={label}>
            <i className="sw2" style={{ background: SERIES[i % SERIES.length] }} />
            <span className="nm" title={label}>{label}</span>
            <span className="vl">{format(v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Row-based slice-and-dice, not a squarified treemap - good enough to read disk share
   at a glance, and it reflows cleanly at any panel width. */
const Treemap = ({ rows }) => {
  const total = rows.reduce((s, r) => s + r[1], 0) || 1;
  return (
    <div className="treemap" style={{ height: 158 }}>
      {rows.map(([label, v], i) => {
        const frac = v / total;
        const col = SERIES[i % SERIES.length];
        return (
          <div className="tm" key={label} title={`${label} - ${fmt.size(v)}`}
               style={{
                 flex: `1 1 ${Math.max(frac * 100, 9)}%`,
                 height: frac > 0.18 ? '100%' : frac > 0.08 ? '48%' : '31%',
                 background: col, color: '#fff',
               }}>
            <span className="nm">{label}</span>
            <span className="vl">{fmt.size(v)}</span>
          </div>
        );
      })}
    </div>
  );
};

const Spark = ({ points }) => {
  const w = 300, h = 76, pad = 6;
  const max = Math.max(...points.map(p => p[1]), 1);
  const xs = i => pad + (i / Math.max(points.length - 1, 1)) * (w - pad * 2);
  const ys = v => h - pad - (v / max) * (h - pad * 2 - 10);
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xs(i).toFixed(1)},${ys(p[1]).toFixed(1)}`).join(' ');
  const area = `${line} L${xs(points.length - 1).toFixed(1)},${h - pad} L${pad},${h - pad} Z`;
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <line className="gl" x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} />
      <path className="ar" d={area} />
      <path className="ln" d={line} />
      {points.map((p, i) => (
        <circle key={p[0]} cx={xs(i)} cy={ys(p[1])} r="2.4" fill="var(--accent)" />
      ))}
    </svg>
  );
};

const Insights = () => {
  const added = AGG.addedByMonth();
  const stateLabels = { downloaded: 'On device', cloud: 'Not downloaded', offloaded: 'Placeholder', downloading: 'Downloading', failed: 'Failed' };
  return (
    <div className="insights">
      <div className="ins-grid">
        <div className="panel wide">
          <h3>Library at a glance</h3>
          <p className="cap-txt">Everything below is computed from the local index, so it works offline.</p>
          <div className="kpis">
            <Kpi v={fmt.num(CATALOG.length)} k="titles" d="+8 this month" />
            <Kpi v={fmt.size(AGG.totalSize())} k="total size" />
            <Kpi v={fmt.num(AGG.totalPages())} k="pages" />
            <Kpi v={AGG.downloaded() + '/' + CATALOG.length} k="downloaded" />
            <Kpi v={AGG.byPublisher().length} k="publishers" />
            <Kpi v={AGG.bySystem().length} k="systems" />
          </div>
        </div>

        <div className="panel">
          <h3>Titles by publisher</h3>
          <p className="cap-txt">Top 8 of {AGG.byPublisher().length}</p>
          <HBars rows={AGG.byPublisher().slice(0, 8)} />
        </div>

        <div className="panel">
          <h3>Titles by system</h3>
          <p className="cap-txt">Where the collection actually concentrates</p>
          <HBars rows={AGG.bySystem().slice(0, 8)} />
        </div>

        <div className="panel">
          <h3>By type</h3>
          <p className="cap-txt">Core rules vs. adventures vs. settings</p>
          <Donut rows={AGG.byKind()} />
        </div>

        <div className="panel">
          <h3>Availability</h3>
          <p className="cap-txt">What is really on this machine</p>
          <Donut rows={AGG.byState().map(([k, v]) => [stateLabels[k] || k, v])} />
        </div>

        <div className="panel wide">
          <h3>Disk usage by publisher</h3>
          <p className="cap-txt">Area is share of {fmt.size(AGG.totalSize())} across all storage roots</p>
          <Treemap rows={AGG.sizeByPublisher().slice(0, 9)} />
        </div>

        <div className="panel wide">
          <h3>Titles added over time</h3>
          <p className="cap-txt">By month acquired</p>
          <Spark points={added} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>
            {added.map(p => <span key={p[0]}>{p[0].slice(5)}/{p[0].slice(2, 4)}</span>)}
          </div>
        </div>

        <div className="panel wide">
          <h3>Storage roots</h3>
          <p className="cap-txt">Capacity and what Libri is using on each</p>
          {ROOTS.map(r => {
            const mine = CATALOG.filter(b => b.root === r.id).reduce((s, b) => s + b.size, 0);
            const pct = r.used / r.total;
            return (
              <div className="hbar" key={r.id} style={{ gridTemplateColumns: '148px 1fr 136px', marginBottom: 8 }}>
                <span className="lbl">{r.name}</span>
                <span className="trk" style={{ height: 17 }}>
                  <i style={{ width: pct * 100 + '%', background: pct > 0.9 ? 'var(--err)' : pct > 0.75 ? 'var(--warn)' : 'var(--accent)' }} />
                </span>
                <span className="vl">{fmt.size(mine)} of {fmt.size(r.total - r.used)} free</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

window.Insights = Insights;
