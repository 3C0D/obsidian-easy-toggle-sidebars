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

// export function getLeftbarActiveLeaf(): WorkspaceLeaf | undefined {
//     const leftRoot = getLeftSplit(this).getRoot();
//     const leaves: WorkspaceLeaf[] = [];
//     this.app.workspace.iterateAllLeaves((leaf: WorkspaceLeaf) => {
//         if (leaf.getRoot() === leftRoot && leaf.view.containerEl.clientWidth > 0) {
//             leaves.push(leaf);
//         }
//     });
//     return leaves[0];
// }