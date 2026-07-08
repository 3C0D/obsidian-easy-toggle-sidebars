import type EasytoggleSidebar from './main.ts';
import { areModifiersExactMatch } from './utils/modifierUtils.ts';

const MODIFIER_KEYS = new Set(['Control', 'Alt', 'Shift', 'Meta', 'AltGraph']);

/**
 * Arms the modifier+swipe gesture once the required modifier combination
 * (settings.trackpadModifiers, e.g. Ctrl, Alt, Shift, Meta, or any combo)
 * is fully held. Only arms the flag; the actual start point is set on the
 * first subsequent mousemove event (see mousemoveHandler), since
 * KeyboardEvent carries no cursor position to seed startX/startY from.
 */
export function keydownHandler(plugin: EasytoggleSidebar, e: KeyboardEvent): void {
  const { keyGesture, settings } = plugin;
  if (!settings.useTrackpadSwipe) return;
  if (!MODIFIER_KEYS.has(e.key)) return;
  if (keyGesture.armed) return;
  // Don't arm during a click-and-drag: a held pointer button means the user
  // is doing something else (text selection, line drag, etc.) and the swipe
  // gesture would interfere.
  if (plugin.mouse.isButtonDown) return;
  if (!areModifiersExactMatch(e, settings)) return;
  keyGesture.armed = true;
  keyGesture.done = false;
}

/**
 * Disarms the gesture as soon as any required modifier is released.
 * A successful toggle already sets `done` in mousemoveHandler, so this
 * mainly cleans up a gesture that never crossed the threshold.
 */
export function keyupHandler(plugin: EasytoggleSidebar, e: KeyboardEvent): void {
  const { keyGesture, settings } = plugin;
  if (!MODIFIER_KEYS.has(e.key)) return;
  if (areModifiersExactMatch(e, settings)) return;
  keyGesture.armed = false;
  keyGesture.isTracking = false;
  keyGesture.done = false;
}

/**
 * Tracks pointer button state so the swipe gesture can refuse to arm
 * during a click-and-drag. Registered in capture phase to fire early.
 */
export function pointerDownHandler(plugin: EasytoggleSidebar, _e: PointerEvent): void {
  plugin.mouse.isButtonDown = true;
  // If the gesture was already armed (modifiers held before the click),
  // disarm it immediately so it can't trigger mid-drag.
  plugin.keyGesture.armed = false;
  plugin.keyGesture.isTracking = false;
  plugin.keyGesture.done = false;
}

export function pointerUpHandler(plugin: EasytoggleSidebar, _e: PointerEvent): void {
  plugin.mouse.isButtonDown = false;
}

/**
 * Blocks pointer events (pointermove, pointerdown) in the capture phase
 * while the gesture is armed, so that views like Canvas don't interpret
 * Ctrl+drag as a marquee selection. Registered in capture phase so it
 * runs before any bubbling listener.
 */
export function pointerBlockHandler(plugin: EasytoggleSidebar, e: PointerEvent): void {
  if (!plugin.keyGesture.armed) return;
  // Safety net: never block during a click-and-drag.
  if (plugin.mouse.isButtonDown) return;
  e.preventDefault();
  e.stopPropagation();
}
