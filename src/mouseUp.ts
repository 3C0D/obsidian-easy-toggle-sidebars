import type { App } from 'obsidian';
import { toggleBothSidebars, getLeftSplit, getRightSplit } from './barTools.ts';
import { goToExplorerTab } from './explorerTabs.ts';
import type EasytoggleSidebar from './main.ts';
import { reveal } from './reveal.ts';
import { handleEditorEdgeClick } from './scrollBar.ts';
import { togglePin } from './togglePin.ts';
import { contextmenuListener, removeContextMenuListener } from './tools.ts';
import { ZoneDetector } from './utils/domUtils.ts';
import { UI_CONSTANTS } from './constants/index.ts';

export async function mouseupHandler(
  plugin: EasytoggleSidebar,
  app: App,
  evt: MouseEvent
): Promise<void> {
  const { mouse } = plugin;

  // Click & move
  if (mouse.isTracking) {
    mouse.isTracking = false;
    mouse.button = null;
    mouse.startX = evt.clientX;
    mouse.startY = evt.clientY;
    mouse.preventContextmenu = setTimeout(() => {
      removeContextMenuListener(plugin);
    }, plugin.settings.dblClickDelay);
    if (mouse.movedX || mouse.movedY) {
      mouse.movedX = false;
      mouse.movedY = false;
      return;
    }
  }

  const { useRightMouse, useMiddleMouse } = plugin.settings;

  if (evt.detail === 1) {
    if (evt.button === 0) {
      // Note: autoHide is handled by the document 'click' listener registered
      // in main.ts (self-gated on settings.autoHide). Calling it again here
      // would double-toggle and cancel the action out.
      if (plugin.settings.reveal) {
        try {
          reveal(app, evt);
        } catch (error) {
          console.warn('Could not perform reveal action:', error);
        }
      }
    }
  } else if (evt.detail === 2) {
    // Cancel any pending double-click action
    if (mouse.doubleClickTimeout) {
      clearTimeout(mouse.doubleClickTimeout);
    }

    if ((useMiddleMouse && evt.button === 1) || (useRightMouse && evt.button === 2)) {
      contextmenuListener(plugin);
      const target = evt.target as HTMLElement;
      const isRibbon = ZoneDetector.isRibbonZone(target);
      const editor = ZoneDetector.isEditorZone(target);
      if (isRibbon || editor) toggleBothSidebars(plugin);
    }
    if (evt.button === 0) {
      const target = evt.target as HTMLElement;
      const isRibbon = ZoneDetector.isRibbonZone(target);
      const isScroller = ZoneDetector.isDoubleClickZone(target, evt);
      const isTabHeader = ZoneDetector.isTabHeader(target);

      if (isScroller) {
        handleEditorEdgeClick(evt, plugin);
      } else if (isRibbon) {
        // Apply timeout only for ribbon action (allows triple-click to override)
        mouse.doubleClickTimeout = setTimeout(() => {
          getLeftSplit(plugin.app).toggle();
          mouse.doubleClickTimeout = null;
        }, UI_CONSTANTS.RIBBON_TOGGLE_DELAY);
      } else if (isTabHeader) {
        await togglePin(app, evt, plugin);
      }
    }
  } else if (evt.detail === 3) {
    // Cancel the pending double-click action
    if (mouse.doubleClickTimeout) {
      clearTimeout(mouse.doubleClickTimeout);
      mouse.doubleClickTimeout = null;
    }

    const target = evt.target as HTMLElement;
    const isRibbon = ZoneDetector.isRibbonZone(target);
    const isLeftSplit = ZoneDetector.isLeftSplitZone(target);

    if (isRibbon) {
      getRightSplit(plugin.app).toggle();
      return;
    } else if (isLeftSplit) {
      await goToExplorerTab(plugin, app, evt);
    }
  }
}
