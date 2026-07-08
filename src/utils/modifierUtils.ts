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
 *
 * AltGr handling: on some browsers/OS, AltGr fires as key === 'AltGraph'
 * without setting altKey/ctrlKey natively. We treat it as Alt+Ctrl when
 * both are required, so a Ctrl+Alt config correctly matches AltGr.
 */
export function areModifiersExactMatch(
  event: ModifierKeyState,
  settings: ETSSettings
): boolean {
  const required = settings.trackpadModifiers;

  const isAltGraph = 'key' in event && (event as { key: string }).key === 'AltGraph';
  const altGraphMatches = isAltGraph && required.alt && required.ctrl;

  return (
    required.alt === (event.altKey || altGraphMatches) &&
    required.shift === event.shiftKey &&
    required.ctrl === (event.ctrlKey || altGraphMatches) &&
    required.meta === event.metaKey
  );
}
