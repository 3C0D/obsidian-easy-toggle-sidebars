import { getLeftSplit, getRightSplit, getRootSplit, isOpen, toggleBothSidebars } from "./barTools";

export function onResize() {
    const LS = getLeftSplit();
    const RS = getRightSplit();
    const R = getRootSplit();
    const { settings } = this;
    const { minRootWidth } = settings;

    if (
        !settings.autoMinRootWidth ||
        (!isOpen(LS) && !isOpen(RS))
    ) {
        return;
    }
    const editorWidth = R.containerEl.clientWidth;
    if (editorWidth < minRootWidth) {
        if (LS.containerEl.clientWidth > 200) {
            LS.setSize(200);
        }
        if (RS.containerEl.clientWidth > 200) {
            RS.setSize(200);
        }
    }
    if (editorWidth < minRootWidth) {
        const updatedEditorWidth =
            R.containerEl.clientWidth;
        if (updatedEditorWidth <= minRootWidth) {
            toggleBothSidebars();
        }
    }
}