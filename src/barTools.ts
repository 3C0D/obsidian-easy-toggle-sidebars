import type { WorkspaceSidedock, WorkspaceRoot, App } from 'obsidian';
import type EasytoggleSidebar from './main.ts';

export function getLeftSplit(app: App): WorkspaceSidedock {
	return app.workspace.leftSplit as WorkspaceSidedock;
}

export function getRightSplit(app: App): WorkspaceSidedock {
	return app.workspace.rightSplit as WorkspaceSidedock;
}

export function getRootSplit(app: App): WorkspaceRoot {
	return app.workspace.rootSplit as WorkspaceRoot;
}

export function toggleBothSidebars(plugin: EasytoggleSidebar): void {
	const isLeftOpen = isOpen(getLeftSplit(plugin.app));
	const isRightOpen = isOpen(getRightSplit(plugin.app));
	if (isLeftOpen && !isRightOpen) {
		getLeftSplit(plugin.app).toggle();
	} else if (isRightOpen && !isLeftOpen) {
		getRightSplit(plugin.app).toggle();
	} else if (isRightOpen && isLeftOpen) {
		getLeftSplit(plugin.app).toggle();
		getRightSplit(plugin.app).toggle();
	} else {
		getLeftSplit(plugin.app).expand();
		getRightSplit(plugin.app).expand();
	}
}

export function isOpen(side: WorkspaceSidedock): boolean {
	return !side.collapsed;
}

export function toggleIf(side: WorkspaceSidedock): void {
	if (isOpen(side)) {
		side.collapse();
	} else {
		side.expand();
	}
}
