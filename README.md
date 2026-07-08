# Easy Toggle Sidebars

## How It Works

**1. Choose a modifier combination** — pick any combination of Ctrl, Shift, Alt, Win/Meta (e.g. Ctrl+Shift). Ctrl by default.

**2. Hold the modifiers and move the mouse** over the editor (no click needed):

| Direction | Action |
| --------- | ------ |
| → Right | Toggle right sidebar |
| ← Left | Toggle left sidebar |
| ↓ Down | Toggle **both** sidebars |
| ↑ Up | Reveal active file in the file explorer |

Works with both **mouse** and **trackpad**.

> **Important:** Do not click before moving. This limitation is intentional — it prevents interference with other operations like text selection or drag-and-drop.

**3. Release the modifiers between successive gestures.**

---

**4. Reveal on title click** — hold your modifier combination and click the view header title to reveal the active file in the file explorer.

**5. Auto-Hide** — when enabled, clicking inside the editor automatically closes the sidebars. A ribbon icon lets you toggle auto-hide on/off.

**6. Pin tabs** — double-click any tab header to toggle its pin state. Works in any window and any view type.

**7. Works on virtually all views and secondary windows** — including Canvas, Excalidraw, etc.

**8. Minimal Editor Width** — sidebars are automatically hidden when the editor area becomes narrower than a configured pixel threshold.

---

## Modifier Matching

The matching is **exact**: if you configure Ctrl+Shift, holding an extra key like Alt will **not** trigger the gesture. This prevents conflicts with other plugins.

> Note: **Ctrl+Alt is equivalent to AltGr**.

## Commands

Two commands are available in the command palette (assignable to hotkeys):

- **Toggle both sidebars** — opens or closes both sidebars at once
- **Toggle autohide sidebars** — enables or disables the auto-hide feature

## Related Plugin

[obsidian-gesture-commander](https://github.com/3C0D/obsidian-gesture-commander) uses the same gesture process to trigger arbitrary commands. Both plugins can coexist thanks to the wide range of possible modifier combinations.

## Settings Overview

| Setting | Description |
| ------- | ----------- |
| Auto hide | Auto-hide sidebars when clicking the editor; adds a ribbon icon |
| Minimal editor width | Auto-hide sidebars when editor is narrower than threshold |
| Set editor min width | Pixel threshold for minimal editor width (200–800 px) |
| Double click on tab headers to toggle pin | Enable/disable the tab pin toggle |
| Reveal file on title click with modifiers | Enable/disable the title click reveal |
| Swipe gesture | Enable/disable the modifier + swipe gesture |
| Swipe gesture: Shift / Ctrl / Alt / Win | Choose which modifier(s) to require |
| Swipe threshold (px) | Minimum swipe distance to trigger an action (30–200 px) |

## Development

Automate the development and publication processes on github, including releases. You are supposed to git clone your plugin out of the vault and set the right path in the .env file (1 for your trying vault, 1 for the real vault).

If you want more options like sass, check out other branches

### Environment Setup

- **Development in the plugins folder of your vault:**
  - Set the `REAL` variable to `-1` in the `.env` file. Or delete the file. Run the usual npm commands.

- **Development outside the vault:**
  - If your plugin's source code is outside the vault, the necessary files will be automatically copied to the targeted vault. Set the paths in the .env file. Use TestVault for the development vault and RealVault to simulate production.

- **other steps:**
  - You can then do `npm run version` to update the version and do the push of the changed files (package, manifest, version). Prompts will guide you.

  - You can then do `npm run release` to create the release. Few seconds later you can see the created release in the GitHub releases.

### Available Commands

*I recommend a `npm run start` then `npm run bacp` then `npm run version` then `npm run release`. Super fast and easy.*

- **`npm run dev` and `npm start`**: For development.
  `npm start` opens Visual Studio Code, runs `npm install`, and then `npm run dev`

- **`npm run build`**: Builds the project in the folder containing the source code.

- **`npm run real`**: Equivalent to a traditional installation of the plugin in your REAL vault.

- **`npm run bacp`** & **`npm run acp`**: `b` stands for build, and `acp` stands for add, commit, push. You will be prompted for the commit message.

- **`npm run version`**: Asks for the type of version update, modifies the relevant files, and then performs an add, commit, push.

- **`npm run release`**: Asks for the release title, creates the release. This command works with the configurations in the `.github` folder. The release title can be multiline by using `\n`.
