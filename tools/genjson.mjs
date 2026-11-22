// Generates theme.json for Kitsune Midnight Glass
import fs from 'node:fs';
const dir = process.argv[2];
const ALL = ['SP', 'MainMenu', 'QuickAccess', 'notificationtoasts.*'];
const SP = ['SP'];
const TOAST = ['notificationtoasts.*'];
const v = (name, val, tabs = ALL) => ({ [name]: [val, ...tabs] });

const colors = {
  'Black': '#000', 'Dark Gray': '#121212', 'Gray': '#181818', 'Red': '#271414', 'Orange': '#2b1c0b',
  'Yellow': '#222209', 'Green': '#142714', 'Blue': '#141427', 'Indigo': '#1d1427', 'Violet': '#231427',
};
const mainColor = Object.fromEntries(Object.entries(colors).map(([k, c]) => [k, v('--kmg-main', c)]));
mainColor.Custom = {};

const MENU_TABS = ['MainMenu', 'QuickAccess', 'SP'];
const SP_MENUS = ['SP', 'MainMenu', 'QuickAccess'];

// Notification background presets (with Notification Opacity)
const toastColors = {
  'Black': '#000000', 'Charcoal': '#141414', 'Gray': '#2b2b2b', 'Midnight Blue': '#0b1630', 'Purple': '#2a0845',
};

// Extra width for the Quick Access and Steam menus: label -> px
const widthSteps = (steps, varName, tab, file) => ({
  'Default': {},
  ...Object.fromEntries(steps.map((px) => [`+${px} px`, { ...v(varName, `${px}px`, ['SP', tab]), [file]: ['SP', tab] }])),
});

// ProtonDB Badges library icon corner: top, bottom, left, right
const pdbCorner = (top, bottom, left, right) => ({
  ...v('--kmg-pdb-top', top, SP), ...v('--kmg-pdb-bottom', bottom, SP),
  ...v('--kmg-pdb-left', left, SP), ...v('--kmg-pdb-right', right, SP),
  'protondb/icon-position.css': SP,
});
const pdbBg = (value) => ({ ...v('--kmg-pdb-bg', value, SP), 'protondb/icon-background.css': SP });
const pdbColor = (value) => ({ ...v('--kmg-pdb-color', value, SP), 'protondb/icon-color.css': SP });

// Accent presets (replace Steam's blue #1a9fff)
const accents = {
  'Purple': '#9d01fa', 'Violet': '#b06cff', 'Pink': '#ff4fa3', 'Red': '#ff3b4e',
  'Orange': '#ff8a1f', 'Gold': '#f5c518', 'Green': '#3ddc84', 'Teal': '#1fd1c1', 'White': '#ffffff',
};

const pct = (list, varName, tabs, map = x => String(x / 100)) =>
  Object.fromEntries(list.map(p => [`${p}%`, v(varName, map(p), tabs)]));

// Gameview darkness: label -> artwork opacity behind the content
const darkness = { 'Original': null, '20%': 0.5, '40%': 0.35, '60%': 0.2, '80%': 0.1, '100%': 0 };
const gvDark = Object.fromEntries(Object.entries(darkness).map(([k, a]) =>
  [k, a === null ? {} : { 'gameview/dark.css': SP, ...v('--kmg-gv-art', String(a), SP) }]));

const theme = {
  name: 'Kitsune Midnight Glass',
  author: 'K1tsune12',
  version: 'v1.3',
  manifest_version: 9,
  description: 'Black glass UI inspired by Obsidian that keeps Steam\'s blur and transparency, with Clean Gameview, zoom & blur hero options and a darker game page.',
  inject: {
    'shared.css': ALL,
    'gameview/clean.css': SP,
    'gameview/bar.css': SP,
    'gameview/logo.css': SP,
    'notifications/toast.css': TOAST,
    'other/chat.css': ['SP', 'QuickAccess'],
    'other/new-design.css': SP_MENUS,
  },
  patches: {
    'Main Color': {
      type: 'dropdown', default: 'Black', values: mainColor,
      components: [{ name: 'Custom Color', type: 'color-picker', on: 'Custom', default: '#000', css_variable: '--kmg-main', tabs: ALL }],
    },
    'Accent Color': {
      type: 'dropdown', default: 'Steam Blue',
      values: {
        'Steam Blue': {},
        ...Object.fromEntries(Object.entries(accents).map(([k, c]) =>
          [k, { 'other/accent.css': ALL, ...v('--kmg-accent', c) }])),
        'Custom': { 'other/accent.css': ALL },
      },
      components: [{ name: 'Custom Accent', type: 'color-picker', on: 'Custom', default: '#9d01fa', css_variable: '--kmg-accent', tabs: ALL }],
    },
    'Menu Opacity': {
      type: 'slider', default: '100%',
      values: pct([50, 60, 70, 80, 85, 90, 95, 100], '--kmg-menu-alpha', ALL),
    },
    'Dialog Opacity': {
      type: 'slider', default: '70%',
      values: pct([50, 60, 70, 80, 85, 90, 95, 100], '--kmg-dialog-alpha', ALL),
    },
    'Chat Opacity': {
      type: 'slider', default: '80%',
      values: pct([50, 60, 70, 80, 85, 90, 95, 100], '--kmg-chat-alpha', ALL),
    },
    'Selection Opacity': {
      type: 'slider', default: '45%',
      values: {
        'Original': {},
        ...Object.fromEntries([20, 30, 45, 60, 70].map(p =>
          [`${p}%`, { 'other/selection.css': MENU_TABS, ...v('--kmg-select-alpha', String(p / 100), MENU_TABS) }])),
      },
    },
    'Selection Color': {
      type: 'dropdown', default: 'Black',
      values: {
        'Black': {},
        'Gray': v('--kmg-select-color', '#8b929a', MENU_TABS),
        'White': v('--kmg-select-color', '#ffffff', MENU_TABS),
        'Accent Color': v('--kmg-select-color', 'var(--kmg-accent, #1a9fff)', MENU_TABS),
      },
    },
    'Notification Opacity': {
      type: 'slider', default: '60%',
      values: pct([20, 30, 40, 50, 60, 70, 80, 90, 100], '--kmg-toast-alpha', TOAST),
    },
    'Notification Color': {
      type: 'dropdown', default: 'Main Color',
      values: {
        'Main Color': {},
        ...Object.fromEntries(Object.entries(toastColors).map(([k, c]) => [k, v('--kmg-toast-base', c, TOAST)])),
        'Custom': {},
      },
      components: [{ name: 'Custom Notification Color', type: 'color-picker', on: 'Custom', default: '#000000', css_variable: '--kmg-toast-base', tabs: TOAST }],
    },
    'Overlay Glass': {
      type: 'checkbox', default: 'Yes',
      values: { 'Yes': { 'other/overlay-glass.css': ['MainMenu', 'QuickAccess'] }, 'No': {} },
    },
    'In-Game Menu Style': {
      type: 'checkbox', default: 'Yes',
      values: { 'Yes': { 'other/ingame-menu.css': ['MainMenu'] }, 'No': {} },
    },
    'In-Game Dim': {
      type: 'slider', default: 'Off',
      values: {
        'Steam': {},
        'Off': { 'other/ingame-glass.css': SP, ...v('--kmg-ingame-dim', '0', SP) },
        ...Object.fromEntries([10, 20, 30, 40, 50].map(p =>
          [`${p}%`, { 'other/ingame-glass.css': SP, ...v('--kmg-ingame-dim', String(p / 100), SP) }])),
      },
    },
    'In-Game Bars Follow Menus': {
      type: 'checkbox', default: 'Yes',
      values: { 'Yes': { 'other/ingame-bars.css': ['SP', 'QuickAccess'] }, 'No': {} },
    },
    'Text Shadow': (() => {
      const MENUS = ['MainMenu', 'QuickAccess', 'notificationtoasts.*'];
      const shadows = {
        'Soft': '0 0 3px rgba(0, 0, 0, 0.7), 0 1px 2px rgba(0, 0, 0, 0.6)',
        'Strong': '0 0 6px rgba(0, 0, 0, 0.9), 0 0 2px rgba(0, 0, 0, 0.9)',
      };
      return {
        type: 'dropdown', default: 'Soft',
        values: {
          'Off': {},
          ...Object.fromEntries(Object.entries(shadows).map(([k, sh]) => [k, {
            'other/text-shadow.css': MENUS,
            'other/text-shadow-bars.css': SP,
            ...v('--kmg-text-shadow', sh, [...MENUS, ...SP]),
          }])),
        },
      };
    })(),
    'Gameview Darkness': { type: 'slider', default: '60%', values: gvDark },
    'Home Background Zoom': {
      type: 'dropdown', default: 'Steady',
      values: {
        'Steam': {},
        'Steady': { 'gameview/home-zoom-steady.css': SP },
        'Off': { 'gameview/home-zoom-off.css': SP },
      },
    },
    'Online Badge Opacity': {
      type: 'slider', default: '40%',
      values: Object.fromEntries([0, 20, 40, 60, 80, 100].map(p =>
        [`${p}%`, { 'gameview/badge.css': SP, ...v('--kmg-badge-alpha', String(p / 100), SP) }])),
    },
    'Play Bar Style': {
      type: 'dropdown', default: 'Transparent',
      values: {
        'Transparent': {},
        'Blur': v('--kmg-bar-blur', 'blur(8px)', SP),
        'Gradient': { ...v('--kmg-bar-play-bg', 'linear-gradient(to bottom, var(--kmg-bar-half), var(--kmg-bar-full))', SP), ...v('--kmg-bar-hltb-bg', 'linear-gradient(to bottom, transparent, var(--kmg-bar-half))', SP) },
        'Gradient + Blur': { ...v('--kmg-bar-play-bg', 'linear-gradient(to bottom, var(--kmg-bar-half), var(--kmg-bar-full))', SP), ...v('--kmg-bar-hltb-bg', 'linear-gradient(to bottom, transparent, var(--kmg-bar-half))', SP), ...v('--kmg-bar-hltb-mask', 'linear-gradient(to bottom, transparent, #000)', SP), ...v('--kmg-bar-blur', 'blur(8px)', SP) },
        'Clear': { ...v('--kmg-bar-play-bg', 'transparent', SP), ...v('--kmg-bar-hltb-bg', 'transparent', SP) },
      },
    },
    'Play Bar Opacity': {
      type: 'slider', default: '33%',
      values: pct([10, 20, 33, 50, 65, 80, 100], '--kmg-bar-alpha', SP),
    },
    'Play Bar Tint': {
      type: 'dropdown', default: 'Steam',
      values: {
        'Steam': {},
        'Main Color': v('--kmg-bar-base', 'var(--kmg-main)', SP),
      },
    },
    'Connect Hero with Body': {
      type: 'checkbox', default: 'No',
      values: { 'Yes': { 'gameview/playbar-connected.css': SP }, 'No': {} },
    },
    'Hero Alignment': {
      type: 'dropdown', default: 'Zoom-Center',
      values: {
        'Zoom-Center': {},
        'Zoom-Left': { 'gameview/alignments/left.css': SP },
        'Zoom-Right': { 'gameview/alignments/right.css': SP },
        'Contain': { 'gameview/alignments/contain.css': SP },
        'Stretch': { 'gameview/alignments/stretch.css': SP },
        'Custom Zoom & Blur': { 'gameview/alignments/zoom-blur.css': SP },
      },
    },
    'Official Hero Zoom': {
      type: 'slider', default: '100%',
      values: pct([100, 110, 120, 130, 140, 150], '--kmg-zoom-official', SP, p => `${p}%`),
    },
    'Custom Hero Zoom': {
      type: 'slider', default: '180%',
      values: pct([100, 120, 140, 150, 160, 170, 180, 200], '--kmg-zoom-custom', SP, p => `${p}%`),
    },
    'Zoom Fill Blur': {
      type: 'slider', default: '20px',
      values: Object.fromEntries([0, 10, 20, 30, 40, 50].map(p => [`${p}px`, v('--kmg-fill-blur', `${p}px`, SP)])),
    },
    'Hero Blur': {
      type: 'slider', default: 'Off',
      values: Object.fromEntries(['Off', '2px', '4px', '8px', '16px', '32px'].map(p =>
        [p, p === 'Off' ? {} : { 'gameview/hero-filter.css': SP, ...v('--kmg-hero-blur', p, SP) }])),
    },
    'Hero Brightness': {
      type: 'slider', default: '1',
      values: Object.fromEntries(['0.2', '0.4', '0.6', '0.8', '1', '1.2', '1.4'].map(p => [p, v('--kmg-hero-brightness', p, SP)])),
    },
    'Show Steam Cloud': {
      type: 'checkbox', default: 'Yes',
      values: { 'Yes': { 'gameview/steamcloud.css': SP }, 'No': {} },
    },
    'Ignore Footer': {
      type: 'checkbox', default: 'No',
      values: {
        'Yes': { ...v('--kmg-footer-height', '0px', SP), ...v('--kmg-play-anim-height', '100vh', SP) },
        'No': { ...v('--kmg-footer-height', '40px', SP), ...v('--kmg-play-anim-height', 'min(58vw, calc(100vh - 40px))', SP) },
      },
    },
    'Lock Logo': {
      type: 'checkbox', default: 'Yes',
      values: { 'Yes': { 'gameview/lockedlogo.css': SP }, 'No': {} },
    },
    'Logo Above HLTB': {
      type: 'checkbox', default: 'Yes',
      values: { 'Yes': v('--kmg-logo-hltb-gap', '40px', SP), 'No': v('--kmg-logo-hltb-gap', '0px', SP) },
    },
    'Logo Lift': {
      type: 'slider', default: '0px',
      values: Object.fromEntries([0, 20, 40, 60, 80, 100, 120, 160, 200].map(p => [`${p}px`, v('--kmg-logo-lift', `${p}px`, SP)])),
    },
    'Logo Size': {
      type: 'slider', default: '100%',
      values: pct([50, 60, 70, 80, 90, 100, 110, 125, 150], '--kmg-logo-scale', SP),
    },
    'ProtonDB Badge Border': {
      type: 'dropdown', default: 'Match Tier',
      values: {
        'Default': {},
        'Match Tier': { 'protondb/match-tier.css': SP },
        'White': { 'protondb/white.css': SP },
        'None': { 'protondb/none.css': SP },
      },
    },
    'Disable Glow': {
      type: 'checkbox', default: 'No',
      values: { 'Yes': { 'other/no-glow.css': ALL }, 'No': {} },
    },
    'Quick Access Width': {
      type: 'slider', default: 'Default',
      values: widthSteps([100, 200, 300, 400], '--kmg-qam-extra', 'QuickAccess', 'other/qam-width.css'),
    },
    'Main Menu Width': {
      type: 'slider', default: 'Default',
      values: widthSteps([60, 120, 180, 240], '--kmg-mm-extra', 'MainMenu', 'other/mainmenu-width.css'),
    },
    'ProtonDB Icon Position': {
      type: 'dropdown', default: 'Plugin',
      values: {
        'Plugin': {},
        'Top Left': pdbCorner('4px', 'auto', '4px', 'auto'),
        'Top Right': pdbCorner('4px', 'auto', 'auto', '4px'),
        'Bottom Left': pdbCorner('auto', '4px', '4px', 'auto'),
        'Bottom Right': pdbCorner('auto', '4px', 'auto', '4px'),
        'Hidden': { 'protondb/icon-hidden.css': SP },
      },
    },
    'ProtonDB Icon Background': {
      type: 'dropdown', default: 'Plugin',
      values: {
        'Plugin': {},
        'Transparent': pdbBg('transparent'),
        'Soft Dark': pdbBg('rgba(0, 0, 0, 0.35)'),
        'Main Color': pdbBg('var(--kmg-main, #000)'),
        'Accent Color': pdbBg('var(--kmg-accent, #1a9fff)'),
        'White': pdbBg('rgba(255, 255, 255, 0.85)'),
      },
    },
    'ProtonDB Icon Color': {
      type: 'dropdown', default: 'Status',
      values: {
        'Status': {},
        'White': pdbColor('#fff'),
        'Black': pdbColor('#000'),
        'Accent Color': pdbColor('var(--kmg-accent, #1a9fff)'),
      },
    },
    'Hide ProtonDB Analysis Button': {
      type: 'checkbox', default: 'Yes',
      values: { 'Yes': { 'protondb/analysis-hidden.css': SP }, 'No': {} },
    },
    'Decky Plugin Names': {
      type: 'dropdown', default: 'Right',
      values: { 'Right': {}, 'Left': { 'decky/names-left.css': ['QuickAccess'] } },
    },
  },
};
// Default preset: the author's setup. These override the per-option defaults above.
const DEFAULT_PRESET = {
  'Accent Color': 'Purple',
  'Menu Opacity': '60%',
  'Gameview Darkness': '20%',
  'Online Badge Opacity': '20%',
  'Play Bar Style': 'Gradient + Blur',
  'Play Bar Opacity': '65%',
  'Official Hero Zoom': '150%',
  'Custom Hero Zoom': '150%',
  'Zoom Fill Blur': '0px',
  'Lock Logo': 'No',
  'Logo Size': '90%',
  'ProtonDB Badge Border': 'None',
};
for (const [name, value] of Object.entries(DEFAULT_PRESET)) {
  const patch = theme.patches[name];
  if (!patch || !(value in patch.values)) throw new Error(`bad default preset entry: ${name}=${value}`);
  patch.default = value;
}

fs.writeFileSync(`${dir}/theme.json`, JSON.stringify(theme, null, 2) + '\n');
console.log('ok');
