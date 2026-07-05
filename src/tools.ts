import type EasytoggleSidebar from './main.ts';
import { UI_CONSTANTS } from './constants/index.ts';

function contextmenuHandler(evt: MouseEvent): void {
  evt.preventDefault();
}

export function contextmenuListener(plugin: EasytoggleSidebar): void {
  plugin.mouse.target?.addEventListener('contextmenu', contextmenuHandler, true);
}

export function removeContextMenuListener(plugin: EasytoggleSidebar): void {
  const { mouse } = plugin;
  if (mouse.movedX || mouse.movedY || mouse.preventContextmenu) {
    setTimeout(() => {
      mouse.target?.removeEventListener('contextmenu', contextmenuHandler, true);
      mouse.movedX = false;
      mouse.movedY = false;
      mouse.preventContextmenu = null;
    }, UI_CONSTANTS.CONTEXTMENU_TIMEOUT);
  }
}
