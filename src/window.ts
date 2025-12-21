import { WorkspaceSidedock } from "obsidian";
import { getLeftSplit, getRightSplit, getRootSplit, isOpen, toggleBothSidebars } from "./barTools";
import EasytoggleSidebar from "./main";

export function onResize(plugin: EasytoggleSidebar) {
    const LS = getLeftSplit(plugin.app);
    const RS = getRightSplit(plugin.app);
    const R = getRootSplit(plugin.app);
    const { settings } = plugin;
    const { minRootWidth } = settings;

    if (
        !settings.autoMinRootWidth ||
        (!isOpen(LS) && !isOpen(RS))
    ) {
        return;
    }
    const editorWidth = R.containerEl.clientWidth;
    if (editorWidth < minRootWidth) {
        updateSidebars(LS, RS, minRootWidth);
    }
    if (editorWidth < minRootWidth) {
        const updatedEditorWidth =
            R.containerEl.clientWidth;
        if (updatedEditorWidth <= minRootWidth) {
            toggleBothSidebars(plugin);
        }
    }
}

function updateSidebars(LS: WorkspaceSidedock, RS: WorkspaceSidedock, minRootWidth: number): void {
    if (LS.containerEl.clientWidth > 200) {
        LS.setSize(200);
    }
    if (RS.containerEl.clientWidth > 200) {
        RS.setSize(200);
    }
}
