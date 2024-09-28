import { App, PluginSettingTab, Setting } from "obsidian";
import EasytoggleSidebar from "./main";
import { toggleAutoHideEvent, toggleColor, autoHideON } from "./autoHide";
import { DEFAULT_SETTINGS } from "./types/types";

export class ETSSettingTab extends PluginSettingTab {
	plugin: EasytoggleSidebar;

	constructor(app: App, plugin: EasytoggleSidebar) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		const content = `
		<br>
		<b>Right/Middle Mouse Click Usage:</b>
		<ul>
			<li><b>Click and move towards right/left (or top/bottom):</b> Toggles the right/left sidebar.</li>
			<li>Double click to toggle both sidebars in the editor and the ribbon bar.</li>
		</ul>

		<b>With LeftMouseButton: </b>
		<ul>
		<li><b>Double/Triple click on the ribbon bar:</b> Toggles the left/right sidebar (especially useful in canvas mode). </li>
		<li><b>Double click on the left/right edges of the editor to toggle the left/right sidebar.</li>
		<li><b>Click on the view header title or around it:</b> Reveals the active file in the file explorer.</li>
		<li><b>Double click on the tab header:</b> Toggles the tab pinning.</li>
		<li>Tips: Triple click in the left sidebar to switch between active tab and explorer tab.</li>
		</ul>

		<br>
		<b>Ohter features:</b>
		<ul>
			<li>Auto-hide to automatically hide sidebars when clicking on the editor.</li>
			<li>Use the setting "minimal editor width" to automatically hide the sidebars if the editor width is less than the specified threshold.</li>
		</ul>

		<br>
		<b>Settings:</b>
		<p>Every setting can be customized in the settings.</p>
		<ul>
			<li><b>Horizontal and Vertical Move Threshold:</b> You can customize the sensitivity of the click-and-move gesture by adjusting the horizontal and vertical move thresholds in settings.</li>
			<li><b>Right and Middle Mouse Button Activation:</b> You can enable or disable the use of the right and middle mouse buttons in settings.</li>
			<li><b>Double-Click Delay:</b> You can customize the delay for double-click actions in settings.</li>
		</ul>		
		`;
		const fragment = createFragment((el) => {
			el.createEl("div").innerHTML = content;
		})

		containerEl.createDiv("", (el: HTMLDivElement) => {
			el.appendChild(fragment);
		});

		new Setting(containerEl)
			.setName("Right Mouse")
			.setDesc("Activates Right Mouse to trigger operations")
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.useRightMouse)
					.onChange((value) => {
						this.plugin.settings.useRightMouse = value;
						this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Middle Mouse")
			.setDesc("Activates Right Mouse to trigger operations")
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.useMiddleMouse)
					.onChange(async (value) => {
						this.plugin.settings.useMiddleMouse = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Horizontal Move threshold(px)")
			.setDesc("the most used")
			.addSlider((slider) => {
				slider
					.setLimits(50, 410, 20)
					.setValue(this.plugin.settings.moveThresholdHor)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.moveThresholdHor = value;
						await this.plugin.saveSettings();
					});
			})
			.addExtraButton((btn) => {
				btn.setIcon("reset")
					.setTooltip("Reset to default")
					.onClick(async () => {
						this.plugin.settings.moveThresholdHor =
							DEFAULT_SETTINGS.moveThresholdHor;
						await this.plugin.saveSettings();
						this.display();
					});
			});

		new Setting(containerEl)
			.setName("Vertical Move threshold(px)")
			.setDesc("could be used in ribbon bar, when using canvas")
			.addSlider((slider) => {
				slider
					.setLimits(50, 410, 20)
					.setValue(this.plugin.settings.moveThresholdVert)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.moveThresholdVert = value;
						await this.plugin.saveSettings();
					});
			})
			.addExtraButton((btn) => {
				btn.setIcon("reset")
					.setTooltip("Reset to default")
					.onClick(async () => {
						this.plugin.settings.moveThresholdVert =
							DEFAULT_SETTINGS.moveThresholdVert;
						await this.plugin.saveSettings();
						this.display();
					});
			});

		new Setting(containerEl)
			.setName("Auto hide")
			.setDesc(
				"Auto hide panels when clicking on the editor. Add a Ribbon icon to switch autoHide"
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.autoHideRibbon)
					.onChange(async (value) => {
						this.plugin.settings.autoHideRibbon = value;
						if (this.plugin.settings.autoHideRibbon) {
							this.plugin.settings.autoHide = true;
							toggleAutoHideEvent(this.plugin);
							toggleColor(this.plugin);
							autoHideON.bind(this.plugin)();
						} else {
							this.plugin.ribbonIconEl?.remove();
							this.plugin.ribbonIconEl = null;
							this.plugin.settings.autoHide = false;
							toggleAutoHideEvent(this.plugin);
							toggleColor(this.plugin);
						}
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Minimal editor width")
			.setDesc(
				"Hide panel(s) if the proportion of the editor is less than X (threshold below) times the window size"
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.autoMinRootWidth)
					.onChange(async (value) => {
						this.plugin.settings.autoMinRootWidth = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Set editor min width")
			.setDesc("min width triggering auto reduce/close sidebars")
			.addSlider((slider) => {
				slider
					.setLimits(200, 800, 10)
					.setValue(this.plugin.settings.minRootWidth)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.minRootWidth = value;
						await this.plugin.saveSettings();
					});
			})
			.addExtraButton((btn) => {
				btn.setIcon("reset")
					.setTooltip("Reset to default")
					.onClick(async () => {
						this.plugin.settings.minRootWidth =
							DEFAULT_SETTINGS.minRootWidth;
						await this.plugin.saveSettings();
						this.display();
					});
			});

		new Setting(containerEl)
			.setName("double click delay(ms)")
			.setDesc("max delay to trigger a double click")
			.addSlider((slider) => {
				slider
					.setLimits(200, 600, 10)
					.setValue(this.plugin.settings.dblClickDelay)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.dblClickDelay = value;
						await this.plugin.saveSettings();
					});
			})
			.addExtraButton((btn) => {
				btn.setIcon("reset")
					.setTooltip("Reset to default")
					.onClick(async () => {
						this.plugin.settings.dblClickDelay =
							DEFAULT_SETTINGS.dblClickDelay;
						await this.plugin.saveSettings();
						this.display();
					});
			});

		new Setting(containerEl)
			.setName("double click on tab headers to toggle pin")
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.togglePin)
					.onChange(async (value) => {
						this.plugin.settings.togglePin = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("reveal file clicking on view header title")
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.reveal)
					.onChange(async (value) => {
						this.plugin.settings.reveal = value;
						await this.plugin.saveSettings();
					});
			});
	}
}
