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
    this.registerDomEvents();
    registerCommands(this);

    this.registerDomEvent(document, 'click', autoHide.bind(this));

    this.registerEvent(this.app.workspace.on('resize', () => onResize(this)));
  }

  private registerDomEvents(): void {
    this.registerDomEvent(document, 'mousedown', (e: MouseEvent) =>
      mousedownHandler(this, e)
    );
    this.registerDomEvent(document, 'mousemove', (e: MouseEvent) =>
      mousemoveHandler(this, e)
    );
    this.registerDomEvent(document, 'mouseup', (e: MouseEvent) =>
      mouseupHandler(this, this.app, e)
    );
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}
