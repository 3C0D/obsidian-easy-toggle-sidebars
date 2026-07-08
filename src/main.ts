import { Plugin } from 'obsidian';
import { ETSSettingTab } from './settings.ts';
import { autoHide, autoHideON } from './autoHide.ts';
import { onResize } from './window.ts';
import type { ETSSettings } from './types/settings.ts';
import { DEFAULT_SETTINGS } from './constants/index.ts';
import { registerCommands } from './commands.ts';
import { mousemoveHandler } from './mouseMove.ts';
import { mouseupHandler } from './mouseUp.ts';
import { MouseState } from './state/mouseState.ts';
import { KeyGestureState } from './state/keyGestureState.ts';
import {
  keydownHandler,
  keyupHandler,
  pointerBlockHandler,
  pointerDownHandler,
  pointerUpHandler
} from './keyGesture.ts';
import { WelcomeModal } from './welcome.ts';

export default class EasytoggleSidebar extends Plugin {
  settings!: ETSSettings;
  ribbonIconEl: HTMLElement | null = null;
  mouse = new MouseState();
  keyGesture = new KeyGestureState();
  async onload(): Promise<void> {
    await this.loadSettings();
    this.addSettingTab(new ETSSettingTab(this.app, this));
    if (this.settings.autoHideRibbon) autoHideON(this);
    if (!this.settings.welcomeShown) {
      new WelcomeModal(this).open();
    }
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
    const isMainWindow = doc === document;

    if (isMainWindow) {
      this.registerDomEvent(doc, 'mousemove', (e: MouseEvent) =>
        mousemoveHandler(this, e)
      );
      this.registerDomEvent(doc, 'click', autoHide.bind(this));
      // keydown/keyup scoped to the main window, matching mousemove above:
      // this is where the swipe gesture is actually captured.
      this.registerDomEvent(doc, 'keydown', (e: KeyboardEvent) =>
        keydownHandler(this, e)
      );
      this.registerDomEvent(doc, 'keyup', (e: KeyboardEvent) => keyupHandler(this, e));

      // Track pointer button state in capture phase to prevent the swipe
      // gesture from arming during a click-and-drag (text selection, etc.).
      this.registerDomEvent(
        doc,
        'pointerdown',
        (e: PointerEvent) => pointerDownHandler(this, e),
        true
      );
      this.registerDomEvent(
        doc,
        'pointerup',
        (e: PointerEvent) => pointerUpHandler(this, e),
        true
      );

      // Block pointer events in capture phase while the gesture is armed,
      // so views like Canvas can't interpret Ctrl+drag as a marquee selection.
      this.registerDomEvent(
        doc,
        'pointermove',
        (e: PointerEvent) => pointerBlockHandler(this, e),
        true
      );
      this.registerDomEvent(
        doc,
        'pointerdown',
        (e: PointerEvent) => pointerBlockHandler(this, e),
        true
      );
    }

    // mouseup always registers: Toggle Pin, reveal-on-click and double-click
    // all work in every window, including popouts.
    this.registerDomEvent(doc, 'mouseup', (e: MouseEvent) =>
      mouseupHandler(this, this.app, e, isMainWindow)
    );
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}
