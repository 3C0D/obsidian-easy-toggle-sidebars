import type { App } from 'obsidian';
import type { ETSSettings } from './types/settings.ts';
import { areModifiersExactMatch } from './utils/modifierUtils.ts';

/**
 * Checks whether a DOM element is fully visible within its scroll container.
 */
function isElementVisible(el: HTMLElement, container: HTMLElement): boolean {
  const elRect = el.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return elRect.top >= containerRect.top && elRect.bottom <= containerRect.bottom;
}

/**
 * Reveals the active file in the file explorer, retrying until the
 * highlighted item is scrolled into view (handles long folder trees).
 */
export async function revealActiveFile(app: App): Promise<void> {
  const leaf = app.workspace.getLeavesOfType('file-explorer')[0];
  if (!leaf) return;
  const container = (leaf.view.containerEl as HTMLElement).querySelector(
    '.nav-files-container'
  ) as HTMLElement | null;

  for (let i = 0; i < 3; i++) {
    app.commands.executeCommandById('file-explorer:reveal-active-file');
    await new Promise((resolve) => setTimeout(resolve, 100));
    const active = container?.querySelector(
      '.nav-file-title.is-active'
    ) as HTMLElement | null;
    if (!active || !container || isElementVisible(active, container)) break;
  }
}

/**
 * Handles reveal on click: if the user clicks on the view header title
 * while holding the configured modifiers, reveals the active file.
 * Useful in views like Monaco (https://github.com/3C0D/obsidian-code-files-modif) where the swipe-up gesture isn't available.
 */
export async function handleRevealClick(
  app: App,
  evt: MouseEvent,
  settings: ETSSettings,
  target: HTMLElement
): Promise<void> {
  if (!areModifiersExactMatch(evt, settings)) return;
  if (
    target.closest('.view-header-title-container') ||
    target.closest('.view-header-title')
  ) {
    await revealActiveFile(app);
  }
}
