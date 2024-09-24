import EasytoggleSidebar from "./main";


export function mousedownHandler(plugin: EasytoggleSidebar, e: MouseEvent): void {
    plugin.button = e.button;
    plugin.target = e.target as HTMLElement;
    if (plugin.isTracking) return
    const { useMiddleMouse, useRightMouse } = plugin.settings;
    if ((useMiddleMouse && e.button === 1) || (useRightMouse && e.button === 2)) {
        plugin.isTracking = true
        plugin.startX = e.clientX;
        plugin.startY = e.clientY;

    }
}


