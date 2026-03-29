import { WorkspaceSidedock } from 'obsidian';
import {
	getLeftSplit,
	getRightSplit,
	getRootSplit,
	isOpen,
	toggleBothSidebars
} from './barTools.ts';
import EasytoggleSidebar from './main.ts';
import { UI_CONSTANTS } from './constants/index.ts';

export function onResize(plugin: EasytoggleSidebar): void {
	const LS = getLeftSplit(plugin.app);
	const RS = getRightSplit(plugin.app);
	const R = getRootSplit(plugin.app);
	const { settings } = plugin;
	const { minRootWidth } = settings;

	if (!settings.autoMinRootWidth || (!isOpen(LS) && !isOpen(RS))) {
		return;
	}
	const editorWidth = R.containerEl.clientWidth;
	if (editorWidth < minRootWidth) {
		updateSidebars(LS, RS, minRootWidth);
	}
	if (editorWidth < minRootWidth) {
		const updatedEditorWidth = R.containerEl.clientWidth;
		if (updatedEditorWidth <= minRootWidth) {
			toggleBothSidebars(plugin);
		}
	}
}

function updateSidebars(
	LS: WorkspaceSidedock,
	RS: WorkspaceSidedock,
	minRootWidth: number
): void {
	if (LS.containerEl.clientWidth > UI_CONSTANTS.SIDEBAR_MIN_SIZE) {
		LS.setSize(UI_CONSTANTS.SIDEBAR_MIN_SIZE);
	}
	if (RS.containerEl.clientWidth > UI_CONSTANTS.SIDEBAR_MIN_SIZE) {
		RS.setSize(UI_CONSTANTS.SIDEBAR_MIN_SIZE);
	}
}
