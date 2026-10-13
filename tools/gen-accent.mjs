// Builds other/accent.css: every Steam rule that uses the blue accent (#1a9fff)
// is copied with the blue replaced by var(--kmg-accent), keeping each alpha.
// Hashed class names are swapped for CSS Loader's stable names when known.
// usage: node gen-accent.mjs <out.css> <blue_*.json ...>
import fs from 'node:fs';

const [, , out, ...inputs] = process.argv;
const mapping = JSON.parse(fs.readFileSync(new URL('./stable.json', import.meta.url)));

// hash -> stable readable name (module_Name_xxxxx), the form CSS Loader translates
const readable = new Map();
for (const v of Object.values(mapping)) {
  const vs = Array.isArray(v) ? v : [v];
  const hash = vs[vs.length - 1];
  const suffix = String(hash).replace(/^_/, '').slice(0, 5);
  // CSS Loader resolves every alias in the list; prefer the one named after this hash.
  const aliases = vs.filter((x) => /^[a-z0-9]+_[A-Za-z0-9-]+_[A-Za-z0-9-]+$/.test(x));
  const name = aliases.find((x) => x.endsWith('_' + suffix)) ?? aliases[0];
  if (name && hash && !readable.has(hash)) readable.set(hash, name);
}

const rules = new Map();
for (const f of inputs) for (const r of JSON.parse(fs.readFileSync(f, 'utf8'))) rules.set(r.sel + '|' + r.props.join(';'), r);

const BLUE = /rgba?\(\s*26,\s*159,\s*255(?:,\s*([\d.]+))?\s*\)|#1a9fff([0-9a-f]{2})?/gi;
const toAccent = (value) =>
  value.replace(BLUE, (_m, a, hexA) => {
    const alpha = a !== undefined ? parseFloat(a) : hexA ? parseInt(hexA, 16) / 255 : 1;
    if (alpha >= 1) return 'var(--kmg-accent)';
    return `color-mix(in srgb, var(--kmg-accent) ${Math.round(alpha * 1000) / 10}%, transparent)`;
  });

const translateSelector = (sel) =>
  sel.replace(/\.([_a-zA-Z][_a-zA-Z0-9-]*)/g, (m, cls) => (readable.has(cls) ? '.' + readable.get(cls) : m));

let css = `/*
  Accent color: replaces Steam's blue (#1a9fff) with --kmg-accent.
  Generated from the SteamUI stylesheets; each rule keeps its original alpha.
*/
`;
let n = 0;
for (const r of rules.values()) {
  const decls = r.props
    .map((p) => {
      const i = p.indexOf(':');
      const prop = p.slice(0, i).trim();
      const value = p.slice(i + 1).replace(/\s*!important\s*$/, '').trim();
      return `  ${prop}: ${toAccent(value)} !important;`;
    })
    .join('\n');
  css += `\n${translateSelector(r.sel)} {\n${decls}\n}\n`;
  n++;
}
fs.writeFileSync(out, css);
console.log(`wrote ${n} rules to ${out}`);
