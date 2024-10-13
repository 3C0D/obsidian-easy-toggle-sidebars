import { App } from "obsidian";

export  function reveal(app: App, e: MouseEvent): void {
    const target = e.target as HTMLElement;
    const headerTitleContainer = target.closest('.view-header-title-container');
    const headerTitle = target.closest('.view-header-title');

    if (target === headerTitleContainer || target === headerTitle) {
        // run twice to ensure the file is revealed on long trees
        app.commands.executeCommandById(
            "file-explorer:reveal-active-file"
        );
        app.commands.executeCommandById(
            "file-explorer:reveal-active-file"
        );
    }
}


