# Easy Toggle Sidebars

Toggle Obsidian's sidebars with simple swipe gestures — works with both **mouse** and **trackpad**, no click required.

## Swipe Gestures

Hold your configured modifier key(s) and swipe anywhere in the window. Works on **any view type** (editor, Canvas, Excalidraw, etc.).

> **No drag, no click** — just hold the modifier(s) first, then swipe. The gesture won't trigger during a click-and-drag (e.g. text selection), so it never interferes with your normal workflow.

| Swipe direction | Action                                  |
| --------------- | --------------------------------------- |
| ← Left          | Toggle left sidebar                     |
| → Right         | Toggle right sidebar                    |
| ↓ Down          | Toggle **both** sidebars                |
| ↑ Up            | Reveal active file in the file explorer |

### Configurable Modifiers

Choose any combination of modifier keys to activate the swipe gesture:

- **Shift**
- **Ctrl**
- **Alt**
- **Win / Meta** (Meta on Linux, Cmd on Mac)

You can use a single key (e.g. Ctrl) or combine several (e.g. Ctrl + Alt). Note that **Ctrl + Alt is equivalent to AltGr** on keyboards that have an AltGr key. The matching is **exact**: if you configure Ctrl + Alt, holding an extra key like Shift will **not** trigger the gesture. This prevents conflicts with other plugins that may use different modifier combinations.

> A **threshold** setting (in pixels) controls the minimum swipe distance needed to trigger an action. Increase it if gestures trigger too easily, decrease it if you need to swipe further.

## Other Features

### Reveal on Title Click

Click the **view header title** while holding your configured modifiers to reveal the active file in the file explorer. Useful in views like Monaco-based editors where the swipe-up gesture isn't available.

### Toggle Pin on Tab Header

**Double-click** any tab header to toggle its pin state. Works in any window and any view type.

### Auto-Hide

When enabled, clicking inside any **workspace leaf** (editor, Canvas, etc.) automatically hides the sidebars, except when clicking the view header (title bar). A **ribbon icon** lets you quickly toggle auto-hide on/off (highlighted when active).

### Minimal Editor Width

When the editor area becomes narrower than the configured threshold (in pixels), sidebars are automatically hidden to give more space to the editor.

## Commands

Two commands are available in the command palette (assignable to hotkeys):

- **Toggle both sidebars** — opens or closes both sidebars at once
- **Toggle autohide sidebars** — enables or disables the auto-hide feature

## Settings Overview

| Setting                                   | Description                                                     |
| ----------------------------------------- | --------------------------------------------------------------- |
| Auto hide                                 | Auto-hide sidebars when clicking the editor; adds a ribbon icon |
| Minimal editor width                      | Auto-hide sidebars when editor is narrower than threshold       |
| Set editor min width                      | Pixel threshold for minimal editor width (200–800 px)           |
| Double click on tab headers to toggle pin | Enable/disable the tab pin toggle                               |
| Reveal file on title click with modifiers | Enable/disable the title click reveal                           |
| Swipe gesture                             | Enable/disable the modifier + swipe gesture                     |
| Swipe gesture: Shift / Ctrl / Alt / Win   | Choose which modifier(s) to require                             |
| Swipe threshold (px)                      | Minimum swipe distance to trigger an action (30–200 px)         |

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
