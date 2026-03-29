import { Notice } from 'obsidian';
import { getLeftSplit, getRightSplit, toggleBothSidebars } from './barTools';
import EasytoggleSidebar from './main';
import { ZoneDetector } from './utils/domUtils';
import { UI_CONSTANTS } from './constants';

export function autoHideON(plugin: EasytoggleSidebar): void {
	const { settings } = plugin;
	plugin.ribbonIconEl = plugin.addRibbonIcon(
		'move-horizontal',
		'autoHide switcher',
		async () => {
			settings.autoHide = !settings.autoHide;
			await plugin.saveSettings();
			toggleColor(plugin);
			toggleAutoHideEvent(plugin);
			new Notice(
				settings.autoHide ? 'AutoHide Enabled' : 'AutoHide Disabled',
				UI_CONSTANTS.NOTICE_DURATION
			);
		}
	);
	toggleColor(plugin);
}

export function toggleColor(plugin: EasytoggleSidebar) {
	plugin.settings.autoHide
		? plugin.ribbonIconEl?.addClass('ribbon-color')
		: plugin.ribbonIconEl?.removeClass('ribbon-color');
}

export function toggleAutoHideEvent(plugin: EasytoggleSidebar) {
	if (plugin.settings.autoHide) {
		plugin.registerDomEvent(document, 'click', autoHide.bind(plugin));
	} else {
		document.removeEventListener('click', autoHide.bind(plugin));
	}
}

export async function toggleAutoHide(plugin: EasytoggleSidebar): Promise<void> {
	const { settings } = plugin;
	settings.autoHide = !settings.autoHide;
	await plugin.saveSettings();
	toggleColor(plugin);
	toggleAutoHideEvent(plugin);
	new Notice(
		settings.autoHide ? 'AutoHide Enabled' : 'AutoHide Disabled',
		UI_CONSTANTS.NOTICE_DURATION
	);
}

export function autoHide(evt: MouseEvent): void {
	if (!this.settings.autoHide) return;
	const element = evt.target as HTMLElement;

	if (!ZoneDetector.isEditorContent(element)) return;

	// Check if clicking on reveal zones
	if (ZoneDetector.isRevealZone(element)) return;

	// Check if in double-click zones on edges
	if (ZoneDetector.isDoubleClickZone(element, evt)) {
		return; // Don't trigger autoHide in double-click zones
	}

	// All collapsed
	const leftSplit = getLeftSplit(this.app);
	const rightSplit = getRightSplit(this.app);
	if (leftSplit.collapsed && rightSplit.collapsed) return;
	toggleBothSidebars(this);
}
