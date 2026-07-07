import { Modal, Setting } from 'obsidian';
import type EasytoggleSidebar from './main.ts';

export class WelcomeModal extends Modal {
  private plugin: EasytoggleSidebar;

  constructor(plugin: EasytoggleSidebar) {
    super(plugin.app);
    this.plugin = plugin;
  }

  onOpen(): void {
    const { contentEl } = this;

    contentEl.createEl('h2', { text: "Easy Toggle Sidebars — What's new" });

    const content = `
      <ul>
        <li><b>Modifier + swipe gesture:</b> Configure your modifier keys (Shift, Ctrl, Alt, Win/Meta), hold them, and swipe. No click needed.</li>
        <li><b>Works everywhere:</b> The swipe gesture and auto-hide both work in all views — editor, Canvas, and more.</li>
        <li><b>No more mouse button gestures:</b> Right-click and middle-click gestures have been removed. Everything is now modifier + swipe.</li>
        <li><b>Click-and-drag safe:</b> The gesture won't activate if you're holding a mouse button (e.g. selecting text or dragging).</li>
        <li><b>Exact modifier matching:</b> Only the exact configured combination triggers the gesture, preventing conflicts with other plugins.</li>
      </ul>
    `;
    contentEl.createDiv('', (el) => {
      el.innerHTML = content;
    });

    new Setting(contentEl).setName("Don't show this again").addButton((btn) => {
      btn
        .setButtonText('Got it')
        .setCta()
        .onClick(async () => {
          this.plugin.settings.welcomeShown = true;
          await this.plugin.saveSettings();
          this.close();
        });
    });
  }

  onClose(): void {
    this.contentEl.empty();
  }
}
