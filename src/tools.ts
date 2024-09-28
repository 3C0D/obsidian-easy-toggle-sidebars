import { WorkspaceLeaf } from "obsidian";
import EasytoggleSidebar from "./main";
import { getLeftSplit } from "./barTools";


function contextmenuHandler(evt: MouseEvent) {
    evt.preventDefault();
}

export function contextmenuListener(plugin: EasytoggleSidebar): void {

    plugin.target?.addEventListener(
        "contextmenu",
        contextmenuHandler,
        true
    );
}

export function removeContextMenuListener(plugin: EasytoggleSidebar): void {
    if (plugin.movedX || plugin.movedY || plugin.preventContextmenu) {
        setTimeout(() => {
            plugin.target?.removeEventListener(
                "contextmenu",
                contextmenuHandler,
                true
            );
            plugin.movedX = false;
            plugin.movedY = false;
            plugin.preventContextmenu = null;
        }, 20);
    }
}

export function getActiveSidebarLeaf(): WorkspaceLeaf | null {
    const leftRoot = getLeftSplit().getRoot();
    const leaves: WorkspaceLeaf[] = [];
    this.app.workspace.iterateAllLeaves((leaf: WorkspaceLeaf) => {
        if (leaf.getRoot() === leftRoot && leaf.view.containerEl.clientWidth > 0) {
            leaves.push(leaf);
        }
    });
    return leaves[0];
}