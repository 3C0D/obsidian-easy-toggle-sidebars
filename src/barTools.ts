import { WorkspaceSidedock, WorkspaceRoot } from "obsidian";

export function getLeftSplit() {
    return this.app.workspace.leftSplit as WorkspaceSidedock;
}

export function getRightSplit() {
    return this.app.workspace.rightSplit as WorkspaceSidedock;
}

export function getRootSplit() {
    return this.app.workspace.rootSplit as WorkspaceRoot;
}


export function toggleBothSidebars() {
    const isLeftOpen = isOpen(getLeftSplit());
    const isRightOpen = isOpen(getRightSplit());
    if (isLeftOpen && !isRightOpen) {
        getLeftSplit().toggle();
    } else if (isRightOpen && !isLeftOpen) {
        getRightSplit().toggle();
    } else if (isRightOpen && isLeftOpen) {
        getLeftSplit().toggle();
        getRightSplit().toggle();
    } else {
        getLeftSplit().expand();
        getRightSplit().expand();
    }
}

export function isOpen(side: WorkspaceSidedock): boolean {
    return !side.collapsed;
}


export async function toggleIf(side: WorkspaceSidedock) {
    if (isOpen(side)) {
        side.collapse();
    } else {
        side.expand();
    }
}