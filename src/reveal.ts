import type { App } from 'obsidian';
import type { ETSSettings } from './types/settings.ts';

/**
 * Reveals the active file in the file explorer.
 * Called from the upward swipe gesture (modifier+swipe up).
 * Runs the command twice to ensure the file is revealed on long trees.
 */
export function revealActiveFile(app: App): void {
  app.commands.executeCommandById('file-explorer:reveal-active-file');
  app.commands.executeCommandById('file-explorer:reveal-active-file');
}

/**
 * Checks whether the configured modifier combination is exactly held during
 * a click. Uses strict equality: required modifiers must be pressed AND
 * non-required modifiers must NOT be pressed.
 * Note: AltGraph cannot be detected on MouseEvent (no `key` property),
 * so the AltGr compensation only applies to keyboard events in keyGesture.ts.
 */
function areModifiersHeld(evt: MouseEvent, settings: ETSSettings): boolean {
  const required = settings.trackpadModifiers;
  return (
    required.shift === evt.shiftKey &&
    required.ctrl === evt.ctrlKey &&
    required.alt === evt.altKey &&
    required.meta === evt.metaKey
  );
}

/**
 * Handles reveal on click: if the user clicks on the view header title
 * while holding the configured modifiers, reveals the active file.
 * Useful in views like Monaco (https://github.com/3C0D/obsidian-code-files-modif) where the swipe-up gesture isn't available.
 */
export function handleRevealClick(
  app: App,
  evt: MouseEvent,
  settings: ETSSettings,
  target: HTMLElement
): void {
  if (!areModifiersHeld(evt, settings)) return;
  if (
    target.closest('.view-header-title-container') ||
    target.closest('.view-header-title')
  ) {
    revealActiveFile(app);
  }
}
