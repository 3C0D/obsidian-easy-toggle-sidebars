import { getLeftSplit, getRightSplit, toggleIf } from './barTools.ts';
import type EasytoggleSidebar from './main.ts';
import { contextmenuListener } from './tools.ts';

export function mousemoveHandler(plugin: EasytoggleSidebar, e: MouseEvent): void {
  const { mouse, settings } = plugin;
  if (!mouse.button || mouse.button === 0 || !mouse.isTracking) return;
  mouse.endX = e.clientX;
  mouse.endY = e.clientY;

  const distanceX = Math.abs(e.clientX - mouse.startX);
  const distanceY = Math.abs(e.clientY - mouse.startY);

  mouse.movedX = distanceX > settings.moveThresholdHor;
  mouse.movedY = distanceY > settings.moveThresholdVert;

  if (mouse.movedX || mouse.movedY) {
    // Direction mapping (intentional):
    //   - Horizontal: left  -> left sidebar,  right -> right sidebar
    //   - Vertical:   up    -> left sidebar,  down  -> right sidebar
    // The vertical mapping is mainly useful when starting the gesture from the
    // ribbon bar (e.g. in canvas mode) where horizontal room is limited.
    if (
      (mouse.movedX && mouse.endX < mouse.startX) ||
      (mouse.movedY && mouse.endY < mouse.startY)
    ) {
      toggleIf(getLeftSplit(plugin.app));
    } else if (
      (mouse.movedX && mouse.endX > mouse.startX) ||
      (mouse.movedY && mouse.endY > mouse.startY)
    ) {
      toggleIf(getRightSplit(plugin.app));
    }
    mouse.startX = e.clientX;
    mouse.startY = e.clientY;
    if (mouse.button === 2) contextmenuListener(plugin);
    mouse.isTracking = false;
    mouse.button = null;
    return;
  }
}
