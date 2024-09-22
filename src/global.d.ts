import 'obsidian'

declare module "obsidian" {
    interface WorkspaceSplit {
        containerEl: HTMLElement
    }
    interface WorkspaceSidedock {
        containerEl: HTMLElement
        setSize(width: number): void
    }
}
