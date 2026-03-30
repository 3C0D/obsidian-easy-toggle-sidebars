import type { App } from 'obsidian';
import type EasytoggleSidebar from './main.ts';
import { getActiveSidebarLeaf } from './tools.ts';

/**
 * Switch between active tab and explorer tab in left sidebar,
 * or toggle right sidebar when triple-clicking on ribbon
 */

export async function goToExplorerTab(
	plugin: EasytoggleSidebar,
	app: App,
	evt: MouseEvent
): Promise<void> {
	const targetElement = evt.target as Element;
	const isLeftSplit = targetElement.closest('.mod-left-split');

	if (isLeftSplit) {
		const activeLeftSplit = getActiveSidebarLeaf(app);
		const isExplorerLeaf = activeLeftSplit?.getViewState().type === 'file-explorer';
		if (isExplorerLeaf) {
			if (plugin.previousActiveSplitLeaf)
				await app.workspace.revealLeaf(plugin.previousActiveSplitLeaf);
		} else {
			const explorerLeaf = app.workspace.getLeavesOfType('file-explorer')[0];
			if (explorerLeaf) await app.workspace.revealLeaf(explorerLeaf);
		}
		plugin.previousActiveSplitLeaf = activeLeftSplit;
	}
}
