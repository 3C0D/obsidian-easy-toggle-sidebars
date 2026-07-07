import type EasytoggleSidebar from './main.ts';
import type { ETSSettings } from './types/settings.ts';

/**
 * Checks whether the modifier combination required by
 * settings.trackpadModifiers is currently held, mirroring Gesture
 * Commander's areModifierKeysPressed: only modifiers explicitly enabled in
 * settings are checked, any other modifier's state is irrelevant. Works for
 * both keydown and keyup events, since KeyboardEvent.ctrlKey/altKey reflect
 * the state at the moment of the event, including the key being pressed or
 * released.
 */
function areModifierKeysPressed(event: KeyboardEvent, settings: ETSSettings): boolean {
  const { ctrl, alt } = settings.trackpadModifiers;
  return (!ctrl || event.ctrlKey) && (!alt || event.altKey);
}

/**
 * Arms trackpad swipe capture once the required modifier combination
 * (settings.trackpadModifiers, e.g. Ctrl, Alt, or both together) is fully
 * held. Only arms the flag, the actual start point is set on the first
 * subsequent mousemove event (see mousemoveHandler), since KeyboardEvent
 * carries no cursor position to seed startX from. Ignored while a mouse
 * click-drag (right/middle button) is already in progress, so the two
 * gestures never fight over tracking state.
 */
export function keydownHandler(plugin: EasytoggleSidebar, e: KeyboardEvent): void {
  const { mouse, keyGesture, settings } = plugin;
  if (!settings.useTrackpadSwipe) return;
  if (mouse.isTracking) return;
  if (e.key !== 'Control' && e.key !== 'Alt') return;
  if (keyGesture.armed) return;
  if (!areModifierKeysPressed(e, settings)) return;
  keyGesture.armed = true;
}

/**
 * Disarms trackpad swipe capture as soon as any modifier required by
 * settings.trackpadModifiers is released, even a partial release of a
 * combination like Ctrl+Alt. A successful toggle already disarms itself in
 * mousemoveHandler, so this only needs to cancel a gesture that never
 * crossed the threshold (fingers moved, then a required modifier was
 * released before the swipe completed).
 */
export function keyupHandler(plugin: EasytoggleSidebar, e: KeyboardEvent): void {
  const { keyGesture, settings } = plugin;
  if (e.key !== 'Control' && e.key !== 'Alt') return;
  if (areModifierKeysPressed(e, settings)) return;
  keyGesture.armed = false;
  keyGesture.isTracking = false;
}
