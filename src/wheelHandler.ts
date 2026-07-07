import { getLeftSplit, getRightSplit, toggleIf } from './barTools.ts';
import type EasytoggleSidebar from './main.ts';
import { UI_CONSTANTS } from './constants/index.ts';

export function wheelHandler(plugin: EasytoggleSidebar, e: WheelEvent): void {
  const { mouse, wheel, settings } = plugin;

  if (!settings.useTrackpadSwipe) return;
  // Avoid conflicting with an ongoing right/middle mouse click-and-move gesture
  if (mouse.isTracking) return;
  if (!e.ctrlKey) return;

  // Prevent Chromium/Electron from interpreting Ctrl+wheel as a zoom gesture.
  // Without this, after the first sidebar toggle the compositor's gesture
  // recognizer enters a "zoom in progress" state that swallows subsequent
  // wheel events at a level below the DOM — no synthetic mousemove or
  // pointerdown can reset it, only a real physical click does. Calling
  // preventDefault on every Ctrl+wheel event keeps the compositor out of
  // zoom mode entirely, so wheel events keep flowing to JS after a toggle.
  e.preventDefault();

  // Once triggered, keep the lock active as long as events arrive (including
  // momentum). The timer is renewed on every event, so triggered only resets
  // after a genuine gap where no wheel events are received for
  // TRACKPAD_RETRIGGER_DELAY ms. This self-adjusting cooldown automatically
  // outlasts any momentum duration. Intentional re-swipes still work because
  // there is always a physical pause between two distinct gestures (fingers
  // lift, reposition, swipe again), during which the timer fires and unlocks.
  if (wheel.triggered) {
    if (wheel.resetTimeout) clearTimeout(wheel.resetTimeout);
    wheel.resetTimeout = setTimeout(() => resetWheelState(plugin), UI_CONSTANTS.TRACKPAD_RETRIGGER_DELAY);
    return;
  }

  // Filter out near-zero deltas (electrical noise, sub-pixel residuals).
  // This is a low threshold (3px) just to reject noise, NOT to filter
  // momentum — momentum is handled by the self-renewing lock above.
  if (Math.abs(e.deltaX) < UI_CONSTANTS.TRACKPAD_MOMENTUM_THRESHOLD) return;

  // Reset an abandoned partial swipe after a pause (fingers moved, then
  // stopped short of the threshold). Renewed on every qualifying event during
  // accumulation: a continuous gesture postponing it is correct behaviour.
  if (wheel.resetTimeout) clearTimeout(wheel.resetTimeout);
  wheel.resetTimeout = setTimeout(() => resetWheelState(plugin), UI_CONSTANTS.TRACKPAD_RESET_DELAY);

  const deltaX = settings.invertTrackpadSwipe ? -e.deltaX : e.deltaX;
  wheel.accumulatedX += deltaX;

  if (Math.abs(wheel.accumulatedX) > settings.trackpadThreshold) {
    toggleIf(wheel.accumulatedX < 0 ? getLeftSplit(plugin.app) : getRightSplit(plugin.app));
    wheel.triggered = true;

    // Arm the self-renewing cooldown for the first time. Subsequent events
    // hitting the triggered branch above will keep renewing it.
    if (wheel.resetTimeout) clearTimeout(wheel.resetTimeout);
    wheel.resetTimeout = setTimeout(() => resetWheelState(plugin), UI_CONSTANTS.TRACKPAD_RETRIGGER_DELAY);
  }
}

/**
 * Fully resets the trackpad swipe state: clears accumulatedX and triggered,
 * and cancels any pending timeout. Called either after an abandoned partial
 * swipe times out, or once the post-trigger cooldown detects a genuine gap
 * in the event stream; see the setTimeout calls in wheelHandler above.
 */
export function resetWheelState(plugin: EasytoggleSidebar): void {
  const { wheel } = plugin;
  wheel.accumulatedX = 0;
  wheel.triggered = false;
  if (wheel.resetTimeout) {
    clearTimeout(wheel.resetTimeout);
    wheel.resetTimeout = null;
  }
}
