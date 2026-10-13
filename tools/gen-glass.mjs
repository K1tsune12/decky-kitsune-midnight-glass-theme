// Builds other/overlay-glass.css for the Steam menu and Quick Access windows:
//  - focus animations (gray / translucent white) become translucent black,
//    driven by --kmg-focus-from / --kmg-focus-to
//  - solid gray / blue-gray backgrounds become translucent black, keeping the
//    relative hierarchy (lighter grays -> lighter black)
//  - text that Steam darkens on focus/hover (made for a light highlight) stays light
//  - Steam's dim secondary text grays (made for its blue background) get lighter
//  - solid blue-gray fade shadows under headers are removed
//  - white highlights and light translucent panels become dark
// usage: node gen-glass.mjs <out.css> <scan.json> [scancolor.json] [scantext.json] [scanshadow.json] [scanlight.json]
import fs from 'node:fs';

const [, , out, scanFile, colorFile, textFile, shadowFile, lightFile] = process.argv;
const scan = JSON.parse(fs.readFileSync(scanFile, 'utf8'));
const mapping = JSON.parse(fs.readFileSync(new URL('./stable.json', import.meta.url)));

const readable = new Map();
for (const v of Object.values(mapping)) {
  const vs = Array.isArray(v) ? v : [v];
  const hash = vs[vs.length - 1];
  const suffix = String(hash).replace(/^_/, '').slice(0, 5);
  const aliases = vs.filter((x) => /^[a-z0-9]+_[A-Za-z0-9-]+_[A-Za-z0-9-]+$/.test(x));
  const name = aliases.find((x) => x.endsWith('_' + suffix)) ?? aliases[0];
  if (name && hash && !readable.has(hash)) readable.set(hash, name);
}
const translate = (sel) =>
  sel.replace(/\.([_a-zA-Z][_a-zA-Z0-9-]*)/g, (m, cls) => (readable.has(cls) ? '.' + readable.get(cls) : m));

const parse = (v) => {
  const m = v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  return m && { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
};
const isGreen = (c) => c.g > c.r + 40 && c.g > c.b + 40;

// Gray level 10..110 -> black alpha 0.55..0.25 (lighter gray = lighter black)
const blackFor = (c) => {
  const level = Math.max(c.r, c.g, c.b);
  const t = Math.min(1, Math.max(0, (level - 10) / 100));
  const alpha = Math.round((0.55 - t * 0.3) * 100) / 100;
  return `rgba(0, 0, 0, ${alpha})`;
};

let css = `/*
  Overlay glass for the Steam menu and Quick Access windows (generated).
  These windows sit on top of the game, where CSS blur has nothing to blur and
  solid grays hide the game. Blur comes from gamescope (Midnight Glass Overlay).
*/
:root {
  --kmg-focus-to: rgba(0, 0, 0, var(--kmg-select-alpha, 0.45));
  --kmg-focus-from: rgba(0, 0, 0, calc(var(--kmg-select-alpha, 0.45) + 0.15));
}

/* CSS blur turns black over a game */
*, *::before, *::after {
  backdrop-filter: none !important;
}
`;

// 1) Focus animations
const kfSeen = new Set();
let kfCount = 0;
for (const k of scan.kf) {
  if (kfSeen.has(k.name)) continue;
  kfSeen.add(k.name);
  const colors = k.frames.map((f) => parse(f.split(':').slice(1).join(':'))).filter(Boolean);
  if (!colors.length || colors.some(isGreen)) continue;
  const grayOrWhite = colors.every((c) => Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b) <= 40);
  if (!grayOrWhite) continue;
  css += `@keyframes ${k.name} { 0% { background-color: var(--kmg-focus-from); } 100% { background-color: var(--kmg-focus-to); } }\n`;
  kfCount++;
}

// 2) Solid gray backgrounds
css += '\n';
const bySel = new Map();
for (const r of scan.bg) {
  const c = parse(r.val);
  if (!c || isGreen(c)) continue;
  const sel = translate(r.sel);
  if (/:root|html|body\b/.test(sel)) continue;
  bySel.set(sel, blackFor(c));
}
for (const [sel, color] of bySel) css += `${sel} { background-color: ${color} !important; }\n`;

// 3) Dark text on focus/hover would be unreadable on a black highlight
if (colorFile) {
  const colorRules = JSON.parse(fs.readFileSync(colorFile, 'utf8'));
  const lightSel = new Map();
  for (const r of colorRules) {
    if (/disabled/i.test(r.sel)) continue; // disabled items are meant to look dim
    const sel = translate(r.sel);
    lightSel.set(sel + '|' + r.prop, { sel, prop: r.prop });
  }
  css += '\n/* Focused / hovered text stays light on the dark highlight */\n';
  for (const { sel, prop } of lightSel.values()) css += `${sel} { ${prop}: #fff !important; }\n`;
  console.log(`light text rules: ${lightSel.size}`);
}

// 4) Secondary text: lift Steam's dim grays so they read on translucent black
if (textFile) {
  const LIFT = { '61,68,80': '#9ba1a8', '70,77,88': '#9ba1a8', '103,112,123': '#b8bdc2' };
  const textSel = new Map();
  for (const r of JSON.parse(fs.readFileSync(textFile, 'utf8'))) {
    if (/disabled/i.test(r.sel)) continue;
    const key = r.val.match(/\d+/g).join(',');
    if (LIFT[key]) textSel.set(translate(r.sel), LIFT[key]);
  }
  css += '\n/* Secondary text readable on translucent black */\n';
  for (const [sel, color] of textSel) css += `${sel} { color: ${color} !important; }\n`;
  console.log(`secondary text rules: ${textSel.size}`);
}

// 5) Solid blue-gray "fade" shadows under headers look like a dirty gradient over the game
if (shadowFile) {
  const shadowSel = new Set(JSON.parse(fs.readFileSync(shadowFile, 'utf8')).map((r) => translate(r.sel)));
  css += '\n/* No solid blue-gray fade shadows */\n';
  for (const sel of shadowSel) css += `${sel} { box-shadow: none !important; }\n`;
  console.log(`shadow rules: ${shadowSel.size}`);
}

// 6) White / light highlights (focused tabs, hovered rows) and light translucent panels
//    (stats blocks, info boxes) become the dark selection / translucent black.
if (lightFile) {
  const CONTROL = /Button|Toggle|Slider|Input|Dropdown|Checkbox|Radio|Progress|Scrollbar|scrollbar|Notch|Track|Knob|Rail/i;
  const light = JSON.parse(fs.readFileSync(lightFile, 'utf8'));
  const focusSel = new Set();
  for (const r of light.focus) {
    if (/scrollbar/i.test(r.sel)) continue;
    focusSel.add(translate(r.sel));
  }
  const panelSel = new Set();
  for (const r of light.panels) {
    const sel = translate(r.sel);
    if (CONTROL.test(sel) || /:root|html|body\b/.test(sel)) continue;
    panelSel.add(sel);
  }
  css += '\n/* Light highlights become the dark selection */\n';
  for (const sel of focusSel) css += `${sel} { background: var(--kmg-focus-to) !important; }\n`;
  css += '\n/* Light translucent panels become translucent black */\n';
  for (const sel of panelSel) css += `${sel} { background: rgba(0, 0, 0, 0.35) !important; }\n`;
  console.log(`light highlight rules: ${focusSel.size}, light panel rules: ${panelSel.size}`);
}

// 7) Main panels keep the theme color / Menu Opacity (higher specificity than the rules above)
css += `
/* Main panels follow Main Color + Menu Opacity */
:root .mainmenu_Menu_23IDi,
:root .mainmenuapprunning_NavigationColumn_27FEg,
:root .mainmenuapprunning_AppColumn_3FAI9,
:root .quickaccessmenu_QuickAccessMenu_V0cr-,
:root .GamepadMode.friendlist,
:root .GamepadMode.friendlist.gpfocuswithin {
  background: var(--kmg-menu) !important;
}
:root .multiChatDialog.GamepadMode,
:root .GamepadMode .multiChatDialog {
  background: var(--kmg-chat) !important;
}
:root .quickaccessmenu_Tab_1S76C:not(.quickaccessmenu_Selected_2QHMu) {
  background: transparent !important;
}
`;

fs.writeFileSync(out, css);
console.log(`keyframes: ${kfCount}, background rules: ${bySel.size}, size: ${(css.length / 1024).toFixed(0)} KiB`);
