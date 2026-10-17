/* Static mock data for the Libri v2 prototype. Plain JS, no JSX.
   Fields beyond claude-1's set model the v2 goals: `state` (OS-native file state),
   `root` (which storage root holds it), `tags`, `entries` (archive contents), `summary`. */

const TAGS = [
  { id: 'running', name: 'Running', color: 'oklch(0.62 0.13 150)' },
  { id: 'toread', name: 'To Read', color: 'oklch(0.66 0.14 75)' },
  { id: 'reference', name: 'Reference', color: 'oklch(0.60 0.12 250)' },
  { id: 'favorite', name: 'Favorite', color: 'oklch(0.62 0.15 25)' },
  { id: 'printed', name: 'Printed', color: 'oklch(0.58 0.06 300)' },
];

const ROOTS = [
  { id: 'local', name: 'Local Library', path: '~/Documents/Libri', used: 412, total: 994, kind: 'internal' },
  { id: 'vault', name: 'Archive Vault', path: '/Volumes/Vault/RPG', used: 3180, total: 4000, kind: 'external' },
  { id: 'icloud', name: 'iCloud Drive', path: '~/Library/Mobile Documents/.../Libri', used: 88, total: 2000, kind: 'cloud' },
];

/* state: downloaded | cloud | offloaded | downloading | failed
   offloaded = present as an OS placeholder (iCloud dataless / Windows reparse stub) */
const CATALOG = [
  { id: 'p1', title: 'Curse of Strahd', pub: 'Wizards of the Coast', sys: 'D&D 5E', kind: 'Adventure',
    pages: 256, size: 184.2, added: '2026-09-28', released: '2016-03-15', color: '#6B2B2B',
    state: 'downloaded', root: 'local', tags: ['running', 'favorite'], fmt: 'PDF',
    desc: 'A gothic horror campaign set in the mist-shrouded valley of Barovia, where the vampire Strahd von Zarovich rules from Castle Ravenloft.',
    files: [ { n: 'CurseOfStrahd.pdf', k: 'pdf', s: 162.4, state: 'downloaded' },
             { n: 'CoS_Maps.zip', k: 'zip', s: 21.8, state: 'downloaded' } ],
    entries: [
      { p: 'Maps/', d: true, c: [
        { p: 'Barovia_Village_GM.jpg', s: 4.2 }, { p: 'Barovia_Village_Player.jpg', s: 3.8 },
        { p: 'Castle_Ravenloft_L1.png', s: 5.1 }, { p: 'Castle_Ravenloft_L2.png', s: 4.9 } ] },
      { p: 'Handouts/', d: true, c: [ { p: 'Tarokka_Cards.pdf', s: 2.1 }, { p: 'Letter_Kolyan.pdf', s: 0.4 } ] },
      { p: 'README.txt', s: 0.002 },
    ],
    summary: { text: 'A sandbox gothic-horror campaign for levels 1-10. The party is drawn into Barovia, a demiplane sealed by mist and ruled by the vampire Strahd. Play is driven by a Tarokka card reading that randomizes three objectives and Strahd\'s lair, so each run differs. Structure is open: a hub village, roughly a dozen locations of varying lethality, and a final assault on Castle Ravenloft.',
      keywords: ['gothic horror', 'sandbox', 'levels 1-10', 'vampire', 'randomized objectives'],
      model: 'claude-sonnet-5', when: '2026-10-04', tokens: 4820 } },

  { id: 'p2', title: 'Pathfinder Core Rulebook', pub: 'Paizo', sys: 'Pathfinder 2E', kind: 'Core Rules',
    pages: 640, size: 412.6, added: '2026-09-24', released: '2019-08-01', color: '#2B4B6B',
    state: 'downloaded', root: 'vault', tags: ['reference'], fmt: 'PDF',
    desc: 'The complete core ruleset for Pathfinder Second Edition: character creation, the three-action economy, spells, and equipment.',
    files: [ { n: 'PF2E_Core.pdf', k: 'pdf', s: 398.1, state: 'downloaded' },
             { n: 'PF2E_Core_Printer.pdf', k: 'pdf', s: 14.5, state: 'downloaded' } ],
    entries: null, summary: null },

  { id: 'p3', title: 'Blades in the Dark', pub: 'Evil Hat Productions', sys: 'Forged in the Dark', kind: 'Core Rules',
    pages: 336, size: 96.4, added: '2026-09-19', released: '2017-03-01', color: '#1F1F2E',
    state: 'offloaded', root: 'icloud', tags: ['favorite', 'toread'], fmt: 'PDF',
    desc: 'A tabletop RPG about a crew of daring scoundrels in the haunted, eternally dark industrial city of Doskvol.',
    files: [ { n: 'BladesInTheDark.pdf', k: 'pdf', s: 96.4, state: 'offloaded' } ],
    entries: null,
    summary: { text: 'A heist-driven RPG using the Forged in the Dark engine. Play alternates between score (the heist, resolved with flashbacks rather than planning) and downtime (recovery, long-term projects, faction fallout). Characters carry stress and trauma instead of hit points; the crew itself advances as a character.',
      keywords: ['heist', 'flashbacks', 'stress and trauma', 'faction play', 'Doskvol'],
      model: 'claude-sonnet-5', when: '2026-10-11', tokens: 3140 } },

  { id: 'p4', title: 'Mörk Borg', pub: 'Free League Publishing', sys: 'Mörk Borg', kind: 'Core Rules',
    pages: 96, size: 48.1, added: '2026-09-14', released: '2020-02-14', color: '#C9A227',
    state: 'downloaded', root: 'local', tags: ['favorite'], fmt: 'PDF',
    desc: 'A pitch-black apocalyptic fantasy RPG about lost souls and fools seeking redemption among the ruins of a dying world.',
    files: [ { n: 'MorkBorg.pdf', k: 'pdf', s: 44.0, state: 'downloaded' },
             { n: 'MorkBorg_Sheets.zip', k: 'zip', s: 4.1, state: 'downloaded' } ],
    entries: [ { p: 'Sheets/', d: true, c: [ { p: 'Character_Sheet.pdf', s: 1.2 }, { p: 'Character_Sheet_Form.pdf', s: 1.6 } ] },
               { p: 'Fonts/', d: true, c: [ { p: 'Blackletter.otf', s: 0.9 } ] } ],
    summary: null },

  { id: 'p5', title: 'Delta Green: Agent\'s Handbook', pub: 'Arc Dream Publishing', sys: 'Delta Green', kind: 'Core Rules',
    pages: 232, size: 72.8, added: '2026-09-08', released: '2016-11-01', color: '#2E4634',
    state: 'cloud', root: null, tags: ['toread'], fmt: 'PDF',
    desc: 'Play the agents of a secret conspiracy fighting the unnatural, and the toll that fight takes on their sanity and their lives.',
    files: [ { n: 'DG_AgentsHandbook.pdf', k: 'pdf', s: 72.8, state: 'cloud' } ],
    entries: null, summary: null },

  { id: 'p6', title: 'Tomb of Annihilation', pub: 'Wizards of the Coast', sys: 'D&D 5E', kind: 'Adventure',
    pages: 256, size: 171.5, added: '2026-09-02', released: '2017-09-19', color: '#7A5C2E',
    state: 'downloading', root: 'local', tags: [], fmt: 'PDF', progress: 0.62,
    desc: 'A deadly jungle hexcrawl leading to the trap-riddled Tomb of the Nine Gods beneath the lost city of Omu.',
    files: [ { n: 'TombOfAnnihilation.pdf', k: 'pdf', s: 171.5, state: 'downloading' } ],
    entries: null, summary: null },

  { id: 'p7', title: 'Spire: The City Must Fall', pub: 'Rowan, Rook and Decard', sys: 'Resistance', kind: 'Core Rules',
    pages: 224, size: 88.9, added: '2026-08-27', released: '2018-05-10', color: '#4B2D5E',
    state: 'downloaded', root: 'vault', tags: ['reference', 'printed'], fmt: 'PDF',
    desc: 'Dark elf revolutionaries work to topple the high elf occupation of a mile-high city.',
    files: [ { n: 'Spire.pdf', k: 'pdf', s: 88.9, state: 'downloaded' } ],
    entries: null, summary: null },

  { id: 'p8', title: 'Lancer', pub: 'Massif Press', sys: 'Lancer', kind: 'Core Rules',
    pages: 420, size: 204.3, added: '2026-08-21', released: '2019-12-01', color: '#1E4A52',
    state: 'failed', root: 'local', tags: [], fmt: 'PDF',
    desc: 'Mech-scale tactical combat and narrative pilot play in a far-future post-scarcity setting.',
    files: [ { n: 'Lancer_CoreBook.pdf', k: 'pdf', s: 204.3, state: 'failed' } ],
    entries: null, summary: null },

  { id: 'p9', title: 'Call of Cthulhu 7E Keeper Rulebook', pub: 'Chaosium', sys: 'Call of Cthulhu', kind: 'Core Rules',
    pages: 448, size: 268.0, added: '2026-08-15', released: '2014-05-01', color: '#3B4A2E',
    state: 'downloaded', root: 'vault', tags: ['reference'], fmt: 'PDF',
    desc: 'The complete rules for investigating the Cthulhu Mythos in the 1920s and beyond.',
    files: [ { n: 'CoC7E_Keeper.pdf', k: 'pdf', s: 254.0, state: 'downloaded' },
             { n: 'CoC7E_Handouts.zip', k: 'zip', s: 14.0, state: 'downloaded' } ],
    entries: [ { p: 'Handouts/', d: true, c: [ { p: 'Newspaper_Clipping.jpg', s: 2.4 }, { p: 'Telegram.jpg', s: 1.1 } ] },
               { p: 'Maps/', d: true, c: [ { p: 'Arkham_1920.png', s: 6.2 } ] } ],
    summary: null },

  { id: 'p10', title: 'Troika!', pub: 'Melsonian Arts Council', sys: 'Troika!', kind: 'Core Rules',
    pages: 64, size: 22.4, added: '2026-08-09', released: '2019-06-01', color: '#8A3A52',
    state: 'cloud', root: null, tags: [], fmt: 'PDF',
    desc: 'Science-fantasy adventure in a humanist universe of crystal spheres and improbable travellers.',
    files: [ { n: 'Troika.pdf', k: 'pdf', s: 22.4, state: 'cloud' } ],
    entries: null, summary: null },

  { id: 'p11', title: 'Dungeon Crawl Classics Core', pub: 'Goodman Games', sys: 'DCC', kind: 'Core Rules',
    pages: 480, size: 312.7, added: '2026-08-03', released: '2012-06-01', color: '#5E3A1E',
    state: 'offloaded', root: 'icloud', tags: ['printed'], fmt: 'PDF',
    desc: 'Appendix-N inspired old-school play with funnel adventures, mighty deeds, and chaotic spell results.',
    files: [ { n: 'DCC_Core.pdf', k: 'pdf', s: 312.7, state: 'offloaded' } ],
    entries: null, summary: null },

  { id: 'p12', title: 'Vaesen: Nordic Horror', pub: 'Free League Publishing', sys: 'Year Zero', kind: 'Core Rules',
    pages: 272, size: 134.6, added: '2026-07-29', released: '2020-04-01', color: '#2C3E50',
    state: 'downloaded', root: 'local', tags: ['running'], fmt: 'PDF',
    desc: 'Investigate the creatures of Nordic folklore in a mythic nineteenth-century Scandinavia.',
    files: [ { n: 'Vaesen.pdf', k: 'pdf', s: 128.2, state: 'downloaded' },
             { n: 'Vaesen_Maps.zip', k: 'zip', s: 6.4, state: 'downloaded' } ],
    entries: [ { p: 'Upsala_HQ.png', s: 3.1 }, { p: 'Region_Map.png', s: 3.3 } ],
    summary: null },

  { id: 'p13', title: 'Ten Candles', pub: 'Cavalry Games', sys: 'Ten Candles', kind: 'Core Rules',
    pages: 112, size: 18.9, added: '2026-07-22', released: '2015-10-01', color: '#1A1A1A',
    state: 'downloaded', root: 'local', tags: ['favorite'], fmt: 'PDF',
    desc: 'A tragic horror game played by candlelight, where every character dies before the last flame goes out.',
    files: [ { n: 'TenCandles.pdf', k: 'pdf', s: 18.9, state: 'downloaded' } ],
    entries: null, summary: null },

  { id: 'p14', title: 'Eat the Reich', pub: 'Rowan, Rook and Decard', sys: 'Bite Marks', kind: 'Adventure',
    pages: 96, size: 54.2, added: '2026-07-16', released: '2023-10-01', color: '#9B2226',
    state: 'cloud', root: null, tags: [], fmt: 'PDF',
    desc: 'Vampire commandos are air-dropped into occupied Paris to drink Hitler dry.',
    files: [ { n: 'EatTheReich.pdf', k: 'pdf', s: 54.2, state: 'cloud' } ],
    entries: null, summary: null },

  { id: 'p15', title: 'Mothership Player\'s Survival Guide', pub: 'Tuesday Knight Games', sys: 'Mothership', kind: 'Core Rules',
    pages: 48, size: 31.5, added: '2026-07-10', released: '2023-02-01', color: '#0F3B47',
    state: 'downloaded', root: 'vault', tags: ['running', 'reference'], fmt: 'PDF',
    desc: 'Survive the horrors of deep space as a freelancer, android, scientist, or teamster.',
    files: [ { n: 'Mothership_PSG.pdf', k: 'pdf', s: 31.5, state: 'downloaded' } ],
    entries: null, summary: null },

  { id: 'p16', title: 'The One Ring 2E', pub: 'Free League Publishing', sys: 'The One Ring', kind: 'Core Rules',
    pages: 272, size: 198.4, added: '2026-07-04', released: '2022-02-01', color: '#4A3A1E',
    state: 'offloaded', root: 'icloud', tags: ['toread'], fmt: 'PDF',
    desc: 'Adventure in the lands of Middle-earth during the long watchful peace before the War of the Ring.',
    files: [ { n: 'TOR2E.pdf', k: 'pdf', s: 198.4, state: 'offloaded' } ],
    entries: null, summary: null },

  { id: 'p17', title: 'Heart: The City Beneath', pub: 'Rowan, Rook and Decard', sys: 'Resistance', kind: 'Core Rules',
    pages: 248, size: 102.8, added: '2026-06-28', released: '2020-09-01', color: '#6E1F3A',
    state: 'downloaded', root: 'vault', tags: [], fmt: 'PDF',
    desc: 'Delve into a living, hungry dungeon that reshapes itself around the desires of those who enter.',
    files: [ { n: 'Heart.pdf', k: 'pdf', s: 102.8, state: 'downloaded' } ],
    entries: null, summary: null },

  { id: 'p18', title: 'Dolmenwood Campaign Book', pub: 'Necrotic Gnome', sys: 'OSE', kind: 'Setting',
    pages: 304, size: 221.0, added: '2026-06-21', released: '2024-11-01', color: '#2F4F2F',
    state: 'downloading', root: 'vault', tags: ['running'], fmt: 'PDF', progress: 0.21,
    desc: 'A mythic fairy-tale wilderness of ancient woods, scheming fairy lords, and goat-men.',
    files: [ { n: 'Dolmenwood_Campaign.pdf', k: 'pdf', s: 221.0, state: 'downloading' } ],
    entries: null, summary: null },
];

/* `synced: true` marks a collection that is a real DriveThruRPG product list - every
   manual collection today is one, with no separate local model. Smart collections are
   local-only saved queries, but can reference a synced collection as one predicate among
   others via the `collection` facet (see s4 below), rather than being a separate kind of
   thing from it. */
const COLLECTIONS = [
  { id: 'c1', name: 'Thursday Game', kind: 'manual', count: 6, icon: 'folder', synced: true },
  { id: 'c2', name: 'Horror Shelf', kind: 'manual', count: 11, icon: 'folder', synced: true },
  { id: 'c3', name: 'Print Queue', kind: 'manual', count: 3, icon: 'folder', synced: true },
  { id: 's1', name: 'Big Downloads', kind: 'smart', count: 24, icon: 'smart',
    rules: [ { f: 'size', o: 'gt', v: '150 MB' }, { f: 'state', o: 'is', v: 'downloaded' } ] },
  { id: 's2', name: 'Unread Adventures', kind: 'smart', count: 17, icon: 'smart',
    rules: [ { f: 'kind', o: 'is', v: 'Adventure' }, { f: 'tag', o: 'not', v: 'Running' } ] },
  { id: 's4', name: 'Thursday Game - Unread', kind: 'smart', count: 2, icon: 'smart',
    rules: [ { f: 'collection', o: 'is', v: 'Thursday Game' }, { f: 'tag', o: 'not', v: 'Running' } ] },
  { id: 's3', name: 'Free League Everything', kind: 'smart', count: 9, icon: 'smart',
    rules: [ { f: 'publisher', o: 'is', v: 'Free League Publishing' } ] },
];

const fmt = {
  size(mb) {
    if (mb == null) return '-';
    if (mb >= 1024) return (mb / 1024).toFixed(1) + ' GB';
    if (mb < 1) return Math.round(mb * 1024) + ' KB';
    return mb.toFixed(1) + ' MB';
  },
  date(iso) {
    if (!iso) return '-';
    const [y, m, d] = iso.split('-');
    return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m - 1] + ' ' + +d + ', ' + y;
  },
  shortDate(iso) {
    if (!iso) return '-';
    const [y, m, d] = iso.split('-');
    return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m - 1] + ' ' + +d;
  },
  num(n) { return n.toLocaleString('en-US'); },
};

/* ---- derived aggregates, standing in for what SQL would compute in the real app ---- */
const AGG = {
  byPublisher() {
    const m = new Map();
    CATALOG.forEach(b => m.set(b.pub, (m.get(b.pub) || 0) + 1));
    return [...m].sort((a, b) => b[1] - a[1]);
  },
  bySystem() {
    const m = new Map();
    CATALOG.forEach(b => m.set(b.sys, (m.get(b.sys) || 0) + 1));
    return [...m].sort((a, b) => b[1] - a[1]);
  },
  byKind() {
    const m = new Map();
    CATALOG.forEach(b => m.set(b.kind, (m.get(b.kind) || 0) + 1));
    return [...m].sort((a, b) => b[1] - a[1]);
  },
  byState() {
    const m = new Map();
    CATALOG.forEach(b => m.set(b.state, (m.get(b.state) || 0) + 1));
    return [...m];
  },
  sizeByPublisher() {
    const m = new Map();
    CATALOG.forEach(b => m.set(b.pub, (m.get(b.pub) || 0) + b.size));
    return [...m].sort((a, b) => b[1] - a[1]);
  },
  addedByMonth() {
    const m = new Map();
    CATALOG.forEach(b => {
      const k = b.added.slice(0, 7);
      m.set(k, (m.get(k) || 0) + 1);
    });
    return [...m].sort();
  },
  totalSize() { return CATALOG.reduce((s, b) => s + b.size, 0); },
  totalPages() { return CATALOG.reduce((s, b) => s + b.pages, 0); },
  downloaded() { return CATALOG.filter(b => b.state === 'downloaded').length; },
};

const AUDIT = [
  { ts: '14:22:08', tool: 'search_library', dsc: 'query "gothic horror" → 4 results', scope: 'read' },
  { ts: '14:22:11', tool: 'get_item', dsc: 'Curse of Strahd (p1)', scope: 'read' },
  { ts: '14:22:14', tool: 'get_item_summary', dsc: 'Curse of Strahd - cached, no model call', scope: 'read' },
  { ts: '14:19:02', tool: 'add_to_collection', dsc: 'Vaesen → "Thursday Game"', scope: 'write' },
  { ts: '14:18:55', tool: 'list_collections', dsc: '6 collections', scope: 'read' },
  { ts: '13:47:31', tool: 'download_item', dsc: 'Dolmenwood → Archive Vault (denied: scope off)', scope: 'download' },
];

window.TAGS = TAGS;
window.ROOTS = ROOTS;
window.CATALOG = CATALOG;
window.COLLECTIONS = COLLECTIONS;
window.AUDIT = AUDIT;
window.AGG = AGG;
window.fmt = fmt;
