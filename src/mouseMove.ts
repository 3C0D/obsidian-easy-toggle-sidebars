import { getLeftSplit, getRightSplit, toggle } from "./barTools";
import EasytoggleSidebar from "./main";
import { contextmenuListener } from "./tools";

export function mousemoveHandler(plugin: EasytoggleSidebar, e: MouseEvent) {
    if (!plugin.button || plugin.button === 0 || !plugin.isTracking) return;
    const { settings } = plugin;
    plugin.endX = e.clientX;
    plugin.endY = e.clientY;

    const distanceX = Math.abs(e.clientX - plugin.startX);
    const distanceY = Math.abs(e.clientY - plugin.startY);

    plugin.movedX = distanceX > settings.moveThresholdHor;
    plugin.movedY = distanceY > settings.moveThresholdVert;

    if (plugin.movedX || plugin.movedY) {
        moveAction(plugin);
        plugin.startX = e.clientX;
        plugin.startY = e.clientY;
        if (plugin.button === 2) contextmenuListener(plugin);
        plugin.isTracking = false;
        plugin.button = null;
        return
    }
}

function moveAction(plugin: EasytoggleSidebar) {
    if (
        (plugin.movedX && plugin.endX < plugin.startX) ||
        (plugin.movedY && plugin.endY < plugin.startY)
    ) {
        toggle(getLeftSplit(), 2);
    } else if (
        (plugin.movedX && plugin.endX > plugin.startX) ||
        (plugin.movedY && plugin.endY > plugin.startY)
    ) {
        toggle(getRightSplit(), 2);
    }
}