# Tools

Scripts used to build parts of the theme. You only need them to change the
options or to regenerate the generated CSS after a big Steam update.

## theme.json

`theme.json` is generated; edit `genjson.mjs` instead, then run:

```sh
node tools/genjson.mjs .
```

The `DEFAULT_PRESET` block at the end of `genjson.mjs` sets the default value
of each option.

## Generated CSS

`other/accent.css` and `other/overlay-glass.css` are generated from the
SteamUI stylesheets, so they follow Steam's current class names.

1. Download CSS Loader's class mappings next to the scripts:
   `curl -o tools/stable.json https://api.deckthemes.com/stable.json`
2. On the Deck, enable CEF remote debugging in Decky's developer settings.
   Then open the Steam menu or Quick Access with the theme **disabled**, so
   the scans only see Steam's own styles.
3. Scan the stylesheets (`DECK_IP` is the Deck's IP address):

   ```sh
   cd tools
   for w in "Modo Big Picture" MainMenu QuickAccess; do
     DECK_IP=... node cdp.mjs "$w" scan/blue.js > "blue_${w// /}.json"
   done
   DECK_IP=... node cdp.mjs QuickAccess scan/scan.js > scan.json
   DECK_IP=... node cdp.mjs QuickAccess scan/scancolor.js > scancolor.json
   DECK_IP=... node cdp.mjs QuickAccess scan/scantext.js > scantext.json
   DECK_IP=... node cdp.mjs QuickAccess scan/scanshadow.js > scanshadow.json
   DECK_IP=... node cdp.mjs MainMenu scan/scanlight.js > scanlight.json
   ```

   The first argument is part of the page title; the main window is
   "Steam Big Picture Mode" (or its translation in your Steam language).
4. Generate:

   ```sh
   node gen-accent.mjs ../other/accent.css blue_*.json
   node gen-glass.mjs ../other/overlay-glass.css scan.json scancolor.json scantext.json scanshadow.json scanlight.json
   ```
