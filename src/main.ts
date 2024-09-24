import { Plugin, WorkspaceLeaf } from "obsidian";
import { ETSSettingTab } from "./settings";
import { mousedownHandler } from "./mouseDown";
import { autoHide, autoHideON } from "./autoHide";
import { onResize } from "./window";
import { DEFAULT_SETTINGS, ETSSettings } from "./types/types";
import { registerCommands } from "./commands";
import { mousemoveHandler } from "./mouseMove";
import { mouseupHandler } from "./mouseUp";

// menu when click and move from ribbon not good context menu 

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
	ribbonToggleTimer: NodeJS.Timeout | null = null;
	clicked = 0;
	// clickTimeout: NodeJS.Timeout | string | number | undefined;
	previousActiveSplitLeaf: WorkspaceLeaf | null;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new ETSSettingTab(this.app, this));
		if (this.settings.autoHideRibbon) autoHideON.bind(this)();
		this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));
	}

	private onLayoutReady(): void {
		this.registerDomEvents();
		registerCommands(this);

		if (this.settings.autoHide) {
			this.registerDomEvent(document, "click", autoHide.bind(this));
		}

		this.registerEvent(
			this.app.workspace.on("resize", onResize.bind(this))
		);
	}

	private registerDomEvents(): void {
		this.registerDomEvent(document, "mousedown",
			(e: MouseEvent) => mousedownHandler(this, e));
		this.registerDomEvent(document, "mousemove", (e: MouseEvent) => mousemoveHandler(this, e));
		this.registerDomEvent(document, "mouseup", (e: MouseEvent) => mouseupHandler(this, e));
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
