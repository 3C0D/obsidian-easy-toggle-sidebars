import { View, WorkspaceLeaf } from "obsidian";

export async function togglePin(evt: MouseEvent): Promise<void> {
    const isTabHeader = (evt.target as Element).closest(".workspace-tab-header-inner-title");
    if (!isTabHeader) return;
    const activeLeaf = this.app.workspace.getActiveViewOfType(View)?.leaf;
    const { isMainWindow, isRootSplit } = getLeafProperties(activeLeaf);
    const condition = (isMainWindow && isRootSplit) || !isMainWindow;
    if (activeLeaf && condition) {
        activeLeaf.togglePinned();
    }
}

function getLeafProperties(leaf: WorkspaceLeaf | undefined
): { isMainWindow: boolean; isRootSplit: boolean } {
    const isMainWindow = leaf?.view.containerEl.win === window;
    const isRootSplit = leaf?.getRoot() === this.app.workspace.rootSplit
    return { isMainWindow, isRootSplit };
}