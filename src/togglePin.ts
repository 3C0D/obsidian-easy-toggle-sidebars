import { App, View, WorkspaceLeaf } from 'obsidian';
import EasytoggleSidebar from './main';

export async function togglePin(
	app: App,
	evt: MouseEvent,
	plugin: EasytoggleSidebar
): Promise<void> {
	// Check if togglePin feature is enabled in settings
	if (!plugin.settings.togglePin) return;

	const activeLeaf = app.workspace.getActiveViewOfType(View)?.leaf;
	const { isMainWindow, isRootSplit } = getLeafProperties(app, activeLeaf);
	const condition = (isMainWindow && isRootSplit) || !isMainWindow;
	if (activeLeaf && condition) {
		activeLeaf.togglePinned();
	}
}

function getLeafProperties(
	app: App,
	leaf: WorkspaceLeaf | undefined
): { isMainWindow: boolean; isRootSplit: boolean } {
	const isMainWindow = leaf?.view.containerEl.win === window;
	const isRootSplit = leaf?.getRoot() === app.workspace.rootSplit;
	return { isMainWindow, isRootSplit };
}
