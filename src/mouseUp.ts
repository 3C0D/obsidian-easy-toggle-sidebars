import type { App } from 'obsidian';
import type EasytoggleSidebar from './main.ts';
import { handleRevealClick } from './reveal.ts';
import { togglePin } from './togglePin.ts';
import { ZoneDetector } from './utils/domUtils.ts';

export async function mouseupHandler(
  plugin: EasytoggleSidebar,
  app: App,
  evt: MouseEvent,
  _isMainWindow: boolean
): Promise<void> {
  if (evt.button !== 0) return;
  const target = evt.target as HTMLElement;

  // Single left click: reveal file in explorer (with modifiers held)
  if (evt.detail === 1) {
    if (plugin.settings.reveal) {
      await handleRevealClick(app, evt, plugin.settings, target);
    }
    return;
  }

  // Double click on tab header: toggle pin
  if (evt.detail === 2) {
    if (!ZoneDetector.isTabHeader(target)) return;
    await togglePin(app, evt, plugin);
  }
}
