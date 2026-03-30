import type { WorkspaceLeaf } from 'obsidian';
import { Plugin } from 'obsidian';
import { ETSSettingTab } from './settings.ts';
import { mousedownHandler } from './mouseDown.ts';
import { autoHide, autoHideON } from './autoHide.ts';
import { onResize } from './window.ts';
import type { ETSSettings } from './types/variables.ts';
import { DEFAULT_SETTINGS } from './constants/index.ts';
import { registerCommands } from './commands.ts';
import { mousemoveHandler } from './mouseMove.ts';
import { mouseupHandler } from './mouseUp.ts';

export default class EasytoggleSidebar extends Plugin {
	settings: ETSSettings;
	ribbonIconEl: HTMLElement | null = null;
	startX = 0;
	startY = 0;
	endX = 0;
	endY = 0;
	button: number | null = null;
	isTracking = false;
	movedX = false;
	movedY = false;
	target: HTMLElement | null = null;
	preventContextmenu: NodeJS.Timeout | null = null;
	doubleClickTimeout: NodeJS.Timeout | null = null;
	clicked = 0;
	previousActiveSplitLeaf: WorkspaceLeaf | null;

	async onload(): Promise<void> {
		await this.loadSettings();
		this.addSettingTab(new ETSSettingTab(this.app, this));
		if (this.settings.autoHideRibbon) autoHideON(this);
		this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));
	}

	private onLayoutReady(): void {
		this.registerDomEvents();
		registerCommands(this);

		if (this.settings.autoHide) {
			this.registerDomEvent(document, 'click', autoHide.bind(this));
		}

		this.registerEvent(this.app.workspace.on('resize', () => onResize(this)));
	}

	private registerDomEvents(): void {
		this.registerDomEvent(document, 'mousedown', (e: MouseEvent) =>
			mousedownHandler(this, e)
		);
		this.registerDomEvent(document, 'mousemove', (e: MouseEvent) =>
			mousemoveHandler(this, e)
		);
		this.registerDomEvent(document, 'mouseup', (e: MouseEvent) =>
			mouseupHandler(this, this.app, e)
		);
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}
