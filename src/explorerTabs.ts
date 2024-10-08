import { App } from "obsidian";
import EasytoggleSidebar from "./main";
import { getActiveSidebarLeaf } from "./tools";

export async function goToExplorerTab(plugin: EasytoggleSidebar, app: App, evt: MouseEvent) {
    const isLeftSplit = (evt.target as Element).closest(".mod-left-split");
    if (isLeftSplit) {
        const activeLeftSplit = getActiveSidebarLeaf(app)
        const isExplorerLeaf = activeLeftSplit?.getViewState().type === 'file-explorer'
        if (isExplorerLeaf) {
            if (plugin.previousActiveSplitLeaf) await app.workspace.revealLeaf(plugin.previousActiveSplitLeaf)
        } else {
            const explorerLeaf = app.workspace.getLeavesOfType('file-explorer')[0];
            if(explorerLeaf) await app.workspace.revealLeaf(explorerLeaf)
        }
        plugin.previousActiveSplitLeaf = activeLeftSplit
    }
}