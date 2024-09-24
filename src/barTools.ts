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
        toggle(getLeftSplit());
    } else if (isRightOpen && !isLeftOpen) {
        toggle(getRightSplit());
    } else if (isRightOpen && isLeftOpen) {
        toggle(getLeftSplit());
        toggle(getRightSplit());
    } else {
        toggle(getLeftSplit(), 1);
        toggle(getRightSplit(), 1);
    }
}

export function isOpen(side: WorkspaceSidedock): boolean {
    return !side.collapsed;
}


export async function toggle(side: WorkspaceSidedock, mode = 0) {
    switch (mode) {
        case 0: // Mode close
            side.collapse();
            break;
        case 1: // Mode open
            side.expand();
            break;
        case 2: // Mode toggle
            if (isOpen(side)) {
                side.collapse();
            } else {
                side.expand();
            }
            break;
        default:
            break;
    }
}