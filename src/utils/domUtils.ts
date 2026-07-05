import { CSS_SELECTORS, UI_CONSTANTS } from '../constants/index.ts';

/**
 * Utilities for DOM zone detection and UI interactions
 */
export class ZoneDetector {
  /**
   * Check if element is in a reveal zone
   */
  static isRevealZone(element: HTMLElement): boolean {
    return !!(
      element.closest(CSS_SELECTORS.VIEW_HEADER_TITLE_CONTAINER) ||
      element.closest(CSS_SELECTORS.VIEW_HEADER_TITLE)
    );
  }

  /**
   * Returns which edge of the editor scroller the click happened on, or `null`
   * if the click is not on a scroller edge zone.
   */
  static getScrollerEdge(
    element: HTMLElement,
    evt: MouseEvent
  ): 'left' | 'right' | null {
    const scroller = element.closest(CSS_SELECTORS.CM_SCROLLER);
    if (!scroller) return null;

    const rect = scroller.getBoundingClientRect();
    const offsetX = evt.clientX - rect.left;
    if (offsetX < UI_CONSTANTS.EDGE_ZONE_WIDTH) return 'left';
    if (offsetX > rect.width - UI_CONSTANTS.EDGE_ZONE_WIDTH) return 'right';
    return null;
  }

  /**
   * Check if element is in a double-click edge zone
   */
  static isDoubleClickZone(element: HTMLElement, evt: MouseEvent): boolean {
    return ZoneDetector.getScrollerEdge(element, evt) !== null;
  }

  /**
   * Check if element is in the ribbon zone
   */
  static isRibbonZone(element: HTMLElement): boolean {
    return !!element.closest(CSS_SELECTORS.WORKSPACE_RIBBON);
  }

  /**
   * Check if element is in the main editor zone
   */
  static isEditorZone(element: HTMLElement): boolean {
    return !!element.closest(CSS_SELECTORS.MOD_ROOT_VIEW_CONTENT);
  }

  /**
   * Check if element is in the editor content zone
   */
  static isEditorContent(element: HTMLElement): boolean {
    const isContentContainer = element.closest(CSS_SELECTORS.CM_CONTENT_CONTAINER);
    return !!isContentContainer;
  }

  /**
   * Check if element is a tab header element
   */
  static isTabHeader(element: HTMLElement): boolean {
    return !!element.closest(CSS_SELECTORS.WORKSPACE_TAB_HEADER_INNER_TITLE);
  }
}

