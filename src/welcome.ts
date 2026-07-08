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

    contentEl.createEl('h2', { text: "Easy Toggle Sidebars: What's New" });

    const content = `
      <p>Pick a modifier combination in settings (Ctrl, Shift, Alt, Win/Meta), hold it (Ctrl by default) and just move the mouse/trackpad over the editor without clicking.</p>
      <table>
        <tr><th>Direction</th><th>Action</th></tr>
        <tr><td>→ Right</td><td>Toggle right sidebar</td></tr>
        <tr><td>← Left</td><td>Toggle left sidebar</td></tr>
        <tr><td>↓ Down</td><td>Toggle both sidebars</td></tr>
        <tr><td>↑ Up</td><td>Reveal active file in explorer</td></tr>
      </table>
      <p>Release the modifier(s) between two gestures.</p>
      <p>Also:</p>
      <ul>
        <li>Reveal on title click: hold modifiers and click the view header</li>
        <li>Auto-hide: sidebars close on editor click (ribbon icon)</li>
        <li>Pin tabs: double-click a tab header</li>
        <li>Minimal editor width: sidebars auto-hide below a set threshold</li>
        <li>Swipe gesture works on Canvas, Excalidraw and other view types</li>
        <li>Pin tabs also works in secondary windows</li>
      </ul>
      <p>Do not click before moving the mouse, this avoids conflicts with text selection and drag-and-drop.</p>
      <p>Full details in the <a href="https://github.com/3C0D/obsidian-easy-toggle-sidebars">README</a>.</p>
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
