import type { App, WorkspaceLeaf } from 'obsidian';
import type EasytoggleSidebar from './main.ts';

export async function togglePin(
  app: App,
  evt: MouseEvent,
  plugin: EasytoggleSidebar
): Promise<void> {
  if (!plugin.settings.togglePin) return;

  // Derive the leaf from the tab header that was actually clicked. This works
  // for any view type and in secondary (popout) windows, unlike relying on the
  // workspace's active leaf (which tracks the main window only).
  const leaf = getLeafFromTabHeader(app, evt.target as HTMLElement);
  if (!leaf) return;

  leaf.togglePinned();
}

function getLeafFromTabHeader(app: App, target: HTMLElement): WorkspaceLeaf | null {
  const tabHeader = target.closest('.workspace-tab-header');
  if (!tabHeader) return null;

  // iterateAllLeaves has no early-exit mechanism, so we throw a sentinel
  // value as soon as the matching leaf is found, to avoid scanning
  // the remaining leaves once we already have our answer.
  const FOUND = Symbol('leaf-found');
  let leaf: WorkspaceLeaf | null = null;

  try {
    app.workspace.iterateAllLeaves((candidate: WorkspaceLeaf) => {
      if (candidate.tabHeaderEl === tabHeader) {
        leaf = candidate;
        throw FOUND;
      }
    });
  } catch (e) {
    if (e !== FOUND) throw e;
  }

  return leaf;
}
