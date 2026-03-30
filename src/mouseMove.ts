import { getLeftSplit, getRightSplit, toggleIf } from './barTools.ts';
import type EasytoggleSidebar from './main.ts';
import { contextmenuListener } from './tools.ts';

export function mousemoveHandler(plugin: EasytoggleSidebar, e: MouseEvent): void {
	if (!plugin.button || plugin.button === 0 || !plugin.isTracking) return;
	const { settings } = plugin;
	plugin.endX = e.clientX;
	plugin.endY = e.clientY;

	const distanceX = Math.abs(e.clientX - plugin.startX);
	const distanceY = Math.abs(e.clientY - plugin.startY);

	plugin.movedX = distanceX > settings.moveThresholdHor;
	plugin.movedY = distanceY > settings.moveThresholdVert;

	if (plugin.movedX || plugin.movedY) {
		if (
			(plugin.movedX && plugin.endX < plugin.startX) ||
			(plugin.movedY && plugin.endY < plugin.startY)
		) {
			toggleIf(getLeftSplit(plugin.app));
		} else if (
			(plugin.movedX && plugin.endX > plugin.startX) ||
			(plugin.movedY && plugin.endY > plugin.startY)
		) {
			toggleIf(getRightSplit(plugin.app));
		}
		plugin.startX = e.clientX;
		plugin.startY = e.clientY;
		if (plugin.button === 2) contextmenuListener(plugin);
		plugin.isTracking = false;
		plugin.button = null;
		return;
	}
}
