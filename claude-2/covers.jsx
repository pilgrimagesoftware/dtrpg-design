/* Generative cover art + the shared file-state glyph.
   Covers are deterministic from the item id so the prototype looks stable across reloads. */

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function readable(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.32 ? '#1A160F' : '#F2EADA';
}

const Motif = ({ kind, size }) => {
  const common = { width: size, height: size, viewBox: '0 0 40 40', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, opacity: 0.74 };
  if (kind === 0) return <svg {...common}><circle cx="20" cy="20" r="14" /><circle cx="20" cy="20" r="7.5" /></svg>;
  if (kind === 1) return <svg {...common}><path d="M20 5l15 15-15 15L5 20z" /><path d="M20 13l7 7-7 7-7-7z" /></svg>;
  if (kind === 2) return <svg {...common}><path d="M5 14h30M5 20h30M5 26h30" /></svg>;
  return <svg {...common}><path d="M20 6l14 26H6z" /><path d="M20 15l7 13H13z" /></svg>;
};

const Cover = ({ book, scale = 1 }) => {
  const h = hash(book.id + book.title);
  const ink = readable(book.color);
  return (
    <div className="cv" style={{ background: book.color, color: ink }}>
      <div className="motif" style={{ display: 'flex', justifyContent: 'center' }}>
        <Motif kind={h % 4} size={Math.round(40 * scale)} />
      </div>
      <div className="ttl" style={{ fontSize: Math.round(11 * scale) + 'px' }}>{book.title}</div>
      <div style={{ fontSize: Math.round(7 * scale) + 'px', opacity: 0.72, marginTop: 2 * scale, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {book.sys}
      </div>
    </div>
  );
};

/* One glyph, one meaning - reused in the list, the grid corner, and the inspector. */
const StateGlyph = ({ book, size = 15 }) => {
  const s = book.state;
  if (s === 'downloading') {
    const p = book.progress || 0;
    const r = 6, circ = 2 * Math.PI * r;
    return (
      <span className="st dl" title={`Downloading - ${Math.round(p * 100)}%`}>
        <svg className="ring" viewBox="0 0 16 16">
          <circle className="bg" cx="8" cy="8" r={r} />
          <circle className="fg" cx="8" cy="8" r={r} strokeDasharray={circ} strokeDashoffset={circ * (1 - p)} />
        </svg>
      </span>
    );
  }
  if (s === 'downloaded') return <span className="st ok" title="Downloaded - on this device"><Icon.dot s={size - 5} /></span>;
  if (s === 'offloaded') return <span className="st cloud" title="Placeholder - offloaded by the OS, tap to materialize"><Icon.cloudDash s={size} /></span>;
  if (s === 'cloud') return <span className="st cloud" title="Not downloaded - available from DriveThruRPG"><Icon.cloud s={size} /></span>;
  if (s === 'failed') return <span className="st err" title="Download failed - retry available"><Icon.warn s={size} /></span>;
  return null;
};

const TagChip = ({ tag, onRemove }) => (
  <span className="tagchip">
    <i className="tagdot" style={{ background: tag.color }} />
    {tag.name}
    {onRemove && <button onClick={onRemove} aria-label={`Remove ${tag.name}`}><Icon.close s={9} /></button>}
  </span>
);

const tagById = id => window.TAGS.find(t => t.id === id);

window.Cover = Cover;
window.StateGlyph = StateGlyph;
window.TagChip = TagChip;
window.tagById = tagById;
window.hash = hash;
