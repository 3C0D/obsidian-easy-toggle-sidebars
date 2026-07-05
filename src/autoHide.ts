import { Notice } from 'obsidian';
import { getLeftSplit, getRightSplit, toggleBothSidebars } from './barTools.ts';
import type EasytoggleSidebar from './main.ts';
import { ZoneDetector } from './utils/domUtils.ts';
import { UI_CONSTANTS } from './constants/index.ts';

export function autoHideON(plugin: EasytoggleSidebar): void {
  const { settings } = plugin;
  plugin.ribbonIconEl = plugin.addRibbonIcon(
    'move-horizontal',
    'autoHide switcher',
    async () => {
      settings.autoHide = !settings.autoHide;
      await plugin.saveSettings();
      toggleColor(plugin);
      new Notice(
        settings.autoHide ? 'AutoHide Enabled' : 'AutoHide Disabled',
        UI_CONSTANTS.NOTICE_DURATION
      );
    }
  );
  toggleColor(plugin);
}

export function toggleColor(plugin: EasytoggleSidebar): void {
  plugin.settings.autoHide
    ? plugin.ribbonIconEl?.addClass('ribbon-color')
    : plugin.ribbonIconEl?.removeClass('ribbon-color');
}

export async function toggleAutoHide(plugin: EasytoggleSidebar): Promise<void> {
  const { settings } = plugin;
  settings.autoHide = !settings.autoHide;
  await plugin.saveSettings();
  toggleColor(plugin);
  new Notice(
    settings.autoHide ? 'AutoHide Enabled' : 'AutoHide Disabled',
    UI_CONSTANTS.NOTICE_DURATION
  );
}

export function autoHide(this: EasytoggleSidebar, evt: MouseEvent): void {
  if (!this.settings.autoHide) return;
  const element = evt.target as HTMLElement;

  if (!ZoneDetector.isEditorContent(element)) return;

  // Don't trigger when clicking on reveal zones (view header title etc.)
  if (ZoneDetector.isRevealZone(element)) return;

  // Don't trigger inside double-click edge zones
  if (ZoneDetector.isDoubleClickZone(element, evt)) return;

  const leftSplit = getLeftSplit(this.app);
  const rightSplit = getRightSplit(this.app);
  if (leftSplit.collapsed && rightSplit.collapsed) return;
  toggleBothSidebars(this);
}
