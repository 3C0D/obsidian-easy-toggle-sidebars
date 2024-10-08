import { Notice } from "obsidian";
import { getLeftSplit, getRightSplit, toggleBothSidebars } from "./barTools";
import EasytoggleSidebar from "./main";

export function autoHideON() {
    const { settings } = this;
    this.ribbonIconEl = this.addRibbonIcon(
        "move-horizontal",
        "autoHide switcher",
        async () => {
            settings.autoHide = !settings.autoHide;
            await this.saveSettings();
            toggleColor(this);
            toggleAutoHideEvent(this);
            new Notice(
                settings.autoHide
                    ? "AutoHide Enabled"
                    : "AutoHide Disabled",
                2000
            );
        }
    );
    toggleColor(this);
}

export function toggleColor(plugin: EasytoggleSidebar) {
    plugin.settings.autoHide
        ? plugin.ribbonIconEl?.addClass("ribbon-color")
        : plugin.ribbonIconEl?.removeClass("ribbon-color");
}

export function toggleAutoHideEvent(plugin: EasytoggleSidebar) {
    if (plugin.settings.autoHide) {
        plugin.registerDomEvent(document, "click", autoHide.bind(plugin));
    } else {
        document.removeEventListener("click", autoHide.bind(plugin));
    }
}


export async function toggleAutoHide(plugin: EasytoggleSidebar): Promise<void> {
    const { settings } = plugin;
    settings.autoHide = !settings.autoHide;
    await plugin.saveSettings();
    toggleColor(this);
    toggleAutoHideEvent(this);
    new Notice(
        settings.autoHide ? "AutoHide Enabled" : "AutoHide Disabled",
        2000
    );
}

export function autoHide(evt: MouseEvent): void {
    if (!this.settings.autoHide) return
    const element = evt.target as HTMLElement;
    const isBody = element.closest(".cm-content");
    const isLine = element.closest(".cm-line");
    const isLink = element.closest(".cm-underline");
    const isRoot = element.closest(".mod-root");
    if (!isRoot && !isBody && !isLine && !isLink) return;


    //all collpased 
    const leftSplit = getLeftSplit();
    const rightSplit = getRightSplit();
    if (leftSplit.collapsed && rightSplit.collapsed) return
    toggleBothSidebars();
}

