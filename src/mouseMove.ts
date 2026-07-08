import { getLeftSplit, getRightSplit, toggleBothSidebars, toggleIf } from './barTools.ts';
import type EasytoggleSidebar from './main.ts';
import { revealActiveFile } from './reveal.ts';

export function mousemoveHandler(plugin: EasytoggleSidebar, e: MouseEvent): void {
  const { keyGesture, settings } = plugin;

  if (!settings.useTrackpadSwipe) return;
  if (!keyGesture.armed || keyGesture.done) return;

  // First mousemove after arming: seed the start position.
  if (!keyGesture.isTracking) {
    keyGesture.isTracking = true;
    keyGesture.startX = e.clientX;
    keyGesture.startY = e.clientY;
    e.preventDefault();
    return;
  }

  const deltaX = e.clientX - keyGesture.startX;
  const deltaY = e.clientY - keyGesture.startY;
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);
  const threshold = settings.trackpadThreshold;

  if (absX > threshold || absY > threshold) {
    if (absY > absX) {
      if (deltaY > 0) {
        // Vertical downward swipe → toggle both sidebars
        toggleBothSidebars(plugin);
      } else {
        // Vertical upward swipe → reveal active file in explorer
        revealActiveFile(plugin.app);
      }
    } else if (absX >= absY) {
      // Horizontal swipe → left or right sidebar
      toggleIf(deltaX < 0 ? getLeftSplit(plugin.app) : getRightSplit(plugin.app));
    }
    // Mark gesture as done so further mousemoves are ignored until the
    // modifiers are released and re-armed.
    keyGesture.done = true;
    keyGesture.isTracking = false;
  }
  e.preventDefault();
}
