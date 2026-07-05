import type { App, WorkspaceItem, WorkspaceLeaf } from 'obsidian';
import { View } from 'obsidian';
import type EasytoggleSidebar from './main.ts';

export async function togglePin(
  app: App,
  _evt: MouseEvent,
  plugin: EasytoggleSidebar
): Promise<void> {
  if (!plugin.settings.togglePin) return;

  const activeLeaf = app.workspace.getActiveViewOfType(View)?.leaf;
  if (!activeLeaf) return;

  const { isMainWindow, isRootSplit } = getLeafProperties(app, activeLeaf);
  const condition = (isMainWindow && isRootSplit) || !isMainWindow;
  if (condition) {
    activeLeaf.togglePinned();
  }
}

function getLeafProperties(
  app: App,
  leaf: WorkspaceLeaf
): { isMainWindow: boolean; isRootSplit: boolean } {
  const isMainWindow = leaf.view.containerEl.win === window;
  const isRootSplit =
    leaf.getRoot() === (app.workspace.rootSplit as unknown as WorkspaceItem);
  return { isMainWindow, isRootSplit };
}
