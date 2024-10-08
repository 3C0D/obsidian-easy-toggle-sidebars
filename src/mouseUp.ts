import { App } from "obsidian";
import { autoHide } from "./autoHide";
import { toggleBothSidebars, getLeftSplit, getRightSplit } from "./barTools";
import { goToExplorerTab } from "./explorerTabs";
import EasytoggleSidebar from "./main";
import { reveal } from "./reveal";
import { clickRightEdge } from "./scrollBar";
import { togglePin } from "./togglePin";
import { contextmenuListener, removeContextMenuListener } from "./tools";

export async function mouseupHandler(plugin: EasytoggleSidebar, app: App, evt: MouseEvent) {
    // click & move
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
            return
        }
    }

    if (evt.detail === 1) {
        if (evt.button === 0) {
            if (plugin.settings.autoHide) {
                autoHide.bind(plugin)(evt);
            }
            if (plugin.settings.reveal) {
                reveal(app, evt);
            }
        }
    }

    const { useRightMouse, useMiddleMouse } = plugin.settings

    if (evt.detail === 2) {
        if (
            ((useMiddleMouse && evt.button === 1) || (useRightMouse && evt.button === 2))
        ) {
            contextmenuListener(plugin);
            const target = evt.target as HTMLElement;
            const isRibbon = target.closest('.workspace-ribbon');
            const editor = target.closest('.mod-root .view-content');
            if (isRibbon || editor) toggleBothSidebars();
        }
        if (evt.button === 0) {
            clickRightEdge(evt)
            plugin.ribbonToggleTimer = setTimeout(() => {
                toggleRibbonSidebar(evt)
            }, 300);
            if (plugin.settings.togglePin) {
                await togglePin(app, evt)
            }
        }

    }
    if (evt.detail === 3) {
        await goToExplorerTab(plugin, app, evt);
        if (plugin.ribbonToggleTimer) {
            clearTimeout(plugin.ribbonToggleTimer);
            plugin.ribbonToggleTimer = null;
        }
    }
}

function toggleRibbonSidebar(evt: MouseEvent, right = false) {
    const target = evt.target as HTMLElement;
    const isRibbon = target.closest('.workspace-ribbon');

    if (right && isRibbon) {
        getRightSplit().toggle();
        return
    }

    if (isRibbon) {
        getLeftSplit().toggle();
    }
}