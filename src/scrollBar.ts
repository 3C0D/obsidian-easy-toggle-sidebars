import { getLeftSplit, getRightSplit } from './barTools.ts';
import type EasytoggleSidebar from './main.ts';
import { ZoneDetector } from './utils/domUtils.ts';

export function handleEditorEdgeClick(e: MouseEvent, plugin: EasytoggleSidebar): void {
  const edge = ZoneDetector.getScrollerEdge(e.target as HTMLElement, e);
  if (!edge) return;
  if (edge === 'right') {
    getRightSplit(plugin.app).toggle();
  } else {
    getLeftSplit(plugin.app).toggle();
  }
}
