export async function reveal(e: MouseEvent): Promise<void> {
    const target = e.target as HTMLElement;
    const headerTitleContainer = target.closest('.view-header-title-container');
    const headerTitle = target.closest('.view-header-title');

    if (target === headerTitleContainer || target === headerTitle) {
        await this.app.commands.executeCommandById(
            "file-explorer:reveal-active-file"
        );
    }
}


