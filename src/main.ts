import { Plugin } from 'obsidian';
import { ETSSettingTab } from './settings.ts';
import { mousedownHandler } from './mouseDown.ts';
import { autoHide, autoHideON } from './autoHide.ts';
import { onResize } from './window.ts';
import type { ETSSettings } from './types/settings.ts';
import { DEFAULT_SETTINGS } from './constants/index.ts';
import { registerCommands } from './commands.ts';
import { mousemoveHandler } from './mouseMove.ts';
import { mouseupHandler } from './mouseUp.ts';
import { MouseState } from './state/mouseState.ts';

export default class EasytoggleSidebar extends Plugin {
  settings!: ETSSettings;
  ribbonIconEl: HTMLElement | null = null;
  mouse = new MouseState();
  async onload(): Promise<void> {
    await this.loadSettings();
    this.addSettingTab(new ETSSettingTab(this.app, this));
    if (this.settings.autoHideRibbon) autoHideON(this);
    this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));
  }

  private onLayoutReady(): void {
    // Register on the main window's document.
    this.registerDomEvents(document);

    // Register on any already-open popout windows and on windows opened later,
    // so gestures and Toggle Pin work in secondary windows too. Leaves inside
    // the same popout share a single document, so dedupe before registering.
    const registeredDocs = new Set<Document>([document]);
    this.app.workspace.iterateAllLeaves((leaf) => {
      const doc = leaf.getContainer().doc;
      if (!registeredDocs.has(doc)) {
        registeredDocs.add(doc);
        this.registerDomEvents(doc);
      }
    });
    this.registerEvent(
      this.app.workspace.on('window-open', (_workspaceWin, win) =>
        this.registerDomEvents(win.document)
      )
    );

    registerCommands(this);

    this.registerEvent(this.app.workspace.on('resize', () => onResize(this)));
  }

  private registerDomEvents(doc: Document): void {
    this.registerDomEvent(doc, 'mousedown', (e: MouseEvent) =>
      mousedownHandler(this, e)
    );
    this.registerDomEvent(doc, 'mousemove', (e: MouseEvent) =>
      mousemoveHandler(this, e)
    );
    this.registerDomEvent(doc, 'mouseup', (e: MouseEvent) =>
      mouseupHandler(this, this.app, e)
    );
    this.registerDomEvent(doc, 'click', autoHide.bind(this));
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}
