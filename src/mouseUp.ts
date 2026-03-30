import type { App } from 'obsidian';
import { autoHide } from './autoHide.ts';
import { toggleBothSidebars, getLeftSplit, getRightSplit } from './barTools.ts';
import { goToExplorerTab } from './explorerTabs.ts';
import type EasytoggleSidebar from './main.ts';
import { reveal } from './reveal.ts';
import { handleEditorEdgeClick } from './scrollBar.ts';
import { togglePin } from './togglePin.ts';
import { contextmenuListener, removeContextMenuListener } from './tools.ts';
import { ZoneDetector } from './utils/domUtils.ts';

export async function mouseupHandler(
	plugin: EasytoggleSidebar,
	app: App,
	evt: MouseEvent
): Promise<void> {
	// Click & move
	if (plugin.isTracking) {
		plugin.isTracking = false;
		plugin.button = null;
		plugin.startX = evt.clientX;
		plugin.startY = evt.clientY;
		plugin.preventContextmenu = setTimeout(() => {
			removeContextMenuListener(plugin);
		}, plugin.settings.dblClickDelay);
		if (plugin.movedX || plugin.movedY) {
			plugin.movedX = false;
			plugin.movedY = false;
			return;
		}
	}

	const { useRightMouse, useMiddleMouse } = plugin.settings;

	if (evt.detail === 1) {
		if (evt.button === 0) {
			if (plugin.settings.autoHide) {
				autoHide.bind(plugin)(evt);
			}
			if (plugin.settings.reveal) {
				reveal(app, evt);
			}
		}
	} else if (evt.detail === 2) {
		// Cancel any pending double-click action
		if (plugin.doubleClickTimeout) {
			clearTimeout(plugin.doubleClickTimeout);
		}

		if ((useMiddleMouse && evt.button === 1) || (useRightMouse && evt.button === 2)) {
			contextmenuListener(plugin);
			const target = evt.target as HTMLElement;
			const isRibbon = ZoneDetector.isRibbonZone(target);
			const editor = ZoneDetector.isEditorZone(target);
			if (isRibbon || editor) toggleBothSidebars(plugin);
		}
		if (evt.button === 0) {
			const target = evt.target as HTMLElement;
			const isRibbon = ZoneDetector.isRibbonZone(target);
			const isScroller = ZoneDetector.isDoubleClickZone(target, evt);
			const isTabHeader = ZoneDetector.isTabHeader(target);

			if (isScroller) {
				handleEditorEdgeClick(evt, plugin);
			} else if (isRibbon) {
				// Apply timeout only for ribbon action
				plugin.doubleClickTimeout = setTimeout(() => {
					getLeftSplit(plugin.app).toggle();
					plugin.doubleClickTimeout = null;
				}, 300);
			} else if (isTabHeader) {
				await togglePin(app, evt, plugin);
			}
		}
	} else if (evt.detail === 3) {
		// Cancel the pending double-click action
		if (plugin.doubleClickTimeout) {
			clearTimeout(plugin.doubleClickTimeout);
			plugin.doubleClickTimeout = null;
		}

		const target = evt.target as HTMLElement;
		const isRibbon = ZoneDetector.isRibbonZone(target);
		const isLeftSplit = ZoneDetector.isLeftSplitZone(target);

		if (isRibbon) {
			getRightSplit(plugin.app).toggle();
			return;
		} else if (isLeftSplit) {
			await goToExplorerTab(plugin, app, evt);
		}
	}
}
