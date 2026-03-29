import 'obsidian';

declare module 'obsidian' {
	interface App {
		commands: {
			executeCommandById(id: string): boolean;
		};
	}
	interface WorkspaceSplit {
		containerEl: HTMLElement;
	}
	interface WorkspaceSidedock {
		containerEl: HTMLElement;
		setSize(width: number): void;
	}
}
