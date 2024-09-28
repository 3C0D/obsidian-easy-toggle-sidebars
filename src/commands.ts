import { toggleAutoHide } from "./autoHide";
import { toggleBothSidebars } from "./barTools";
import EasytoggleSidebar from "./main";

export function registerCommands(plugin: EasytoggleSidebar): void {
    plugin.addCommand({
        id: "toggle-autohide",
        name: "Toggle autohide sidebars",
        callback: async () => await toggleAutoHide(plugin),
    });

    plugin.addCommand({
        id: "toggle-both-sidebars",
        name: "Toggle both sidebars",
        callback: toggleBothSidebars,
    });
}