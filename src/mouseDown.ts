import type EasytoggleSidebar from './main.ts';

export function mousedownHandler(plugin: EasytoggleSidebar, e: MouseEvent): void {
  const { mouse } = plugin;
  mouse.button = e.button;
  mouse.target = e.target as HTMLElement;
  if (mouse.isTracking) return;
  const { useMiddleMouse, useRightMouse } = plugin.settings;
  if ((useMiddleMouse && e.button === 1) || (useRightMouse && e.button === 2)) {
    mouse.isTracking = true;
    mouse.startX = e.clientX;
    mouse.startY = e.clientY;
  }
}
