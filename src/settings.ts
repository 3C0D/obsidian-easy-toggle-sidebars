import type { App } from 'obsidian';
import { PluginSettingTab, Setting } from 'obsidian';
import type EasytoggleSidebar from './main.ts';
import { toggleColor, autoHideON } from './autoHide.ts';
import { DEFAULT_SETTINGS, UI_CONSTANTS } from './constants/index.ts';

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
		<b>Swipe gesture (mouse & trackpad):</b>
		<ul>
			<li>Hold the modifier(s) selected below and swipe. No click needed — just hold then move.</li>
			<li><b>Swipe left/right:</b> Toggles the left/right sidebar.</li>
			<li><b>Swipe down:</b> Toggles both sidebars.</li>
			<li><b>Swipe up:</b> Reveals the active file in the file explorer.</li>
			<li>Works on all views (editor, Canvas, etc.).</li>
			<li>Won't trigger during a click-and-drag (text selection, etc.).</li>
		</ul>

		<b>Other features:</b>
		<ul>
			<li><b>Click on the view header title with modifiers:</b> Reveals the active file in the file explorer.</li>
			<li><b>Double click on the tab header:</b> Toggles the tab pinning.</li>
			<li><b>Auto-hide:</b> Automatically hides sidebars when clicking anywhere in the content area (works in all views including Canvas).</li>
			<li><b>Minimal editor width:</b> Automatically hides sidebars if the editor is narrower than the threshold.</li>
		</ul>
		`;
    const fragment = createFragment((el) => {
      el.createEl('div').innerHTML = content;
    });

    containerEl.createDiv('', (el: HTMLDivElement) => {
      el.appendChild(fragment);
    });

    new Setting(containerEl)
      .setName('Auto hide')
      .setDesc(
        'Auto hide panels when clicking on the editor. Add a Ribbon icon to switch autoHide'
      )
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.autoHideRibbon).onChange(async (value) => {
          this.plugin.settings.autoHideRibbon = value;
          if (this.plugin.settings.autoHideRibbon) {
            this.plugin.settings.autoHide = true;
            toggleColor(this.plugin);
            autoHideON(this.plugin);
          } else {
            this.plugin.ribbonIconEl?.remove();
            this.plugin.ribbonIconEl = null;
            this.plugin.settings.autoHide = false;
            toggleColor(this.plugin);
          }
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName('Minimal editor width')
      .setDesc(
        'Hide panel(s) if the proportion of the editor is less than X (threshold below) times the window size'
      )
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.autoMinRootWidth).onChange(async (value) => {
          this.plugin.settings.autoMinRootWidth = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName('Set editor min width')
      .setDesc('min width triggering auto reduce/close sidebars')
      .addSlider((slider) => {
        slider
          .setLimits(
            UI_CONSTANTS.MIN_EDITOR_WIDTH,
            UI_CONSTANTS.MAX_EDITOR_WIDTH,
            UI_CONSTANTS.SLIDER_STEP
          )
          .setValue(this.plugin.settings.minRootWidth)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.minRootWidth = value;
            await this.plugin.saveSettings();
          });
      })
      .addExtraButton((btn) => {
        btn
          .setIcon('reset')
          .setTooltip('Reset to default')
          .onClick(async () => {
            this.plugin.settings.minRootWidth = DEFAULT_SETTINGS.minRootWidth;
            await this.plugin.saveSettings();
            this.display();
          });
      });

    new Setting(containerEl)
      .setName('Double click on tab headers to toggle pin')
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.togglePin).onChange(async (value) => {
          this.plugin.settings.togglePin = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName('Reveal file on title click with modifiers')
      .setDesc(
        'Click the view header title while holding the configured modifiers to reveal the active file'
      )
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.reveal).onChange(async (value) => {
          this.plugin.settings.reveal = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName('Swipe gesture')
      .setDesc(
        'Hold the modifier(s) selected below and swipe (works with both mouse and trackpad). Left/right toggles sidebars, down toggles both, up reveals active file.'
      )
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.useTrackpadSwipe).onChange(async (value) => {
          this.plugin.settings.useTrackpadSwipe = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName('Swipe gesture: Shift')
      .setDesc('Require Shift to be held for the swipe gesture')
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.trackpadModifiers.shift)
          .onChange(async (value) => {
            if (
              !value &&
              !this.plugin.settings.trackpadModifiers.ctrl &&
              !this.plugin.settings.trackpadModifiers.alt &&
              !this.plugin.settings.trackpadModifiers.meta
            ) {
              toggle.setValue(true);
              return;
            }
            this.plugin.settings.trackpadModifiers.shift = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName('Swipe gesture: Ctrl')
      .setDesc('Require Ctrl to be held for the swipe gesture')
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.trackpadModifiers.ctrl)
          .onChange(async (value) => {
            if (
              !value &&
              !this.plugin.settings.trackpadModifiers.shift &&
              !this.plugin.settings.trackpadModifiers.alt &&
              !this.plugin.settings.trackpadModifiers.meta
            ) {
              toggle.setValue(true);
              return;
            }
            this.plugin.settings.trackpadModifiers.ctrl = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName('Swipe gesture: Alt')
      .setDesc('Require Alt to be held for the swipe gesture')
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.trackpadModifiers.alt)
          .onChange(async (value) => {
            if (
              !value &&
              !this.plugin.settings.trackpadModifiers.shift &&
              !this.plugin.settings.trackpadModifiers.ctrl &&
              !this.plugin.settings.trackpadModifiers.meta
            ) {
              toggle.setValue(true);
              return;
            }
            this.plugin.settings.trackpadModifiers.alt = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName('Swipe gesture: Win / Meta')
      .setDesc('Require Win (Meta on Linux, Cmd on Mac) to be held for the swipe gesture')
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.trackpadModifiers.meta)
          .onChange(async (value) => {
            if (
              !value &&
              !this.plugin.settings.trackpadModifiers.shift &&
              !this.plugin.settings.trackpadModifiers.ctrl &&
              !this.plugin.settings.trackpadModifiers.alt
            ) {
              toggle.setValue(true);
              return;
            }
            this.plugin.settings.trackpadModifiers.meta = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName('Swipe threshold(px)')
      .setDesc('minimal accumulated swipe distance to trigger a toggle')
      .addSlider((slider) => {
        slider
          .setLimits(
            UI_CONSTANTS.TRACKPAD_THRESHOLD_MIN,
            UI_CONSTANTS.TRACKPAD_THRESHOLD_MAX,
            UI_CONSTANTS.MOVEMENT_SLIDER_STEP
          )
          .setValue(this.plugin.settings.trackpadThreshold)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.trackpadThreshold = value;
            await this.plugin.saveSettings();
          });
      })
      .addExtraButton((btn) => {
        btn
          .setIcon('reset')
          .setTooltip('Reset to default')
          .onClick(async () => {
            this.plugin.settings.trackpadThreshold = DEFAULT_SETTINGS.trackpadThreshold;
            await this.plugin.saveSettings();
            this.display();
          });
      });
  }
}
