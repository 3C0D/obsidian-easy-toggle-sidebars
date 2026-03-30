import type { App, WorkspaceLeaf } from 'obsidian';
import type EasytoggleSidebar from './main.ts';
import { getLeftSplit } from './barTools.ts';
import { UI_CONSTANTS } from './constants/index.ts';

function contextmenuHandler(evt: MouseEvent): void {
	evt.preventDefault();
}

export function contextmenuListener(plugin: EasytoggleSidebar): void {
	plugin.target?.addEventListener('contextmenu', contextmenuHandler, true);
}

export function removeContextMenuListener(plugin: EasytoggleSidebar): void {
	if (plugin.movedX || plugin.movedY || plugin.preventContextmenu) {
		setTimeout(() => {
			plugin.target?.removeEventListener('contextmenu', contextmenuHandler, true);
			plugin.movedX = false;
			plugin.movedY = false;
			plugin.preventContextmenu = null;
		}, UI_CONSTANTS.CONTEXTMENU_TIMEOUT);
	}
}

export function getActiveSidebarLeaf(app: App): WorkspaceLeaf | null {
	try {
		const leftRoot = getLeftSplit(app).getRoot();
		const leaves: WorkspaceLeaf[] = [];
		app.workspace.iterateAllLeaves((leaf: WorkspaceLeaf) => {
			if (leaf.getRoot() === leftRoot && leaf.view.containerEl.clientWidth > 0) {
				leaves.push(leaf);
			}
		});
		return leaves[0] || null;
	} catch (error) {
		console.error('Error getting active sidebar leaf:', error);
		return null;
	}
}
