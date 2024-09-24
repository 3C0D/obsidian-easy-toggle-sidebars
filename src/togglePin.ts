import { View, WorkspaceLeaf } from "obsidian";
import { getRootSplit } from "./barTools";

export async function togglePin(evt: MouseEvent): Promise<void> {
    const isTabHeader = (evt.target as Element).closest(".workspace-tab-header-inner-title");
    if (!isTabHeader) return;
    const activeLeaf = this.app.workspace.getActiveViewOfType(View)?.leaf;
    const { isMainWindow, rootSplit } = getLeafProperties(activeLeaf);
    const condition = (isMainWindow && rootSplit) || !isMainWindow;
    if (activeLeaf && condition) {
        activeLeaf.togglePinned();
    }
}

function getLeafProperties(leaf: WorkspaceLeaf | undefined
): { isMainWindow: boolean; rootSplit: boolean } {
    const isMainWindow = leaf?.view.containerEl.win === window;
    const rootSplit = leaf?.getRoot() === getRootSplit();
    return { isMainWindow, rootSplit };
}