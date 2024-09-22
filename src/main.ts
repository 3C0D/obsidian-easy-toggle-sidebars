import { Notice, Plugin, View, WorkspaceLeaf, WorkspaceRoot, WorkspaceSidedock } from "obsidian";
import { ETSSettingTab } from "./settings";

interface ETSSettings {
	useRightMouse: boolean;
	useMiddleMouse: boolean;
	moveThresholdHor: number;
	moveThresholdVert: number;
	autoHide: boolean;
	autoHideRibbon: boolean;
	autoMinRootWidth: boolean;
	minRootWidth: number;
	dblClickDelay: number;
	togglePin: boolean
}

export const DEFAULT_SETTINGS: ETSSettings = {
	useRightMouse: true,
	useMiddleMouse: true,
	moveThresholdHor: 50,
	moveThresholdVert: 50,
	autoHide: true,
	autoHideRibbon: true,
	autoMinRootWidth: true,
	minRootWidth: 300,
	dblClickDelay: 450,
	togglePin: true,
};

export default class EasytoggleSidebar extends Plugin {
	settings: ETSSettings;
	ribbonIconEl: HTMLElement | null = null;
	private startX = 0;
	private startY = 0;
	private endX = 0;
	private endY = 0;
	private isTracking = false;
	private distanceX = 0;
	private distanceY = 0;
	private movedX = false;
	private movedY = false;
	private doubleClickTimer: NodeJS.Timeout | null = null;
	private clicked = 0;
	private clickTimeout: ReturnType<typeof setTimeout> | null = null;
	private previousActiveSplitLeaf: WorkspaceLeaf | null;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new ETSSettingTab(this.app, this));
		if (this.settings.autoHideRibbon) {
			this.autoHideON();
		}

		this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));
	}

	private onLayoutReady(): void {
		this.registerDomEvents();
		this.registerCommands();

		if (this.settings.autoHide) {
			this.registerDomEvent(document, "click", this.autoHide);
		}

		this.registerEvent(
			this.app.workspace.on("resize", this.onResize.bind(this))
		);
	}

	private registerDomEvents(): void {
		this.registerDomEvent(document, "mousedown", this.mousedownHandler);
		this.registerDomEvent(document, "mousemove", this.mousemoveHandler);
		this.registerDomEvent(document, "mouseup", this.mouseupHandler);
		this.registerDomEvent(document, "dblclick", this.toggleRightSidebar);
		this.registerDomEvent(document, "click", this.onClick);
	}

	private registerCommands(): void {
		this.addCommand({
			id: "toggle-autohide",
			name: "Toggle autohide sidebars",
			callback: this.toggleAutoHide.bind(this),
		});

		this.addCommand({
			id: "toggle-both-sidebars",
			name: "Toggle both sidebars",
			callback: this.toggleBothSidebars.bind(this),
		});
	}

	private async toggleAutoHide(): Promise<void> {
		const { settings } = this;
		settings.autoHide = !settings.autoHide;
		await this.saveSettings();
		this.toggleAutoHideEvent();
		this.toggleColor();
		new Notice(
			settings.autoHide ? "AutoHide Enabled" : "AutoHide Disabled",
			2000
		);
	}

	onClick = (evt: MouseEvent) => {
		if (this.clickTimeout) {
			clearTimeout(this.clickTimeout);
		}

		if (!this.clicked) {
			this.clicked = 1;
		} else {
			this.clicked++;
		}

		this.clickTimeout = setTimeout(async () => {
			if (this.clicked === 3) {
				await this.goToExplorerTab.bind(this)(evt);
			} else if (this.clicked === 2 && this.settings.togglePin) {
				await this.togglePin.bind(this)(evt);
			}
			this.clicked = 0;
		}, 400); // to recognize the triple clic
	};

	private contextMenuHandler = (evt: MouseEvent): void => {
		evt.preventDefault();
	}

	private mousedownHandler = (evt: MouseEvent):void => {
		if (evt.button === 0) return;
		this.reinitialize();
		const { settings } = this;
		const RMB = settings.useRightMouse;
		const MMB = settings.useMiddleMouse;
		if ((MMB && evt.button === 1) || (RMB && evt.button === 2)) {
			this.startX = evt.clientX;
			this.startY = evt.clientY;
			this.isTracking = true;
			this.doubleClickTimer = setTimeout(() => {
				this.doubleClickTimer = null;
				this.removeContextMenuListener();
			}, this.settings.dblClickDelay);
		}
	};

	mousemoveHandler = (e: MouseEvent) => {
		if (!this.isTracking) return;

		const { settings } = this;
		this.endX = e.clientX;
		this.endY = e.clientY;

		this.distanceX = Math.abs(this.endX - this.startX);
		this.distanceY = Math.abs(this.endY - this.startY);

		this.movedX = this.distanceX > settings.moveThresholdHor;
		this.movedY = this.distanceY > settings.moveThresholdVert;

		if (this.movedX || this.movedY) {
			this.addContextMenuListener();
		}
	};

	mouseupHandler = (evt: MouseEvent) => {
		if (!this.isTracking) return;
		this.isTracking = false; //to stop operations on mousemoveHandler and this one

		const { settings } = this;
		const RMB = settings.useRightMouse;
		const MMB = settings.useMiddleMouse;

		if (
			((MMB && evt.button === 1) || (RMB && evt.button === 2)) &&
			evt.detail === 1
		)
			if (
				(this.movedX && this.endX < this.startX) ||
				(this.movedY && this.endY < this.startY)
			) {
				this.toggle(this.getLeftSplit(), 2);
				this.removeContextMenuListener();
			} else if (
				(this.movedX && this.endX > this.startX) ||
				(this.movedY && this.endY > this.startY)
			) {
				this.toggle(this.getRightSplit(), 2);
				this.removeContextMenuListener();
			}

		if (
			((MMB && evt.button === 1) || (RMB && evt.button === 2)) &&
			evt.detail === 2 &&
			this.doubleClickTimer
		) {
			this.addContextMenuListener();
			this.toggleBothSidebars();
			this.removeContextMenuListener();
		}
	};

	autoHideON = () => {
		const { settings } = this;
		this.ribbonIconEl = this.addRibbonIcon(
			"move-horizontal",
			"autoHide switcher",
			async () => {
				settings.autoHide = !settings.autoHide;
				await this.saveSettings();
				this.toggleAutoHideEvent();
				this.toggleColor();
				new Notice(
					settings.autoHide
						? "AutoHide Enabled"
						: "AutoHide Disabled",
					2000
				);
			}
		);
		this.toggleColor();
	};

	toggleColor() {
		this.settings.autoHide
			? this.ribbonIconEl?.addClass("ribbon-color")
			: this.ribbonIconEl?.removeClass("ribbon-color");
	}

	toggleAutoHideEvent = () => {
		if (this.settings.autoHide) {
			this.registerDomEvent(document, "click", this.autoHide);
		} else {
			document.removeEventListener("click", this.autoHide);
		}
	};

	contextmenuHandler(evt: MouseEvent) {
		evt.preventDefault();
	}

	addContextMenuListener(): void {
		window.addEventListener(
			"contextmenu",
			this.contextmenuHandler,
			true
		);
	}

	reinitialize() {
		this.startX = 0;
		this.startY = 0;
		this.endX = 0;
		this.endY = 0;
		this.isTracking = false;
		this.distanceX = 0;
		this.distanceY = 0;
		this.movedX = false;
		this.movedY = false;
	}

	private removeContextMenuListener(delay = 20): void {
		if (this.movedX || this.movedY || this.doubleClickTimer) {
			setTimeout(() => {
				window.removeEventListener(
					"contextmenu",
					this.contextmenuHandler,
					true
				);
				this.movedX = false;
				this.movedY = false;
				this.doubleClickTimer = null;
			}, delay);
		}
	}

	toggleBothSidebars() {
		const isLeftOpen = this.isOpen(this.getLeftSplit());
		const isRightOpen = this.isOpen(this.getRightSplit());
		if (isLeftOpen && !isRightOpen) {
			this.toggle(this.getLeftSplit());
		} else if (isRightOpen && !isLeftOpen) {
			this.toggle(this.getRightSplit());
		} else if (isRightOpen && isLeftOpen) {
			this.toggle(this.getLeftSplit());
			this.toggle(this.getRightSplit());
		} else {
			this.toggle(this.getLeftSplit(), 1);
			this.toggle(this.getRightSplit(), 1);
		}
	}

	getLeftSplit() {
		return this.app.workspace.leftSplit as WorkspaceSidedock;
	}

	getRightSplit() {
		return this.app.workspace.rightSplit as WorkspaceSidedock;
	}

	getRootSplit() {
		return this.app.workspace.rootSplit as WorkspaceRoot;
	}

	onResize() {
		const LS = this.getLeftSplit();
		const RS = this.getRightSplit();
		const R = this.getRootSplit();
		const { settings } = this;
		const { minRootWidth } = settings;

		if (
			!settings.autoMinRootWidth ||
			(!this.isOpen(LS) && !this.isOpen(RS))
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
				this.toggleBothSidebars();
			}
		}
	}

	async toggle(side: WorkspaceSidedock, mode = 0) {
		switch (mode) {
			case 0: // Mode close
				side.collapse();
				break;
			case 1: // Mode open
				side.expand();
				break;
			case 2: // Mode toggle
				if (this.isOpen(side)) {
					side.collapse();
				} else {
					side.expand();
				}
				break;
			default:
				break;
		}
	}

	private isOpen(side: WorkspaceSidedock): boolean {
		return !side.collapsed;
	}

	private autoHide = (evt: MouseEvent): void => {
		const rootSplitEl = this.getRootSplit().containerEl;
		const element = evt.target as HTMLElement;
		// Root body content only
		const isBody = element.classList.contains("cm-content");
		const isLine = element.classList.contains("cm-line");
		const isLink = element.classList.contains("cm-underline"); // links
		const isRoot = rootSplitEl.contains(element);
		if (!isRoot) return;
		if (isLine || isBody || isLink) {
			const leftSplit = this.getLeftSplit();
			const rightSplit = this.getRightSplit();
			if (!leftSplit.collapsed || !rightSplit.collapsed) {
				this.toggleBothSidebars();
			}
		}
	}

	toggleRightSidebar = (evt: MouseEvent) => {
		const Element = evt.target as HTMLElement;
		const isRibbon = Element.classList.contains("workspace-ribbon");
		if (isRibbon) {
			const leftSplit = this.getLeftSplit();
			this.toggle(leftSplit, 2);
		}
	};

	goToExplorerTab = async (evt: MouseEvent) => {
		const isLeftSplit = (evt.target as Element).closest(".mod-left-split");
		if (isLeftSplit) {
			const activeLeftSplit = this.getActiveSidebarLeaf.bind(this)()
			const isExplorerLeaf = activeLeftSplit?.getViewState().type === 'file-explorer'
			if (isExplorerLeaf) {
				if (this.previousActiveSplitLeaf) this.app.workspace.revealLeaf(this.previousActiveSplitLeaf)
			} else {
				const explorerLeaf = this.app.workspace.getLeavesOfType('file-explorer')[0];
				this.app.workspace.revealLeaf(explorerLeaf)
			}
			this.previousActiveSplitLeaf = activeLeftSplit
		}
	};


	private togglePin = async (evt: MouseEvent): Promise<void> => {
		const isTabHeader = (evt.target as Element).closest(".workspace-tab-header-inner-title");
		if (!isTabHeader) return;
		const activeLeaf = this.app.workspace.getActiveViewOfType(View)?.leaf;
		const { isMainWindow, rootSplit } = this.getLeafProperties(activeLeaf);
		const condition = (isMainWindow && rootSplit) || !isMainWindow;
		if (activeLeaf && condition) {
			activeLeaf.togglePinned();
		}
	}

	private getLeafProperties(
		leaf: WorkspaceLeaf | undefined
	): { isMainWindow: boolean; rootSplit: boolean } {
		const isMainWindow = leaf?.view.containerEl.win === window;
		const rootSplit = leaf?.getRoot() === this.getRootSplit();
		return { isMainWindow, rootSplit };
	}

	private getActiveSidebarLeaf(): WorkspaceLeaf | undefined {
		const leftRoot = this.getLeftSplit().getRoot();
		const leaves: WorkspaceLeaf[] = [];
		this.app.workspace.iterateAllLeaves((leaf) => {
			if (leaf.getRoot() === leftRoot && leaf.view.containerEl.clientWidth > 0) {
				leaves.push(leaf);
			}
		});
		return leaves[0];
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
