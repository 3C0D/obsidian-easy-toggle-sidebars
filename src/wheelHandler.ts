import { getLeftSplit, getRightSplit, toggleIf } from './barTools.ts';
import type EasytoggleSidebar from './main.ts';
import { UI_CONSTANTS } from './constants/index.ts';

export function wheelHandler(plugin: EasytoggleSidebar, e: WheelEvent): void {
  const { mouse, wheel, settings } = plugin;

  if (!settings.useTrackpadSwipe) return;
  // Avoid conflicting with an ongoing right/middle mouse click-and-move gesture
  if (mouse.isTracking) return;
  if (!e.ctrlKey) return;

  const deltaX = settings.invertTrackpadSwipe ? -e.deltaX : e.deltaX;

  wheel.accumulatedX += deltaX;

  if (!wheel.triggered) {
    if (Math.abs(wheel.accumulatedX) > settings.trackpadThreshold) {
      toggleIf(wheel.accumulatedX < 0 ? getLeftSplit(plugin.app) : getRightSplit(plugin.app));
      wheel.triggered = true;
    }
  }

  // Reset accumulation once no 'wheel' event has fired for a short delay,
  // which marks the end of the swipe burst.
  if (wheel.resetTimeout) clearTimeout(wheel.resetTimeout);
  wheel.resetTimeout = setTimeout(() => {
    wheel.accumulatedX = 0;
    wheel.triggered = false;
    wheel.resetTimeout = null;
  }, UI_CONSTANTS.TRACKPAD_RESET_DELAY);
}
