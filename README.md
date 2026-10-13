# Kitsune Midnight Glass

A [CSS Loader](https://github.com/DeckThemes/SDH-CssLoader) theme for the Steam Deck
(Game Mode / Big Picture) that turns the UI black while **keeping Steam's blur and
transparency**. It also bundles a cleaner game page, so you don't need several
separate gameview themes.

![Game page](images/gameview.png)

## Features

- **Black UI, still glassy**: menus, Quick Access, Steam menu, context menus,
  library, settings, downloads and notifications go black (or any color you pick),
  with an adjustable opacity so the blur behind them can still show through.
- **Darker game page**: the area below the play bar (friends, activity, news)
  gets a black base with the game artwork faintly showing behind it, and the
  blue-gray cards become neutral.
- **Play bar + HowLongToBeat as one panel**: Transparent, Blur, Gradient,
  Gradient + Blur or Clear, with shared opacity and tint.
- **Game logo control**: keep the logo above the HLTB bar, lift it, resize it.
- **Clean Gameview layout** with hero alignment, zoom and blur options built in.
- **Plugin touches**: adjustable opacity for the "players online" badge
  (PlayCount) and border style for the ProtonDB Badges indicator.
- Fixes a Clean Gameview issue where dragging the page by its background
  scrolled past the tabs and left the content cut off.

## Install

1. Download `Kitsune-Midnight-Glass-vX.Y.zip` (or `.rar`) from the
   [latest release](https://github.com/K1tsune12/decky-kitsune-midnight-glass-theme/releases/latest).
2. In Desktop Mode, extract it into `~/homebrew/themes/`, so you end up with
   `~/homebrew/themes/Kitsune Midnight Glass/theme.json`.
3. Back in Game Mode, open CSS Loader, refresh the theme list and enable
   **Kitsune Midnight Glass**.

Disable **Clean Gameview**, **Clean Gameview - Custom Zoom & Blur**,
**Blur Gameview Background** and **Obsidian** while using this theme, since it
already includes what they do.

## Options

| Option | What it does |
|---|---|
| Main Color | Base color of the UI (Black by default, presets or a custom color) |
| Menu Opacity | Opacity of menus and popups (100% = solid) |
| Gameview Darkness | How dark the game page is below the play bar (Original keeps Steam's look) |
| Online Badge Opacity | Background opacity of the PlayCount "online" badge |
| Play Bar Style | Transparent, Blur, Gradient, Gradient + Blur or Clear, for the play bar and HLTB bar |
| Play Bar Opacity | Strength of the play bar / HLTB background |
| Play Bar Tint | Steam's original tint or the theme's main color |
| Connect Hero with Body | Lets the hero image continue behind the play bar area |
| Hero Alignment | Zoom-Center, Zoom-Left, Zoom-Right, Contain, Stretch or Custom Zoom & Blur |
| Official / Custom Hero Zoom | Zoom for official and custom artwork (Custom Zoom & Blur mode) |
| Zoom Fill Blur | Blur of the fill behind the zoomed image (Custom Zoom & Blur mode) |
| Hero Blur / Hero Brightness | Blur and brightness of the hero image |
| Show Steam Cloud | Shows the cloud sync status icon in the play bar |
| Ignore Footer | Lets the hero use the full screen height |
| Lock Logo | Keeps the logo at a fixed position and size |
| Logo Above HLTB | Moves the logo above the HowLongToBeat bar when it is shown |
| Logo Lift / Logo Size | Moves the logo up and resizes it |
| ProtonDB Badge Border | Default, Match Tier, White or None |
| Disable Glow | Removes the glow behind focused games |

## Credits

This theme builds on the work of:

- [Obsidian](https://deckthemes.com) by EMERALD0874: black UI
- Clean Gameview by SuchMeme: game page layout
- Clean Gameview - Custom Zoom & Blur by Cegrosa: hero zoom and blur fill
- Blur Gameview Background by gaker19: hero blur and brightness
