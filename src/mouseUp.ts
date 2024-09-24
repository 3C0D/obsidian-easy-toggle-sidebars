import { autoHide } from "./autoHide";
import { toggleBothSidebars, getLeftSplit, getRightSplit } from "./barTools";
import { goToExplorerTab } from "./explorerTabs";
import EasytoggleSidebar from "./main";
import { reveal } from "./reveal";
import { clickScrollBar } from "./scrollBar";
import { togglePin } from "./togglePin";
import { contextmenuListener, removeContextMenuListener } from "./tools";

export async function mouseupHandler(plugin: EasytoggleSidebar, evt: MouseEvent) {
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
                reveal(evt);
            }
        }
    }

    const { useRightMouse, useMiddleMouse } = plugin.settings

    if (evt.detail === 2) {
        if (
            ((useMiddleMouse && evt.button === 1) || (useRightMouse && evt.button === 2))
        ) {
            contextmenuListener(plugin);
            toggleBothSidebars();
        }
        if (evt.button === 0) {
            clickScrollBar(evt)
            plugin.ribbonToggleTimer = setTimeout(() => {
                ribbonToggleSidebar(evt)
            }, 300);
            if (plugin.settings.togglePin) {
                await togglePin(evt)
            }
        }

    }
    if (evt.detail === 3) {
        await goToExplorerTab(plugin, evt);
        if (plugin.ribbonToggleTimer) {
            clearTimeout(plugin.ribbonToggleTimer);
            plugin.ribbonToggleTimer = null;
        }
        ribbonToggleSidebar(evt, true);

    }
}

function ribbonToggleSidebar(evt: MouseEvent, right = false) {
    const target = evt.target as HTMLElement;
    const isRibbon = target.closest('.workspace-ribbon');
    // const isLeftSplit = target.closest('.mod-left-split');
    // const isTreeItem = target.closest('.tree-item-self');

    if (right && isRibbon) {
        getRightSplit().toggle();
        return
    }

    if (isRibbon) {
        getLeftSplit().toggle();
    }
}