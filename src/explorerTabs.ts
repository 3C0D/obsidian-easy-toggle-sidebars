import EasytoggleSidebar from "./main";
import { getActiveSidebarLeaf } from "./tools";

export async function goToExplorerTab (plugin : EasytoggleSidebar, evt: MouseEvent) {
    const isLeftSplit = (evt.target as Element).closest(".mod-left-split");
    if (isLeftSplit) {
        const activeLeftSplit = getActiveSidebarLeaf()
        const isExplorerLeaf = activeLeftSplit?.getViewState().type === 'file-explorer'
        if (isExplorerLeaf) {
            if (plugin.previousActiveSplitLeaf) this.app.workspace.revealLeaf(plugin.previousActiveSplitLeaf)
        } else {
            const explorerLeaf = this.app.workspace.getLeavesOfType('file-explorer')[0];
            this.app.workspace.revealLeaf(explorerLeaf)
        }
        plugin.previousActiveSplitLeaf = activeLeftSplit
    }
}