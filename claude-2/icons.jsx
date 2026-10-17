/* Inline SVG line icons. Stroke uses currentColor so icons inherit theme text colors. */

const Svg = ({ s = 15, children, sw = 1.5, fill = 'none' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const Icon = {
  search: p => <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></Svg>,
  chev: p => <Svg {...p}><path d="M9 18l6-6-6-6" /></Svg>,
  chevDown: p => <Svg {...p}><path d="M6 9l6 6 6-6" /></Svg>,
  check: p => <Svg {...p} sw={2.2}><path d="M20 6L9 17l-5-5" /></Svg>,
  close: p => <Svg {...p}><path d="M18 6L6 18M6 6l12 12" /></Svg>,
  plus: p => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>,
  dots: p => <Svg {...p} fill="currentColor" sw={0}><circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" /></Svg>,

  // file / library state
  dot: p => <Svg {...p} fill="currentColor" sw={0}><circle cx="12" cy="12" r="5" /></Svg>,
  cloud: p => <Svg {...p}><path d="M17.5 19H7a4.5 4.5 0 01-.5-8.97A6 6 0 0118 10.5a4.25 4.25 0 01-.5 8.5z" /></Svg>,
  cloudDash: p => <Svg {...p}><path d="M17.5 19H7a4.5 4.5 0 01-.5-8.97A6 6 0 0118 10.5a4.25 4.25 0 01-.5 8.5z" strokeDasharray="2.6 2.4" /></Svg>,
  download: p => <Svg {...p}><path d="M12 3v12" /><path d="M7.5 10.5L12 15l4.5-4.5" /><path d="M4 20h16" /></Svg>,
  warn: p => <Svg {...p}><path d="M12 4l9 16H3z" /><path d="M12 10v4" /><path d="M12 17.2v.1" /></Svg>,

  // objects
  book: p => <Svg {...p}><path d="M5 4h9a3 3 0 013 3v13H8a3 3 0 01-3-3z" /><path d="M5 17h12" /></Svg>,
  folder: p => <Svg {...p}><path d="M4 7a2 2 0 012-2h3.2l1.6 2H18a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2z" /></Svg>,
  smart: p => <Svg {...p}><path d="M4 7a2 2 0 012-2h3.2l1.6 2H18a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2z" /><path d="M12 10.5l.9 1.9 2 .3-1.45 1.45.35 2.05L12 15.2l-1.8.95.35-2.05L9.1 12.7l2-.3z" /></Svg>,
  tag: p => <Svg {...p}><path d="M11 3.5H5.5A2 2 0 003.5 5.5V11a2 2 0 00.6 1.4l7.5 7.5a2 2 0 002.8 0l5.5-5.5a2 2 0 000-2.8l-7.5-7.5A2 2 0 0011 3.5z" /><circle cx="7.8" cy="7.8" r="1.2" /></Svg>,
  archive: p => <Svg {...p}><rect x="3.5" y="5" width="17" height="4" rx="1" /><path d="M5 9v9a1.5 1.5 0 001.5 1.5h11A1.5 1.5 0 0019 18V9" /><path d="M10.5 13h3" /></Svg>,
  file: p => <Svg {...p}><path d="M14 3.5H7a1.5 1.5 0 00-1.5 1.5v14A1.5 1.5 0 007 20.5h10a1.5 1.5 0 001.5-1.5V8z" /><path d="M14 3.5V8h4.5" /></Svg>,
  eye: p => <Svg {...p}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="2.6" /></Svg>,
  sparkle: p => <Svg {...p}><path d="M12 3.5l1.7 4.3 4.3 1.7-4.3 1.7L12 15.5l-1.7-4.3L6 9.5l4.3-1.7z" /><path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" /></Svg>,
  robot: p => <Svg {...p}><rect x="4" y="8" width="16" height="11" rx="2.5" /><path d="M12 8V4.5" /><circle cx="9" cy="13" r="1.2" fill="currentColor" sw={0} /><circle cx="15" cy="13" r="1.2" fill="currentColor" sw={0} /><path d="M9.5 16.5h5" /></Svg>,
  chart: p => <Svg {...p}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></Svg>,
  drive: p => <Svg {...p}><rect x="3" y="11" width="18" height="8" rx="2" /><path d="M6 11V6a2 2 0 012-2h8a2 2 0 012 2v5" /><circle cx="17" cy="15" r="1" fill="currentColor" sw={0} /></Svg>,
  filter: p => <Svg {...p}><path d="M3.5 6h17M6.5 12h11M10 18h4" /></Svg>,
  sliders: p => <Svg {...p}><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></Svg>,
  sort: p => <Svg {...p}><path d="M7 4v16M7 20l-3-3M7 20l3-3" /><path d="M14 7h7M14 12h5M14 17h3" /></Svg>,
  gear: p => <Svg {...p}><circle cx="12" cy="12" r="3" /><path d="M12 2.5v2.2M12 19.3v2.2M4.2 7l1.9 1.1M17.9 15.9l1.9 1.1M4.2 17l1.9-1.1M17.9 8.1l1.9-1.1" /></Svg>,
  refresh: p => <Svg {...p}><path d="M20 11a8 8 0 10-2.5 5.8" /><path d="M20 4.5V11h-6" /></Svg>,
  external: p => <Svg {...p}><path d="M14 4.5h5.5V10" /><path d="M19.5 4.5L11 13" /><path d="M18 14v4.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 014 18.5v-11A1.5 1.5 0 015.5 6H10" /></Svg>,
  trash: p => <Svg {...p}><path d="M4 7h16M9 7V4.5h6V7M6 7l1 13h10l1-13" /></Svg>,
  clock: p => <Svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></Svg>,
  shield: p => <Svg {...p}><path d="M12 3l7 2.8v5.4c0 4.3-2.9 7.6-7 9.3-4.1-1.7-7-5-7-9.3V5.8z" /></Svg>,
  palette: p => <Svg {...p}><path d="M12 20.5a8.5 8.5 0 110-17c4.7 0 8.5 3.3 8.5 7.3 0 2.4-2 4.2-4.4 4.2h-1.6a1.9 1.9 0 00-1.3 3.3 1.4 1.4 0 01-1.2 2.2z" /><circle cx="8" cy="11" r="1.1" fill="currentColor" sw={0} /><circle cx="12" cy="8" r="1.1" fill="currentColor" sw={0} /></Svg>,

  // layout switcher
  lList: p => <Svg {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Svg>,
  lThumbs: p => <Svg {...p}><rect x="3.5" y="5" width="4" height="5" rx="0.8" /><rect x="3.5" y="14" width="4" height="5" rx="0.8" /><path d="M10 6.5h10M10 9h6M10 15.5h10M10 18h6" /></Svg>,
  lGrid: p => <Svg {...p}><rect x="4" y="4" width="6.5" height="7.5" rx="0.8" /><rect x="13.5" y="4" width="6.5" height="7.5" rx="0.8" /><rect x="4" y="14" width="6.5" height="6" rx="0.8" /><rect x="13.5" y="14" width="6.5" height="6" rx="0.8" /></Svg>,
};

window.Icon = Icon;
