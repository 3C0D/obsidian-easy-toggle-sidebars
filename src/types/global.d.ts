import 'obsidian';

declare module 'obsidian' {
  interface App {
    commands: {
      executeCommandById(id: string): boolean;
    };
  }
  interface WorkspaceSidedock {
    containerEl: HTMLDivElement;
    setSize(width: number): void;
  }
}
