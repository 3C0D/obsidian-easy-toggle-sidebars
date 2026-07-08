import type { ETSSettings } from '../types/settings.ts';

/**
 * The modifier-key booleans shared by KeyboardEvent and MouseEvent
 * (altKey, ctrlKey, metaKey, shiftKey), used to compare against
 * settings.trackpadModifiers regardless of the originating event type.
 */
interface ModifierKeyState {
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
}

/**
 * Checks whether the modifier combination required by
 * settings.trackpadModifiers is exactly held: required modifiers must be
 * pressed AND non-required modifiers must NOT be pressed. This prevents
 * interference with other plugins that use a superset of modifiers.
 * Shared between the swipe gesture (KeyboardEvent) and reveal-on-click
 * (MouseEvent) handlers.
 */
export function areModifiersExactMatch(
  event: ModifierKeyState,
  settings: ETSSettings
): boolean {
  const required = settings.trackpadModifiers;
  return (
    required.alt === event.altKey &&
    required.shift === event.shiftKey &&
    required.ctrl === event.ctrlKey &&
    required.meta === event.metaKey
  );
}
